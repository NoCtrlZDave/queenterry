import { Link } from 'react-router-dom';
import { ArrowUpRight, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { cn, discountPercent } from '../../lib/format';
import Price from '../ui/Price';
import Rating from '../ui/Rating';
import ProductImage from './ProductImage';

function isNew(product) {
  if (!product?.createdAt) return false;
  return Date.now() - new Date(product.createdAt).getTime() < 1000 * 60 * 60 * 24 * 30;
}

export default function ProductCard({ product, className = '' }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const discount = discountPercent(product);
  const outOfStock = Number(product.stock) <= 0;
  const saved = has(product._id);

  return (
    <article className={cn('group flex h-full flex-col', className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-mist">
        <Link to={`/product/${product.slug}`} className="block h-full" aria-label={product.name}>
          <ProductImage
            product={product}
            className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              -{discount}%
            </span>
          )}
          {discount === 0 && isNew(product) && (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink shadow-sm">
              New
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggle(product._id)}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={saved}
          className={cn(
            'absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white',
            saved ? 'text-accent' : 'text-ink'
          )}
        >
          <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
        </button>

        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center bg-white/55 backdrop-blur-[2px]">
            <span className="rounded-full bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-smoke">
          {product.brand?.name || product.brand || 'Queen Terry'}
        </p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <Link
            to={`/product/${product.slug}`}
            className="min-w-0 font-display text-[15px] font-semibold leading-snug text-ink transition hover:text-accent"
          >
            {product.name}
          </Link>
          <Link
            to={`/product/${product.slug}`}
            className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mist text-ink transition hover:bg-ink hover:text-white"
            aria-label={`View ${product.name}`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Rating value={product.rating} count={product.reviewsCount} className="mt-2" />

        <div className="mt-auto pt-3">
          <Price price={product.price} compareAtPrice={product.compareAtPrice} showDiscount />
          <button
            type="button"
            disabled={outOfStock}
            onClick={() =>
              addItem(product, { quantity: 1, color: product.colors?.[0]?.name || '' })
            }
            className="btn-primary mt-3 w-full gap-1.5 px-2 py-2.5 text-xs"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {outOfStock ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="skeleton aspect-[4/5] rounded-3xl" />
      <div className="space-y-2 pt-4">
        <div className="skeleton h-2.5 w-16 rounded-full" />
        <div className="skeleton h-4 w-3/4 rounded-full" />
        <div className="skeleton h-4 w-1/3 rounded-full" />
        <div className="skeleton h-10 w-full rounded-full" />
      </div>
    </div>
  );
}
