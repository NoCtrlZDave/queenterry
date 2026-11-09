import { Link } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, Headset, ShieldCheck, Truck } from 'lucide-react';
import Logo from '../brand/Logo';

const perks = [
  { icon: BadgeCheck, title: 'Curated technology', text: 'Trusted brands and honest product information.' },
  { icon: Truck, title: 'Nationwide delivery', text: 'Delivery arranged with you on WhatsApp.' },
  { icon: Headset, title: 'Personal support', text: 'Talk to a real person before and after you buy.' },
  { icon: ShieldCheck, title: 'No online payment', text: 'Confirm every detail before you pay.' },
];

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative">
            <Logo variant="light" />
            <p className="mt-14 max-w-sm font-display text-3xl font-semibold leading-tight tracking-[-0.03em] xl:text-4xl">
              Premium tech, ordered the simple way.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
              Create an account to save your details, track order inquiries and keep your wishlist
              close. Final orders are confirmed personally on WhatsApp.
            </p>
          </div>

          <div className="relative mt-12 grid gap-4 sm:grid-cols-2">
            {perks.map(({ icon: Icon, title: perkTitle, text }) => (
              <div key={perkTitle} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <Icon className="h-4 w-4 text-accent-300" />
                <p className="mt-2.5 text-xs font-semibold text-white">{perkTitle}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/50">{text}</p>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex flex-col px-5 py-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            <div className="lg:hidden">
              <Logo />
            </div>
            <Link
              to="/"
              className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-smoke transition hover:bg-mist hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to store
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center py-8">
            <div className="w-full max-w-md">
              <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] text-ink">
                {title}
              </h1>
              {subtitle && <p className="mt-2 text-sm leading-relaxed text-smoke">{subtitle}</p>}
              <div className="mt-7">{children}</div>
              {footer && <div className="mt-6 text-center text-xs text-smoke">{footer}</div>}
            </div>
          </div>

          <p className="text-center text-[10px] text-smoke">
            © {new Date().getFullYear()} Queen Terry. Prices in Nigerian Naira (₦).
          </p>
        </div>
      </div>
    </div>
  );
}
