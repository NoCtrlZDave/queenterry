import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: '' },
    group: {
      type: String,
      enum: ['Phones & Tablets', 'Computers', 'Audio', 'Wearables', 'Accessories', 'Gaming', 'Gadgets'],
      default: 'Gadgets',
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category = mongoose.model('Category', categorySchema);
