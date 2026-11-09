import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { api } from '../lib/api';
import { useCatalog } from '../context/CatalogContext';
import useDebounce from '../hooks/useDebounce';
import ProductGrid from '../components/product/ProductGrid';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { cn } from '../lib/format';

const SORT_OPTIONS = [
  ['featured', 'Featured'],
  ['newest', 'Newest'],
  ['price_asc', 'Price: Low to High'],
  ['price_desc', 'Price: High to Low'],
  ['best_selling', 'Best Selling'],
];

const PAGE_SIZE = 12;

function FilterPanel({ categories, brands, values, onCategory, onBrand, onAvailability, onPrice, onClear }) {
  const [min, setMin] = useState(values.minPrice || '');
  const [max, setMax] = useState(values.maxPrice || '');

  useEffect(() => {
    setMin(values.minPrice || '');
    setMax(values.maxPrice || '');
  }, [values.minPrice, values.maxPrice]);

  const selectedCategories = (values.categories || '').split(',').filter(Boolean);

  return (
    <div className="space-y-7">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">Category</h3>
          {values.category && (
            <button type="button" onClick={() => onCategory('')} className="text-[10px] text-accent hover:underline">
              Reset
            </button>
          )}
        </div>
        <div className="mt-3 space-y-0.5">
          <button
            type="button"
            onClick={() => onCategory('')}
            className={cn(
              'flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm transition',
              !values.category ? 'font-semibold text-ink' : 'text-smoke hover:bg-mist hover:text-ink'
            )}
          >
            All categories
          </button>
          {categories.map((category) => {
            const active = values.category === category.slug;
            return (
              <button
                key={category._id}
                type="button"
                onClick={() => onCategory(active ? '' : category.slug)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm transition',
                  active ? 'bg-mist font-semibold text-ink' : 'text-smoke hover:bg-mist hover:text-ink'
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      active || selectedCategories.includes(category.slug) ? 'bg-accent' : 'bg-line'
                    )}
                  />
                  {category.name}
                </span>
                <span className="text-[10px] text-smoke">{category.productCount || 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-line pt-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">Brand</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {brands.map((brand) => {
            const active = values.brand === brand.slug;
            return (
              <button
                key={brand._id}
                type="button"
                onClick={() => onBrand(active ? '' : brand.slug)}
                className={cn('chip', active && 'chip-active')}
              >
                {brand.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-line pt-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">Price (₦)</h3>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={min}
            onChange={(event) => setMin(event.target.value)}
            placeholder="Min"
            className="input px-3 py-2 text-xs"
            aria-label="Minimum price"
          />
          <span className="text-smoke">–</span>
          <input
            type="number"
            min="0"
            value={max}
            onChange={(event) => setMax(event.target.value)}
            placeholder="Max"
            className="input px-3 py-2 text-xs"
            aria-label="Maximum price"
          />
        </div>
        <button
          type="button"
          onClick={() => onPrice(min, max)}
          className="btn-outline mt-3 w-full py-2 text-xs"
        >
          Apply price
        </button>
      </div>

      <div className="border-t border-line pt-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">Availability</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            ['', 'All'],
            ['in_stock', 'In stock'],
            ['out_of_stock', 'Out of stock'],
          ].map(([value, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => onAvailability(value)}
              className={cn('chip', (values.availability || '') === value && 'chip-active')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-line pt-5">
        <button type="button" onClick={onClear} className="btn-outline w-full py-2.5 text-xs">
          Clear all filters
        </button>
      </div>
    </div>
  );
}

export default function Shop({ dealsOnly = false }) {
  const [params, setParams] = useSearchParams();
  const { categories, brands } = useCatalog();
  const [data, setData] = useState({ items: [], page: 1, pages: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = params.get('search') || '';
  const category = params.get('category') || '';
  const categoriesParam = params.get('categories') || '';
  const brand = params.get('brand') || '';
  const availability = params.get('availability') || '';
  const sort = params.get('sort') || 'featured';
  const page = params.get('page') || '1';
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';
  const featured = params.get('featured') || '';

  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  const setMany = useCallback(
    (updates) => {
      const next = new URLSearchParams(params);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') next.delete(key);
        else next.set(key, value);
      });
      next.delete('page');
      setParams(next, { replace: true });
    },
    [params, setParams]
  );

  useEffect(() => {
    const term = debouncedSearch.trim();
    if (term === q) return;
    setMany({ search: term });
  }, [debouncedSearch, q, setMany]);

  const queryString = params.toString();

  useEffect(() => {
    let active = true;
    const searchParams = new URLSearchParams(queryString);
    searchParams.set('limit', String(PAGE_SIZE));
    if (!searchParams.get('sort')) searchParams.set('sort', 'featured');
    if (dealsOnly) searchParams.set('deals', 'true');

    setLoading(true);
    api(`/products?${searchParams.toString()}`)
      .then((result) => {
        if (!active) return;
        setData(result);
      })
      .catch(() => {
        if (active) setData({ items: [], page: 1, pages: 0, total: 0 });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [queryString, dealsOnly]);

  const heading = useMemo(() => {
    if (q) return `Search results for “${q}”`;
    if (category) return categories.find((c) => c.slug === category)?.name || 'Products';
    if (categoriesParam) {
      return categoriesParam
        .split(',')
        .map((slug) => categories.find((c) => c.slug === slug)?.name || slug)
        .join(' · ');
    }
    if (brand) return brands.find((b) => b.slug === brand)?.name || 'Products';
    if (dealsOnly) return 'Deals & offers';
    if (featured === 'true') return 'Featured products';
    return 'All products';
  }, [q, category, categoriesParam, brand, categories, brands, dealsOnly, featured]);

  const values = { category, brand, availability, minPrice, maxPrice, categories: categoriesParam };

  const panelHandlers = {
    onCategory: (slug) => setMany({ category: slug, categories: null }),
    onBrand: (slug) => setMany({ brand: slug }),
    onAvailability: (value) => setMany({ availability: value }),
    onPrice: (min, max) => setMany({ minPrice: min, maxPrice: max }),
    onClear: () => setParams(new URLSearchParams(), { replace: true }),
  };

  const activeChips = [
    category && {
      key: 'category',
      label: categories.find((c) => c.slug === category)?.name || category,
      clear: () => setMany({ category: null }),
    },
    categoriesParam && {
      key: 'categories',
      label: categoriesParam
        .split(',')
        .map((slug) => categories.find((c) => c.slug === slug)?.name || slug)
        .join(', '),
      clear: () => setMany({ categories: null }),
    },
    brand && {
      key: 'brand',
      label: brands.find((b) => b.slug === brand)?.name || brand,
      clear: () => setMany({ brand: null }),
    },
    availability && {
      key: 'availability',
      label: availability === 'in_stock' ? 'In stock' : 'Out of stock',
      clear: () => setMany({ availability: null }),
    },
    (minPrice || maxPrice) && {
      key: 'price',
      label: `₦${Number(minPrice || 0).toLocaleString()} – ${
        maxPrice ? `₦${Number(maxPrice).toLocaleString()}` : 'Any'
      }`,
      clear: () => setMany({ minPrice: null, maxPrice: null }),
    },
  ].filter(Boolean);

  return (
    <div className="shell py-8 sm:py-12">
      <div className="border-b border-line pb-8">
        <p className="section-kicker">{dealsOnly ? 'Limited-time offers' : 'Shop Queen Terry'}</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
              {heading}
            </h1>
            <p className="mt-2 text-sm text-smoke">
              {loading ? 'Loading products…' : `${data.total} product${data.total === 1 ? '' : 's'} available`}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-smoke" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search products"
                className="w-full bg-transparent text-sm outline-none placeholder:text-smoke/70 sm:w-48"
                aria-label="Search within products"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setMany({ search: null });
                  }}
                  aria-label="Clear search"
                  className="text-smoke hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="btn-outline shrink-0 px-4 py-2.5 text-xs lg:hidden"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>

              <label className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-xs text-smoke">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <select
                  value={sort}
                  onChange={(event) => setMany({ sort: event.target.value })}
                  className="bg-transparent text-xs font-medium text-ink outline-none"
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.clear}
                className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-[11px] font-medium text-ink transition hover:bg-line"
              >
                {chip.label}
                <X className="h-3 w-3" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
              className="text-[11px] font-semibold text-accent hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-10">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            <FilterPanel categories={categories} brands={brands} values={values} {...panelHandlers} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {!loading && data.items.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No products found"
              description="Try adjusting your filters or searching for a different keyword."
              actionLabel="Browse all products"
              actionTo="/shop"
            />
          ) : (
            <ProductGrid products={data.items} loading={loading} skeletonCount={8} />
          )}

          {data.pages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-1.5">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => setMany({ page: String(data.page - 1) })}
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition hover:border-ink/40 disabled:opacity-35"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(5, data.pages) }).map((_, index) => {
                let start = Math.max(1, data.page - 2);
                const end = Math.min(data.pages, start + 4);
                start = Math.max(1, end - 4);
                const number = start + index;
                if (number > data.pages) return null;
                return (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setMany({ page: String(number) })}
                    className={cn(
                      'grid h-9 w-9 place-items-center rounded-full text-xs font-semibold transition',
                      number === data.page
                        ? 'bg-ink text-white'
                        : 'border border-line text-ink hover:border-ink/40'
                    )}
                    aria-label={`Page ${number}`}
                    aria-current={number === data.page ? 'page' : undefined}
                  >
                    {number}
                  </button>
                );
              })}
              <button
                type="button"
                disabled={data.page >= data.pages}
                onClick={() => setMany({ page: String(data.page + 1) })}
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition hover:border-ink/40 disabled:opacity-35"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        panelClassName="max-h-[85vh] overflow-y-auto"
      >
        <FilterPanel categories={categories} brands={brands} values={values} {...panelHandlers} />
        <button
          type="button"
          onClick={() => setFiltersOpen(false)}
          className="btn-primary mt-5 w-full"
        >
          Show results
        </button>
      </Modal>
    </div>
  );
}
