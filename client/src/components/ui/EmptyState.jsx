import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = PackageOpen, title, description, actionLabel, actionTo, children }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-cloud px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-accent shadow-sm">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 font-display text-xl font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm leading-relaxed text-smoke">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
      {children}
    </div>
  );
}
