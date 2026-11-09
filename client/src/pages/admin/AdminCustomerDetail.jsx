import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';
import { api } from '../../lib/api';
import { formatDate, formatNaira, ORDER_STATUS_META } from '../../lib/format';
import { PageLoader } from '../../components/ui/Spinner';

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api(`/admin/customers/${id}`)
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
  }, [id]);

  if (loading) return <PageLoader label="Loading customer…" />;

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-line bg-white p-10 text-center">
        <p className="font-display text-lg font-semibold text-ink">Customer not found</p>
        <p className="mt-1 text-xs text-smoke">{error || 'This customer may have been removed.'}</p>
        <Link to="/admin/customers" className="btn-outline mt-5 text-xs">
          Back to customers
        </Link>
      </div>
    );
  }

  const { customer, orders } = data;
  const confirmed = orders.filter((order) =>
    ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)
  );
  const totalSpent = confirmed.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-5">
      <div>
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-smoke hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Customers
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
          {customer.name}
        </h1>
        <p className="mt-1 text-xs text-smoke">Joined {formatDate(customer.createdAt)}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 rounded-2xl border border-line bg-white p-5 text-xs text-smoke">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
            Contact
          </p>
          <p className="flex min-w-0 items-center gap-2 break-words">
            <Mail className="h-3.5 w-3.5 shrink-0 text-smoke" /> {customer.email}
          </p>
          <p className="flex min-w-0 items-center gap-2 break-words">
            <Phone className="h-3.5 w-3.5 shrink-0 text-smoke" /> {customer.phone || 'No phone saved'}
          </p>
          {customer.addresses?.[0] && (
            <p className="flex min-w-0 items-start gap-2 break-words pt-1">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-smoke" />
              {[customer.addresses[0].street, customer.addresses[0].city, customer.addresses[0].state]
                .filter(Boolean)
                .join(', ')}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">Orders</p>
          <p className="mt-2 font-display text-2xl font-semibold text-ink">{orders.length}</p>
          <p className="text-[11px] text-smoke">{confirmed.length} confirmed or later</p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
            Total spent
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-ink">
            {formatNaira(totalSpent)}
          </p>
          <p className="text-[11px] text-smoke">Excludes unconfirmed inquiries</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-line bg-white">
        <h2 className="border-b border-line px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink">
          Order history
        </h2>
        {orders.length === 0 ? (
          <p className="px-5 py-8 text-center text-xs text-smoke">No orders for this customer yet.</p>
        ) : (
          <div className="divide-y divide-line">
            {orders.map((order) => {
              const meta = ORDER_STATUS_META[order.status] || {};
              return (
                <Link
                  key={order._id}
                  to={`/admin/orders/${order._id}`}
                  className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition hover:bg-cloud"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-ink">{order.orderNumber}</p>
                    <p className="text-[10px] text-smoke">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold ${meta.className}`}>
                    {meta.short}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-ink">{formatNaira(order.total)}</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
