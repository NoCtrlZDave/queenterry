import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import useDebounce from '../../hooks/useDebounce';
import { formatNaira } from '../../lib/format';
import { PageLoader } from '../../components/ui/Spinner';
import ProductImage from '../../components/product/ProductImage';

const filters = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Hidden' },
  { value: 'low_stock', label: 'Low stock' },
];

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 350);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [debounced, status]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api(`/admin/products?search=${encodeURIComponent(debounced)}&status=${status}&page=${page}&limit=20`)
      .then((response) => {
        if (active) setData(response);
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
  }, [debounced, status, page, version]);

  const remove = async (product) => {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    setDeleting(product._id);
    try {
      await api(`/admin/products/${product._id}`, { method: 'DELETE' });
      setVersion((value) => value + 1);
    } catch (err) {
      window.alert(err.message);
    } finally {
      setDeleting('');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Catalogue</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">Products</h1>
          <p className="mt-1 text-xs text-smoke">
            {data.total} product{data.total === 1 ? '' : 's'} in the catalogue
          </p>
        </div>
        <Link to="/admin/products/new" className="btn-primary text-xs">
          <Plus className="h-4 w-4" />
          Add product
        </Link>
      </div>

      <div className="rounded-2xl border border-line bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-smoke" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or SKU"
              className="input pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatus(filter.value)}
                className={`chip ${status === filter.value ? 'chip-active' : ''}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <PageLoader label="Loading products…" />
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {error}
        </div>
      ) : data.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center">
          <p className="font-display text-lg font-semibold text-ink">No products found</p>
          <p className="mt-1 text-xs text-smoke">Try a different filter or add a new product.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="scroll-x-touch overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead>
                <tr className="border-b border-line bg-cloud text-[10px] uppercase tracking-[0.12em] text-smoke">
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.items.map((product) => (
                  <tr key={product._id} className="transition hover:bg-cloud">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-10 shrink-0 overflow-hidden rounded-lg bg-mist">
                          <ProductImage product={product} className="h-full w-full" />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-semibold text-ink">{product.name}</p>
                          <p className="text-[10px] text-smoke">
                            {product.brand?.name}
                            {product.sku ? ` · ${product.sku}` : ''}
                            {product.isDemo ? ' · Demo' : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-smoke">{product.category?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{formatNaira(product.price)}</p>
                      {product.compareAtPrice > product.price && (
                        <p className="text-[10px] text-smoke line-through">
                          {formatNaira(product.compareAtPrice)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          product.stock === 0
                            ? 'font-semibold text-rose-600'
                            : product.stock <= 5
                              ? 'font-semibold text-amber-600'
                              : 'text-ink'
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold ${
                          product.isActive
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-line bg-mist text-smoke'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/product/${product.slug}`}
                          className="rounded-full p-2 text-smoke hover:bg-mist hover:text-ink"
                          aria-label="View product"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          to={`/admin/products/${product._id}`}
                          className="rounded-full p-2 text-smoke hover:bg-mist hover:text-ink"
                          aria-label="Edit product"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(product)}
                          disabled={deleting === product._id}
                          className="rounded-full p-2 text-smoke hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                          aria-label="Delete product"
                        >
                          {deleting === product._id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.pages > 1 && (
            <div className="flex items-center justify-between border-t border-line px-4 py-3 text-xs">
              <span className="text-smoke">
                Page {data.page} of {data.pages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="btn-outline px-3 py-1.5 text-[11px]"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= data.pages}
                  onClick={() => setPage((value) => value + 1)}
                  className="btn-outline px-3 py-1.5 text-[11px]"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
