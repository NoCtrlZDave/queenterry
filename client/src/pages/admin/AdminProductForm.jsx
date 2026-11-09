import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImagePlus, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { api, assetUrl, uploadImages } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { formatNaira } from '../../lib/format';
import { PageLoader } from '../../components/ui/Spinner';

const emptyForm = {
  name: '',
  brand: '',
  category: '',
  description: '',
  highlights: '',
  price: '',
  compareAtPrice: '',
  stock: '',
  sku: '',
  warranty: '',
  rating: '',
  reviewsCount: '',
  featured: false,
  isActive: true,
  images: [],
  colors: [],
  specs: [],
};

function Section({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      {description && <p className="mt-1 text-xs text-smoke">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function AdminProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileRef = useRef(null);

  const [form, setForm] = useState(emptyForm);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([api('/admin/brands'), api('/admin/categories')])
      .then(([brandData, categoryData]) => {
        if (!active) return;
        setBrands(brandData.items || []);
        setCategories(categoryData.items || []);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!editing) return undefined;
    let active = true;
    setLoading(true);
    api(`/admin/products/${id}`)
      .then(({ product }) => {
        if (!active) return;
        setIsDemo(Boolean(product.isDemo));
        setForm({
          name: product.name || '',
          brand: product.brand?._id || product.brand || '',
          category: product.category?._id || product.category || '',
          description: product.description || '',
          highlights: (product.highlights || []).join('\n'),
          price: product.price ?? '',
          compareAtPrice: product.compareAtPrice ?? '',
          stock: product.stock ?? '',
          sku: product.sku || '',
          warranty: product.warranty || '',
          rating: product.rating ?? '',
          reviewsCount: product.reviewsCount ?? '',
          featured: Boolean(product.featured),
          isActive: product.isActive !== false,
          images: product.images || [],
          colors: (product.colors || []).map((color) => ({ ...color })),
          specs: (product.specs || []).map((spec) => ({ ...spec })),
        });
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, editing]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const upload = async (event) => {
    const files = event.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const data = await uploadImages(files);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...data.urls].slice(0, 8) }));
      toast(`${data.urls.length} image(s) uploaded`);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const addColor = () =>
    setForm((prev) => ({ ...prev, colors: [...prev.colors, { name: '', hex: '#111111' }] }));
  const addSpec = () =>
    setForm((prev) => ({ ...prev, specs: [...prev.specs, { label: '', value: '' }] }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Product name is required.');
    if (!form.brand || !form.category) return setError('Choose a brand and category.');
    if (!Number(form.price) || Number(form.price) <= 0) return setError('Enter a valid price.');

    const payload = {
      name: form.name.trim(),
      brand: form.brand,
      category: form.category,
      description: form.description,
      highlights: form.highlights
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      price: Number(form.price),
      compareAtPrice: Number(form.compareAtPrice) || 0,
      stock: Number(form.stock) || 0,
      sku: form.sku,
      warranty: form.warranty,
      rating: Number(form.rating) || 0,
      reviewsCount: Number(form.reviewsCount) || 0,
      featured: form.featured,
      isActive: form.isActive,
      images: form.images,
      colors: form.colors.filter((color) => color.name.trim()),
      specs: form.specs.filter((spec) => spec.label.trim() && spec.value.trim()),
    };

    setSaving(true);
    try {
      if (editing) {
        await api(`/admin/products/${id}`, { method: 'PUT', body: payload });
        toast('Product updated');
      } else {
        await api('/admin/products', { method: 'POST', body: payload });
        toast('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader label="Loading product…" />;

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-smoke hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Products
          </Link>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
            {editing ? 'Edit product' : 'Add product'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/products" className="btn-outline text-xs">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn-primary text-xs">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {editing ? 'Save changes' : 'Create product'}
          </button>
        </div>
      </div>

      {isDemo && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
          This is a demo catalogue product. Replace the demo description, price, stock and images
          with real details before launch, or delete it.
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <Section title="Basic information">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="label">
                  Product name *
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  className="input"
                  placeholder="e.g. iPhone 15 Pro Max 256GB"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="brand" className="label">
                    Brand *
                  </label>
                  <select
                    id="brand"
                    value={form.brand}
                    onChange={(event) => update('brand', event.target.value)}
                    className="input"
                  >
                    <option value="">Select brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="category" className="label">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(event) => update('category', event.target.value)}
                    className="input"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="label">
                  Description
                </label>
                <textarea
                  id="description"
                  rows="5"
                  value={form.description}
                  onChange={(event) => update('description', event.target.value)}
                  className="input resize-none"
                  placeholder="Describe the product, its condition and what is included."
                />
              </div>

              <div>
                <label htmlFor="highlights" className="label">
                  Highlights (one per line)
                </label>
                <textarea
                  id="highlights"
                  rows="4"
                  value={form.highlights}
                  onChange={(event) => update('highlights', event.target.value)}
                  className="input resize-none"
                  placeholder={'6.7-inch Super Retina display\nA17 Pro chip\n48MP main camera'}
                />
              </div>
            </div>
          </Section>

          <Section title="Pricing & inventory">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className="label">
                  Price (₦) *
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(event) => update('price', event.target.value)}
                  className="input"
                  placeholder="0"
                />
                {Number(form.price) > 0 && (
                  <p className="mt-1 text-[10px] text-smoke">{formatNaira(form.price)}</p>
                )}
              </div>
              <div>
                <label htmlFor="compare" className="label">
                  Compare-at price (₦)
                </label>
                <input
                  id="compare"
                  type="number"
                  min="0"
                  step="1"
                  value={form.compareAtPrice}
                  onChange={(event) => update('compareAtPrice', event.target.value)}
                  className="input"
                  placeholder="Optional — shows a discount"
                />
              </div>
              <div>
                <label htmlFor="stock" className="label">
                  Stock quantity
                </label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(event) => update('stock', event.target.value)}
                  className="input"
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="sku" className="label">
                  SKU
                </label>
                <input
                  id="sku"
                  value={form.sku}
                  onChange={(event) => update('sku', event.target.value)}
                  className="input"
                  placeholder="Optional internal code"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="warranty" className="label">
                  Warranty
                </label>
                <input
                  id="warranty"
                  value={form.warranty}
                  onChange={(event) => update('warranty', event.target.value)}
                  className="input"
                  placeholder="e.g. 12 months manufacturer warranty"
                />
              </div>
              <div>
                <label htmlFor="rating" className="label">
                  Rating (0–5)
                </label>
                <input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={(event) => update('rating', event.target.value)}
                  className="input"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label htmlFor="reviews" className="label">
                  Reviews count
                </label>
                <input
                  id="reviews"
                  type="number"
                  min="0"
                  value={form.reviewsCount}
                  onChange={(event) => update('reviewsCount', event.target.value)}
                  className="input"
                  placeholder="Optional"
                />
              </div>
            </div>
          </Section>

          <Section title="Images" description="Upload up to 8 images. Without images, the store shows a generated visual.">
            {form.images.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {form.images.map((image, index) => (
                  <div key={`${image}-${index}`} className="group relative overflow-hidden rounded-xl border border-line">
                    <img
                      src={assetUrl(image)}
                      alt={`Product upload ${index + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                      className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-ink shadow-sm hover:bg-white"
                      aria-label="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={upload}
              className="hidden"
              id="product-images"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="btn-outline text-xs"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="h-4 w-4" />
              )}
              {uploading ? 'Uploading…' : 'Upload images'}
            </button>
          </Section>

          <Section title="Colours" description="Optional colour options customers can choose from.">
            <div className="space-y-3">
              {form.colors.map((color, index) => (
                <div key={index} className="flex flex-wrap items-center gap-2">
                  <input
                    value={color.name}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        colors: prev.colors.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, name: event.target.value } : item
                        ),
                      }))
                    }
                    className="input min-w-0 flex-1"
                    placeholder="Colour name"
                  />
                  <input
                    type="color"
                    value={color.hex || '#111111'}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        colors: prev.colors.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, hex: event.target.value } : item
                        ),
                      }))
                    }
                    className="h-11 w-12 cursor-pointer rounded-lg border border-line bg-white p-1"
                    aria-label="Colour hex"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        colors: prev.colors.filter((_, itemIndex) => itemIndex !== index),
                      }))
                    }
                    className="rounded-full p-2 text-smoke hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Remove colour"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addColor} className="btn-outline text-xs">
                <Plus className="h-4 w-4" /> Add colour
              </button>
            </div>
          </Section>

          <Section title="Specifications" description="Shown in the product specification table.">
            <div className="space-y-3">
              {form.specs.map((spec, index) => (
                <div key={index} className="flex flex-wrap items-center gap-2">
                  <input
                    value={spec.label}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        specs: prev.specs.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, label: event.target.value } : item
                        ),
                      }))
                    }
                    className="input min-w-0 flex-1"
                    placeholder="Label (e.g. Display)"
                  />
                  <input
                    value={spec.value}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        specs: prev.specs.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, value: event.target.value } : item
                        ),
                      }))
                    }
                    className="input min-w-0 flex-[1.4]"
                    placeholder="Value"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        specs: prev.specs.filter((_, itemIndex) => itemIndex !== index),
                      }))
                    }
                    className="rounded-full p-2 text-smoke hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Remove specification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addSpec} className="btn-outline text-xs">
                <Plus className="h-4 w-4" /> Add specification
              </button>
            </div>
          </Section>
        </div>

        <div className="sticky-xl-safe space-y-5">
          <Section title="Visibility">
            <div className="space-y-4">
              <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-smoke">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => update('isActive', event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-line accent-accent"
                />
                <span>
                  <span className="block font-semibold text-ink">Active on storefront</span>
                  Hidden products cannot be viewed or ordered.
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-smoke">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => update('featured', event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-line accent-accent"
                />
                <span>
                  <span className="block font-semibold text-ink">Featured product</span>
                  Featured products appear in homepage selections.
                </span>
              </label>
            </div>
          </Section>

          <div className="rounded-2xl border border-line bg-ink p-5 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
              Checklist
            </p>
            <ul className="mt-3 space-y-2 text-[11px] text-white/70">
              <li>• Real product name and accurate specifications</li>
              <li>• Current price and stock quantity</li>
              <li>• Clear description and warranty details</li>
              <li>• Own product images instead of demo visuals</li>
            </ul>
            <button type="submit" disabled={saving} className="btn-light mt-4 w-full py-2.5 text-xs">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editing ? 'Save product' : 'Create product'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
