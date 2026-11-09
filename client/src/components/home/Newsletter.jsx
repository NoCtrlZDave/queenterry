import { useState } from 'react';
import { ArrowRight, Loader2, Mail } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const { toast } = useToast();

  const submit = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const data = await api('/newsletter', { method: 'POST', body: { email } });
      toast(data.message);
      setEmail('');
      setStatus('done');
    } catch (err) {
      toast(err.message, 'error');
      setStatus('idle');
    }
  };

  return (
    <section className="shell">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-white sm:px-10 lg:px-14">
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-accent/45 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-accent-400/20 blur-3xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent-300">
              Stay in the loop
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              New arrivals. Honest offers. Straight to your inbox.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55">
              Join the Queen Terry list for product updates, new stock announcements and selected
              promotions. No noise.
            </p>
          </div>

          <form onSubmit={submit} className="w-full">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-3">
                <Mail className="h-4 w-4 shrink-0 text-smoke" />
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-smoke/70"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn bg-accent text-white hover:bg-accent-800"
              >
                {status === 'loading' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
            <p className="mt-3 text-[11px] text-white/35">
              By subscribing you agree to receive occasional emails from Queen Terry. Unsubscribe at
              any time.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
