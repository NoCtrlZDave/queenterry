import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { api } from '../../lib/api';
import { formatDate, formatNaira, ORDER_STATUS_META } from '../../lib/format';
import EmptyState from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Spinner';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api('/orders/mine')
      .then((data) => {
        if (active) setOrders(data.items || []);
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
  }, []);

  if (loading) return <PageLoader label="Loading orders…" />;

  if (!orders.length) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description={
          error ||
          'When you start an order inquiry, it will appear here with its WhatsApp status.'
        }
        actionLabel="Browse products"
        actionTo="/shop"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-xl font-semibold text-ink">My orders</h2>
        <span className="text-xs text-smoke">{orders.length} total</span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const meta = ORDER_STATUS_META[order.status] || ORDER_STATUS_META.awaiting_whatsapp;
          const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
          return (
            <Link
              key={order._id}
              to={`/account/orders/${order.orderNumber}`}
              className="block rounded-2xl border border-line p-5 transition hover:border-ink/20 hover:shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-semibold text-ink">
                    {order.orderNumber}
                  </p>
                  <p className="mt-1 text-[11px] text-smoke">
                    Placed {formatDate(order.createdAt)} · {itemCount}{' '}
                    {itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${meta.className}`}>
                  {meta.label}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs">
                <span className="min-w-0 break-words text-smoke">
                  {order.items.map((item) => item.name).join(', ')}
                </span>
                <span className="shrink-0 font-semibold text-ink">{formatNaira(order.total)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
