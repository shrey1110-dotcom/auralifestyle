// src/models/Customer.js
import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  fullName: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  pincode: String,
  phone: String,
  email: String,
}, { _id: false });

const CustomerSchema = new mongoose.Schema({
  customerId: { type: String, index: true, unique: false },
  fullName: { type: String },
  email: { type: String, index: true },
  phone: { type: String, index: true },
  addresses: { type: [AddressSchema], default: [] },
  meta: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

const Customer = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
export default Customer;
