import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  Twitter,
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import Logo from '../brand/Logo';

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="text-sm text-white/60 transition hover:text-white">
      {children}
    </Link>
  );
}

export default function Footer() {
  const { settings, whatsappNumber } = useStore();
  const { categories } = useCatalog();
  const year = new Date().getFullYear();
  const socials = [
    ['instagram', Instagram],
    ['facebook', Facebook],
    ['x', Twitter],
    ['tiktok', Music2],
  ].filter(([key]) => settings.socials?.[key]);

  const chatUrl = buildWhatsAppUrl(
    whatsappNumber,
    'Hello Queen Terry! I would like to ask about your products.'
  );

  return (
    <footer className="mt-20 bg-ink pb-[calc(4rem+env(safe-area-inset-bottom))] text-white lg:pb-0">
      <div className="shell py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo variant="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              Premium smartphones, electronics and everyday technology — carefully selected and
              easy to order on WhatsApp.
            </p>
            <a
              href={chatUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-ink transition hover:brightness-105"
            >
              <MessageCircle className="h-4 w-4" />
              Order on WhatsApp
            </a>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-2">
                {socials.map(([key, Icon]) => (
                  <a
                    key={key}
                    href={settings.socials[key]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={key}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Shop</h3>
            <div className="mt-4 grid gap-2.5">
              {categories.slice(0, 7).map((category) => (
                <FooterLink key={category._id} to={`/shop?category=${category.slug}`}>
                  {category.name}
                </FooterLink>
              ))}
              <FooterLink to="/shop">All products</FooterLink>
              <FooterLink to="/deals">Deals</FooterLink>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Support
            </h3>
            <div className="mt-4 grid gap-2.5">
              <FooterLink to="/contact">Contact us</FooterLink>
              <FooterLink to="/delivery">Delivery information</FooterLink>
              <FooterLink to="/returns">Returns policy</FooterLink>
              <FooterLink to="/about">About Queen Terry</FooterLink>
              <FooterLink to="/account/orders">Track an order</FooterLink>
              <FooterLink to="/login">My account</FooterLink>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Get in touch
            </h3>
            <div className="mt-4 space-y-3 text-sm text-white/60">
              {settings.supportPhone && (
                <a
                  href={`tel:${settings.supportPhone.replace(/\s/g, '')}`}
                  className="flex items-start gap-2.5 break-words transition hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                  {settings.supportPhone}
                </a>
              )}
              {settings.supportEmail && (
                <a
                  href={`mailto:${settings.supportEmail}`}
                  className="flex items-start gap-2.5 break-words transition hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  {settings.supportEmail}
                </a>
              )}
              <a
                href={chatUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2.5 transition hover:text-white"
              >
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" />
                WhatsApp support
              </a>
              {settings.address && (
                <p className="flex items-start gap-2.5 break-words">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {settings.address}
                </p>
              )}
              {settings.openingHours && <p className="pl-6 text-xs">{settings.openingHours}</p>}
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-xs leading-relaxed text-white/45">
          Orders are completed on WhatsApp. Adding items to your cart and proceeding to WhatsApp
          does not confirm or pay for an order — our team will confirm availability, delivery and
          payment details with you.
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Queen Terry. All rights reserved. Prices in Nigerian Naira (₦).
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/privacy" className="transition hover:text-white">
              Privacy policy
            </Link>
            <Link to="/terms" className="transition hover:text-white">
              Terms & conditions
            </Link>
            <Link to="/returns" className="transition hover:text-white">
              Returns
            </Link>
            <Link to="/delivery" className="transition hover:text-white">
              Delivery
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
