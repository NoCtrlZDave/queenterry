import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertCircle,
  Check,
  Clipboard,
  Loader2,
  MessageCircle,
  PackageSearch,
  ShoppingBag,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDate, formatNaira, ORDER_STATUS_META } from '../lib/format';
import EmptyState from '../components/ui/EmptyState';

function readStored(orderNumber) {
  try {
    const data = JSON.parse(sessionStorage.getItem('qt_last_order') || 'null');
    if (data?.order?.orderNumber === orderNumber) return data;
    return null;
  } catch {
    return null;
  }
}

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const initial = readStored(orderNumber);
  const [record, setRecord] = useState(initial);
  const [auto, setAuto] = useState(Boolean(initial?.whatsappUrl));
  const [seconds, setSeconds] = useState(4);
  const [phone, setPhone] = useState('');
  const [looking, setLooking] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (record || !user) return;
    let active = true;
    api(`/orders/${orderNumber}`)
      .then((data) => {
        if (active) setRecord(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [record, user, orderNumber]);

  useEffect(() => {
    if (!record?.whatsappUrl || !auto) return undefined;
    if (seconds <= 0) {
      window.location.assign(record.whatsappUrl);
      return undefined;
    }
    timer.current = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer.current);
  }, [record, auto, seconds]);

  const lookup = async (event) => {
    event.preventDefault();
    if (!phone.trim()) return;
    setLooking(true);
    setError('');
    try {
      const data = await api(`/orders/${orderNumber}?phone=${encodeURIComponent(phone)}`);
      setRecord(data);
    } catch (err) {
      if (err.status === 404) setNotFound(true);
      else setError(err.message);
    } finally {
      setLooking(false);
    }
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(record.message);
      toast('Order message copied to clipboard');
    } catch {
      toast('Could not copy automatically. Select the message and copy it.', 'error');
    }
  };

  if (notFound) {
    return (
      <div className="shell py-14">
        <EmptyState
          title="Order not found"
          description="We could not find an order with that reference. Check the reference number or contact us on WhatsApp for help."
          actionLabel="Continue shopping"
          actionTo="/shop"
        />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="shell py-12">
        <div className="mx-auto max-w-md">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent-50 text-accent">
            <PackageSearch className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold text-ink">Track your order</h1>
          <p className="mt-2 text-sm leading-relaxed text-smoke">
            Enter the phone number used for order <span className="font-semibold">{orderNumber}</span> to
            view its status and order message.
          </p>
          <form onSubmit={lookup} className="mt-5 space-y-3">
            <div>
              <label htmlFor="track-phone" className="label">
                Phone number
              </label>
              <input
                id="track-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="e.g. 0801 234 5678"
                className="input"
                inputMode="tel"
              />
            </div>
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-rose-600">
                <AlertCircle className="h-3.5 w-3.5" /> {error}
              </p>
            )}
            <button type="submit" disabled={looking} className="btn-primary w-full">
              {looking ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              View order
            </button>
            {!user && (
              <p className="text-center text-[11px] text-smoke">
                Or{' '}
                <Link to={`/login?redirect=/order/${orderNumber}`} className="font-semibold text-accent hover:underline">
                  sign in
                </Link>{' '}
                to see this order in your account.
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  const { order } = record;
  const meta = ORDER_STATUS_META[order.status] || ORDER_STATUS_META.awaiting_whatsapp;

  return (
    <div className="shell py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-start gap-4 rounded-3xl border border-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Check className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-smoke">
                Order inquiry created
              </p>
              <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
                {order.orderNumber}
              </h1>
              <p className="mt-1 text-xs text-smoke">{formatDate(order.createdAt, { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <span className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold ${meta.className}`}>
            {meta.label}
          </span>
        </div>

        {auto && record.whatsappUrl && (
          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#25D366]/40 bg-[#25D366]/[0.08] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-ink">
              <MessageCircle className="h-4 w-4 text-[#128C4A]" />
              <span>
                Opening WhatsApp in <strong>{seconds}</strong> second{seconds === 1 ? '' : 's'} to
                send your order…
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAuto(false)}
              className="self-start rounded-full border border-ink/15 bg-white px-3 py-1.5 text-[11px] font-semibold text-ink hover:border-ink/30"
            >
              Stay on this page
            </button>
          </div>
        )}

        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
          Opening WhatsApp does not mean your order is confirmed or paid for. Our team will reply to
          confirm stock, delivery cost and payment details. Keep your order reference: {' '}
          <strong>{order.orderNumber}</strong>.
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-line p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
              Customer
            </h2>
            <div className="mt-3 space-y-1.5 break-words text-xs text-smoke">
              <p className="text-sm font-semibold text-ink">{order.customer.name}</p>
              <p>{order.customer.phone}</p>
              {order.customer.email && <p>{order.customer.email}</p>}
              <p className="pt-1">
                {[order.customer.address, order.customer.city, order.customer.state]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              {order.customer.notes && (
                <p className="pt-1 italic">“{order.customer.notes}”</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-line p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
              Order totals
            </h2>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-smoke">Subtotal</span>
                <span className="shrink-0 font-semibold text-ink">{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-smoke">Delivery</span>
                <span className="min-w-0 break-words text-right font-semibold text-ink">
                  {order.deliveryFee ? formatNaira(order.deliveryFee) : 'Confirmed on WhatsApp'}
                </span>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-sm">
                <span className="font-semibold text-ink">Total</span>
                <span className="shrink-0 font-display font-semibold text-ink">
                  {formatNaira(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-line">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
              Items ({order.items.length})
            </h2>
          </div>
          <div className="divide-y divide-line">
            {order.items.map((item, index) => (
              <div key={`${item.slug}-${index}`} className="flex items-center gap-4 px-5 py-3 text-xs">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mist text-[10px] font-bold text-ink">
                  {item.quantity}×
                </span>
                <div className="min-w-0 flex-1">
                  <p className="break-words font-semibold text-ink">{item.name}</p>
                  {item.color && <p className="text-[10px] text-smoke">{item.color}</p>}
                </div>
                <span className="shrink-0 font-semibold text-ink">
                  {formatNaira(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {record.whatsappUrl && (
          <div className="mt-6">
            <a
              href={record.whatsappUrl}
              className="btn-accent w-full py-4"
              onClick={() => setAuto(false)}
            >
              <MessageCircle className="h-5 w-5" />
              Open WhatsApp to send order
            </a>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={copyMessage} className="btn-outline flex-1 py-2.5 text-xs">
                <Clipboard className="h-4 w-4" />
                Copy order message
              </button>
              <Link to="/shop" className="btn-outline flex-1 py-2.5 text-xs">
                <ShoppingBag className="h-4 w-4" />
                Continue shopping
              </Link>
            </div>
          </div>
        )}

        {record.message && (
          <details className="mt-5 rounded-2xl border border-line bg-cloud p-4 text-xs">
            <summary className="cursor-pointer font-semibold text-ink">
              Preview the WhatsApp message
            </summary>
            <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap font-sans leading-relaxed text-smoke">
              {record.message}
            </pre>
          </details>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-smoke">
          <Link to="/account/orders" className="font-semibold text-accent hover:underline">
            View my orders
          </Link>
          <Link to="/contact" className="hover:text-ink">
            Need help? Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
