import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import AuthShell from '../../components/auth/AuthShell';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate(redirect || (user.role === 'admin' ? '/admin' : '/account'), { replace: true });
    }
  }, [loading, user, redirect, navigate]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.name.trim().length < 2) return setError('Enter your full name.');
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return setError('Enter a valid email address.');
    }
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');

    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate(redirect || '/account', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Save your delivery details, track inquiries and keep a wishlist — it takes a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="font-semibold text-accent hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="label">
            Full name
          </label>
          <input
            id="name"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            className="input"
            placeholder="e.g. Terry Okafor"
            autoComplete="name"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="label">
              Phone
            </label>
            <input
              id="phone"
              value={form.phone}
              onChange={(event) => update('phone', event.target.value)}
              className="input"
              placeholder="0801 234 5678"
              autoComplete="tel"
              inputMode="tel"
            />
          </div>
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              className="input"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={show ? 'text' : 'password'}
              value={form.password}
              onChange={(event) => update('password', event.target.value)}
              className="input pr-11"
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShow((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-smoke hover:bg-mist"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm" className="label">
            Confirm password
          </label>
          <input
            id="confirm"
            type={show ? 'text' : 'password'}
            value={form.confirm}
            onChange={(event) => update('confirm', event.target.value)}
            className="input"
            placeholder="Re-enter password"
            autoComplete="new-password"
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Create account
        </button>

        <p className="text-center text-[10px] leading-relaxed text-smoke">
          By creating an account you agree to our{' '}
          <Link to="/terms" className="font-semibold text-ink hover:underline">
            terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="font-semibold text-ink hover:underline">
            privacy policy
          </Link>
          . Orders are finalised on WhatsApp.
        </p>
      </form>
    </AuthShell>
  );
}
