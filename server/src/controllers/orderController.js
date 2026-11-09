import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { getSettings } from '../models/Settings.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateOrderNumber } from '../utils/orderNumber.js';
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp.js';

const digits = (value = '') => String(value).replace(/\D/g, '');

function validateCustomer(customer = {}) {
  if (!customer.name?.trim() || customer.name.trim().length < 2) return 'Please enter your full name.';
  if (digits(customer.phone).length < 10) return 'Please enter a valid phone number.';
  if (!customer.address?.trim()) return 'Please enter your delivery address.';
  return null;
}

export const createOrder = asyncHandler(async (req, res) => {
  const { customer = {}, items = [] } = req.body;

  const customerError = validateCustomer(customer);
  if (customerError) return res.status(400).json({ message: customerError });
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Your cart is empty.' });
  }

  const productIds = items.map((i) => i.productId).filter(Boolean);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true }).populate(
    'brand',
    'name'
  );
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const orderItems = [];
  for (const line of items) {
    const product = productMap.get(String(line.productId));
    if (!product) {
      return res.status(400).json({ message: 'One of the products in your cart is no longer available.' });
    }
    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 1));
    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Only ${product.stock} unit(s) of ${product.name} are available right now.`,
      });
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      brand: product.brand?.name || '',
      slug: product.slug,
      image: product.images?.[0] || '',
      color: line.color || '',
      price: product.price,
      quantity,
    });
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const settings = await getSettings();
  const threshold = Number(settings.delivery?.freeThreshold) || 0;
  const baseFee = Number(settings.delivery?.fee) || 0;
  const deliveryFee = threshold > 0 && subtotal >= threshold ? 0 : baseFee;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user?._id,
    customer: {
      name: customer.name.trim(),
      email: customer.email?.toLowerCase().trim() || req.user?.email || '',
      phone: customer.phone.trim(),
      address: customer.address.trim(),
      state: customer.state?.trim() || '',
      city: customer.city?.trim() || '',
      notes: customer.notes?.trim() || '',
    },
    items: orderItems,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    status: 'awaiting_whatsapp',
    statusHistory: [{ status: 'awaiting_whatsapp', at: new Date() }],
    whatsappOpenedAt: new Date(),
  });

  const message = buildWhatsAppMessage(order);
  const whatsappUrl = buildWhatsAppUrl(settings.whatsappNumber, message);

  res.status(201).json({
    order: {
      orderNumber: order.orderNumber,
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
    },
    message,
    whatsappUrl,
  });
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json({ items: orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber }).lean();
  if (!order) return res.status(404).json({ message: 'Order not found.' });

  const owner = req.user && String(order.user || '') === String(req.user._id);
  const phone = digits(req.query.phone);
  const phoneMatches = phone.length >= 10 && digits(order.customer.phone).slice(-10) === phone.slice(-10);

  if (!owner && !phoneMatches) {
    return res.status(403).json({
      message: 'Please provide the phone number used for this order to view it.',
    });
  }

  const settings = await getSettings();
  const message = buildWhatsAppMessage(order);

  res.json({
    order,
    message,
    whatsappUrl: buildWhatsAppUrl(settings.whatsappNumber, message),
  });
});
