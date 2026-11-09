import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from 'lucide-react';
import { api, assetUrl } from '../lib/api';
import { productImagesFor } from '../lib/productImages';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { cn, formatNaira } from '../lib/format';
import { buildWhatsAppUrl, productInquiryMessage } from '../lib/whatsapp';
import Price from '../components/ui/Price';
import Rating from '../components/ui/Rating';
import QuantityStepper from '../components/ui/QuantityStepper';
import ProductVisual from '../components/product/ProductVisual';
import ProductGrid from '../components/product/ProductGrid';
import EmptyState from '../components/ui/EmptyState';

const tabs = [
  ['overview', 'Overview'],
  ['specifications', 'Specifications'],
  ['delivery', 'Delivery & warranty'],
];

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const { settings, whatsappNumber } = useStore();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setProduct(null);
    setRelated([]);

    Promise.all([
      api(`/products/${slug}`),
      api(`/products/${slug}/related`).catch(() => ({ items: [] })),
    ])
      .then(([productData, relatedData]) => {
        if (!active) return;
        setProduct(productData.product);
        setRelated(relatedData.items || []);
        setColor(productData.product.colors?.[0]?.name || '');
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
    setTab('overview');
  }, [slug]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const images = productImagesFor(product);
    if (images.length) {
      return images.map((url) => ({ type: 'image', url }));
    }
    return [0, 1, 2].map((index) => ({ type: 'visual', index }));
  }, [product]);

  if (loading) {
    return (
      <div className="shell py-8 sm:py-12">
        <div className="skeleton h-3 w-56 rounded-full" />
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="skeleton aspect-square rounded-3xl" />
          <div className="space-y-4">
            <div className="skeleton h-3 w-20 rounded-full" />
            <div className="skeleton h-9 w-3/4 rounded-full" />
            <div className="skeleton h-4 w-40 rounded-full" />
            <div className="skeleton h-10 w-48 rounded-full" />
            <div className="skeleton h-24 w-full rounded-2xl" />
            <div className="skeleton h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="shell py-16">
        <EmptyState
          title="Product not found"
          description="This product may have been moved or is no longer available. Browse the shop for similar options."
          actionLabel="Back to shop"
          actionTo="/shop"
        />
      </div>
    );
  }

  const stock = Number(product.stock) || 0;
  const outOfStock = stock <= 0;
  const saved = has(product._id);
  const compareAt = product.compareAtPrice > product.price ? product.compareAtPrice : 0;
  const discount = compareAt ? Math.round(((compareAt - product.price) / compareAt) * 100) : 0;
  const stockLabel = outOfStock
    ? 'Out of stock'
    : stock <= 5
      ? `Only ${stock} left in stock`
      : 'In stock';
  const categorySlug = product.category?.slug || '';

  const whatsappHref = buildWhatsAppUrl(
    whatsappNumber,
    productInquiryMessage(product, { quantity, color })
  );

  const handleAddToCart = () => {
    addItem(product, { quantity, color });
  };

  const handleBuyNow = () => {
    addItem(product, { quantity, color, silent: true });
    navigate('/checkout');
  };

  return (
    <div className="shell py-6 sm:py-10">
      <nav className="flex flex-wrap items-center gap-1.5 text-[11px] text-smoke" aria-label="Breadcrumb">
        <Link to="/" className="transition hover:text-ink">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="transition hover:text-ink">
          Shop
        </Link>
        {product.category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link
              to={`/shop?category=${categorySlug}`}
              className="transition hover:text-ink"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <div className="group relative aspect-square overflow-hidden rounded-3xl bg-mist">
            {gallery[activeImage]?.type === 'image' ? (
              <img
                src={assetUrl(gallery[activeImage].url)}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            ) : (
              <ProductVisual
                category={categorySlug}
                seed={`${product.name}-${gallery[activeImage]?.index ?? 0}`}
                className="h-full w-full"
                alt={product.name}
              />
            )}

            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white">
                Save {discount}%
              </span>
            )}

            <button
              type="button"
              onClick={() => toggle(product._id)}
              aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              className={cn(
                'absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-105',
                saved ? 'text-accent' : 'text-ink'
              )}
            >
              <Heart className={cn('h-5 w-5', saved && 'fill-current')} />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {gallery.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveImage(index)}
                className={cn(
                  'aspect-square overflow-hidden rounded-2xl border-2 bg-mist transition',
                  activeImage === index ? 'border-ink' : 'border-transparent hover:border-line'
                )}
                aria-label={`View image ${index + 1}`}
                aria-pressed={activeImage === index}
              >
                {item.type === 'image' ? (
                  <img
                    src={assetUrl(item.url)}
                    alt={`${product.name} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ProductVisual
                    category={categorySlug}
                    seed={`${product.name}-${item.index}`}
                    className="h-full w-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="sticky-lg-safe">
          <div className="flex items-center justify-between gap-3">
            {product.brand && (
              <Link
                to={`/shop?brand=${product.brand.slug}`}
                className="min-w-0 break-words text-[11px] font-semibold uppercase tracking-[0.18em] text-accent hover:underline"
              >
                {product.brand.name}
              </Link>
            )}
            <span className="shrink-0 break-words text-right text-[11px] text-smoke">SKU: {product.sku || '—'}</span>
          </div>

          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-[-0.04em] text-ink sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Rating value={product.rating} count={product.reviewsCount} />
            {product.reviewsCount > 0 && (
              <span className="text-[11px] text-smoke">
                Based on {product.reviewsCount} sample reviews
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <Price
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              size="xl"
              showDiscount
            />
            {compareAt > 0 && (
              <span className="pb-1 text-xs font-medium text-emerald-600">
                You save {formatNaira(compareAt - product.price)}
              </span>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-smoke">{product.description}</p>

          {product.isDemo && (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
              Demo catalogue listing — please confirm current price, availability and full
              specifications with our team before ordering.
            </p>
          )}

          {product.colors?.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">
                  Colour
                </p>
                <span className="min-w-0 break-words text-right text-xs text-smoke">{color}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((option) => {
                  const selected = color === option.name;
                  return (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() => setColor(option.name)}
                      className={cn(
                        'flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition',
                        selected
                          ? 'border-ink bg-ink text-white'
                          : 'border-line text-ink hover:border-ink/40'
                      )}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ backgroundColor: option.hex }}
                      />
                      {option.name}
                      {selected && <Check className="h-3 w-3" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-2 text-xs font-medium">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                outOfStock ? 'bg-rose-500' : stock <= 5 ? 'bg-amber-500' : 'bg-emerald-500'
              )}
            />
            <span className={outOfStock ? 'text-rose-600' : 'text-smoke'}>{stockLabel}</span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={Math.max(1, stock)}
            />
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="btn-primary flex-1 py-3.5"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to cart
            </button>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="btn-accent py-3.5"
            >
              <Zap className="h-4 w-4" />
              Buy now
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="btn inline-flex items-center justify-center gap-2 rounded-full border border-[#25D366] bg-[#25D366]/10 py-3.5 text-sm font-semibold text-ink transition hover:bg-[#25D366]/20"
            >
              <MessageCircle className="h-4 w-4 text-[#128C4A]" />
              Order via WhatsApp
            </a>
          </div>

          <button
            type="button"
            onClick={() => toggle(product._id)}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line py-3 text-xs font-semibold text-smoke transition hover:border-ink/30 hover:text-ink"
          >
            <Heart className={cn('h-4 w-4', saved && 'fill-accent text-accent')} />
            {saved ? 'Saved to wishlist' : 'Save to wishlist'}
          </button>

          <div className="mt-7 divide-y divide-line rounded-2xl border border-line">
            <div className="flex items-start gap-3 p-4">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <p className="text-xs font-semibold text-ink">Delivery</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-smoke">
                  {settings.delivery?.info ||
                    'Delivery options are confirmed with our team on WhatsApp based on your location.'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <p className="text-xs font-semibold text-ink">Warranty</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-smoke">
                  {product.warranty ||
                    'Warranty details are confirmed by our team before purchase.'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <RefreshCcw className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <p className="text-xs font-semibold text-ink">Support & returns</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-smoke">
                  Message us on WhatsApp for order support. See our{' '}
                  <Link to="/returns" className="font-semibold text-accent hover:underline">
                    returns policy
                  </Link>{' '}
                  for details.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast('Delivery and payment details will be confirmed on WhatsApp.')}
            className="mt-4 flex w-full items-center justify-center gap-1.5 text-[11px] text-smoke transition hover:text-ink"
          >
            How ordering works
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <section className="mt-14">
        <div className="hide-scrollbar scroll-x-touch flex gap-1 overflow-x-auto overscroll-x-contain border-b border-line">
          {tabs.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={cn(
                'shrink-0 border-b-2 px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] transition',
                tab === value
                  ? 'border-ink text-ink'
                  : 'border-transparent text-smoke hover:text-ink'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {tab === 'overview' && (
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <h2 className="font-display text-xl font-semibold text-ink">About this product</h2>
                <p className="mt-3 text-sm leading-relaxed text-smoke">{product.description}</p>
                {product.highlights?.length > 0 && (
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {product.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2 text-sm text-ink">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-2xl border border-line bg-cloud p-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
                  At a glance
                </h3>
                <div className="mt-3 divide-y divide-line">
                  {product.specs?.slice(0, 4).map((spec) => (
                    <div key={spec.label} className="flex justify-between gap-4 py-2.5 text-xs">
                      <span className="min-w-0 break-words text-smoke">{spec.label}</span>
                      <span className="min-w-0 break-words text-right font-medium text-ink">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'specifications' && (
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Specifications</h2>
              {product.specs?.length ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-line">
                  {product.specs.map((spec, index) => (
                    <div
                      key={`${spec.label}-${index}`}
                      className={cn(
                        'grid grid-cols-1 gap-1 px-4 py-3 text-sm sm:grid-cols-[220px_1fr] sm:gap-6',
                        index % 2 === 0 ? 'bg-white' : 'bg-cloud'
                      )}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wide text-smoke">
                        {spec.label}
                      </span>
                      <span className="break-words text-ink">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-smoke">
                  Detailed specifications for this product have not been added yet. Message us on
                  WhatsApp and we will confirm them for you.
                </p>
              )}
            </div>
          )}

          {tab === 'delivery' && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-line p-5">
                <Truck className="h-5 w-5 text-accent" />
                <h3 className="mt-3 font-display text-base font-semibold text-ink">Delivery</h3>
                <p className="mt-2 text-sm leading-relaxed text-smoke">
                  {settings.delivery?.info ||
                    'Delivery options and timelines are confirmed with you on WhatsApp based on your location.'}
                </p>
                <Link to="/delivery" className="mt-3 inline-block text-xs font-semibold text-accent hover:underline">
                  Read delivery information
                </Link>
              </div>
              <div className="rounded-2xl border border-line p-5">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <h3 className="mt-3 font-display text-base font-semibold text-ink">
                  Warranty & returns
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-smoke">
                  {product.warranty || 'Warranty terms are confirmed before purchase.'} For returns,
                  please review our policy or contact support for guidance.
                </p>
                <Link to="/returns" className="mt-3 inline-block text-xs font-semibold text-accent hover:underline">
                  Read returns policy
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">You may also like</p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                Related products
              </h2>
            </div>
            <Link to={`/shop?category=${categorySlug}`} className="link-underline shrink-0">
              View category
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-7">
            <ProductGrid products={related} skeletonCount={4} />
          </div>
        </section>
      )}

      <div className="mt-10">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-smoke transition hover:text-ink">
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
