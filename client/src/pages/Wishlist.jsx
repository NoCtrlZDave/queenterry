import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { api } from '../lib/api';
import { useWishlist } from '../context/WishlistContext';
import ProductGrid from '../components/product/ProductGrid';
import EmptyState from '../components/ui/EmptyState';

export function WishlistGrid({ skeletonCount = 4 }) {
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const key = ids.join(',');

  useEffect(() => {
    let active = true;
    if (!ids.length) {
      setProducts([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    api(`/products?ids=${ids.join(',')}&limit=48`)
      .then((data) => {
        if (active) setProducts(data.items || []);
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [key]);

  if (!loading && products.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Tap the heart on any product to save it here for later."
        actionLabel="Browse products"
        actionTo="/shop"
      />
    );
  }

  return <ProductGrid products={products} loading={loading} skeletonCount={skeletonCount} />;
}

export default function Wishlist() {
  const { count } = useWishlist();

  return (
    <div className="shell py-8 sm:py-12">
      <p className="section-kicker">Saved for later</p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Your wishlist
        </h1>
        <span className="text-sm text-smoke">
          {count} saved {count === 1 ? 'item' : 'items'}
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-smoke">
        Wishlist items are saved on this device. Add them to your cart or order directly via
        WhatsApp when you are ready.
      </p>
      <div className="mt-8">
        <WishlistGrid skeletonCount={4} />
      </div>
    </div>
  );
}
