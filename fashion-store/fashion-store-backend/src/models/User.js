import mongoose from 'mongoose';
import validator from 'validator';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Invalid email']
    },
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
