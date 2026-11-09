import mongoose from 'mongoose';
import { env } from '../config/env.js';

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'store', unique: true },
    storeName: { type: String, default: 'Queen Terry' },
    tagline: { type: String, default: 'Tech that moves you.' },
    whatsappNumber: { type: String, default: env.whatsappNumber },
    supportEmail: { type: String, default: '' },
    supportPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    openingHours: { type: String, default: '' },
    announcements: {
      type: [String],
      default: [
        'Free delivery on orders above ₦500,000 within Lagos',
        'New arrivals: latest smartphones now in store',
        'Order directly on WhatsApp — fast and easy',
      ],
    },
    socials: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      x: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    delivery: {
      fee: { type: Number, default: 0 },
      freeThreshold: { type: Number, default: 0 },
      info: {
        type: String,
        default:
          'Delivery timelines and fees are confirmed by our team on WhatsApp based on your location.',
      },
    },
  },
  { timestamps: true }
);

export const Settings = mongoose.model('Settings', settingsSchema);

export async function getSettings() {
  let settings = await Settings.findOne({ key: 'store' });
  if (!settings) settings = await Settings.create({ key: 'store' });
  return settings;
}
