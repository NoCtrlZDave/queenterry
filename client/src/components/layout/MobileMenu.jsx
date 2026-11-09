import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronRight,
  Heart,
  Home,
  LayoutGrid,
  MessageCircle,
  Search,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCatalog } from '../../context/CatalogContext';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import Logo from '../brand/Logo';

const groups = [
  'Phones & Tablets',
  'Computers',
  'Audio',
  'Wearables',
  'Accessories',
  'Gaming',
  'Gadgets',
];

export default function MobileMenu({ open, onClose, onSearch }) {
  const { categories } = useCatalog();
  const { user } = useAuth();
  const { whatsappNumber } = useStore();

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const linkClass =
    'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-mist';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] lg:hidden"
        >
          <div className="absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative flex h-full w-[88%] max-w-sm flex-col bg-white"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <Logo compact />
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-ink hover:bg-mist"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSearch();
                }}
                className="mb-5 flex w-full items-center gap-3 rounded-full bg-mist px-4 py-3 text-sm text-smoke"
              >
                <Search className="h-4 w-4" />
                Search products
              </button>

              <div className="grid grid-cols-2 gap-2">
                <Link to="/shop" onClick={onClose} className="rounded-xl bg-cloud p-3 text-sm font-semibold">
                  <LayoutGrid className="mb-2 h-4 w-4 text-accent" />
                  Shop all
                </Link>
                <Link to="/deals" onClick={onClose} className="rounded-xl bg-cloud p-3 text-sm font-semibold">
                  <ShieldCheck className="mb-2 h-4 w-4 text-accent" />
                  Deals
                </Link>
              </div>

              <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-smoke">
                Categories
              </p>
              {groups.map((group) => {
                const items = categories.filter((c) => c.group === group);
                if (!items.length) return null;
                return (
                  <div key={group} className="mb-4">
                    <p className="px-3 text-xs font-semibold text-ink">{group}</p>
                    <div className="mt-1">
                      {items.map((category) => (
                        <Link
                          key={category._id}
                          to={`/shop?category=${category.slug}`}
                          onClick={onClose}
                          className={linkClass}
                        >
                          {category.name}
                          <ChevronRight className="h-3.5 w-3.5 text-smoke" />
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}

              <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-smoke">
                Account
              </p>
              <Link to={user ? '/account' : '/login'} onClick={onClose} className={linkClass}>
                <span className="flex items-center gap-2.5">
                  <User className="h-4 w-4" /> {user ? 'My account' : 'Sign in'}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-smoke" />
              </Link>
              <Link to="/wishlist" onClick={onClose} className={linkClass}>
                <span className="flex items-center gap-2.5">
                  <Heart className="h-4 w-4" /> Wishlist
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-smoke" />
              </Link>
              <Link to="/" onClick={onClose} className={linkClass}>
                <span className="flex items-center gap-2.5">
                  <Home className="h-4 w-4" /> Home
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-smoke" />
              </Link>

              <div className="mt-6 space-y-1 border-t border-line pt-4">
                <Link to="/contact" onClick={onClose} className={linkClass}>
                  Contact us <ChevronRight className="h-3.5 w-3.5 text-smoke" />
                </Link>
                <Link to="/delivery" onClick={onClose} className={linkClass}>
                  Delivery <ChevronRight className="h-3.5 w-3.5 text-smoke" />
                </Link>
                <Link to="/returns" onClick={onClose} className={linkClass}>
                  Returns <ChevronRight className="h-3.5 w-3.5 text-smoke" />
                </Link>
              </div>
            </div>

            <div className="border-t border-line p-4">
              <a
                href={buildWhatsAppUrl(
                  whatsappNumber,
                  'Hello Queen Terry! I would like help with an order.'
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-accent w-full"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
