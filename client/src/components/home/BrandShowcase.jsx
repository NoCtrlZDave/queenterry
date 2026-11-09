import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function BrandShowcase({ brands = [] }) {
  if (!brands.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {brands.map((brand) => (
        <Link
          key={brand._id}
          to={`/shop?brand=${brand.slug}`}
          className="group flex min-h-[118px] flex-col justify-between rounded-2xl border border-line bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-card"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              {brand.name}
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-smoke transition group-hover:text-accent" />
          </div>
          <div>
            <p className="line-clamp-2 text-[11px] leading-snug text-smoke">
              {brand.tagline || 'Shop the collection'}
            </p>
            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
              {brand.productCount ? `${brand.productCount} products` : 'Explore'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
