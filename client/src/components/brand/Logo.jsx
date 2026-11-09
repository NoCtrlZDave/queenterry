import { Link } from 'react-router-dom';
import { cn } from '../../lib/format';

export function CrownMark({ className = '' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M6 13.5 12 18l8-11 8 11 6-4.5-2.4 16.5H8.4L6 13.5Z"
        fill="currentColor"
      />
      <path d="M12 28h16" stroke="white" strokeWidth="2.6" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

export default function Logo({ variant = 'dark', className = '', compact = false }) {
  const isLight = variant === 'light';
  return (
    <Link
      to="/"
      aria-label="Queen Terry home"
      className={cn('group inline-flex items-center gap-2.5', className)}
    >
      <span
        className={cn(
          'grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors',
          isLight ? 'bg-white text-accent' : 'bg-ink text-white'
        )}
      >
        <CrownMark className="h-6 w-6" />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            'block font-display text-[15px] font-extrabold uppercase tracking-[0.2em]',
            isLight ? 'text-white' : 'text-ink'
          )}
        >
          Queen Terry
        </span>
        {!compact && (
          <span
            className={cn(
              'mt-1 block text-[9px] font-semibold uppercase tracking-[0.32em]',
              isLight ? 'text-white/60' : 'text-smoke'
            )}
          >
            Premium Tech Store
          </span>
        )}
      </span>
    </Link>
  );
}
