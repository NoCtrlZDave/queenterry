import { useStore } from '../../context/StoreContext';
import { formatNaira } from '../../lib/format';
import ProductImage from '../product/ProductImage';

export default function OrderSummary({ items = [], subtotal = 0, title = 'Order summary', children }) {
  const { settings } = useStore();
  const fee = Number(settings.delivery?.fee) || 0;
  const threshold = Number(settings.delivery?.freeThreshold) || 0;
  const deliveryFee = fee > 0 ? (threshold > 0 && subtotal >= threshold ? 0 : fee) : null;
  const total = subtotal + (deliveryFee || 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="rounded-3xl border border-line bg-cloud p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        <span className="text-xs text-smoke">
          {count} {count === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={`${item.productId}-${item.color}`} className="flex gap-3">
            <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl">
              <ProductImage
                product={{
                  name: item.name,
                  images: item.image ? [item.image] : [],
                  category: { slug: item.category },
                }}
                className="h-full w-full"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-xs font-semibold leading-snug text-ink">{item.name}</p>
              <p className="mt-0.5 text-[10px] text-smoke">
                {item.color ? `${item.color} · ` : ''}Qty {item.quantity}
              </p>
            </div>
            <span className="shrink-0 text-xs font-semibold text-ink">
              {formatNaira(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2.5 border-t border-line pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-smoke">Subtotal</span>
          <span className="font-semibold text-ink">{formatNaira(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-smoke">Delivery</span>
          {deliveryFee === null ? (
            <span className="text-right text-[11px] font-medium text-smoke">
              Confirmed on WhatsApp
            </span>
          ) : deliveryFee === 0 ? (
            <span className="font-semibold text-emerald-600">Free</span>
          ) : (
            <span className="font-semibold text-ink">{formatNaira(deliveryFee)}</span>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-line pt-3">
          <span className="font-semibold text-ink">
            {deliveryFee === null ? 'Subtotal due' : 'Total'}
          </span>
          <span className="font-display text-xl font-semibold text-ink">
            {formatNaira(deliveryFee === null ? subtotal : total)}
          </span>
        </div>
      </div>

      {children}
    </div>
  );
}
