// src/models/Order.js
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  sku: String,
  title: String,
  price: Number,
  qty: Number,
  size: String,
  color: String,
  image: String,
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, index: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  customerId: String,
  address: { type: mongoose.Schema.Types.Mixed },
  items: { type: [OrderItemSchema], default: [] },
  sub: Number,
  gst: Number,
  total: Number,
  status: { type: String, default: "pending" },
  razorpay: { type: mongoose.Schema.Types.Mixed },
  notes: { type: String },
  meta: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
