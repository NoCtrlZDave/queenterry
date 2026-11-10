import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { assetUrl } from '../../lib/api';
import { categoryImage } from '../../lib/categoryImages';
import ProductVisual from './ProductVisual';

export default function CategoryCard({ category }) {
  const visual = categoryImage(category.slug);

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="group flex flex-col rounded-3xl border border-line bg-white p-3 transition duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-card sm:p-4"
    >
      <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-mist">
        {visual ? (
          <>
            <img
              src={assetUrl(visual.src)}
              alt={visual.alt || `${category.name} at Queen Terry`}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: visual.position }}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/0 to-transparent" />
            <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink shadow-sm backdrop-blur transition group-hover:bg-ink group-hover:text-white">
              Shop now
            </span>
          </>
        ) : (
          <ProductVisual
            category={category.slug}
            seed={category.name}
            className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]"
            alt={`${category.name} category visual`}
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-3 px-1 pb-1 pt-4">
        <div className="min-w-0">
          <h3 className="break-words font-display text-base font-semibold leading-tight text-ink">
            {category.name}
          </h3>
          <p className="mt-1 text-xs text-smoke">
            {category.productCount ? `${category.productCount} products` : 'Explore range'}
          </p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mist text-ink transition group-hover:bg-ink group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
