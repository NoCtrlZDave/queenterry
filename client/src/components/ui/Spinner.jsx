import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/format';

export default function Spinner({ className = '', label = 'Loading' }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm text-smoke', className)}>
      <Loader2 className="h-4 w-4 animate-spin" />
      {label && <span>{label}</span>}
    </span>
  );
}

export function PageLoader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[45vh] items-center justify-center">
      <Spinner label={label} className="text-base" />
    </div>
  );
}
