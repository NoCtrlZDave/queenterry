import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { api } from '../../lib/api';
import useDebounce from '../../hooks/useDebounce';
import { formatDate, formatNaira, ORDER_STATUS_META } from '../../lib/format';
import { PageLoader } from '../../components/ui/Spinner';

const statuses = [
  { value: '', label: 'All' },
  { value: 'awaiting_whatsapp', label: 'Awaiting' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrders() {
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState(params.get('status') || '');
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 350);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setPage(1);
  }, [debounced, status]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api(
      `/admin/orders?status=${status}&search=${encodeURIComponent(debounced)}&page=${page}&limit=20`
    )
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
  }, [status, debounced, page]);

  const changeStatus = (value) => {
    setStatus(value);
    if (value) setParams({ status: value });
    else setParams({});
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Sales</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">Orders</h1>
        <p className="mt-1 text-xs text-smoke">
          {data.total} order{data.total === 1 ? '' : 's'} · orders are confirmed on WhatsApp
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-white p-4">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-smoke" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order number, name, phone or email"
              className="input pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => changeStatus(item.value)}
                className={`chip ${status === item.value ? 'chip-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <PageLoader label="Loading orders…" />
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {error}
        </div>
      ) : data.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center">
          <p className="font-display text-lg font-semibold text-ink">No orders found</p>
          <p className="mt-1 text-xs text-smoke">
            New WhatsApp inquiries will appear here as soon as they are created.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="scroll-x-touch overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead>
                <tr className="border-b border-line bg-cloud text-[10px] uppercase tracking-[0.12em] text-smoke">
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Items</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.items.map((order) => {
                  const meta = ORDER_STATUS_META[order.status] || {};
                  return (
                    <tr key={order._id} className="transition hover:bg-cloud">
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="font-semibold text-ink hover:text-accent hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{order.customer?.name}</p>
                        <p className="text-[10px] text-smoke">{order.customer?.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-smoke">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 text-smoke">
                        {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                      </td>
                      <td className="px-4 py-3 font-semibold text-ink">
                        {formatNaira(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold ${meta.className}`}>
                          {meta.short}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-semibold ${
                            order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-smoke'
                          }`}
                        >
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {data.pages > 1 && (
            <div className="flex items-center justify-between border-t border-line px-4 py-3 text-xs">
              <span className="text-smoke">
                Page {data.page} of {data.pages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="btn-outline px-3 py-1.5 text-[11px]"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= data.pages}
                  onClick={() => setPage((value) => value + 1)}
                  className="btn-outline px-3 py-1.5 text-[11px]"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
