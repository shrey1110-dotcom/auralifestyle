// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import { createHmac, timingSafeEqual } from 'crypto';

// --- Socket.io Imports ---
import http from 'http';
import { Server as IOServer } from 'socket.io';

// DB + mail
import connectDB from './src/config/db.js';
import {
  transporter as mailTransport,
  FROM_EMAIL,
  FROM_NAME,
  orderEmailHTML,
} from './src/config/mail.js';

// models
import Product from './src/models/Product.js';
import Customer from './src/models/Customer.js';
import Order from './src/models/Order.js';

// routes (single import each)
import authRoutes from './src/routes/auth.js';
import inventoryRoutes from './src/routes/inventory.js';
import ordersRoutes from './src/routes/orders.js';
import adminRoutes from './src/routes/admin.js';
import productsRoutes from './src/routes/products.js';

// validation
import validate from './src/middleware/validate.js';
import { VerifyPaymentSchema } from './src/schemas/verifyPayment.js';

const app = express();
app.set('trust proxy', 1);

/* ---------------- CORS ---------------- */
const ALLOW_LIST = [
  process.env.CORS_ORIGIN || '',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://theauralifestyle.org',
  'https://www.theauralifestyle.org',
].filter(Boolean);
const ALLOW_REGEX = [/\.netlify\.app$/i];

const corsOrigin = (origin, cb) => {
  if (!origin) return cb(null, true); // allow server-to-server / curl requests
  if (ALLOW_LIST.includes(origin) || ALLOW_REGEX.some((rx) => rx.test(origin))) return cb(null, true);
  return cb(new Error('CORS blocked: ' + origin));
};

