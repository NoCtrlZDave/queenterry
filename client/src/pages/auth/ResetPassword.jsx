import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import AuthShell from '../../components/auth/AuthShell';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const [token, setToken] = useState(params.get('token') || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fromQuery = params.get('token');
    if (fromQuery) setToken(fromQuery);
  }, [params]);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!token.trim()) return setError('Paste the reset token from your instructions.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');

    setSubmitting(true);
    try {
      await api('/auth/reset-password', {
        method: 'POST',
        body: { token: token.trim(), password },
      });
      await refresh();
      navigate('/account', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Paste your reset token and set a password you have not used before."
      footer={
        <>
          Need a new link?{' '}
          <Link to="/forgot-password" className="font-semibold text-accent hover:underline">
            Request reset instructions
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
          <label htmlFor="token" className="label">
            Reset token
          </label>
          <input
            id="token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            className="input font-mono text-xs"
            placeholder="Paste token"
            autoComplete="one-time-code"
          />
        </div>

        <div>
          <label htmlFor="password" className="label">
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
            Confirm new password
          </label>
          <input
            id="confirm"
            type={show ? 'text' : 'password'}
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            className="input"
            placeholder="Re-enter password"
            autoComplete="new-password"
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5">
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <KeyRound className="h-4 w-4" />
          )}
          Update password
        </button>
      </form>
    </AuthShell>
  );
}
