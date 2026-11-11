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

export default function Logo({
  variant = 'dark',
  className = '',
  compact = false,
  compactOnMobile = false,
}) {
  const isLight = variant === 'light';
  return (
    <Link
      to="/"
      aria-label="Queen Terry home"
      className={cn('group inline-flex min-w-0 items-center gap-2 sm:gap-2.5', className)}
    >
      <span
        className={cn(
          'grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors sm:h-10 sm:w-10',
          isLight ? 'bg-white text-accent' : 'bg-ink text-white'
        )}
      >
        <CrownMark className="h-5 w-5 sm:h-6 sm:w-6" />
      </span>
      <span className="min-w-0 leading-none">
        <span
          className={cn(
            'block truncate font-display text-[12px] font-extrabold uppercase tracking-[0.12em] sm:text-[15px] sm:tracking-[0.2em]',
            isLight ? 'text-white' : 'text-ink'
          )}
        >
          Queen Terry
        </span>
        {!compact && (
          <span
            className={cn(
              'mt-1 text-[9px] font-semibold uppercase tracking-[0.32em]',
              compactOnMobile ? 'hidden sm:block' : 'block',
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
