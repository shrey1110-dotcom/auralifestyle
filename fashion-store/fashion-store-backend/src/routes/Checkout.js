// src/routes/Checkout.js
import express from 'express';
import mongoose from 'mongoose';
import { safeEmit } from '../utils/socket.js';

const router = express.Router();

/**
 * POST /api/checkout/create-order
 * - create an order in DB with status 'pending' (for deferred flows)
 * body expected: { items, address, sub, gst, total, customerId?, meta? }
 */
router.post('/create-order', async (req, res) => {
  try {
    const { items = [], address = {}, sub = 0, gst = 0, total = 0, customerId, meta = {} } = req.body || {};
    const col = mongoose.connection.collection('orders');

    // create a display order id (simple)
    const displayOrderId = `ORD_${Date.now()}`;

    const orderDoc = {
      orderNumber: displayOrderId,
      customerId: customerId || (address?.email || address?.phone) || null,
      address,
      items: (items || []).map((it) => ({
        sku: String(it.sku || it.id || '').trim(),
        title: it.title || it.name || '',
        price: Number(it.price || 0),
        qty: Number(it.qty || 1),
        size: it.size || '',
        color: it.color || '',
        image: it.image || '',
      })),
      sub: Number(sub || 0),
      gst: Number(gst || 0),
      total: Number(total || 0),
      status: 'pending',
      meta,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const r = await col.insertOne(orderDoc);
    const inserted = await col.findOne({ _id: r.insertedId });

    // notify admins via socket
    try { safeEmit('admin', 'order:created', inserted); } catch (e) {}

    res.json({ success:true, order: inserted });
  } catch (e) {
    console.error('checkout/create-order err', e);
    res.status(500).json({ success:false, message: e.message || 'Server error' });
  }
});

export default router;
