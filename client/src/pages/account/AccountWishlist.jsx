import { WishlistGrid } from '../Wishlist';

export default function AccountWishlist() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink">My wishlist</h2>
        <p className="mt-1 text-xs text-smoke">
          Saved items live on this device. Add them to cart when you are ready.
        </p>
      </div>
      <WishlistGrid skeletonCount={4} />
    </div>
  );
}
