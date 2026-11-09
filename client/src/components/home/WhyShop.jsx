import { Headphones, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Quality you can trust',
    text: 'We focus on genuine products from established technology brands, with clear product information before you order.',
  },
  {
    icon: MessageCircle,
    title: 'Simple WhatsApp ordering',
    text: 'Build your cart, review your total and send a complete order summary straight to our team — no complicated checkout.',
  },
  {
    icon: Headphones,
    title: 'Support when you need it',
    text: 'Ask questions about availability, specifications or delivery before committing. A real person replies.',
  },
  {
    icon: Sparkles,
    title: 'Curated, not cluttered',
    text: 'A focused catalogue of smartphones, audio, computing and everyday gadgets — selected for real daily use.',
  },
];

export default function WhyShop() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {benefits.map(({ icon: Icon, title, text }, index) => (
        <div
          key={title}
          className="rounded-3xl border border-line bg-white p-6 transition hover:border-ink/20 hover:shadow-card"
        >
          <div className="flex items-center justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white">
              <Icon className="h-5 w-5" />
            </span>
            <span className="font-display text-2xl font-semibold text-line">
              0{index + 1}
            </span>
          </div>
          <h3 className="mt-5 font-display text-base font-semibold text-ink">{title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-smoke sm:text-[13px]">{text}</p>
        </div>
      ))}
    </div>
  );
}
