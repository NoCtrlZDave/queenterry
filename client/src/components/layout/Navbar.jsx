import { Fragment, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCatalog } from '../../context/CatalogContext';
import { useWishlist } from '../../context/WishlistContext';
import { cn, initials } from '../../lib/format';
import Logo from '../brand/Logo';
import SearchOverlay from './SearchOverlay';
import MobileMenu from './MobileMenu';

const NAV_ITEMS = [
  {
    label: 'Smartphones',
    to: '/shop?category=smartphones',
    align: 'left',
    lgSection: 'primary',
  },
  { label: 'Tablets', to: '/shop?category=tablets', align: 'left', lgSection: 'primary' },
  { label: 'Laptops', to: '/shop?category=laptops', align: 'center', lgSection: 'primary' },
  {
    label: 'Smartwatches',
    to: '/shop?category=smartwatches',
    align: 'center',
    lgSection: 'more',
  },
  {
    label: 'Audio',
    to: '/shop?categories=earbuds,headphones,speakers',
    slugs: ['earbuds', 'headphones', 'speakers'],
    align: 'center',
    lgSection: 'primary',
  },
  {
    label: 'Accessories',
    to: '/shop?categories=chargers,power-banks,phone-accessories',
    slugs: ['chargers', 'power-banks', 'phone-accessories'],
    align: 'center',
    lgSection: 'more',
  },
  {
    label: 'Gadgets',
    to: '/shop?categories=gaming-accessories,other-gadgets',
    slugs: ['gaming-accessories', 'other-gadgets'],
    align: 'right',
    lgSection: 'more',
  },
  { label: 'Deals', to: '/deals', lgSection: 'trailing' },
];

const LG_PRIMARY = NAV_ITEMS.filter((item) => item.lgSection === 'primary');
const LG_MORE = NAV_ITEMS.filter((item) => item.lgSection === 'more');
const LG_TRAILING = NAV_ITEMS.filter((item) => item.lgSection === 'trailing');

const navLinkClass =
  'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-2 text-xs font-medium text-ink transition hover:bg-mist xl:text-[13px]';

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
    'relative grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-mist sm:h-10 sm:w-10';

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
  const alignClass =
    item.align === 'right'
      ? 'right-0'
      : item.align === 'left'
        ? 'left-0'
        : 'left-1/2 -translate-x-1/2';

  return (
    <div
      className={cn(
        'invisible absolute top-full w-[min(560px,calc(100vw-2rem))] pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100',
        alignClass
      )}
    >
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

function NavEntry({ item }) {
  if (item.slugs) {
    return (
      <div className="group relative">
        <Link to={item.to} className={navLinkClass}>
          {item.label}
        </Link>
        <MegaMenu item={item} />
      </div>
    );
  }

  return (
    <Link
      to={item.to}
      className={cn(navLinkClass, item.label === 'Deals' && 'text-accent')}
    >
      {item.label}
    </Link>
  );
}

function MoreMenu() {
  return (
    <div className="group relative">
      <button
        type="button"
        aria-haspopup="true"
        className={cn(navLinkClass, 'gap-1')}
      >
        More
        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
      </button>
      <div className="invisible absolute right-0 top-full w-56 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-lift">
          {LG_MORE.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-mist"
            >
              {item.label}
              <ArrowUpRight className="h-3.5 w-3.5 text-smoke" />
            </Link>
          ))}
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
        <div className="shell flex h-16 items-center justify-between gap-2 sm:gap-3 lg:h-20">
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="-ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink transition hover:bg-mist sm:h-10 sm:w-10 lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Logo compactOnMobile />
          </div>

          <nav className="hidden items-center gap-0.5 lg:flex xl:hidden" aria-label="Primary">
            {LG_PRIMARY.map((item) => (
              <NavEntry key={item.label} item={item} />
            ))}
            <MoreMenu />
            {LG_TRAILING.map((item) => (
              <NavEntry key={item.label} item={item} />
            ))}
          </nav>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <Fragment key={item.label}>
                <NavEntry item={item} />
              </Fragment>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
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
              className="ml-1 hidden rounded-full bg-ink px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-coal lg:inline-flex"
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
