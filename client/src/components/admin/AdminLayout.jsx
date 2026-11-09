import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Users,
  X,
} from 'lucide-react';
import Logo from '../brand/Logo';
import { useAuth } from '../../context/AuthContext';
import { cn, initials } from '../../lib/format';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/settings', label: 'Store settings', icon: Settings },
];

function NavItems({ onNavigate }) {
  return (
    <nav className="space-y-1">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
              isActive
                ? 'bg-white text-ink'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const signOut = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-mist">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink p-5 text-white lg:flex">
        <Logo variant="light" compact />
        <p className="mt-1.5 pl-[50px] text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Admin console
        </p>

        <div className="mt-8 flex-1">
          <NavItems />
          <div className="mt-6 border-t border-white/10 pt-4">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <Store className="h-4 w-4" />
              View storefront
              <ExternalLink className="ml-auto h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-xs font-bold text-ink">
              {initials(user?.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">{user?.name}</p>
              <p className="truncate text-[10px] text-white/45">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 py-2 text-[11px] font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Logo compact />
            <div className="flex items-center gap-2">
              <Link to="/" className="rounded-full p-2 text-smoke hover:bg-mist" aria-label="View store">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-mist"
                aria-label="Open admin menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {menuOpen && (
          <div className="fixed inset-0 z-[80] lg:hidden">
            <div
              className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute inset-y-0 left-0 w-72 bg-ink p-5 text-white">
              <div className="flex items-center justify-between">
                <Logo variant="light" compact />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full p-2 text-white/70 hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Admin console
              </p>
              <div className="mt-6">
                <NavItems onNavigate={() => setMenuOpen(false)} />
              </div>
              <Link
                to="/"
                className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white"
              >
                <Store className="h-4 w-4" /> View storefront
              </Link>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
