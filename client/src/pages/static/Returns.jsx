import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, MessageCircle, PackageX, RotateCcw, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

const included = [
  'The item was damaged on arrival and the damage is reported immediately.',
  'You received a different item from what was confirmed on WhatsApp.',
  'The item has a verified manufacturing fault covered by its warranty.',
];

const excluded = [
  'Change of mind after the item has been used or installed.',
  'Damage caused by accidents, liquid, unauthorised repairs or misuse.',
  'Items without their original packaging, accessories or proof of purchase.',
  'Products sold as clearance or explicitly marked “no returns” (where permitted).',
];

export default function Returns() {
  const { whatsappNumber } = useStore();
  const chatUrl = buildWhatsAppUrl(
    whatsappNumber,
    'Hello Queen Terry! I would like to ask about a return or warranty claim.'
  );

  return (
    <div>
      <PageHeader
        kicker="Returns & warranty"
        title="Clear policies, fair resolutions."
        description="If something is wrong with your order, contact us quickly. We will review the issue with you and work towards a fair resolution."
      >
        <a href={chatUrl} target="_blank" rel="noreferrer" className="btn-primary">
          <MessageCircle className="h-4 w-4" /> Start a return request
        </a>
      </PageHeader>

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" /> What we can help with
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-smoke">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
              <PackageX className="h-5 w-5 text-rose-600" /> What is usually excluded
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-smoke">
              {excluded.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-ink">How to start a return</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: MessageCircle,
                title: 'Contact us',
                text: 'Message us on WhatsApp with your order reference and a clear description of the issue.',
              },
              {
                icon: RotateCcw,
                title: 'Review',
                text: 'We may ask for photos, videos or a short description so we can assess the issue fairly.',
              },
              {
                icon: ShieldCheck,
                title: 'Resolution',
                text: 'Where eligible, we arrange a repair, replacement or other resolution as agreed.',
              },
            ].map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="rounded-2xl border border-line p-5">
                <span className="text-[10px] font-bold text-smoke/60">STEP 0{index + 1}</span>
                <Icon className="mt-3 h-5 w-5 text-accent" />
                <h3 className="mt-2 font-display text-base font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-smoke">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-cloud p-6">
            <h2 className="font-display text-xl font-semibold text-ink">Warranty</h2>
            <p className="mt-2 text-sm leading-relaxed text-smoke">
              Warranty terms vary by brand and product. Where a manufacturer warranty applies, we
              will share the details on the product page or during confirmation. Keep your receipt
              and packaging.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
              <AlertCircle className="h-5 w-5 text-amber-600" /> Important
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-smoke">
              Report visible damage or wrong items within 24–48 hours of delivery. Do not attempt
              repairs yourself, as this can void warranty coverage. This page is a summary; your
              statutory rights under applicable Nigerian consumer protection law still apply.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink p-6 text-white">
          <div>
            <p className="font-display text-lg font-semibold">Need help with an order?</p>
            <p className="mt-1 text-xs text-white/60">
              Send your order reference and we will take it from there.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={chatUrl} target="_blank" rel="noreferrer" className="btn-light text-xs">
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
            <Link to="/account/orders" className="btn border border-white/20 text-xs text-white hover:bg-white/10">
              My orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
