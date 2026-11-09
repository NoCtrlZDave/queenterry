import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/format';

export default function SectionHeader({
  kicker,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  className = '',
}) {
  return (
    <div className={cn('flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="max-w-2xl">
        {kicker && <p className="section-kicker">{kicker}</p>}
        <h2 className="section-title">{title}</h2>
        {description && <p className="mt-3 text-sm leading-relaxed text-smoke sm:text-base">{description}</p>}
      </div>
      {actionLabel &&
        (actionTo ? (
          <Link to={actionTo} className="link-underline shrink-0">
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <button type="button" onClick={onAction} className="link-underline shrink-0">
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        ))}
    </div>
  );
}
