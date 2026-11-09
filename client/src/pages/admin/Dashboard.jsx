import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Banknote,
  Clock3,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import { api } from '../../lib/api';
import { formatDate, formatNaira, ORDER_STATUS_META } from '../../lib/format';
import { PageLoader } from '../../components/ui/Spinner';
import ProductImage from '../../components/product/ProductImage';

function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-smoke">
          {label}
        </span>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-50 text-accent">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-ink">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-smoke">{hint}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api('/admin/analytics')
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
  }, []);

  if (loading) return <PageLoader label="Loading dashboard…" />;
  if (error || !data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error || 'Could not load dashboard data.'}
      </div>
    );
  }

  const { totals, monthly, statusBreakdown, recentOrders, topProducts, lowStock } = data;
  const maxRevenue = Math.max(...monthly.map((month) => month.revenue), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            Overview
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Store dashboard
          </h1>
        </div>
        <Link to="/admin/products/new" className="btn-primary text-xs">
          <Package className="h-4 w-4" />
          Add product
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Total orders"
          value={totals.orders}
          hint={`${totals.pendingOrders} awaiting WhatsApp`}
          icon={ShoppingCart}
        />
        <StatCard
          label="Confirmed revenue"
          value={formatNaira(totals.revenue)}
          hint={`${totals.confirmedOrders} confirmed or later`}
          icon={Banknote}
        />
        <StatCard label="Customers" value={totals.customers} hint="Registered accounts" icon={Users} />
        <StatCard
          label="Pending inquiries"
          value={totals.pendingOrders}
          hint="Need WhatsApp follow-up"
          icon={Clock3}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Revenue & orders</h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" /> Last 6 months
            </span>
          </div>
          <div className="mt-6 flex h-52 items-end gap-3 sm:gap-5">
            {monthly.map((month) => {
              const height = Math.max(4, Math.round((month.revenue / maxRevenue) * 100));
              return (
                <div key={month.month} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[9px] font-semibold text-smoke">
                    {month.revenue ? formatNaira(month.revenue) : '—'}
                  </span>
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-accent-800 to-accent-400 transition-all"
                      style={{ height: `${height}%` }}
                      title={`${formatNaira(month.revenue)} · ${month.orders} orders`}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-smoke">{month.month}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-display text-lg font-semibold text-ink">Order statuses</h2>
          <div className="mt-4 space-y-2.5">
            {statusBreakdown.map((row) => {
              const meta = ORDER_STATUS_META[row.status] || {};
              const total = statusBreakdown.reduce((sum, item) => sum + item.count, 0) || 1;
              return (
                <div key={row.status} className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-ink">{meta.short || row.status}</span>
                    <span className="text-smoke">{row.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-mist">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${Math.round((row.count / total) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-ink">Recent orders</h2>
            <Link to="/admin/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
              All orders <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="px-5 py-8 text-center text-xs text-smoke">No orders yet.</p>
          ) : (
            <div className="divide-y divide-line">
              {recentOrders.map((order) => {
                const meta = ORDER_STATUS_META[order.status] || {};
                return (
                  <Link
                    key={order._id}
                    to={`/admin/orders/${order._id}`}
                    className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition hover:bg-cloud"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-ink">{order.orderNumber}</p>
                      <p className="text-[10px] text-smoke">
                        {order.customer?.name} · {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold ${meta.className}`}>
                      {meta.short}
                    </span>
                    <span className="text-xs font-semibold text-ink">{formatNaira(order.total)}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-lg font-semibold text-ink">Low stock</h2>
            {lowStock.length === 0 ? (
              <p className="mt-3 text-xs text-smoke">All products are well stocked.</p>
            ) : (
              <div className="mt-3 space-y-2.5">
                {lowStock.map((product) => (
                  <Link
                    key={product._id}
                    to={`/admin/products/${product._id}`}
                    className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-cloud"
                  >
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-mist">
                      <ProductImage product={product} className="h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-ink">{product.name}</p>
                      <p className="text-[10px] text-smoke">{product.brand?.name}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold ${
                        product.stock === 0 ? 'text-rose-600' : 'text-amber-600'
                      }`}
                    >
                      {product.stock} left
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-lg font-semibold text-ink">Top products</h2>
            {topProducts.length === 0 ? (
              <p className="mt-3 text-xs text-smoke">No sales data yet.</p>
            ) : (
              <div className="mt-3 space-y-2.5">
                {topProducts.map((product) => (
                  <div key={product._id} className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-mist">
                      <ProductImage product={product} className="h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-ink">{product.name}</p>
                      <p className="text-[10px] text-smoke">{formatNaira(product.price)}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-smoke">
                      {product.salesCount || 0} sold
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
