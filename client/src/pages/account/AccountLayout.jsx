import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn, initials } from '../../lib/format';

const links = [
  { to: '/account', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/account/orders', label: 'My orders', icon: Package },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/profile', label: 'Profile', icon: UserIcon },
];

export default function AccountLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const signOut = async () => {
    setBusy(true);
    try {
      await logout();
      navigate('/', { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="shell py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">My account</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Hello, {user?.name?.split(' ')[0] || 'there'}
          </h1>
        </div>
        {user?.role === 'admin' && (
          <NavLink to="/admin" className="btn-outline text-xs">
            <LayoutDashboard className="h-4 w-4" />
            Admin dashboard
          </NavLink>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
        <aside className="sticky-lg-safe">
          <div className="flex items-center gap-3 rounded-2xl border border-line p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">
              {initials(user?.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
              <p className="truncate text-[11px] text-smoke">{user?.email}</p>
            </div>
          </div>

          <nav className="hide-scrollbar scroll-x-touch mt-3 flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition',
                    isActive ? 'bg-ink text-white' : 'text-smoke hover:bg-mist hover:text-ink'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={signOut}
              disabled={busy}
              className="inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-smoke transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </nav>
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
