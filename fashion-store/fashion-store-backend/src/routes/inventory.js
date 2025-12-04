// src/routes/inventory.js
import express from "express";
import mongoose from "mongoose";

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

/**
 * This route handles all inventory operations:
 * - GET /api/inventory               → list inventory items
 * - GET /api/inventory/:sku          → fetch single product stock
 * - PATCH /api/inventory/restock     → admin restock endpoint
 *
 * Requires Product model (with fields: sku, title/name, stock, image/images)
 */

let Product;
try {
  const mod = await import("../models/Product.js");
  Product = mod.default;
} catch (err) {
  console.error("❌ Cannot import Product model:", err.message);
}

/* -------------------- GET INVENTORY LIST -------------------- */
router.get("/", async (req, res) => {
  try {
    if (!Product) return res.status(500).json({ success: false, message: "Product model not loaded" });

    const { q, limit = 200 } = req.query;
    const filter = {};

    if (q) {
      const rx = new RegExp(String(q), "i");
      filter.$or = [{ sku: rx }, { title: rx }, { name: rx }];
    }

    const docs = await Product.find(filter)
      .select("sku title name image images stock")
      .sort({ title: 1 })
      .limit(Number(limit))
      .lean();

    const items = docs.map((d) => ({
      _id: d._id,
      sku: d.sku || (d._id ? String(d._id) : ""),
      title: d.title || d.name || "",
      image: d.image || (Array.isArray(d.images) && d.images[0]) || null,
      stock: Number(d.stock ?? (d.inventory?.stock ?? 0)),
    }));

    res.json({ success: true, items, count: items.length });
  } catch (err) {
    console.error("GET /api/inventory error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});

/* -------------------- RESTOCK ENDPOINT -------------------- */
/**
 * PATCH /api/inventory/restock
 * body: { sku, qty }
 * increases stock value (admin feature)
 */
router.patch("/restock", async (req, res) => {
  try {
    if (!Product) return res.status(500).json({ success: false, message: "Product model not loaded" });

    const { sku, qty } = req.body || {};
    if (!sku || qty === undefined)
      return res.status(400).json({ success: false, message: "sku & qty required" });

    const filter = {
      $or: [{ sku }],
    };
    if (ObjectId.isValid(String(sku))) filter.$or.push({ _id: new ObjectId(sku) });
    filter.$or = filter.$or.filter(Boolean);

    const updated = await Product.findOneAndUpdate(
      filter,
      { $inc: { stock: Number(qty) } },
      { new: true }
    ).lean();

    if (!updated)
      return res.status(404).json({ success: false, message: "Product not found" });

    // Emit inventory update via Socket.io (if io attached)
    try {
      const io = req.app.get("io");
      io?.to("admin")?.emit("inventory:updated", {
        sku: updated.sku,
        stock: updated.stock,
      });
    } catch (e) {
      console.warn("Socket emit failed:", e.message);
    }

    res.json({ success: true, product: updated });
  } catch (err) {
    console.error("PATCH /api/inventory/restock error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});

/* -------------------- GET SINGLE PRODUCT STOCK -------------------- */
router.get("/:sku", async (req, res) => {
  try {
    if (!Product) return res.status(500).json({ success: false, message: "Product model not loaded" });

    const sku = String(req.params.sku || "").trim();
    if (!sku)
      return res.status(400).json({ success: false, message: "Missing sku" });

    const doc = await Product.findOne({ sku }).select("sku stock").lean();
    if (!doc)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({
      success: true,
      sku: doc.sku,
      stock: Number(doc.stock ?? 0),
    });
  } catch (err) {
    console.error("GET /api/inventory/:sku error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});

export default router;
