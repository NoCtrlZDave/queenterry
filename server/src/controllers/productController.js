import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Brand } from '../models/Brand.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isObjectId = (value) => /^[a-f\d]{24}$/i.test(value);

async function resolveRef(Model, value) {
  if (!value) return null;
  return isObjectId(value) ? Model.findById(value) : Model.findOne({ slug: value });
}

function sortOption(sort) {
  switch (sort) {
    case 'newest':
      return { createdAt: -1 };
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    case 'best_selling':
      return { salesCount: -1, createdAt: -1 };
    case 'featured':
    default:
      return { featured: -1, salesCount: -1, createdAt: -1 };
  }
}

export const listProducts = asyncHandler(async (req, res) => {
  const {
    search = '',
    category,
    categories,
    brand,
    minPrice,
    maxPrice,
    availability,
    sort = 'featured',
    page = 1,
    limit = 12,
    featured,
    deals,
    new: newest,
    ids,
  } = req.query;

  const filter = { isActive: true };

  if (search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ name: rx }, { description: rx }, { highlights: rx }];
  }

  if (category) {
    const doc = await resolveRef(Category, category);
    if (!doc) return res.json({ items: [], page: 1, pages: 0, total: 0 });
    filter.category = doc._id;
  }

  if (categories) {
    const slugs = String(categories)
      .split(',')
      .map((slug) => slug.trim())
      .filter(Boolean);
    const docs = await Category.find({ slug: { $in: slugs } });
    if (!docs.length) return res.json({ items: [], page: 1, pages: 0, total: 0 });
    filter.category = { $in: docs.map((doc) => doc._id) };
  }

  if (brand) {
    const doc = await resolveRef(Brand, brand);
    if (!doc) return res.json({ items: [], page: 1, pages: 0, total: 0 });
    filter.brand = doc._id;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (availability === 'in_stock') filter.stock = { $gt: 0 };
  if (availability === 'out_of_stock') filter.stock = 0;

  if (featured === 'true') filter.featured = true;
  if (deals === 'true') filter.$expr = { $gt: ['$compareAtPrice', '$price'] };

  if (ids) {
    const list = String(ids)
      .split(',')
      .filter(isObjectId);
    filter._id = { $in: list };
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(48, Math.max(1, Number(limit) || 12));

  let sortBy = sortOption(sort);
  if (newest === 'true') sortBy = { createdAt: -1 };

  const [total, items] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .populate('brand', 'name slug')
      .populate('category', 'name slug')
      .sort(sortBy)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
  ]);

  res.json({
    items,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total,
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('brand', 'name slug tagline')
    .populate('category', 'name slug');

  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json({ product });
});

export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true });
  if (!product) return res.status(404).json({ message: 'Product not found.' });

  let items = await Product.find({
    _id: { $ne: product._id },
    isActive: true,
    category: product.category,
  })
    .populate('brand', 'name slug')
    .populate('category', 'name slug')
    .sort({ salesCount: -1, createdAt: -1 })
    .limit(4);

  if (items.length < 4) {
    const extra = await Product.find({
      _id: { $nin: [product._id, ...items.map((i) => i._id)] },
      isActive: true,
      brand: product.brand,
    })
      .populate('brand', 'name slug')
      .populate('category', 'name slug')
      .limit(4 - items.length);
    items = [...items, ...extra];
  }

  res.json({ items });
});
