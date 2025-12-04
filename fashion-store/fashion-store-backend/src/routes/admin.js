// src/routes/admin.js
import express from "express";
import mongoose from "mongoose";
import { Parser } from "json2csv";
const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

/*
  NOTE: This file works by reading collections directly from mongoose.connection.
  It tries to be flexible with field names (orderNumber, total, sub, gst, items, address, customer).
  Adjust fields if your schema differs.
*/

/* -------------------- helpers -------------------- */
function parseDateParam(v) {
  if (!v) return null;
  const d = new Date(v);
  if (isNaN(d)) return null;
  return d;
}

/* -------------------- ORDERS -------------------- */
/**
 GET /api/admin/orders?q=&status=&from=&to=&limit=&page=
 returns list of orders (simple)
*/
router.get("/orders", async (req, res) => {
  try {
    const { q, status, from, to, limit = 100, page = 1 } = req.query;
    const col = mongoose.connection.collection("orders");
    const filter = {};

    if (status) filter.status = status;
    if (q) {
      // support orderNumber or email or customerId
      const rx = new RegExp(q, "i");
      filter.$or = [
        { orderNumber: rx },
        { "address.email": rx },
        { customerId: rx },
        { "razorpay.payment_id": rx },
      ];
    }
    if (from || to) {
      filter.createdAt = {};
      const f = parseDateParam(from);
      const t = parseDateParam(to);
      if (f) filter.createdAt.$gte = f;
      if (t) {
        // include end of day
        t.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = t;
      }
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const docs = await col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    res.json({ items: docs, count: docs.length });
  } catch (e) {
    console.error("admin/orders err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/**
 GET /api/admin/orders/:id   (id may be _id or orderNumber)
*/
router.get("/orders/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const col = mongoose.connection.collection("orders");
    let doc = null;

    // try by ObjectId
    if (ObjectId.isValid(id)) {
      doc = await col.findOne({ _id: new ObjectId(id) });
    }
    if (!doc) {
      // try by orderNumber
      doc = await col.findOne({ orderNumber: id });
    }
    if (!doc) return res.status(404).json({ success: false, message: "Order not found" });
    res.json(doc);
  } catch (e) {
    console.error("admin/orders/:id err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/**
 PATCH /api/admin/orders/:id  { status, notes, ... }
 updates order fields (status, etc)
*/
router.patch("/orders/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body || {};
    const col = mongoose.connection.collection("orders");

    // allow updating by _id or orderNumber
    let filter;
    if (ObjectId.isValid(id)) filter = { _id: new ObjectId(id) };
    else filter = { orderNumber: id };

    const update = { $set: {} };
    ["status", "notes", "tracking", "shipment", "fulfillment"].forEach((k) => {
      if (payload[k] !== undefined) update.$set[k] = payload[k];
    });

    // also allow setting arbitrary fields (use with care)
    if (payload.meta && typeof payload.meta === "object") update.$set.meta = payload.meta;

    const r = await col.findOneAndUpdate(filter, update, { returnDocument: "after" });
    if (!r.value) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order: r.value });
  } catch (e) {
    console.error("admin/patch orders err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/* -------------------- EXPORT CSV -------------------- */
/**
 GET /api/admin/orders/export?status=&from=&to=&q=
 returns CSV attachment (orders)
*/
router.get("/orders/export", async (req, res) => {
  try {
    const { q, status, from, to } = req.query;
    const col = mongoose.connection.collection("orders");
    const filter = {};

    if (status) filter.status = status;
    if (q) {
      const rx = new RegExp(q, "i");
      filter.$or = [{ orderNumber: rx }, { "address.email": rx }, { customerId: rx }];
    }
    if (from || to) {
      filter.createdAt = {};
      const f = parseDateParam(from);
      const t = parseDateParam(to);
      if (f) filter.createdAt.$gte = f;
      if (t) {
        t.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = t;
      }
    }

    const docs = await col.find(filter).sort({ createdAt: -1 }).limit(10000).toArray();

    // prepare CSV rows
    const rows = docs.map((d) => ({
      orderNumber: d.orderNumber || d._id,
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : "",
      email: d.address?.email || d.customer?.email || "",
      name: d.address?.fullName || d.customer?.name || "",
      userId: d.customerId || d.customer?.userId || "",
      total: d.total || d.sub || 0,
      status: d.status || "",
      payment_id: d.razorpay?.payment_id || "",
      items: (d.items || []).map((it) => `${it.title || it.name} x${it.qty}`).join(" | "),
      address: `${d.address?.address1 || ""} ${d.address?.address2 || ""} ${d.address?.city || ""} ${d.address?.pincode || ""}`.trim(),
    }));

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.setHeader("Content-Disposition", `attachment; filename="orders-${new Date().toISOString().slice(0,10)}.csv"`);
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  } catch (e) {
    console.error("admin/orders/export err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/* -------------------- PRODUCTS / INVENTORY -------------------- */
/**
 GET /api/admin/products
 Basic products listing (from 'products' collection)
*/
router.get("/products", async (req, res) => {
  try {
    const col = mongoose.connection.collection("products");
    const docs = await col.find({}).sort({ title: 1 }).limit(2000).toArray();
    return res.json({ items: docs, count: docs.length });
  } catch (e) {
    console.error("admin/products err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/**
 GET /api/admin/inventory
 returns product SKU/title/stock for admin inventory view
*/
router.get("/inventory", async (req, res) => {
  try {
    const col = mongoose.connection.collection("products");
    // Look for typical stock fields
    const docs = await col
      .find({}, { projection: { sku: 1, title: 1, name: 1, image: 1, stock: 1, inventory: 1 } })
      .sort({ title: 1 })
      .toArray();

    const normalized = docs.map((d) => ({
      _id: d._id,
      sku: d.sku || (d._id ? String(d._id) : undefined),
      title: d.title || d.name || "",
      image: d.image || (d.images && d.images[0]) || null,
      stock: (d.stock !== undefined ? d.stock : (d.inventory && d.inventory.stock) || 0),
    }));

    res.json({ items: normalized, count: normalized.length });
  } catch (e) {
    console.error("admin/inventory err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/**
 PATCH /api/admin/inventory/restock
 body { sku, qty }
*/
router.patch("/inventory/restock", async (req, res) => {
  try {
    const { sku, qty } = req.body || {};
    if (!sku || qty === undefined) return res.status(400).json({ success: false, message: "sku & qty required" });

    const col = mongoose.connection.collection("products");
    // Try update by sku field, fallback to _id
    const filter = { $or: [{ sku }, { _id: ObjectId.isValid(sku) ? new ObjectId(sku) : null }] };

    // Remove null from $or if any
    filter.$or = filter.$or.filter(Boolean);
    if (!filter.$or.length) return res.status(400).json({ success: false, message: "Invalid sku" });

    // Try increase 'stock' or set if not present
    const r = await col.findOneAndUpdate(
      filter,
      { $inc: { stock: Number(qty) } },
      { returnDocument: "after" }
    );

    if (!r.value) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product: r.value });
  } catch (e) {
    console.error("admin/inventory/restock err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/* -------------------- USERS -------------------- */
router.get("/users", async (req, res) => {
  try {
    const col = mongoose.connection.collection("users");
    const docs = await col.find({}, { projection: { email: 1, name: 1, role: 1, userId: 1, createdAt: 1 } }).sort({ createdAt: -1 }).limit(1000).toArray();
    res.json({ items: docs, count: docs.length });
  } catch (e)
 {
    console.error("admin/users err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body || {};
    const col = mongoose.connection.collection("users");
    let filter;
    if (ObjectId.isValid(id)) filter = { _id: new ObjectId(id) };
    else filter = { email: id };

    const update = { $set: {} };
    if (payload.role) update.$set.role = payload.role;
    if (payload.name) update.$set.name = payload.name;
    if (payload.phone) update.$set.phone = payload.phone;

    const r = await col.findOneAndUpdate(filter, update, { returnDocument: "after" });
    if (!r.value) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user: r.value });
  } catch (e) {
    console.error("admin/users patch err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const col = mongoose.connection.collection("users");
    let filter;
    if (ObjectId.isValid(id)) filter = { _id: new ObjectId(id) };
    else filter = { email: id };
    const r = await col.findOneAndDelete(filter);
    if (!r.value) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true });
  } catch (e) {
    console.error("admin/users delete err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/* -------------------- SETTINGS (simple) -------------------- */
router.get("/settings", async (req, res) => {
  try {
    const col = mongoose.connection.collection("settings");
    const doc = (await col.findOne({})) || {};
    res.json(doc);
  } catch (e) {
    console.error("admin/settings err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

router.patch("/settings", async (req, res) => {
  try {
    const col = mongoose.connection.collection("settings");
    const payload = req.body || {};
    const r = await col.findOneAndUpdate({}, { $set: payload }, { upsert: true, returnDocument: "after" });
    res.json(r.value);
  } catch (e) {
    console.error("admin/patch settings err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

export default router;
