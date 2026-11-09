import { Link } from 'react-router-dom';
import { Clock3, MapPin, MessageCircle, PackageCheck, Truck } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { useStore } from '../../context/StoreContext';
import { formatNaira } from '../../lib/format';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

const steps = [
  { icon: PackageCheck, title: 'Order inquiry', text: 'Choose your items and send the prepared order message to us on WhatsApp.' },
  { icon: MessageCircle, title: 'Confirmation', text: 'We confirm stock, delivery cost and the best payment option for you.' },
  { icon: Truck, title: 'Dispatch', text: 'Once confirmed, we package your order and arrange delivery or pickup.' },
  { icon: Clock3, title: 'Delivery', text: 'We share updates and delivery timelines based on your location.' },
];

export default function Delivery() {
  const { settings, whatsappNumber } = useStore();
  const delivery = settings.delivery || {};
  const fee = Number(delivery.fee) || 0;
  const threshold = Number(delivery.freeThreshold) || 0;
  const chatUrl = buildWhatsAppUrl(
    whatsappNumber,
    'Hello Queen Terry! I would like to confirm delivery to my location.'
  );

  return (
    <div>
      <PageHeader
        kicker="Delivery"
        title="From our store to your door."
        description="We arrange delivery with you after confirming your order on WhatsApp. Costs and timelines depend on your location and the items in your order."
      >
        <a href={chatUrl} target="_blank" rel="noreferrer" className="btn-primary">
          <MessageCircle className="h-4 w-4" /> Confirm delivery to your area
        </a>
      </PageHeader>

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-line p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-smoke">
              Standard delivery
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink">
              {fee > 0 ? formatNaira(fee) : 'Confirmed on WhatsApp'}
            </p>
            <p className="mt-1 text-xs text-smoke">
              {fee > 0
                ? 'Fixed fee where applicable. Final cost may vary for bulky items or special locations.'
                : 'We confirm the exact delivery cost based on your address before you pay.'}
            </p>
          </div>
          <div className="rounded-2xl border border-line p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-smoke">
              Free delivery
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink">
              {threshold > 0 ? formatNaira(threshold) : 'Ask us'}
            </p>
            <p className="mt-1 text-xs text-smoke">
              {threshold > 0
                ? 'Orders above this amount qualify for free standard delivery, where available.'
                : 'Ask us about current free delivery offers for your location.'}
            </p>
          </div>
          <div className="rounded-2xl border border-line p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-smoke">
              Pickup
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink">Available</p>
            <p className="mt-1 text-xs text-smoke">
              {settings.address
                ? `Collect from ${settings.address}. Confirm availability before visiting.`
                : 'Ask us for pickup options and directions.'}
            </p>
          </div>
        </div>

        {delivery.info && (
          <div className="mt-6 rounded-2xl border border-accent/20 bg-accent-50 p-5 text-sm leading-relaxed text-ink">
            {delivery.info}
          </div>
        )}

        <div className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-ink">How delivery works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="rounded-2xl bg-cloud p-5">
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-accent shadow-sm">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-bold text-smoke/60">0{index + 1}</span>
                </div>
                <h3 className="mt-3 font-display text-base font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-smoke">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line p-6">
            <h2 className="font-display text-xl font-semibold text-ink">Coverage & timelines</h2>
            <p className="mt-2 text-sm leading-relaxed text-smoke">
              We deliver across Nigeria. Timelines depend on your state, the courier partner and
              product availability. During checkout we confirm the estimate before your order is
              finalised.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-smoke">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                Lagos and major cities are usually fastest; other locations may take longer.
              </li>
              <li className="flex items-start gap-2">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                We share an estimate on WhatsApp after confirming stock.
              </li>
              <li className="flex items-start gap-2">
                <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                Inspect your item at delivery and raise any concerns immediately.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-line p-6">
            <h2 className="font-display text-xl font-semibold text-ink">Need a delivery update?</h2>
            <p className="mt-2 text-sm leading-relaxed text-smoke">
              Have your order reference ready and message us on WhatsApp. If you created an account,
              you can also view the latest status in your order history.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={chatUrl} target="_blank" rel="noreferrer" className="btn-accent text-xs">
                <MessageCircle className="h-4 w-4" /> Message us
              </a>
              <Link to="/account/orders" className="btn-outline text-xs">
                View my orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
