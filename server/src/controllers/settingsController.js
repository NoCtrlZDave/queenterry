import { getSettings } from '../models/Settings.js';
import { Subscriber } from '../models/Subscriber.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  res.json({
    settings: {
      storeName: settings.storeName,
      tagline: settings.tagline,
      whatsappNumber: settings.whatsappNumber,
      supportEmail: settings.supportEmail,
      supportPhone: settings.supportPhone,
      address: settings.address,
      openingHours: settings.openingHours,
      announcements: settings.announcements,
      socials: settings.socials,
      delivery: settings.delivery,
    },
  });
});

export const getAdminSettings = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  res.json({ settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  const { storeName, tagline, whatsappNumber, supportEmail, supportPhone, address, openingHours } =
    req.body;

  if (storeName !== undefined) settings.storeName = storeName.trim();
  if (tagline !== undefined) settings.tagline = tagline;
  if (supportEmail !== undefined) settings.supportEmail = supportEmail.trim();
  if (supportPhone !== undefined) settings.supportPhone = supportPhone.trim();
  if (address !== undefined) settings.address = address;
  if (openingHours !== undefined) settings.openingHours = openingHours;

  if (whatsappNumber !== undefined) {
    const cleaned = String(whatsappNumber).replace(/\D/g, '');
    if (cleaned.length < 10) {
      return res.status(400).json({ message: 'Enter a valid WhatsApp number including country code.' });
    }
    settings.whatsappNumber = cleaned;
  }

  if (Array.isArray(req.body.announcements)) {
    settings.announcements = req.body.announcements
      .map((a) => String(a).trim())
      .filter(Boolean)
      .slice(0, 6);
  }

  if (req.body.socials) {
    ['instagram', 'facebook', 'x', 'tiktok'].forEach((key) => {
      if (req.body.socials[key] !== undefined) {
        settings.socials[key] = String(req.body.socials[key]).trim();
      }
    });
  }

  if (req.body.delivery) {
    const { fee, freeThreshold, info } = req.body.delivery;
    if (fee !== undefined) settings.delivery.fee = Math.max(0, Number(fee) || 0);
    if (freeThreshold !== undefined) {
      settings.delivery.freeThreshold = Math.max(0, Number(freeThreshold) || 0);
    }
    if (info !== undefined) settings.delivery.info = String(info);
  }

  await settings.save();
  res.json({ settings });
});

export const subscribe = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  try {
    await Subscriber.create({ email, source: req.body.source || 'newsletter' });
    res.status(201).json({ message: 'You are subscribed. Welcome to Queen Terry.' });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({ message: 'You are already subscribed. Thank you!' });
    }
    throw err;
  }
});
