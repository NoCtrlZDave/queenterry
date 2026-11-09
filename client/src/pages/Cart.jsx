import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatNaira } from '../lib/format';
import ProductImage from '../components/product/ProductImage';
import QuantityStepper from '../components/ui/QuantityStepper';
import OrderSummary from '../components/cart/OrderSummary';
import EmptyState from '../components/ui/EmptyState';

export default function Cart() {
  const { items, subtotal, updateQty, removeItem, clear } = useCart();
  const { settings } = useStore();

  if (!items.length) {
    return (
      <div className="shell py-14">
        <h1 className="mb-8 font-display text-3xl font-semibold tracking-[-0.04em]">Your cart</h1>
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Explore our latest smartphones, laptops, audio and accessories to build your order."
          actionLabel="Start shopping"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="shell py-8 sm:py-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker">Review your selection</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Your cart
          </h1>
        </div>
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-smoke transition hover:text-rose-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear cart
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
        <div className="divide-y divide-line rounded-3xl border border-line">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.color}`}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5"
            >
              <Link
                to={`/product/${item.slug}`}
                className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-28"
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
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-smoke">
                      {item.brand || 'Queen Terry'}
                    </p>
                    <Link
                      to={`/product/${item.slug}`}
                      className="mt-1 block font-display text-base font-semibold leading-snug text-ink transition hover:text-accent"
                    >
                      {item.name}
                    </Link>
                    {item.color && <p className="mt-1 text-xs text-smoke">{item.color}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.color)}
                    className="rounded-full p-2 text-smoke transition hover:bg-mist hover:text-rose-600"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <QuantityStepper
                    value={item.quantity}
                    max={item.stock || 99}
                    onChange={(qty) => updateQty(item.productId, item.color, qty)}
                  />
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink">
                      {formatNaira(item.price * item.quantity)}
                    </p>
                    <p className="text-[11px] text-smoke">{formatNaira(item.price)} each</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <OrderSummary items={items} subtotal={subtotal}>
            <Link to="/checkout" className="btn-accent mt-5 w-full">
              <MessageCircle className="h-4 w-4" />
              Proceed to WhatsApp
            </Link>
            <Link
              to="/shop"
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold text-smoke transition hover:text-ink"
            >
              Continue shopping
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <p className="mt-3 text-center text-[10px] leading-relaxed text-smoke">
              {settings.delivery?.info ||
                'Your order is not confirmed or paid for until our team replies on WhatsApp.'}
            </p>
          </OrderSummary>

          <div className="rounded-2xl border border-line bg-white p-4 text-[11px] leading-relaxed text-smoke">
            <p className="font-semibold text-ink">How it works</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>Review your cart and proceed to WhatsApp.</li>
              <li>Add your delivery details and send the prepared message.</li>
              <li>Our team confirms availability, delivery and payment with you.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
