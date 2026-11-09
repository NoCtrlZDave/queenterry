import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, Heart, MapPin, Package, PackageCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatDate, formatNaira, ORDER_STATUS_META } from '../../lib/format';
import { PageLoader } from '../../components/ui/Spinner';

export default function Overview() {
  const { user } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api('/orders/mine')
      .then((data) => {
        if (active) setOrders(data.items || []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <PageLoader label="Loading your account…" />;

  const pending = orders.filter((order) =>
    ['awaiting_whatsapp', 'confirmed', 'processing', 'shipped'].includes(order.status)
  ).length;
  const delivered = orders.filter((order) => order.status === 'delivered').length;
  const defaultAddress =
    user?.addresses?.find((address) => address.isDefault) || user?.addresses?.[0];

  const stats = [
    { label: 'Total inquiries', value: orders.length, icon: Package, to: '/account/orders' },
    { label: 'In progress', value: pending, icon: Clock3, to: '/account/orders' },
    { label: 'Delivered', value: delivered, icon: PackageCheck, to: '/account/orders' },
    { label: 'Wishlist', value: wishlistCount, icon: Heart, to: '/account/wishlist' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="rounded-2xl border border-line p-4 transition hover:border-ink/20 hover:shadow-card"
          >
            <Icon className="h-4 w-4 text-accent" />
            <p className="mt-3 font-display text-2xl font-semibold text-ink">{value}</p>
            <p className="text-[11px] text-smoke">{label}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-line">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-ink">Recent orders</h2>
          <Link to="/account/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Package className="mx-auto h-8 w-8 text-smoke/50" />
            <p className="mt-3 text-sm font-semibold text-ink">No orders yet</p>
            <p className="mt-1 text-xs text-smoke">
              Start an inquiry from any product page and it will appear here.
            </p>
            <Link to="/shop" className="btn-primary mt-5 text-xs">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {orders.slice(0, 4).map((order) => {
              const meta = ORDER_STATUS_META[order.status] || ORDER_STATUS_META.awaiting_whatsapp;
              return (
                <Link
                  key={order._id}
                  to={`/account/orders/${order.orderNumber}`}
                  className="flex flex-wrap items-center gap-3 px-5 py-4 transition hover:bg-cloud"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">{order.orderNumber}</p>
                    <p className="text-[11px] text-smoke">
                      {formatDate(order.createdAt)} · {order.items.length}{' '}
                      {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${meta.className}`}>
                    {meta.short}
                  </span>
                  <span className="text-sm font-semibold text-ink">{formatNaira(order.total)}</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-line p-5">
          <h2 className="font-display text-base font-semibold text-ink">Contact details</h2>
          <div className="mt-3 space-y-1 text-xs text-smoke">
            <p className="text-sm font-semibold text-ink">{user?.name}</p>
            <p>{user?.email}</p>
            <p>{user?.phone || 'No phone number saved yet'}</p>
          </div>
          <Link to="/account/profile" className="mt-4 inline-flex text-xs font-semibold text-accent hover:underline">
            Edit profile →
          </Link>
        </section>

        <section className="rounded-2xl border border-line p-5">
          <h2 className="font-display text-base font-semibold text-ink">Default address</h2>
          {defaultAddress ? (
            <p className="mt-3 text-xs leading-relaxed text-smoke">
              <span className="font-semibold text-ink">{defaultAddress.label}</span>
              <br />
              {defaultAddress.street}
              <br />
              {defaultAddress.city}, {defaultAddress.state}
              {defaultAddress.phone ? (
                <>
                  <br />
                  {defaultAddress.phone}
                </>
              ) : null}
            </p>
          ) : (
            <p className="mt-3 text-xs text-smoke">No delivery address saved yet.</p>
          )}
          <Link to="/account/addresses" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
            <MapPin className="h-3.5 w-3.5" /> Manage addresses →
          </Link>
        </section>
      </div>
    </div>
  );
}
