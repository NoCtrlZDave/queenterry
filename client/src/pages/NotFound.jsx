import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Search, ShoppingBag } from 'lucide-react';
import { CrownMark } from '../components/brand/Logo';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-ink text-white">
        <CrownMark className="h-8 w-8" />
      </span>
      <p className="mt-8 font-display text-7xl font-semibold tracking-[-0.06em] text-ink/10">404</p>
      <h1 className="-mt-4 font-display text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
        This page has gone off-grid.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-smoke">
        The link may be broken, or the page may have moved. Let us help you find your way back to
        the good stuff.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <Link to="/shop" className="btn-outline">
          <Compass className="h-4 w-4" /> Browse shop
        </Link>
      </div>
      <div className="mt-12 grid w-full max-w-2xl gap-3 sm:grid-cols-3 text-left">
        {[
          { icon: ShoppingBag, label: 'Shop all products', to: '/shop' },
          { icon: Search, label: 'Search the catalogue', to: '/shop' },
          { icon: Compass, label: 'Explore deals', to: '/deals' },
        ].map(({ icon: Icon, label, to }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center gap-2.5 rounded-2xl border border-line p-4 text-xs font-semibold text-ink transition hover:border-ink/20 hover:bg-cloud"
          >
            <Icon className="h-4 w-4 text-accent" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
