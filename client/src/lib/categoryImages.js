const categoryImages = {
  smartphones: {
    src: '/images/products/iphone-15-pro-max-1.jpg',
    alt: 'Shop the latest smartphones',
    position: 'center',
  },
  tablets: {
    src: '/images/products/apple-ipad-air-m2-1.jpg',
    alt: 'Shop tablets for work and play',
    position: 'center',
  },
  laptops: {
    src: '/images/products/apple-macbook-air-13-inch-m3-1.jpg',
    alt: 'Shop laptops for productivity',
    position: 'center',
  },
  smartwatches: {
    src: '/images/products/apple-watch-series-9-1.jpg',
    alt: 'Shop smartwatches and wearables',
    position: 'center',
  },
  earbuds: {
    src: '/images/products/apple-airpods-pro-2nd-generation-1.jpg',
    alt: 'Shop wireless earbuds',
    position: 'center',
  },
  headphones: {
    src: '/images/products/jbl-tune-770nc-1.webp',
    alt: 'Shop over-ear headphones',
    position: 'center',
  },
  speakers: {
    src: '/images/products/jbl-flip-6-1.png',
    alt: 'Shop portable and home speakers',
    position: 'center',
  },
  chargers: {
    src: '/images/products/anker-65w-gan-charger-1.webp',
    alt: 'Shop fast chargers and adapters',
    position: 'center',
  },
  'power-banks': {
    src: '/images/products/anker-737-power-bank-24000mah-1.webp',
    alt: 'Shop portable power banks',
    position: 'center',
  },
  'phone-accessories': {
    src: '/images/products/anker-maggo-magnetic-ring-1.avif',
    alt: 'Shop phone accessories',
    position: 'center',
  },
  'gaming-accessories': {
    src: '/images/products/jbl-quantum-100-gaming-headset-1.webp',
    alt: 'Shop gaming accessories',
    position: 'center',
  },
  'other-gadgets': {
    src: '/images/products/xiaomi-smart-band-8-1.webp',
    alt: 'Shop smart gadgets',
    position: 'center',
  },
};

export function categoryImage(slug) {
  return categoryImages[slug] || null;
}
