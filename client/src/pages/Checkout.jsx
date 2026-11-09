import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Lock, MessageCircle, ShoppingBag } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { NIGERIAN_STATES } from '../lib/nigeria';
import OrderSummary from '../components/cart/OrderSummary';
import EmptyState from '../components/ui/EmptyState';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  notes: '',
};

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const defaultAddress =
      user.addresses?.find((address) => address.isDefault) || user.addresses?.[0];
    setForm((prev) => ({
      ...prev,
      name: prev.name || user.name || '',
      phone: prev.phone || user.phone || defaultAddress?.phone || '',
      email: prev.email || user.email || '',
      address: prev.address || defaultAddress?.street || '',
      city: prev.city || defaultAddress?.city || '',
      state: prev.state || defaultAddress?.state || '',
    }));
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="shell py-14">
        <h1 className="mb-8 font-display text-3xl font-semibold tracking-[-0.04em]">Checkout</h1>
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out yet"
          description="Add products to your cart first, then return here to prepare your WhatsApp order."
          actionLabel="Browse products"
          actionTo="/shop"
        />
      </div>
    );
  }

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your full name.';
    if (form.phone.replace(/\D/g, '').length < 10) next.phone = 'Enter a valid phone number.';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email or leave it blank.';
    }
    if (!form.address.trim()) next.address = 'Enter your delivery address.';
    if (!form.city.trim()) next.city = 'Enter your city or area.';
    if (!form.state) next.state = 'Select your state.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!validate()) {
      setError('Please check the highlighted fields and try again.');
      return;
    }
    if (!agree) {
      setError('Please confirm that you understand this order will be completed on WhatsApp.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await api('/orders', {
        method: 'POST',
        body: {
          customer: form,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            color: item.color,
          })),
        },
      });
      sessionStorage.setItem('qt_last_order', JSON.stringify(data));
      clear();
      navigate(`/order/${data.order.orderNumber}`);
    } catch (err) {
      setError(err.message);
      toast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shell py-8 sm:py-12">
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-smoke">
        <Link to="/cart" className="hover:text-ink">
          Cart
        </Link>
        <span>→</span>
        <span className="font-semibold text-ink">Your details</span>
        <span>→</span>
        <span>WhatsApp confirmation</span>
      </div>

      <div className="mt-3">
        <p className="section-kicker">Almost there</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Review & send your order
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-smoke">
          Add your delivery details below. We will save your inquiry and open WhatsApp with a
          complete order summary ready to send to our team.
        </p>
      </div>

      <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/[0.07] p-4 text-xs leading-relaxed text-ink">
        <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#128C4A]" />
        <p>
          Orders are completed on WhatsApp. Placing this inquiry does <strong>not</strong> charge
          you or confirm the order. Our team will confirm availability, delivery and payment with
          you directly.
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
        <div className="space-y-6">
          <section className="rounded-3xl border border-line p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">Contact details</h2>
              {!user && (
                <Link to="/login?redirect=/checkout" className="text-[11px] font-semibold text-accent hover:underline">
                  Sign in to autofill
                </Link>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="label">
                  Full name *
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  placeholder="e.g. Terry Okafor"
                  className={errors.name ? 'input border-rose-400' : 'input'}
                  autoComplete="name"
                />
                {errors.name && <p className="mt-1 text-[11px] text-rose-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="label">
                  Phone number *
                </label>
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(event) => update('phone', event.target.value)}
                  placeholder="e.g. 0801 234 5678"
                  className={errors.phone ? 'input border-rose-400' : 'input'}
                  autoComplete="tel"
                  inputMode="tel"
                />
                {errors.phone && <p className="mt-1 text-[11px] text-rose-600">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="label">
                  Email (optional)
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  placeholder="you@example.com"
                  className={errors.email ? 'input border-rose-400' : 'input'}
                  autoComplete="email"
                />
                {errors.email && <p className="mt-1 text-[11px] text-rose-600">{errors.email}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-line p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Delivery details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="address" className="label">
                  Delivery address *
                </label>
                <input
                  id="address"
                  value={form.address}
                  onChange={(event) => update('address', event.target.value)}
                  placeholder="Street, building, landmark"
                  className={errors.address ? 'input border-rose-400' : 'input'}
                  autoComplete="street-address"
                />
                {errors.address && (
                  <p className="mt-1 text-[11px] text-rose-600">{errors.address}</p>
                )}
              </div>
              <div>
                <label htmlFor="city" className="label">
                  City / area *
                </label>
                <input
                  id="city"
                  value={form.city}
                  onChange={(event) => update('city', event.target.value)}
                  placeholder="e.g. Lekki"
                  className={errors.city ? 'input border-rose-400' : 'input'}
                  autoComplete="address-level2"
                />
                {errors.city && <p className="mt-1 text-[11px] text-rose-600">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="state" className="label">
                  State *
                </label>
                <select
                  id="state"
                  value={form.state}
                  onChange={(event) => update('state', event.target.value)}
                  className={errors.state ? 'input border-rose-400' : 'input'}
                >
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="mt-1 text-[11px] text-rose-600">{errors.state}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="label">
                  Additional instructions
                </label>
                <textarea
                  id="notes"
                  rows="3"
                  value={form.notes}
                  onChange={(event) => update('notes', event.target.value)}
                  placeholder="Preferred delivery time, landmark, colour notes, etc."
                  className="input resize-none"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-line p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Payment</h2>
            <div className="mt-3 flex items-start gap-3 rounded-2xl bg-cloud p-4 text-xs leading-relaxed text-smoke">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p>
                Online payment is not collected on this website. Payment is arranged directly with
                Queen Terry after your order is confirmed on WhatsApp. Never send money to an
                unverified account.
              </p>
            </div>
          </section>

          {error && (
            <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-4 text-xs leading-relaxed text-smoke">
            <input
              type="checkbox"
              checked={agree}
              onChange={(event) => setAgree(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-accent"
            />
            <span>
              I understand that this is an order inquiry. Queen Terry will confirm stock, delivery
              and payment with me on WhatsApp before the order is finalised.
            </span>
          </label>

          <button type="submit" disabled={submitting} className="btn-accent w-full py-4">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing your order…
              </>
            ) : (
              <>
                <MessageCircle className="h-4 w-4" />
                Proceed to WhatsApp
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-smoke">
            Your order inquiry will be saved securely and a message will be prepared for WhatsApp.
          </p>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <OrderSummary items={items} subtotal={subtotal} title="Your order" />
          <div className="rounded-2xl border border-line bg-white p-4 text-[11px] leading-relaxed text-smoke">
            <p className="font-semibold text-ink">What happens next?</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>We save your order inquiry with a reference number.</li>
              <li>You send the prepared message to us on WhatsApp.</li>
              <li>We confirm stock, delivery cost and payment options.</li>
            </ol>
          </div>
        </div>
      </form>
    </div>
  );
}
