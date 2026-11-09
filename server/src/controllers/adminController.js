import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Brand } from '../models/Brand.js';
import { Order, ORDER_STATUSES } from '../models/Order.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uniqueSlug } from '../utils/slug.js';

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const cleanImages = (value) =>
  Array.isArray(value)
    ? value.filter((v) => typeof v === 'string' && v.trim()).map((v) => v.trim()).slice(0, 8)
    : [];

const cleanColors = (value) =>
  Array.isArray(value)
    ? value
        .filter((c) => c && c.name)
        .map((c) => ({ name: String(c.name).trim(), hex: String(c.hex || '#111111').trim() }))
        .slice(0, 12)
    : [];

const cleanSpecs = (value) =>
  Array.isArray(value)
    ? value
        .filter((s) => s && s.label && s.value)
        .map((s) => ({ label: String(s.label).trim(), value: String(s.value).trim() }))
        .slice(0, 30)
    : [];

const cleanHighlights = (value) =>
  Array.isArray(value)
    ? value.map((h) => String(h).trim()).filter(Boolean).slice(0, 10)
    : [];

function productPayload(body) {
  const payload = {};
  if (body.name !== undefined) payload.name = String(body.name).trim();
  if (body.brand !== undefined) payload.brand = body.brand;
  if (body.category !== undefined) payload.category = body.category;
  if (body.description !== undefined) payload.description = String(body.description);
  if (body.highlights !== undefined) payload.highlights = cleanHighlights(body.highlights);
  if (body.price !== undefined) payload.price = Math.max(0, Number(body.price) || 0);
  if (body.compareAtPrice !== undefined) {
    payload.compareAtPrice = Math.max(0, Number(body.compareAtPrice) || 0);
  }
  if (body.images !== undefined) payload.images = cleanImages(body.images);
  if (body.colors !== undefined) payload.colors = cleanColors(body.colors);
  if (body.specs !== undefined) payload.specs = cleanSpecs(body.specs);
  if (body.stock !== undefined) payload.stock = Math.max(0, Math.floor(Number(body.stock) || 0));
  if (body.sku !== undefined) payload.sku = String(body.sku).trim();
  if (body.warranty !== undefined) payload.warranty = String(body.warranty).trim();
  if (body.featured !== undefined) payload.featured = Boolean(body.featured);
  if (body.isActive !== undefined) payload.isActive = Boolean(body.isActive);
  if (body.rating !== undefined) payload.rating = Math.min(5, Math.max(0, Number(body.rating) || 0));
  if (body.reviewsCount !== undefined) {
    payload.reviewsCount = Math.max(0, Math.floor(Number(body.reviewsCount) || 0));
  }
  return payload;
}

export const listAdminProducts = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20, category, brand, status } = req.query;
  const filter = {};

  if (search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ name: rx }, { sku: rx }];
  }
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (status === 'active') filter.isActive = true;
  if (status === 'inactive') filter.isActive = false;
  if (status === 'low_stock') {
    filter.isActive = true;
    filter.stock = { $lte: 5 };
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('brand', 'name slug')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const getAdminProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('brand', 'name slug')
    .populate('category', 'name slug');
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json({ product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const payload = productPayload(req.body);
  if (!payload.name) return res.status(400).json({ message: 'Product name is required.' });
  if (!payload.brand || !payload.category) {
    return res.status(400).json({ message: 'Brand and category are required.' });
  }
  if (!mongoose.isValidObjectId(payload.brand) || !mongoose.isValidObjectId(payload.category)) {
    return res.status(400).json({ message: 'Invalid brand or category.' });
  }
  if (!payload.price || payload.price <= 0) {
    return res.status(400).json({ message: 'Enter a valid price.' });
  }

  const [brand, category] = await Promise.all([
    Brand.findById(payload.brand),
    Category.findById(payload.category),
  ]);
  if (!brand || !category) return res.status(400).json({ message: 'Brand or category not found.' });

  const product = await Product.create({
    ...payload,
    slug: await uniqueSlug(Product, payload.name),
    isDemo: false,
  });
  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });

  const payload = productPayload(req.body);

  if (payload.name && payload.name !== product.name) {
    product.name = payload.name;
    product.slug = await uniqueSlug(Product, payload.name, product._id);
  }
  if (payload.brand && !mongoose.isValidObjectId(payload.brand)) {
    return res.status(400).json({ message: 'Invalid brand.' });
  }
  if (payload.category && !mongoose.isValidObjectId(payload.category)) {
    return res.status(400).json({ message: 'Invalid category.' });
  }
  if (payload.price !== undefined && payload.price <= 0) {
    return res.status(400).json({ message: 'Enter a valid price.' });
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'name') return;
    product[key] = value;
  });

  await product.save();
  res.json({ product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json({ message: 'Product deleted.' });
});

