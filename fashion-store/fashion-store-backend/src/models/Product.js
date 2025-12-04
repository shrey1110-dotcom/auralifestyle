// src/models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    brand: { type: String, default: 'AuraLifestyle' },

    description: { type: String, default: '' },

    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },

    images: [{ type: String }], // absolute or public-relative URLs
    thumbnail: { type: String },

    sizes: [{ type: String }],   // e.g. ["S","M","L","XL"]
    colors: [{ type: String }],  // e.g. ["black","white"]

    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 100 },

    tags: [{ type: String }],
    category: { type: String, default: 'apparel' },
    subcategory: { type: String, default: 't-shirt' }
  },
  { timestamps: true }
);

// Keep slugs pretty
ProductSchema.pre('validate', function (next) {
  if (this.isModified('name') && !this.isModified('slug')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

export default mongoose.model('Product', ProductSchema);