app.use(cors({
  origin: corsOrigin,
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

/* -------------- security/perf -------------- */
app.use(helmet({ contentSecurityPolicy:false, crossOriginEmbedderPolicy:false }));
app.use(compression());
app.use(cookieParser());
// parse JSON for all routes except webhook (webhook uses express.raw for signature)
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

/* -------------- rate limits -------------- */
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 100, standardHeaders:true, legacyHeaders:false });
const payLimiter  = rateLimit({ windowMs: 5*60*1000,  max: 50,  standardHeaders:true, legacyHeaders:false });
app.use('/api/auth/', authLimiter);
app.use('/api/verify-payment', payLimiter);
app.use('/api/create-order', payLimiter);

/* -------------- health -------------- */
app.get('/api/health', (_req, res) => res.json({ ok:true, ts:Date.now() }));
app.get('/health', (_req, res) => res.json({ ok:true, ts:Date.now() }));

/* -------------- Razorpay config -------------- */
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const RAZORPAY_SKIP_VERIFY = String(process.env.RAZORPAY_SKIP_VERIFY || '0') === '1';

const razorpay = (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET)
  ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
  : null;

// Create payment order endpoint (optional)
app.post('/api/create-order', async (req, res) => {
  try {
    if (!razorpay) return res.status(500).json({ success:false, message:'Razorpay not configured' });
    const { amount, currency='INR', receipt, notes } = req.body || {};
    const rupees = Number(amount);
    if (!rupees || rupees <= 0) return res.status(400).json({ success:false, message:'Invalid amount' });

    const order = await razorpay.orders.create({
      amount: Math.round(rupees * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });
    res.json({ success:true, order });
  } catch (err) {
    console.error('Order create error:', err);
    res.status(500).json({ success:false, message:'Order creation failed', error:err?.message || 'unknown_error' });
  }
});

/* -------------- verify-payment (transactional) -------------- */
app.post('/api/verify-payment', validate(VerifyPaymentSchema), async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, meta } = req.body;

    // Signature check (skip in dev)
    if (!RAZORPAY_SKIP_VERIFY && razorpay_signature !== 'skip') {
      const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expected = createHmac('sha256', RAZORPAY_KEY_SECRET).update(payload).digest('hex');
      if (expected !== razorpay_signature) {
        return res.status(400).json({ success:false, message:'Invalid signature' });
      }
    }

    const items = meta.items || [];
    const sub = Number(meta.sub) || 0;
    const gst = Number(meta.gst) || 0;
    const total = Number(meta.total) || 0;
    const address = meta.address || {};
    const displayOrderId = meta.display_order_id || razorpay_order_id;

    let orderDoc = null;
    let customerDoc = null;

    await session.withTransaction(async () => {
      // Idempotency: if payment_id already recorded, return existing order
      const existing = await Order.findOne({ 'razorpay.payment_id': razorpay_payment_id }, null, { session });
      if (existing) {
        orderDoc = existing;
        return;
      }

      // 1) CHECK stock
      const skus = [...new Set(items.map(it => String(it.id || it.sku || '').trim()).filter(Boolean))];
      const prodDocs = await Product.find({ sku: { $in: skus } }, null, { session });
      const stockMap = new Map(prodDocs.map(d => [d.sku, Number(d.stock || 0)]));
      const shortages = [];
      for (const it of items) {
        const sku = String(it.id || it.sku || '').trim();
        const reqQty = Math.max(1, Number(it.qty) || 1);
        const have = stockMap.has(sku) ? stockMap.get(sku) : 0;
        if (have < reqQty) shortages.push({ sku, requested: reqQty, available: have });
      }
      if (shortages.length) {
        const err = new Error('insufficient');
        err.code = 409;
        err.payload = shortages;
        throw err;
      }

      // 2) APPLY decrements atomically (per product)
      for (const it of items) {
        const sku = String(it.id || it.sku || '').trim();
        const qty = Math.max(1, Number(it.qty) || 1);
        const r = await Product.updateOne(
          { sku, stock: { $gte: qty } },
          { $inc: { stock: -qty } },
          { session }
        );
        if (r.modifiedCount !== 1) {
          const err = new Error('insufficient');
          err.code = 409;
          err.payload = [{ sku, requested: qty }];
          throw err;
        }
      }

      // 3) ensure customer exists or create
      if (meta.customerId) {
        customerDoc = await Customer.findOne({ customerId: meta.customerId }, null, { session });
      }
      if (!customerDoc) {
        if (!address?.email && !address?.phone) {
          const err = new Error('Address email or phone required');
          err.code = 400;
          throw err;
        }
        customerDoc =
          (await Customer.findOne({ $or: [{ email: address.email || null }, { phone: address.phone || null }] }, null, { session })) ||
          (await Customer.create([{
            fullName: address.fullName || "",
            email: address.email || null,
            phone: address.phone || null,
            addresses: [address],
          }], { session }).then(a => a[0]));

        const exists = customerDoc.addresses.some(
          (a) => a.address1 === address.address1 && a.pincode === address.pincode && a.phone === address.phone
        );
        if (!exists) {
          customerDoc.addresses.unshift(address);
          await customerDoc.save({ session });
        }
      }

      // 4) save order
      orderDoc = await Order.create([{
        orderNumber: displayOrderId,
        customer: customerDoc._id,
        customerId: customerDoc.customerId,
        address,
        items: items.map((it) => ({
          sku: String(it.id || it.sku || '').trim(),
          title: it.title || it.name || '',
          price: Number(it.price) || 0,
          qty: Number(it.qty) || 1,
          size: it.size || '',
          color: it.color || '',
          image: it.image || '',
        })),
        sub, gst, total,
        status: 'paid',
        razorpay: {
          order_id: razorpay_order_id,
          payment_id: razorpay_payment_id,
          signature: razorpay_signature,
          amount: Number(meta?.rzpAmount || 0),
          currency: meta?.rzpCurrency || 'INR',
        },
      }], { session }).then(a => a[0]);
    });

    // send email (best-effort)
    let emailed = false;
    if (mailTransport && address?.email) {
      try {
        const html = orderEmailHTML({ displayOrderId, address, items, sub, gst, total });
        await mailTransport.sendMail({
          from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
          to: address.email,
          subject: `Order confirmed • ${displayOrderId}`,
          html,
          attachments: [{ filename: `Invoice-${displayOrderId}.html`, content: html }],
        });
        emailed = true;
      } catch (e) {
        console.error('Email error:', e?.message || e);
      }
    }

    return res.json({
      success: true,
      orderNumber: orderDoc.orderNumber,
      customerId: orderDoc.customerId,
      emailed,
    });
  } catch (err) {
    if (err?.code === 409) {
      return res.status(409).json({ success:false, message:'Stock insufficient after payment', insufficient: err.payload || [] });
    }
    console.error('Verify error:', err);
    return res.status(500).json({ success:false, message:'Verification failed', error: err?.message || 'unknown_error' });
  } finally {
    session.endSession();
  }
});

