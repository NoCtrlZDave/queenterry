import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, LayoutGrid, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { cn } from '../../lib/format';

export default function MobileBottomBar() {
  const { pathname, search } = useLocation();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();

  const items = [
    { label: 'Home', to: '/', icon: Home, active: pathname === '/' },
    {
      label: 'Shop',
      to: '/shop',
      icon: LayoutGrid,
      active: pathname === '/shop' || pathname.startsWith('/product/'),
    },
    {
      label: 'Saved',
      to: '/wishlist',
      icon: Heart,
      active: pathname === '/wishlist',
      badge: wishlistCount,
    },
    {
      label: 'Cart',
      to: '/cart',
      icon: ShoppingBag,
      active: pathname === '/cart' || pathname === '/checkout',
      badge: count,
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur xl:hidden"
      aria-label="Mobile quick navigation"
    >
      <div className="grid grid-cols-4">
        {items.map(({ label, to, icon: Icon, active, badge }) => (
          <Link
            key={label}
            to={to}
            className={cn(
              'relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition',
              active ? 'text-accent' : 'text-smoke'
            )}
          >
            <span className="relative">
              <Icon className="h-[18px] w-[18px]" />
              {badge > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[8px] font-bold text-white">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </span>
            {label}
          </Link>
        ))}
      </div>
      {search && <span className="sr-only">Filtered view</span>}
    </nav>
  );
}
