import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { discountPercent, formatNaira } from '../../lib/format';
import ProductImage from '../product/ProductImage';

const FALLBACK_SLIDES = [
  {
    id: 'iphone-15-pro-max',
    kicker: 'Apple · Flagship',
    title: 'iPhone 15 Pro Max',
    text: 'Titanium build, the A17 Pro chip and a 48MP pro camera system — the iPhone at its most capable.',
    product: {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      category: { slug: 'smartphones' },
    },
    to: '/shop?category=smartphones',
  },
  {
    id: 'samsung-galaxy-s24-ultra',
    kicker: 'Samsung · Galaxy AI',
    title: 'Galaxy S24 Ultra',
    text: 'A 200MP camera, built-in S Pen and Galaxy AI features, finished in titanium.',
    product: {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      category: { slug: 'smartphones' },
    },
    to: '/shop?category=smartphones',
  },
  {
    id: 'apple-macbook-air-13-inch-m3',
    kicker: 'Apple · Computing',
    title: 'MacBook Air M3',
    text: 'Impossibly thin and seriously fast, with all-day battery and the M3 chip.',
    product: {
      name: 'MacBook Air 13-inch M3',
      slug: 'apple-macbook-air-13-inch-m3',
      category: { slug: 'laptops' },
    },
    to: '/shop?category=laptops',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function Hero({ featured }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = useMemo(() => {
    const items = (featured || []).slice(0, 3);
    if (items.length) {
      return items.map((product) => ({
        id: product._id,
        kicker: product.brand?.name || 'Featured device',
        title: product.name,
        text:
          product.description ||
          (product.highlights || []).slice(0, 3).join(' · ') ||
          'A considered pick from the Queen Terry catalogue.',
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        rating: product.rating,
        product,
        to: `/product/${product.slug}`,
      }));
    }
    return FALLBACK_SLIDES;
  }, [featured]);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (reduceMotion || slides.length < 2 || paused) return undefined;
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 6500);
    return () => clearInterval(timer);
  }, [reduceMotion, slides.length, paused]);

  const goTo = (next) => setIndex(((next % slides.length) + slides.length) % slides.length);

  const slide = slides[index];
  const discount = slide.price ? discountPercent(slide) : 0;

  return (
    <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-mist via-[#FAF9FF] to-white">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-accent-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent-50 blur-3xl" />

      <div
        className="shell relative grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_1.02fr] lg:gap-12 lg:py-20"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="relative max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={reduceMotion ? false : 'hidden'}
              animate="show"
              exit={reduceMotion ? undefined : { opacity: 0, y: -16 }}
              variants={reduceMotion ? undefined : { show: { transition: { staggerChildren: 0.07 } } }}
              transition={{ duration: 0.4 }}
            >
              <motion.div variants={reduceMotion ? undefined : fadeUp} transition={{ duration: 0.5 }}>
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white/70 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {slide.kicker}
                </span>
              </motion.div>

              <motion.h1
                variants={reduceMotion ? undefined : fadeUp}
                transition={{ duration: 0.55 }}
                className="mt-6 font-display text-[clamp(2.6rem,6.4vw,4.9rem)] font-extrabold leading-[0.94] tracking-[-0.05em] text-ink"
              >
                {slide.title}
              </motion.h1>

              <motion.p
                variants={reduceMotion ? undefined : fadeUp}
                transition={{ duration: 0.55 }}
                className="mt-5 max-w-lg text-[15px] leading-relaxed text-smoke sm:text-lg"
              >
                {slide.text}
              </motion.p>

              {slide.price ? (
                <motion.div
                  variants={reduceMotion ? undefined : fadeUp}
                  transition={{ duration: 0.55 }}
                  className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2"
                >
                  <span className="font-display text-2xl font-semibold tracking-tight text-ink">
                    {formatNaira(slide.price)}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-sm text-smoke line-through">
                        {formatNaira(slide.compareAtPrice)}
                      </span>
                      <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                        -{discount}%
                      </span>
                    </>
                  )}
                  {slide.rating > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-smoke">
                      <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                      {slide.rating.toFixed(1)}
                    </span>
                  )}
                </motion.div>
              ) : null}

              <motion.div
                variants={reduceMotion ? undefined : fadeUp}
                transition={{ duration: 0.55 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Link to={slide.to} className="btn-primary group px-7 py-3.5">
                  {slide.price ? 'Shop this device' : 'Explore the range'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link to="/deals" className="btn-outline px-7 py-3.5">
                  Shop latest deals
                </Link>
              </motion.div>

              <motion.div
                variants={reduceMotion ? undefined : fadeUp}
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
          </AnimatePresence>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[2.5rem] border border-white/80 bg-white shadow-soft sm:aspect-[5/6]">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <ProductImage product={slide.product} className="h-full w-full" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/70 bg-white/90 p-4 backdrop-blur">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-smoke">
                {slide.price ? 'Featured device' : 'New season'}
              </p>
              <div className="mt-1 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="line-clamp-2 break-words font-display text-base font-semibold leading-tight text-ink">
                    {slide.title}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-accent">
                    {slide.price ? formatNaira(slide.price) : 'Now in store'}
                  </p>
                </div>
                <Link
                  to={slide.to}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white transition hover:bg-coal"
                  aria-label="View featured product"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute -right-1 bottom-24 hidden items-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-[11px] font-semibold text-ink shadow-card sm:flex">
            <MessageCircle className="h-4 w-4" />
            Order on WhatsApp
          </div>

          {slides.length > 1 && (
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2" role="tablist" aria-label="Featured slides">
                {slides.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Show slide ${i + 1}: ${item.title}`}
                    onClick={() => goTo(i)}
                    className={
                      i === index
                        ? 'h-1.5 w-8 rounded-full bg-ink transition-all'
                        : 'h-1.5 w-3 rounded-full bg-ink/20 transition-all hover:bg-ink/40'
                    }
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-ink/40"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-ink/40"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
