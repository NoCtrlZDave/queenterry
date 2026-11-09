import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, HeartHandshake, MessageCircle, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

const values = [
  {
    icon: BadgeCheck,
    title: 'Genuine products',
    text: 'We focus on trusted brands and clear product information. If something is unclear, ask us before you buy.',
  },
  {
    icon: HeartHandshake,
    title: 'Personal service',
    text: 'Every order is confirmed by a real person on WhatsApp. You can ask questions, compare options and decide with confidence.',
  },
  {
    icon: Truck,
    title: 'Reliable delivery',
    text: 'We confirm delivery timelines and costs based on your location before your order is finalised.',
  },
  {
    icon: ShieldCheck,
    title: 'No pressure',
    text: 'No online payment is collected on this website. We confirm every detail before any payment is arranged.',
  },
];

export default function About() {
  const { whatsappNumber } = useStore();
  const chatUrl = buildWhatsAppUrl(
    whatsappNumber,
    'Hello Queen Terry! I would like to learn more about your store.'
  );

  return (
    <div>
      <PageHeader
        kicker="Our story"
        title="Technology should feel personal."
        description="Queen Terry is a Nigerian technology store built around a simple idea: buying premium devices should be clear, friendly and free of pressure."
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/shop" className="btn-primary">
            Explore the catalogue <ArrowRight className="h-4 w-4" />
          </Link>
          <a href={chatUrl} target="_blank" rel="noreferrer" className="btn-outline">
            <MessageCircle className="h-4 w-4" /> Talk to us
          </a>
        </div>
      </PageHeader>

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="section-kicker">Why we exist</p>
            <h2 className="section-title">A better way to buy tech in Nigeria.</h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-smoke">
              <p>
                Buying electronics should not feel like a gamble. Too often, shoppers are left
                comparing unclear listings, chasing unavailable stock or paying before they have
                answers. Queen Terry was created to make that experience feel human again.
              </p>
              <p>
                We curate smartphones, laptops, audio, wearables and everyday gadgets from brands
                people already trust. Every product page gives you the facts we have, and our team
                is one message away when you need a recommendation or a delivery update.
              </p>
              <p>
                We deliberately do not collect online payments on this website. Your order starts
                as an inquiry, we confirm availability and delivery with you on WhatsApp, and only
                then do we discuss payment. That is how we keep things transparent.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Curated', 'Products selected for quality and everyday value.'],
              ['Nationwide', 'Delivery arranged across Nigeria.'],
              ['WhatsApp-first', 'Direct answers from a real person.'],
              ['Transparent', 'Clear prices and confirmation before payment.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-line p-5">
                <Sparkles className="h-4 w-4 text-accent" />
                <p className="mt-3 font-display text-lg font-semibold text-ink">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-smoke">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-cloud p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-accent shadow-sm">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-ink">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-smoke">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 overflow-hidden rounded-3xl bg-ink p-8 text-white sm:p-12">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-300">
              Talk to Queen Terry
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Not sure which device is right for you?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Tell us what you need, your budget and how you plan to use it. We will help you
              narrow down the options — no pressure to buy.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={chatUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-light"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
              <Link to="/contact" className="btn border border-white/20 text-white hover:bg-white/10">
                Contact page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
