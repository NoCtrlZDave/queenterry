import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, MessageCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import { formatDateTime, formatNaira, ORDER_STATUS_META } from '../../lib/format';
import { PageLoader } from '../../components/ui/Spinner';
import ProductImage from '../../components/product/ProductImage';

const statuses = ['awaiting_whatsapp', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingStatus, setSavingStatus] = useState('');
  const [savingPayment, setSavingPayment] = useState(false);

  useEffect(() => {
    let active = true;
    api(`/admin/orders/${id}`)
      .then((response) => {
        if (active) setOrder(response.order);
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

  const changeStatus = async (status) => {
    setSavingStatus(status);
    try {
      const data = await api(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: { status },
      });
      setOrder((prev) => ({
        ...prev,
        status: data.order.status,
        statusHistory: data.order.statusHistory,
      }));
      toast('Order status updated');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSavingStatus('');
    }
  };

  const togglePayment = async () => {
    setSavingPayment(true);
    try {
      const next = order.paymentStatus === 'paid' ? 'unpaid' : 'paid';
      const data = await api(`/admin/orders/${id}/payment`, {
        method: 'PATCH',
        body: { paymentStatus: next },
      });
      setOrder((prev) => ({ ...prev, paymentStatus: data.order.paymentStatus }));
      toast(next === 'paid' ? 'Marked as paid' : 'Marked as unpaid');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSavingPayment(false);
    }
  };

  if (loading) return <PageLoader label="Loading order…" />;

  if (error || !order) {
    return (
      <div className="rounded-2xl border border-line bg-white p-10 text-center">
        <p className="font-display text-lg font-semibold text-ink">Order not found</p>
        <p className="mt-1 text-xs text-smoke">{error || 'This order may have been removed.'}</p>
        <Link to="/admin/orders" className="btn-outline mt-5 text-xs">
          Back to orders
        </Link>
      </div>
    );
  }

  const meta = ORDER_STATUS_META[order.status] || {};
  const customerChat = buildWhatsAppUrl(
    order.customer.phone,
    `Hello ${order.customer.name}, this is Queen Terry regarding your order ${order.orderNumber}.`
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-smoke hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Orders
          </Link>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-xs text-smoke">{formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold ${meta.className}`}>
            {meta.label}
          </span>
          <a href={customerChat} target="_blank" rel="noreferrer" className="btn-outline text-xs">
            <MessageCircle className="h-4 w-4 text-[#128C4A]" />
            Message customer
          </a>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <section className="overflow-hidden rounded-2xl border border-line bg-white">
            <h2 className="border-b border-line px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink">
              Items ({order.items.length})
            </h2>
            <div className="divide-y divide-line">
              {order.items.map((item, index) => (
                <div key={`${item.slug}-${index}`} className="flex items-center gap-3 px-5 py-3">
                  <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-mist">
                    <ProductImage
                      product={{ name: item.name, images: item.image ? [item.image] : [] }}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-xs font-semibold text-ink">{item.name}</p>
                    <p className="break-words text-[10px] text-smoke">
                      {item.brand ? `${item.brand} · ` : ''}
                      {item.color ? `${item.color} · ` : ''}Qty {item.quantity} ×{' '}
                      {formatNaira(item.price)}
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
                <span className="shrink-0 font-display font-semibold text-ink">
                  {formatNaira(order.total)}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
              Status history
            </h2>
            {order.statusHistory?.length ? (
              <ol className="mt-4 space-y-3">
                {[...order.statusHistory].reverse().map((entry, index) => (
                  <li key={index} className="flex items-start gap-3 text-xs">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <div>
                      <p className="font-semibold text-ink">
                        {ORDER_STATUS_META[entry.status]?.label || entry.status}
                      </p>
                      <p className="text-[10px] text-smoke">{formatDateTime(entry.at)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-xs text-smoke">No status updates yet.</p>
            )}
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
              Update status
            </h2>
            <div className="mt-3 space-y-1.5">
              {statuses.map((status) => {
                const itemMeta = ORDER_STATUS_META[status] || {};
                const active = order.status === status;
                return (
                  <button
                    key={status}
                    type="button"
                    disabled={active || Boolean(savingStatus)}
                    onClick={() => changeStatus(status)}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition ${
                      active
                        ? 'border-ink bg-ink text-white'
                        : 'border-line text-ink hover:border-ink/30 hover:bg-cloud'
                    } disabled:cursor-default`}
                  >
                    <span className="break-words">{itemMeta.short || status}</span>
                    {savingStatus === status && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">Payment</h2>
            <p className="mt-3 text-xs text-smoke">
              Current status:{' '}
              <span className="font-semibold text-ink">
                {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
              </span>
            </p>
            <button
              type="button"
              onClick={togglePayment}
              disabled={savingPayment}
              className={`mt-3 w-full rounded-xl border py-2.5 text-xs font-semibold transition ${
                order.paymentStatus === 'paid'
                  ? 'border-line text-ink hover:bg-mist'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {savingPayment
                ? 'Updating…'
                : order.paymentStatus === 'paid'
                  ? 'Mark as unpaid'
                  : 'Mark as paid'}
            </button>
            <p className="mt-2 text-[10px] leading-relaxed text-smoke">
              Only mark as paid after you have confirmed payment directly. This does not process any
              payment online.
            </p>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">Customer</h2>
            <div className="mt-3 space-y-1 break-words text-xs leading-relaxed text-smoke">
              <p className="text-sm font-semibold text-ink">{order.customer.name}</p>
              <p>{order.customer.phone}</p>
              {order.customer.email && <p>{order.customer.email}</p>}
              <p className="pt-1">
                {[order.customer.address, order.customer.city, order.customer.state]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              {order.customer.notes && (
                <p className="border-t border-line pt-2 italic">“{order.customer.notes}”</p>
              )}
            </div>
            {order.user && (
              <Link
                to={`/admin/customers/${order.user._id || order.user}`}
                className="mt-3 inline-flex text-[11px] font-semibold text-accent hover:underline"
              >
                View customer profile →
              </Link>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
