import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { formatDateTime, formatNaira, ORDER_STATUS_META } from '../../lib/format';
import { PageLoader } from '../../components/ui/Spinner';
import ProductImage from '../../components/product/ProductImage';

const steps = ['awaiting_whatsapp', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function AccountOrderDetail() {
  const { orderNumber } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api(`/orders/${orderNumber}`)
      .then((response) => {
        if (active) setData(response);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [orderNumber]);

  if (loading) return <PageLoader label="Loading order…" />;

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-line p-8 text-center">
        <p className="font-display text-lg font-semibold text-ink">Order not available</p>
        <p className="mt-2 text-sm text-smoke">{error || 'We could not load this order.'}</p>
        <Link to="/account/orders" className="btn-outline mt-5 text-xs">
          Back to orders
        </Link>
      </div>
    );
  }

  const { order, whatsappUrl } = data;
  const meta = ORDER_STATUS_META[order.status] || ORDER_STATUS_META.awaiting_whatsapp;
  const stepIndex = steps.indexOf(order.status);

  return (
    <div className="space-y-5">
      <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-smoke hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
      </Link>

      <div className="rounded-2xl border border-line p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-smoke">Order</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
              {order.orderNumber}
            </h2>
            <p className="mt-1 text-[11px] text-smoke">{formatDateTime(order.createdAt)}</p>
          </div>
          <span className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold ${meta.className}`}>
            {meta.label}
          </span>
        </div>

        {order.status !== 'cancelled' && (
          <div className="mt-6 grid grid-cols-5 gap-1">
            {steps.map((step, index) => (
              <div key={step} className="text-center">
                <div
                  className={`mx-auto h-1.5 w-full rounded-full ${
                    index <= stepIndex ? 'bg-accent' : 'bg-mist'
                  }`}
                />
                <p
                  className={`mt-2 break-words px-0.5 text-[8px] font-semibold uppercase leading-tight tracking-wide sm:text-[9px] ${
                    index <= stepIndex ? 'text-ink' : 'text-smoke/60'
                  }`}
                >
                  {ORDER_STATUS_META[step]?.short || step}
                </p>
              </div>
            ))}
          </div>
        )}

        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-accent mt-5 w-full py-3 text-xs">
            <MessageCircle className="h-4 w-4" />
            Continue on WhatsApp
          </a>
        )}
      </div>

      <div className="rounded-2xl border border-line">
        <h3 className="border-b border-line px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink">
          Items
        </h3>
        <div className="divide-y divide-line">
          {order.items.map((item, index) => (
            <div key={`${item.slug}-${index}`} className="flex items-center gap-4 px-5 py-3">
              <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg">
                <ProductImage
                  product={{ name: item.name, images: item.image ? [item.image] : [] }}
                  className="h-full w-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="break-words text-xs font-semibold text-ink">{item.name}</p>
                <p className="break-words text-[10px] text-smoke">
                  {item.color ? `${item.color} · ` : ''}Qty {item.quantity} × {formatNaira(item.price)}
                </p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-ink">
                {formatNaira(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-line px-5 py-4 text-xs">
          <div className="flex justify-between">
            <span className="text-smoke">Subtotal</span>
            <span className="shrink-0 font-semibold text-ink">{formatNaira(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-smoke">Delivery</span>
            <span className="shrink-0 font-semibold text-ink">
              {order.deliveryFee ? formatNaira(order.deliveryFee) : 'Free'}
            </span>
          </div>
          <div className="flex justify-between border-t border-line pt-2 text-sm">
            <span className="font-semibold text-ink">Total</span>
            <span className="shrink-0 font-display font-semibold text-ink">{formatNaira(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line p-5">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
            Delivery details
          </h3>
          <p className="mt-3 break-words text-xs leading-relaxed text-smoke">
            <span className="font-semibold text-ink">{order.customer.name}</span>
            <br />
            {order.customer.phone}
            {order.customer.email ? (
              <>
                <br />
                {order.customer.email}
              </>
            ) : null}
            <br />
            {[order.customer.address, order.customer.city, order.customer.state]
              .filter(Boolean)
              .join(', ')}
          </p>
          {order.customer.notes && (
            <p className="mt-2 border-t border-line pt-2 text-[11px] italic text-smoke">
              “{order.customer.notes}”
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-line p-5">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">Payment</h3>
          <p className="mt-3 break-words text-xs leading-relaxed text-smoke">
            Payment status:{' '}
            <span className="font-semibold text-ink">
              {order.paymentStatus === 'paid' ? 'Paid' : 'Not confirmed'}
            </span>
            <br />
            Payment is arranged directly with Queen Terry after confirmation on WhatsApp. We never
            ask for payment through this website.
          </p>
        </div>
      </div>
    </div>
  );
}
