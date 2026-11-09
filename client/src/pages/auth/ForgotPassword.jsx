import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2, Mail } from 'lucide-react';
import AuthShell from '../../components/auth/AuthShell';
import { api } from '../../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setResetToken('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      const data = await api('/auth/forgot-password', {
        method: 'POST',
        body: { email: email.trim() },
      });
      setMessage(data.message);
      if (data.resetToken) setResetToken(data.resetToken);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email on your account and we will help you set a new password."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Back to sign in
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

        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-800">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              {message}
            </div>
            {resetToken && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-white p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-smoke">
                  Development reset link
                </p>
                <Link
                  to={`/reset-password?token=${resetToken}`}
                  className="mt-1 block break-all text-[11px] font-semibold text-accent hover:underline"
                >
                  /reset-password?token={resetToken}
                </Link>
              </div>
            )}
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Send reset instructions
        </button>

        <p className="text-center text-[10px] leading-relaxed text-smoke">
          In production, reset instructions are sent by email. If you need urgent help, contact
          Queen Terry on WhatsApp.
        </p>
      </form>
    </AuthShell>
  );
}
