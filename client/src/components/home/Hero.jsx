import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, MessageCircle, ShieldCheck } from 'lucide-react';
import { formatNaira } from '../../lib/format';
import ProductImage from '../product/ProductImage';
import ProductVisual from '../product/ProductVisual';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function Hero({ featured }) {
  const heroProduct = featured?.[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-mist via-[#FAF9FF] to-white">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-accent-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-accent-50 blur-3xl" />

      <div className="shell relative grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:py-20">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.08 }}
          className="max-w-xl"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white/70 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Premium tech, thoughtfully selected
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-6 font-display text-[clamp(2.9rem,7.2vw,5.6rem)] font-extrabold leading-[0.92] tracking-[-0.055em] text-ink"
          >
            TECH THAT
            <br />
            MOVES YOU<span className="text-accent">.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-6 max-w-lg text-[15px] leading-relaxed text-smoke sm:text-lg"
          >
            Discover smartphones, premium gadgets and everyday technology essentials, all in one
            place — with a simple, personal way to order on WhatsApp.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link to="/shop" className="btn-primary group px-7 py-3.5">
              Explore products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link to="/deals" className="btn-outline px-7 py-3.5">
              Shop latest deals
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium text-smoke sm:text-xs"
          >
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-accent" /> Quality products
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-accent" /> Safe WhatsApp ordering
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-accent" /> Real human support
            </span>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto w-full max-w-[500px]">
          <div className="relative mx-auto aspect-[5/6] w-full max-w-[400px] overflow-hidden rounded-[2.5rem] border border-white/80 bg-white shadow-soft">
            {heroProduct ? (
              <ProductImage product={heroProduct} className="h-full w-full" />
            ) : (
              <ProductVisual
                category="smartphones"
                seed="Queen Terry hero"
                className="h-full w-full"
                alt="Featured Queen Terry smartphone"
              />
            )}

            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/70 bg-white/90 p-4 backdrop-blur">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-smoke">
                {heroProduct ? 'Featured device' : 'New season'}
              </p>
              <div className="mt-1 flex items-end justify-between gap-3">
                <div>
                  <p className="font-display text-base font-semibold leading-tight text-ink">
                    {heroProduct?.name || 'Latest smartphones'}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-accent">
                    {heroProduct ? formatNaira(heroProduct.price) : 'Now in store'}
                  </p>
                </div>
                <Link
                  to={heroProduct ? `/product/${heroProduct.slug}` : '/shop?category=smartphones'}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white transition hover:bg-coal"
                  aria-label="View featured product"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-5 bottom-28 hidden w-28 rounded-3xl border border-white/70 bg-white p-3 shadow-card sm:block"
          >
            <div className="aspect-square overflow-hidden rounded-2xl">
              <ProductImage
                product={{
                  name: 'Samsung Galaxy Watch 6',
                  slug: 'samsung-galaxy-watch-6',
                  category: { slug: 'smartwatches' },
                }}
                className="h-full w-full"
              />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-3 top-12 hidden w-24 rounded-3xl border border-white/70 bg-white p-3 shadow-card sm:block"
          >
            <div className="aspect-square overflow-hidden rounded-2xl">
              <ProductImage
                product={{
                  name: 'Apple AirPods Pro',
                  slug: 'apple-airpods-pro-2nd-generation',
                  category: { slug: 'earbuds' },
                }}
                className="h-full w-full"
              />
            </div>
          </motion.div>

          <div className="absolute -right-1 bottom-24 hidden items-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-[11px] font-semibold text-ink shadow-card sm:flex">
            <MessageCircle className="h-4 w-4" />
            Order on WhatsApp
          </div>
        </div>
      </div>
    </section>
  );
}