export const listOrders = asyncHandler(async (req, res) => {
  const { status, search = '', page = 1, limit = 20 } = req.query;
  const filter = {};

  if (status && ORDER_STATUSES.includes(status)) filter.status = status;
  if (search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [
      { orderNumber: rx },
      { 'customer.name': rx },
      { 'customer.phone': rx },
      { 'customer.email': rx },
    ];
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    Order.countDocuments(filter),
  ]);

  res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const getAdminOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .lean();
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  res.json({ order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid order status.' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found.' });

  order.status = status;
  order.statusHistory.push({ status, at: new Date(), by: req.user._id });
  await order.save();

  res.json({ order });
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;
  if (!['unpaid', 'paid'].includes(paymentStatus)) {
    return res.status(400).json({ message: 'Invalid payment status.' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  order.paymentStatus = paymentStatus;
  await order.save();
  res.json({ order });
});

export const listCustomers = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));

  const match = { role: 'customer' };
  if (search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i');
    match.$or = [{ name: rx }, { email: rx }, { phone: rx }];
  }

  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'user',
        as: 'orders',
      },
    },
    {
      $addFields: {
        ordersCount: { $size: '$orders' },
        totalSpent: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: '$orders',
                  as: 'o',
                  cond: { $in: ['$$o.status', ['confirmed', 'processing', 'shipped', 'delivered']] },
                },
              },
              as: 'o',
              in: '$$o.total',
            },
          },
        },
      },
    },
    { $project: { name: 1, email: 1, phone: 1, createdAt: 1, ordersCount: 1, totalSpent: 1 } },
    { $sort: { createdAt: -1 } },
  ];

  const [items, total] = await Promise.all([
    User.aggregate([...pipeline, { $skip: (pageNum - 1) * limitNum }, { $limit: limitNum }]),
    User.countDocuments(match),
  ]);

  res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await User.findOne({ _id: req.params.id, role: 'customer' });
  if (!customer) return res.status(404).json({ message: 'Customer not found.' });

  const orders = await Order.find({ user: customer._id }).sort({ createdAt: -1 }).lean();
  res.json({ customer: customer.toSafeJSON(), orders });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const revenueStatuses = ['confirmed', 'processing', 'shipped', 'delivered'];
  const since = new Date();
  since.setMonth(since.getMonth() - 5, 1);
  since.setHours(0, 0, 0, 0);

  const [totalOrders, pendingOrders, customerCount, revenueAgg, statusRows, monthly, recentOrders, topProducts, lowStock] =
    await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'awaiting_whatsapp' }),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        { $match: { status: { $in: revenueStatuses } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            orders: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [{ $in: ['$status', revenueStatuses] }, '$total', 0],
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(8).lean(),
      Product.find({ isActive: true })
        .populate('brand', 'name')
        .sort({ salesCount: -1 })
        .limit(5)
        .lean(),
      Product.find({ isActive: true, stock: { $lte: 5 } })
        .sort({ stock: 1 })
        .limit(8)
        .lean(),
    ]);

  const monthlySeries = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date();
    d.setMonth(d.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const found = monthly.find((row) => row._id === key);
    monthlySeries.push({
      month: d.toLocaleString('en-NG', { month: 'short' }),
      orders: found?.orders || 0,
      revenue: found?.revenue || 0,
    });
  }

  const statusBreakdown = ORDER_STATUSES.map((status) => ({
    status,
    count: statusRows.find((row) => row._id === status)?.count || 0,
  }));

  res.json({
    totals: {
      orders: totalOrders,
      pendingOrders,
      customers: customerCount,
      revenue: revenueAgg[0]?.revenue || 0,
      confirmedOrders: revenueAgg[0]?.count || 0,
    },
    monthly: monthlySeries,
    statusBreakdown,
    recentOrders,
    topProducts,
    lowStock,
  });
});
