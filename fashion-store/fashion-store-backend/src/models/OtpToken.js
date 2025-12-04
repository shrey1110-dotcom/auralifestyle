// src/models/OtpToken.js
import mongoose from 'mongoose';

const OtpTokenSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    otp:   { type: String, required: true }, // <-- REQUIRED and we'll set it
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

// TTL index for automatic cleanup
OtpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('OtpToken', OtpTokenSchema);
