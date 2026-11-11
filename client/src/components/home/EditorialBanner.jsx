import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { assetUrl } from '../../lib/api';
import { cn } from '../../lib/format';
import ProductImage from '../product/ProductImage';

const tones = {
  dark: {
    panel: 'bg-ink text-white',
    eyebrow: 'text-accent-300',
    body: 'text-white/60',
    cta: 'btn-light',
    glow: 'bg-accent/40',
  },
  accent: {
    panel: 'bg-accent text-white',
    eyebrow: 'text-white/75',
    body: 'text-white/80',
    cta: 'btn-light',
    glow: 'bg-white/25',
  },
  light: {
    panel: 'border border-line bg-cloud text-ink',
    eyebrow: 'text-accent',
    body: 'text-smoke',
    cta: 'btn-primary',
    glow: 'bg-accent-200/50',
  },
};

export default function EditorialBanner({
  tone = 'dark',
  eyebrow,
  title,
  text,
  ctaLabel = 'Discover more',
  to = '/shop',
  product,
  src,
  alt = '',
  position = 'center',
  flip = false,
}) {
  const t = tones[tone] || tones.dark;

  return (
    <div className={cn('relative overflow-hidden rounded-[2rem]', t.panel)}>
      <div
        className={cn(
          'pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full blur-3xl',
          t.glow
        )}
      />
      <div
        className={cn(
          'relative grid items-stretch gap-0 md:grid-cols-2',
          flip && 'md:[&>*:first-child]:order-2'
        )}
      >
        <div className="flex flex-col justify-center gap-5 p-8 sm:p-10 lg:p-14">
          {eyebrow && (
            <p className={cn('text-[11px] font-semibold uppercase tracking-[0.22em]', t.eyebrow)}>
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-3xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-[2.6rem]">
            {title}
          </h2>
          {text && (
            <p className={cn('max-w-md text-sm leading-relaxed sm:text-[15px]', t.body)}>{text}</p>
          )}
          <Link to={to} className={cn(t.cta, 'group mt-1 w-fit px-6')}>
            {ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="relative min-h-[240px] overflow-hidden md:min-h-[340px]">
          {product ? (
            <ProductImage
              product={product}
              className="absolute inset-0 h-full w-full transition-transform duration-700 hover:scale-[1.04]"
            />
          ) : src ? (
            <img
              src={assetUrl(src)}
              alt={alt}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: position }}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
            />
          ) : null}
          <div
            className={cn(
              'pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent md:hidden',
              tone === 'light' ? 'from-cloud/70' : 'from-ink/35'
            )}
          />
        </div>
      </div>
    </div>
  );
}
