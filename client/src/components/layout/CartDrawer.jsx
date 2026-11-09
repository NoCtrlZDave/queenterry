import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MessageCircle, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatNaira } from '../../lib/format';
import ProductImage from '../product/ProductImage';
import QuantityStepper from '../ui/QuantityStepper';

export default function CartDrawer() {
  const {
    items,
    count,
    subtotal,
    updateQty,
    removeItem,
    drawerOpen,
    closeDrawer,
  } = useCart();
  const { settings } = useStore();

  useEffect(() => {
    if (!drawerOpen) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95]"
        >
          <div className="absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={closeDrawer} />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="h-dvh-safe absolute right-0 top-0 flex w-full max-w-md flex-col bg-white pr-[env(safe-area-inset-right)]"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <h2 className="font-display text-lg font-semibold">Your cart</h2>
                <p className="text-xs text-smoke">
                  {count} {count === 1 ? 'item' : 'items'} selected
                </p>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-full p-2 text-ink transition hover:bg-mist"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-8 py-8 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-mist text-accent">
                  <ShoppingBag className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">Your cart is empty</h3>
                <p className="mt-2 text-sm text-smoke">
                  Browse our latest smartphones, audio and accessories to get started.
                </p>
                <button type="button" onClick={closeDrawer} className="btn-primary mt-6">
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.color}`}
                        className="flex gap-3 rounded-2xl border border-line p-3"
                      >
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={closeDrawer}
                          className="h-24 w-20 shrink-0 overflow-hidden rounded-xl"
                        >
                          <ProductImage
                            product={{
                              name: item.name,
                              images: item.image ? [item.image] : [],
                              category: { slug: item.category },
                            }}
                            className="h-full w-full"
                          />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/product/${item.slug}`}
                              onClick={closeDrawer}
                              className="line-clamp-2 text-sm font-semibold leading-snug text-ink hover:text-accent"
                            >
                              {item.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId, item.color)}
                              className="shrink-0 rounded-full p-1.5 text-smoke transition hover:bg-mist hover:text-rose-600"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          {item.color && (
                            <p className="mt-0.5 text-[11px] text-smoke">{item.color}</p>
                          )}
                          <p className="mt-1 text-sm font-semibold text-ink">
                            {formatNaira(item.price)}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <QuantityStepper
                              value={item.quantity}
                              max={item.stock || 99}
                              onChange={(qty) => updateQty(item.productId, item.color, qty)}
                            />
                            <span className="text-sm font-semibold text-ink">
                              {formatNaira(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-line bg-cloud px-5 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-smoke">Subtotal</span>
                    <span className="font-display text-xl font-semibold text-ink">
                      {formatNaira(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-smoke">
                    {settings.delivery?.info ||
                      'Delivery and payment are confirmed with our team on WhatsApp.'}
                  </p>
                  <Link
                    to="/checkout"
                    onClick={closeDrawer}
                    className="btn-accent mt-4 w-full"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Proceed to WhatsApp
                  </Link>
                  <Link
                    to="/cart"
                    onClick={closeDrawer}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-smoke transition hover:text-ink"
                  >
                    View full cart
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
