import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import { ProductCardSkeleton } from '../product/ProductCard';

export default function DealsSection({ deals = [], loading = false }) {
  if (!loading && deals.length === 0) return null;

  return (
    <section className="bg-ink py-14 text-white sm:py-16">
      <div className="shell grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-300">
            <Tag className="h-3.5 w-3.5" />
            Special offers
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-[2.75rem]">
            The upgrade you have been waiting for.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
            Selected products at reduced prices while stock lasts. Every offer is confirmed with
            you before payment, so there are no surprises.
          </p>
          <Link to="/deals" className="btn-light group mt-7 px-6">
            Shop all deals
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <p className="mt-4 text-[11px] text-white/35">
            Offers are subject to availability. Confirm current pricing with our team on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {loading
            ? Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="rounded-3xl bg-white p-3">
                  <ProductCardSkeleton />
                </div>
              ))
            : deals.slice(0, 2).map((product) => (
                <div key={product._id} className="rounded-3xl bg-white p-3">
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
