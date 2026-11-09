import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/format';

export default function QuantityStepper({ value, onChange, min = 1, max = 99, className = '' }) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div className={cn('inline-flex items-center rounded-full border border-line bg-white', className)}>
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-mist disabled:opacity-35"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-9 text-center text-sm font-semibold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-mist disabled:opacity-35"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
