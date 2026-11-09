import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Search, X } from 'lucide-react';
import { api } from '../../lib/api';
import { formatNaira } from '../../lib/format';
import useDebounce from '../../hooks/useDebounce';
import { useCatalog } from '../../context/CatalogContext';
import ProductImage from '../product/ProductImage';

const RECENT_KEY = 'qt_recent_searches';

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState([]);
  const debounced = useDebounce(query, 300);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { categories } = useCatalog();

  useEffect(() => {
    if (!open) return;
    setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'));
    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return undefined;
    if (debounced.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);
    api(`/products?search=${encodeURIComponent(debounced.trim())}&limit=6`)
      .then((data) => {
        if (active) setResults(data.items || []);
      })
      .catch(() => {
        if (active) setResults([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debounced, open]);

  const remember = (value) => {
    const next = [value, ...recent.filter((item) => item !== value)].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    setRecent(next);
  };

  const submit = (value) => {
    const term = (value ?? query).trim();
    if (!term) return;
    remember(term);
    onClose?.();
    navigate(`/shop?search=${encodeURIComponent(term)}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-white"
        >
          <div className="border-b border-line">
            <div className="shell flex h-16 items-center gap-4 sm:h-20">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full bg-mist px-4 py-3">
                <Search className="h-5 w-5 shrink-0 text-smoke" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submit();
                  }}
                  placeholder="Search products, brands and categories"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-smoke/80"
                  aria-label="Search products"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="rounded-full p-1 text-smoke hover:bg-white"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full p-2.5 text-ink transition hover:bg-mist"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="overlay-scroll shell py-8">
            {debounced.trim().length >= 2 ? (
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-smoke">
                    {loading ? 'Searching…' : `${results.length} result${results.length === 1 ? '' : 's'}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => submit()}
                    className="link-underline text-sm"
                  >
                    View all results
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 space-y-2">
                  {loading &&
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="skeleton h-20 w-full rounded-2xl" />
                    ))}

                  {!loading &&
                    results.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 rounded-2xl border border-transparent p-2 transition hover:border-line hover:bg-cloud"
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                          <ProductImage product={product} className="h-full w-full" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
                          <p className="text-xs text-smoke">{product.brand?.name}</p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-ink">
                          {formatNaira(product.price)}
                        </span>
                      </Link>
                    ))}

                  {!loading && results.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-line bg-cloud p-8 text-center text-sm text-smoke">
                      No products matched “{debounced}”. Try a different keyword or browse a category.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-smoke">
                    Shop by category
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {categories.slice(0, 8).map((category) => (
                      <Link
                        key={category._id}
                        to={`/shop?category=${category.slug}`}
                        onClick={onClose}
                        className="rounded-xl border border-line px-4 py-3 text-sm font-medium text-ink transition hover:border-ink/30 hover:bg-cloud"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-smoke">
                    Recent searches
                  </p>
                  {recent.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {recent.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => submit(term)}
                          className="chip"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-smoke">
                      Your recent searches will appear here.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