/* -------------- Razorpay Webhook -------------- */
// use raw body to verify signature properly
app.post('/api/webhooks/razorpay', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    if (!secret) return res.json({ received:true });

    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.body; // Buffer
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');

    // use timingSafeEqual if both present
    let valid = false;
    if (signature && expected) {
      try {
        valid = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
      } catch (e) {
        valid = false;
      }
    }
    if (!valid) return res.status(400).json({ received:true });

    const payload = JSON.parse(rawBody.toString('utf8'));
    const event = payload?.event;

    if (event === 'payment.captured') {
      const paymentId = payload?.payload?.payment?.entity?.id;
      if (paymentId) {
        await Order.updateOne(
          { 'razorpay.payment_id': paymentId },
          { $set: { status: 'paid' } }
        );
        // emit socket event if io available
        try {
          const io = app.get('io');
          io?.to?.('admin')?.emit?.('order:updated', { paymentId });
        } catch (e) {}
      }
    }
    res.json({ received:true });
  } catch (e) {
    console.error('Webhook error:', e?.message || e);
    res.json({ received:true });
  }
});

/* -------------- mount routes -------------- */
app.use('/api/products', productsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);

// Compat alias for legacy GET /api/inventory/:sku (frontend calls)
app.get('/api/inventory/:sku', async (req, res) => {
  try {
    const sku = String(req.params.sku || '').trim();
    if (!sku) return res.status(400).json({ success:false, message:'Missing sku' });
    const doc = await Product.findOne({ sku }).select('sku stock');
    if (!doc) return res.status(404).json({ success:false, message:'Not found' });
    res.json({ success:true, sku: doc.sku, stock: Number(doc.stock || 0) });
  } catch (e) {
    res.status(500).json({ success:false, message:'stock_fetch_failed', error:e?.message || 'unknown_error' });
  }
});

/* -------------- Socket.io Setup -------------- */
// Use the http server so sockets and express share the same server
const server = http.createServer(app);

// Socket CORS: use ALLOW_LIST (array)
const io = new IOServer(server, {
  cors: {
    origin: ALLOW_LIST.length ? ALLOW_LIST : '*',
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io); // make io available via req.app.get('io') in routes

// Optional: try to attach custom socket util if present
try {
  const mod = await import('./src/utils/socket.js');
  if (mod && typeof mod.attachSocket === 'function') {
    mod.attachSocket(io);
  }
} catch (e) {
  // If no socket util exists that's fine — we already set app.set('io', io)
  // console.info('No custom socket util attached:', e?.message || e);
}

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // dev helper: allow client to join admin room
  socket.on('join:admin', () => {
    try { socket.join('admin'); } catch (e) {}
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, reason);
  });
});

/* -------------- start server -------------- */
const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await connectDB();
    server.listen(PORT, () => console.log(`✅ API & Sockets running on :${PORT}`));
  } catch (e) {
    console.error('❌ Failed to start server', e);
    process.exit(1);
  }
})();
