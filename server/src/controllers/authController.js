import crypto from 'node:crypto';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { clearAuthCookie, setAuthCookie, signToken } from '../utils/token.js';
import { env } from '../config/env.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

function validateRegistration({ name, email, password }) {
  if (!name || name.trim().length < 2) return 'Please enter your full name.';
  if (!email || !emailPattern.test(email)) return 'Please enter a valid email address.';
  if (!password || password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const invalid = validateRegistration({ name, email, password });
  if (invalid) return res.status(400).json({ message: invalid });

  const exists = await User.exists({ email: email.toLowerCase().trim() });
  if (exists) {
    return res.status(409).json({ message: 'An account with that email already exists.' });
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone?.trim() || '',
    password,
  });

  setAuthCookie(res, signToken(user));
  return res.status(201).json({ user: user.toSafeJSON() });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  user.lastLoginAt = new Date();
  await user.save({ validateModifiedOnly: true });

  setAuthCookie(res, signToken(user));
  return res.json({ user: user.toSafeJSON() });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Signed out.' });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, email } = req.body;
  const user = req.user;

  if (name !== undefined) {
    if (name.trim().length < 2) {
      return res.status(400).json({ message: 'Please enter your full name.' });
    }
    user.name = name.trim();
  }
  if (phone !== undefined) user.phone = phone.trim();
  if (email !== undefined) {
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    const clash = await User.exists({
      email: email.toLowerCase().trim(),
      _id: { $ne: user._id },
    });
    if (clash) return res.status(409).json({ message: 'That email is already in use.' });
    user.email = email.toLowerCase().trim();
  }

  await user.save();
  res.json({ user: user.toSafeJSON() });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters.' });
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword || ''))) {
    return res.status(400).json({ message: 'Current password is incorrect.' });
  }

  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated.' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const generic = {
    message:
      'If an account exists for that email, password reset instructions have been created. Please contact support if you need help.',
  };

  const user = await User.findOne({ email: String(email || '').toLowerCase().trim() });
  if (!user) return res.json(generic);

  const rawToken = crypto.randomBytes(32).toString('hex');
  user.resetToken = sha256(rawToken);
  user.resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000);
  await user.save({ validateModifiedOnly: true });

  console.log(`[auth] Password reset token for ${user.email}: ${rawToken}`);

  return res.json({
    ...generic,
    ...(env.isProduction ? {} : { resetToken: rawToken }),
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password || password.length < 8) {
    return res.status(400).json({ message: 'A valid token and 8+ character password are required.' });
  }

  const user = await User.findOne({
    resetToken: sha256(token),
    resetTokenExpires: { $gt: new Date() },
  }).select('+password');

  if (!user) {
    return res.status(400).json({ message: 'This reset link is invalid or has expired.' });
  }

  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  setAuthCookie(res, signToken(user));
  res.json({ message: 'Password reset successful.', user: user.toSafeJSON() });
});

export const addAddress = asyncHandler(async (req, res) => {
  const { label, street, city, state, phone } = req.body;
  if (!street || !city || !state) {
    return res.status(400).json({ message: 'Street, city and state are required.' });
  }

  const user = req.user;
  if (req.body.isDefault) {
    user.addresses.forEach((a) => {
      a.isDefault = false;
    });
  }
  user.addresses.push({
    label: label || 'Home',
    street,
    city,
    state,
    phone: phone || user.phone,
    isDefault: Boolean(req.body.isDefault) || user.addresses.length === 0,
  });
  await user.save();
  res.status(201).json({ addresses: user.addresses });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = req.user.addresses.id(req.params.addressId);
  if (!address) return res.status(404).json({ message: 'Address not found.' });

  ['label', 'street', 'city', 'state', 'phone'].forEach((field) => {
    if (req.body[field] !== undefined) address[field] = req.body[field];
  });

  if (req.body.isDefault) {
    req.user.addresses.forEach((a) => {
      a.isDefault = false;
    });
    address.isDefault = true;
  }

  await req.user.save();
  res.json({ addresses: req.user.addresses });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const address = req.user.addresses.id(req.params.addressId);
  if (!address) return res.status(404).json({ message: 'Address not found.' });
  address.deleteOne();
  await req.user.save();
  res.json({ addresses: req.user.addresses });
});
