import { Star } from 'lucide-react';
import { cn } from '../../lib/format';

export default function Rating({ value = 0, count = 0, className = '', compact = false }) {
  if (!value) return null;

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'h-3.5 w-3.5',
              star <= Math.round(value) ? 'fill-gold text-gold' : 'text-line'
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-smoke">
        {value.toFixed(1)}
        {!compact && count ? ` (${count})` : ''}
      </span>
    </div>
  );
}
