import { BadgeCheck, MessageCircle, ShieldCheck, Truck } from 'lucide-react';

const items = [
  {
    icon: BadgeCheck,
    title: 'Quality products',
    text: 'Selected devices and accessories from trusted brands.',
  },
  {
    icon: ShieldCheck,
    title: 'Order with confidence',
    text: 'Review your cart and confirm every detail on WhatsApp.',
  },
  {
    icon: MessageCircle,
    title: 'Personal support',
    text: 'Talk to a real person before you pay or commit.',
  },
  {
    icon: Truck,
    title: 'Delivery coordination',
    text: 'Delivery options confirmed for your location on WhatsApp.',
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-line bg-white">
      <div className="shell grid grid-cols-2 gap-x-6 gap-y-6 py-7 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-50 text-accent">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-smoke sm:text-xs">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
