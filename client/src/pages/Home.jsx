import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useCatalog } from '../context/CatalogContext';
import Hero from '../components/home/Hero';
import TrustStrip from '../components/home/TrustStrip';
import CategoryCard from '../components/product/CategoryCard';
import ProductRail from '../components/product/ProductRail';
import DealsSection from '../components/home/DealsSection';
import BrandShowcase from '../components/home/BrandShowcase';
import WhyShop from '../components/home/WhyShop';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';
import SectionHeader from '../components/ui/SectionHeader';

const empty = { featured: [], newArrivals: [], best: [], deals: [] };

export default function Home() {
  const [data, setData] = useState(empty);
  const [loading, setLoading] = useState(true);
  const { categories, brands, loading: catalogLoading } = useCatalog();

  useEffect(() => {
    let active = true;
    Promise.all([
      api('/products?featured=true&limit=8&sort=featured'),
      api('/products?sort=newest&limit=8'),
      api('/products?sort=best_selling&limit=8'),
      api('/products?deals=true&limit=6&sort=best_selling'),
    ])
      .then(([featured, newest, best, deals]) => {
        if (!active) return;
        setData({
          featured: featured.items || [],
          newArrivals: newest.items || [],
          best: best.items || [],
          deals: deals.items || [],
        });
      })
      .catch(() => {
        if (active) setData(empty);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Hero featured={data.featured} />
      <TrustStrip />

      <section className="shell py-14 sm:py-16">
        <SectionHeader
          kicker="Shop by category"
          title="Whatever you need, find it here."
          description="From flagship smartphones to the accessories that complete your setup — browse a focused range built around everyday technology."
          actionLabel="All products"
          actionTo="/shop"
        />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {(catalogLoading ? Array.from({ length: 8 }) : categories).map((category, index) =>
            category ? (
              <CategoryCard key={category._id} category={category} />
            ) : (
              <div key={index} className="skeleton aspect-[5/4] rounded-3xl" />
            )
          )}
        </div>
      </section>

      <section className="shell py-12 sm:py-14">
        <SectionHeader
          kicker="Featured this week"
          title="Considered picks for your next upgrade."
          actionLabel="Shop featured"
          actionTo="/shop?featured=true"
        />
        <div className="mt-8">
          <ProductRail products={data.featured} loading={loading} />
        </div>
      </section>

      <section className="bg-gradient-to-b from-accent-50/80 to-white py-14 sm:py-16">
        <div className="shell">
          <SectionHeader
            kicker="Just landed"
            title="New arrivals, ready to explore."
            description="The latest devices and accessories to reach the Queen Terry catalogue."
            actionLabel="Shop new arrivals"
            actionTo="/shop?sort=newest"
          />
          <div className="mt-8">
            <ProductRail products={data.newArrivals} loading={loading} />
          </div>
        </div>
      </section>

      <section className="shell py-14 sm:py-16">
        <SectionHeader
          kicker="Best sellers"
          title="What customers are choosing."
          description="Popular devices and essentials that keep earning their place."
          actionLabel="Shop best sellers"
          actionTo="/shop?sort=best_selling"
        />
        <div className="mt-8">
          <ProductRail products={data.best} loading={loading} />
        </div>
      </section>

      <DealsSection deals={data.deals} loading={loading} />

      <section className="shell py-14 sm:py-16">
        <SectionHeader
          kicker="Featured brands"
          title="Technology from names you recognise."
          description="We stock a curated selection across phones, computing, audio and accessories. Brand availability is managed from our store dashboard."
          actionLabel="Shop all products"
          actionTo="/shop"
        />
        <div className="mt-8">
          <BrandShowcase brands={brands} />
        </div>
      </section>

      <section className="bg-mist/60 py-14 sm:py-16">
        <div className="shell">
          <SectionHeader
            kicker="Why Queen Terry"
            title="A simpler way to buy technology."
            description="No walls of noise. Just clear products, honest information and a personal ordering experience."
          />
          <div className="mt-8">
            <WhyShop />
          </div>
        </div>
      </section>

      <section className="shell py-14 sm:py-16">
        <SectionHeader
          kicker="Customer feedback"
          title="Built around a better experience."
          description="Early placeholder reviews are shown below until verified customer testimonials are supplied."
        />
        <div className="mt-8">
          <Testimonials />
        </div>
      </section>

      <div className="pb-4">
        <Newsletter />
      </div>
    </>
  );
}
