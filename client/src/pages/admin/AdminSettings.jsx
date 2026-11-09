import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { api } from '../../lib/api';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { PageLoader } from '../../components/ui/Spinner';

function Card({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      {description && <p className="mt-1 text-xs text-smoke">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function AdminSettings() {
  const { refresh } = useStore();
  const { toast } = useToast();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api('/admin/settings')
      .then(({ settings }) => {
        if (!active) return;
        setForm({
          storeName: settings.storeName || '',
          tagline: settings.tagline || '',
          whatsappNumber: settings.whatsappNumber || '',
          supportEmail: settings.supportEmail || '',
          supportPhone: settings.supportPhone || '',
          address: settings.address || '',
          openingHours: settings.openingHours || '',
          announcements: (settings.announcements || []).join('\n'),
          socials: {
            instagram: settings.socials?.instagram || '',
            facebook: settings.socials?.facebook || '',
            x: settings.socials?.x || '',
            tiktok: settings.socials?.tiktok || '',
          },
          delivery: {
            fee: settings.delivery?.fee ?? 0,
            freeThreshold: settings.delivery?.freeThreshold ?? 0,
            info: settings.delivery?.info || '',
          },
        });
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const updateSocial = (key, value) =>
    setForm((prev) => ({ ...prev, socials: { ...prev.socials, [key]: value } }));
  const updateDelivery = (key, value) =>
    setForm((prev) => ({ ...prev, delivery: { ...prev.delivery, [key]: value } }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api('/admin/settings', {
        method: 'PUT',
        body: {
          storeName: form.storeName,
          tagline: form.tagline,
          whatsappNumber: form.whatsappNumber,
          supportEmail: form.supportEmail,
          supportPhone: form.supportPhone,
          address: form.address,
          openingHours: form.openingHours,
          announcements: form.announcements
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean),
          socials: form.socials,
          delivery: {
            fee: Number(form.delivery.fee) || 0,
            freeThreshold: Number(form.delivery.freeThreshold) || 0,
            info: form.delivery.info,
          },
        },
      });
      await refresh();
      toast('Store settings saved');
    } catch (err) {
      setError(err.message);
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader label="Loading settings…" />;

  if (!form) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error || 'Could not load store settings.'}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            Configuration
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Store settings
          </h1>
          <p className="mt-1 text-xs text-smoke">
            These values power the storefront, WhatsApp links and delivery estimates.
          </p>
        </div>
        <button type="submit" disabled={saving} className="btn-primary text-xs">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save settings
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <Card title="Store identity" description="Shown across the website and footer.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="storeName" className="label">
                  Store name
                </label>
                <input
                  id="storeName"
                  value={form.storeName}
                  onChange={(event) => update('storeName', event.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="tagline" className="label">
                  Tagline
                </label>
                <input
                  id="tagline"
                  value={form.tagline}
                  onChange={(event) => update('tagline', event.target.value)}
                  className="input"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="label">
                  Store address
                </label>
                <input
                  id="address"
                  value={form.address}
                  onChange={(event) => update('address', event.target.value)}
                  className="input"
                  placeholder="Shop address, city, state"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="openingHours" className="label">
                  Opening hours
                </label>
                <input
                  id="openingHours"
                  value={form.openingHours}
                  onChange={(event) => update('openingHours', event.target.value)}
                  className="input"
                  placeholder="e.g. Mon–Sat, 9am – 7pm"
                />
              </div>
            </div>
          </Card>

          <Card
            title="Contact & WhatsApp"
            description="Orders are sent to this WhatsApp number. Use the full international format without a plus sign."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="whatsappNumber" className="label">
                  WhatsApp number
                </label>
                <input
                  id="whatsappNumber"
                  value={form.whatsappNumber}
                  onChange={(event) => update('whatsappNumber', event.target.value)}
                  className="input"
                  placeholder="2349025068558"
                  inputMode="tel"
                />
                <p className="mt-1 text-[10px] text-smoke">
                  Digits only, with country code. Example: 2349025068558.
                </p>
              </div>
              <div>
                <label htmlFor="supportPhone" className="label">
                  Support phone
                </label>
                <input
                  id="supportPhone"
                  value={form.supportPhone}
                  onChange={(event) => update('supportPhone', event.target.value)}
                  className="input"
                  placeholder="0902 506 8558"
                  inputMode="tel"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="supportEmail" className="label">
                  Support email
                </label>
                <input
                  id="supportEmail"
                  type="email"
                  value={form.supportEmail}
                  onChange={(event) => update('supportEmail', event.target.value)}
                  className="input"
                  placeholder="hello@queenterry.com"
                />
              </div>
            </div>
          </Card>

          <Card
            title="Announcement bar"
            description="Up to 6 short messages, one per line. They rotate at the top of the store."
          >
            <textarea
              rows="5"
              value={form.announcements}
              onChange={(event) => update('announcements', event.target.value)}
              className="input resize-none"
              placeholder={'Order directly on WhatsApp\nNew arrivals every week'}
            />
          </Card>

          <Card title="Delivery" description="Customers see these details at checkout.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fee" className="label">
                  Standard delivery fee (₦)
                </label>
                <input
                  id="fee"
                  type="number"
                  min="0"
                  value={form.delivery.fee}
                  onChange={(event) => updateDelivery('fee', event.target.value)}
                  className="input"
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="threshold" className="label">
                  Free delivery over (₦)
                </label>
                <input
                  id="threshold"
                  type="number"
                  min="0"
                  value={form.delivery.freeThreshold}
                  onChange={(event) => updateDelivery('freeThreshold', event.target.value)}
                  className="input"
                  placeholder="0"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="deliveryInfo" className="label">
                  Delivery information
                </label>
                <textarea
                  id="deliveryInfo"
                  rows="3"
                  value={form.delivery.info}
                  onChange={(event) => updateDelivery('info', event.target.value)}
                  className="input resize-none"
                  placeholder="Delivery timelines, coverage and fees."
                />
              </div>
            </div>
            <p className="mt-3 rounded-xl bg-cloud p-3 text-[10px] leading-relaxed text-smoke">
              Set the fee to 0 to show “Confirmed on WhatsApp” instead of a fixed delivery charge.
            </p>
          </Card>
        </div>

        <div className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <Card title="Social links" description="Only filled links appear in the footer.">
            <div className="space-y-3">
              {[
                ['instagram', 'Instagram'],
                ['facebook', 'Facebook'],
                ['x', 'X (Twitter)'],
                ['tiktok', 'TikTok'],
              ].map(([key, label]) => (
                <div key={key}>
                  <label htmlFor={`social-${key}`} className="label">
                    {label}
                  </label>
                  <input
                    id={`social-${key}`}
                    value={form.socials[key]}
                    onChange={(event) => updateSocial(key, event.target.value)}
                    className="input"
                    placeholder={`https://${key}.com/...`}
                  />
                </div>
              ))}
            </div>
          </Card>

          <div className="rounded-2xl border border-line bg-ink p-5 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
              WhatsApp preview
            </p>
            <p className="mt-3 break-all text-sm font-semibold">
              wa.me/{form.whatsappNumber.replace(/\D/g, '') || '—'}
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-white/60">
              Always test the WhatsApp link after changing the number. Orders cannot reach the store
              if this is wrong.
            </p>
            <button type="submit" disabled={saving} className="btn-light mt-4 w-full py-2.5 text-xs">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save settings
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
