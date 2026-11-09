import { Category } from '../models/Category.js';
import { Brand } from '../models/Brand.js';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uniqueSlug } from '../utils/slug.js';

async function countsFor(field) {
  const rows = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
  ]);
  return rows.reduce((acc, row) => {
    acc[row._id.toString()] = row.count;
    return acc;
  }, {});
}

export const listCategories = asyncHandler(async (req, res) => {
  const [categories, counts] = await Promise.all([
    Category.find({ isActive: true }).sort({ order: 1, name: 1 }),
    countsFor('category'),
  ]);
  res.json({
    items: categories.map((c) => ({
      ...c.toObject(),
      productCount: counts[c._id.toString()] || 0,
    })),
  });
});

export const listBrands = asyncHandler(async (req, res) => {
  const [brands, counts] = await Promise.all([
    Brand.find({ isActive: true }).sort({ order: 1, name: 1 }),
    countsFor('brand'),
  ]);
  res.json({
    items: brands.map((b) => ({
      ...b.toObject(),
      productCount: counts[b._id.toString()] || 0,
    })),
  });
});

export const adminListCategories = asyncHandler(async (req, res) => {
  const [items, counts] = await Promise.all([
    Category.find().sort({ order: 1, name: 1 }),
    countsFor('category'),
  ]);
  res.json({ items: items.map((c) => ({ ...c.toObject(), productCount: counts[c._id.toString()] || 0 })) });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, group, order, isActive } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: 'Category name is required.' });

  const category = await Category.create({
    name: name.trim(),
    slug: await uniqueSlug(Category, name),
    description: description || '',
    group: group || 'Gadgets',
    order: Number(order) || 0,
    isActive: isActive !== false,
  });
  res.status(201).json({ category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found.' });

  if (req.body.name && req.body.name !== category.name) {
    category.name = req.body.name.trim();
    category.slug = await uniqueSlug(Category, category.name, category._id);
  }
  if (req.body.description !== undefined) category.description = req.body.description;
  if (req.body.group) category.group = req.body.group;
  if (req.body.order !== undefined) category.order = Number(req.body.order) || 0;
  if (req.body.isActive !== undefined) category.isActive = Boolean(req.body.isActive);

  await category.save();
  res.json({ category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Product.exists({ category: req.params.id });
  if (inUse) {
    return res
      .status(400)
      .json({ message: 'This category still has products. Move or delete them first.' });
  }
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted.' });
});

export const adminListBrands = asyncHandler(async (req, res) => {
  const [items, counts] = await Promise.all([
    Brand.find().sort({ order: 1, name: 1 }),
    countsFor('brand'),
  ]);
  res.json({ items: items.map((b) => ({ ...b.toObject(), productCount: counts[b._id.toString()] || 0 })) });
});

export const createBrand = asyncHandler(async (req, res) => {
  const { name, tagline, order, isActive } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: 'Brand name is required.' });

  const brand = await Brand.create({
    name: name.trim(),
    slug: await uniqueSlug(Brand, name),
    tagline: tagline || '',
    order: Number(order) || 0,
    isActive: isActive !== false,
  });
  res.status(201).json({ brand });
});

export const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) return res.status(404).json({ message: 'Brand not found.' });

  if (req.body.name && req.body.name !== brand.name) {
    brand.name = req.body.name.trim();
    brand.slug = await uniqueSlug(Brand, brand.name, brand._id);
  }
  if (req.body.tagline !== undefined) brand.tagline = req.body.tagline;
  if (req.body.order !== undefined) brand.order = Number(req.body.order) || 0;
  if (req.body.isActive !== undefined) brand.isActive = Boolean(req.body.isActive);

  await brand.save();
  res.json({ brand });
});

export const deleteBrand = asyncHandler(async (req, res) => {
  const inUse = await Product.exists({ brand: req.params.id });
  if (inUse) {
    return res
      .status(400)
      .json({ message: 'This brand still has products. Move or delete them first.' });
  }
  await Brand.findByIdAndDelete(req.params.id);
  res.json({ message: 'Brand deleted.' });
});
