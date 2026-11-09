import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCatalog } from '../../context/CatalogContext';
import { useWishlist } from '../../context/WishlistContext';
import { cn, initials } from '../../lib/format';
import Logo from '../brand/Logo';
import SearchOverlay from './SearchOverlay';
import MobileMenu from './MobileMenu';

const NAV_ITEMS = [
  { label: 'Smartphones', to: '/shop?category=smartphones' },
  { label: 'Tablets', to: '/shop?category=tablets' },
  { label: 'Laptops', to: '/shop?category=laptops' },
  { label: 'Smartwatches', to: '/shop?category=smartwatches' },
  {
    label: 'Audio',
    to: '/shop?categories=earbuds,headphones,speakers',
    slugs: ['earbuds', 'headphones', 'speakers'],
  },
  {
    label: 'Accessories',
    to: '/shop?categories=chargers,power-banks,phone-accessories',
    slugs: ['chargers', 'power-banks', 'phone-accessories'],
  },
  {
    label: 'Gadgets',
    to: '/shop?categories=gaming-accessories,other-gadgets',
    slugs: ['gaming-accessories', 'other-gadgets'],
  },
  { label: 'Deals', to: '/deals' },
];

function IconButton({ label, children, badge, onClick, to }) {
  const content = (
    <>
      {children}
      {badge > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </>
  );

  const className =
    'relative grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-mist';

  if (to) {
    return (
      <Link to={to} aria-label={label} title={label} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={className}>
      {content}
    </button>
  );
}

function MegaMenu({ item }) {
  const { categories } = useCatalog();
  const items = categories.filter((c) => item.slugs.includes(c.slug));

  return (
    <div className="absolute left-1/2 top-full w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 pt-4 opacity-0 invisible transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
      <div className="overflow-hidden rounded-3xl border border-line bg-white p-5 shadow-lift">
        <div className="grid grid-cols-[1fr_200px] gap-5">
          <div>
            <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-smoke">
              {item.label}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {items.map((category) => (
                <Link
                  key={category._id}
                  to={`/shop?category=${category.slug}`}
                  className="rounded-xl px-2 py-2.5 text-sm font-medium text-ink transition hover:bg-mist"
                >
                  <span className="flex items-center justify-between gap-2">
                    {category.name}
                    {category.productCount > 0 && (
                      <span className="text-[10px] font-semibold text-smoke">
                        {category.productCount}
                      </span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              to={item.to}
              className="mt-2 inline-flex items-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold text-accent hover:underline"
            >
              Shop all {item.label.toLowerCase()} →
            </Link>
          </div>

          <Link
            to={item.to}
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-ink p-4 text-white"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent/60 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-accent/25 blur-2xl" />
            <div className="relative">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                Queen Terry picks
              </p>
              <p className="mt-3 font-display text-lg font-semibold leading-snug">
                Find your next upgrade
              </p>
            </div>
            <span className="relative mt-6 inline-flex items-center justify-center rounded-full bg-white px-3 py-2 text-[11px] font-semibold text-ink">
              Explore collection
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b border-transparent bg-white/95 backdrop-blur transition-shadow',
          scrolled && 'border-line shadow-[0_8px_30px_-24px_rgba(11,11,15,0.5)]'
        )}
      >
        <div className="shell flex h-16 items-center justify-between gap-4 xl:h-20">
          <div className="flex items-center gap-2 xl:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-mist"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <Logo className="shrink-0" />

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) =>
              item.slugs ? (
                <div key={item.label} className="group relative">
                  <Link
                    to={item.to}
                    className="inline-flex items-center whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium text-ink transition hover:bg-mist"
                  >
                    {item.label}
                  </Link>
                  <MegaMenu item={item} />
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className={cn(
                    'whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition hover:bg-mist',
                    item.label === 'Deals' ? 'text-accent' : 'text-ink'
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <IconButton label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="h-[18px] w-[18px]" />
            </IconButton>

            <div className="hidden sm:block">
              <IconButton
                label={user ? 'My account' : 'Sign in'}
                to={user ? '/account' : '/login'}
              >
                {user ? (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[10px] font-bold text-white">
                    {initials(user.name)}
                  </span>
                ) : (
                  <User className="h-[18px] w-[18px]" />
                )}
              </IconButton>
            </div>

            <div className="hidden sm:block">
              <IconButton label="Wishlist" to="/wishlist" badge={wishlistCount}>
                <Heart className="h-[18px] w-[18px]" />
              </IconButton>
            </div>

            <IconButton label="Cart" to="/cart" badge={count}>
              <ShoppingBag className="h-[18px] w-[18px]" />
            </IconButton>

            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="ml-1 hidden rounded-full bg-ink px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-coal xl:inline-flex"
            >
              Shop now
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSearch={() => setSearchOpen(true)}
      />
    </>
  );
}
