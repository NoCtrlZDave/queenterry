import { useState } from 'react';
import { Clock3, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

export default function Contact() {
  const { settings, whatsappNumber } = useStore();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const text = [
    'Hello Queen Terry!',
    '',
    `Name: ${form.name || '—'}`,
    `Email: ${form.email || '—'}`,
    '',
    form.message || 'I would like to ask about your products.',
  ].join('\n');

  const submit = (event) => {
    event.preventDefault();
    window.open(buildWhatsAppUrl(whatsappNumber, text), '_blank', 'noopener');
  };

  const chatUrl = buildWhatsAppUrl(
    whatsappNumber,
    'Hello Queen Terry! I would like to ask about your products.'
  );

  const details = [
    settings.supportPhone && {
      icon: Phone,
      label: 'Call us',
      value: settings.supportPhone,
      href: `tel:${settings.supportPhone.replace(/\s/g, '')}`,
    },
    settings.supportEmail && {
      icon: Mail,
      label: 'Email us',
      value: settings.supportEmail,
      href: `mailto:${settings.supportEmail}`,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: `+${whatsappNumber.replace(/\D/g, '')}`,
      href: chatUrl,
    },
    settings.address && {
      icon: MapPin,
      label: 'Visit',
      value: settings.address,
    },
    settings.openingHours && {
      icon: Clock3,
      label: 'Opening hours',
      value: settings.openingHours,
    },
  ].filter(Boolean);

  return (
    <div>
      <PageHeader
        kicker="Contact"
        title="We are here to help."
        description="Questions about a product, delivery or an existing order? Send us a message on WhatsApp or use the form below — it opens a pre-filled chat."
      />

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Get in touch</h2>
            <p className="mt-2 text-sm leading-relaxed text-smoke">
              WhatsApp is the fastest way to reach us. We typically respond during business hours.
            </p>

            <div className="mt-6 space-y-3">
              {details.map(({ icon: Icon, label, value, href }) => {
                const content = (
                  <>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mist text-ink">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-smoke">
                        {label}
                      </span>
                      <span className="mt-0.5 block break-words text-sm font-medium text-ink">
                        {value}
                      </span>
                    </span>
                  </>
                );
                return href ? (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    className="flex items-center gap-3 rounded-2xl border border-line p-3.5 transition hover:border-ink/20 hover:bg-cloud"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={label} className="flex items-center gap-3 rounded-2xl border border-line p-3.5">
                    {content}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/[0.07] p-4 text-xs leading-relaxed text-ink">
              <p className="font-semibold">Order updates</p>
              <p className="mt-1 text-smoke">
                Have an order reference? You can view its status in{' '}
                <a href="/account/orders" className="font-semibold text-accent hover:underline">
                  your account
                </a>{' '}
                or ask us on WhatsApp with the reference number.
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="rounded-3xl border border-line bg-cloud p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">Send a message</h2>
            <p className="mt-1 text-xs text-smoke">
              This form opens WhatsApp with your message ready to send. No data is stored on this
              website.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="name" className="label">
                  Your name
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  className="input"
                  placeholder="e.g. Terry Okafor"
                />
              </div>
              <div>
                <label htmlFor="email" className="label">
                  Email (optional)
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  className="input"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="label">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  value={form.message}
                  onChange={(event) => update('message', event.target.value)}
                  className="input resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <button type="submit" className="btn-accent w-full">
                <Send className="h-4 w-4" />
                Continue on WhatsApp
              </button>
              <p className="text-center text-[10px] text-smoke">
                By continuing, WhatsApp will open. Send the message to reach our team.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
