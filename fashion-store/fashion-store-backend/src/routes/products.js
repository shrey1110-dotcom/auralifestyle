// src/routes/products.js
import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const router = Router();

/**
 * GET /api/products
 * Query params (optional):
 *   q=search, tag=, category=, limit=, page=
 */
router.get('/', async (req, res) => {
  try {
    const { q, tag, category, limit = 24, page = 1 } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ];
    }
    if (tag) filter.tags = tag;
    if (category) filter.category = category;

    const perPage = Math.max(1, Math.min(Number(limit), 100));
    const skip = (Math.max(1, Number(page)) - 1) * perPage;

    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPage).lean(),
      Product.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / perPage) });
  } catch (e) {
    console.error('List products error:', e);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

/**
 * GET /api/products/:key
 * :key can be a Mongo ObjectId or a slug
 */
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;

    const byId =
      mongoose.isValidObjectId(key) ? await Product.findById(key).lean() : null;

    const product = byId || (await Product.findOne({ slug: key }).lean());

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json(product);
  } catch (e) {
    console.error('Product detail error:', e);
    res.status(500).json({ error: 'Failed to load product' });
  }
});

export default router;
