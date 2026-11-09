import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard, { ProductCardSkeleton } from './ProductCard';

export default function ProductRail({ products = [], loading = false, skeletonCount = 4 }) {
  const scroller = useRef(null);

  const scroll = (direction) => {
    if (!scroller.current) return;
    scroller.current.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={scroller}
        className="hide-scrollbar scroll-x-touch -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 sm:mx-0 sm:gap-6 sm:px-0"
      >
        {loading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <div key={index} className="w-[72%] shrink-0 snap-start sm:w-[46%] lg:w-[23%]">
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((product) => (
              <div
                key={product._id}
                className="w-[72%] shrink-0 snap-start sm:w-[46%] lg:w-[23%]"
              >
                <ProductCard product={product} />
              </div>
            ))}
      </div>

      <div className="mt-4 hidden justify-end gap-2 sm:flex">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-ink/40"
          aria-label="Scroll products left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-ink/40"
          aria-label="Scroll products right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
