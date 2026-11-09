import { cn, formatNaira } from '../../lib/format';

export default function Price({
  price,
  compareAtPrice,
  size = 'md',
  className = '',
  showDiscount = false,
}) {
  const hasCompare = compareAtPrice && compareAtPrice > price;
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl sm:text-3xl',
  };

  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-1', className)}>
      <span className={cn('font-semibold tracking-tight text-ink', sizes[size])}>
        {formatNaira(price)}
      </span>
      {hasCompare && (
        <span className="text-sm text-smoke line-through">{formatNaira(compareAtPrice)}</span>
      )}
      {hasCompare && showDiscount && (
        <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[11px] font-bold text-accent-700">
          -{Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}%
        </span>
      )}
    </div>
  );
}
