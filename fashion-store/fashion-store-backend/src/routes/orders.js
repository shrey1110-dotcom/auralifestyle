// src/routes/orders.js
import express from 'express';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

/**
 * GET /api/orders
 * - returns orders for authenticated user (expects auth middleware to set req.user)
 */
router.get('/', async (req, res) => {
  try {
    const col = mongoose.connection.collection('orders');
    // if admin query param ?all=1 -> return all (but usually admin route used)
    if (req.user && req.user.role === 'admin' && req.query.all === '1') {
      const docs = await col.find({}).sort({ createdAt: -1 }).limit(200).toArray();
      return res.json({ items: docs, count: docs.length });
    }

    // otherwise return orders for current user
    const userId = req.user?.userId || req.user?.customerId;
    if (!userId) return res.status(401).json({ success:false, message:'Not authenticated' });

    const docs = await col.find({ customerId: userId }).sort({ createdAt: -1 }).toArray();
    res.json({ items: docs, count: docs.length });
  } catch (e) {
    console.error('orders list err', e);
    res.status(500).json({ success:false, message: e.message || 'Server error' });
  }
});

/**
 * GET /api/orders/:id  (by ObjectId or orderNumber)
 */
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const col = mongoose.connection.collection('orders');
    let doc = null;
    if (ObjectId.isValid(id)) {
      doc = await col.findOne({ _id: new ObjectId(id) });
    }
    if (!doc) {
      doc = await col.findOne({ orderNumber: id });
    }
    if (!doc) return res.status(404).json({ success:false, message:'Order not found' });

    // If not admin, ensure owner
    if (req.user?.role !== 'admin') {
      const uid = req.user?.userId || null;
      if (!uid || String(doc.customerId) !== String(uid)) {
        return res.status(403).json({ success:false, message:'Forbidden' });
      }
    }

    res.json(doc);
  } catch (e) {
    console.error('orders/:id err', e);
    res.status(500).json({ success:false, message: e.message || 'Server error' });
  }
});

export default router;
