// src/routes/customers.js
import express from 'express';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

/**
 * GET /api/customers
 * - list customers (admin)
 */
router.get('/', async (req, res) => {
  try {
    // if non-admin call, require authentication and return current user profile if desired
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success:false, message:'Admin required' });
    }
    const col = mongoose.connection.collection('customers');
    const docs = await col.find({}).sort({ createdAt: -1 }).limit(1000).toArray();
    res.json({ items: docs, count: docs.length });
  } catch (e) {
    console.error('customers list err', e);
    res.status(500).json({ success:false, message: e.message || 'Server error' });
  }
});

/**
 * GET /api/customers/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const col = mongoose.connection.collection('customers');
    let doc = null;
    if (ObjectId.isValid(id)) doc = await col.findOne({ _id: new ObjectId(id) });
    if (!doc) doc = await col.findOne({ customerId: id });
    if (!doc) return res.status(404).json({ success:false, message:'Not found' });
    res.json(doc);
  } catch (e) {
    console.error('customers/:id err', e);
    res.status(500).json({ success:false, message: e.message || 'Server error' });
  }
});

export default router;
