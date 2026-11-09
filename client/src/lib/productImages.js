const productImages = {
  'iphone-15-pro-max': [
    '/images/products/iphone-15-pro-max-1.jpg',
    '/images/products/iphone-15-pro-max-2.jpg',
    '/images/products/iphone-15-pro-max-3.jpg',
  ],
  'samsung-galaxy-s24-ultra': [
    '/images/products/galaxy-s24-ultra-1.jpg',
    '/images/products/galaxy-s24-ultra-2.jpg',
    '/images/products/galaxy-s24-ultra-3.jpg',
  ],
  'tecno-camon-30-pro-5g': [
    '/images/products/tecno-camon-30-pro-5g-1.jpg',
    '/images/products/tecno-camon-30-pro-5g-2.jpg',
  ],
  'infinix-note-40-pro': [
    '/images/products/infinix-note-40-pro-1.jpg',
    '/images/products/infinix-note-40-pro-2.jpg',
  ],
  'xiaomi-redmi-note-13-pro': [
    '/images/products/xiaomi-redmi-note-13-pro-1.jpg',
    '/images/products/xiaomi-redmi-note-13-pro-2.jpg',
    '/images/products/xiaomi-redmi-note-13-pro-3.jpg',
  ],
  'samsung-galaxy-a55-5g': [
    '/images/products/samsung-galaxy-a55-5g-1.jpg',
    '/images/products/samsung-galaxy-a55-5g-2.jpg',
  ],
  'apple-ipad-air-m2': [
    '/images/products/apple-ipad-air-m2-1.jpg',
    '/images/products/apple-ipad-air-m2-2.jpg',
  ],
  'samsung-galaxy-tab-s9-fe': [
    '/images/products/samsung-galaxy-tab-s9-fe-1.jpg',
    '/images/products/samsung-galaxy-tab-s9-fe-2.jpg',
    '/images/products/samsung-galaxy-tab-s9-fe-3.jpg',
  ],
  'lenovo-tab-p12': ['/images/products/lenovo-tab-p12-1.jpg'],
  'xiaomi-pad-6': ['/images/products/xiaomi-pad-6-1.jpg', '/images/products/xiaomi-pad-6-2.jpg'],
  'apple-macbook-air-13-inch-m3': [
    '/images/products/apple-macbook-air-13-inch-m3-1.jpg',
    '/images/products/apple-macbook-air-13-inch-m3-2.png',
  ],
  'hp-pavilion-15': ['/images/products/hp-pavilion-15-1.png'],
  'lenovo-ideapad-slim-5': [
    '/images/products/lenovo-ideapad-slim-5-1.avif',
    '/images/products/lenovo-ideapad-slim-5-2.avif',
  ],
  'apple-watch-series-9': [
    '/images/products/apple-watch-series-9-1.jpg',
    '/images/products/apple-watch-series-9-2.jpg',
  ],
  'samsung-galaxy-watch-6': [
    '/images/products/samsung-galaxy-watch-6-1.jpg',
    '/images/products/samsung-galaxy-watch-6-2.jpg',
  ],
  'oraimo-watch-4-plus': [
    '/images/products/oraimo-watch-4-plus-1.webp',
    '/images/products/oraimo-watch-4-plus-2.webp',
  ],
  'apple-airpods-pro-2nd-generation': [
    '/images/products/apple-airpods-pro-2nd-generation-1.jpg',
    '/images/products/apple-airpods-pro-2nd-generation-2.jpg',
  ],
  'oraimo-freepods-4': [
    '/images/products/oraimo-freepods-4-1.jpg',
    '/images/products/oraimo-freepods-4-2.png',
  ],
  'jbl-tune-buds': [
    '/images/products/jbl-tune-buds-1.png',
    '/images/products/jbl-tune-buds-2.png',
  ],
  'jbl-tune-770nc': [
    '/images/products/jbl-tune-770nc-1.webp',
    '/images/products/jbl-tune-770nc-2.png',
  ],
  'anker-soundcore-life-q30': [
    '/images/products/anker-soundcore-life-q30-1.webp',
    '/images/products/anker-soundcore-life-q30-2.webp',
  ],
  'jbl-flip-6': ['/images/products/jbl-flip-6-1.png', '/images/products/jbl-flip-6-2.png'],
  'anker-soundcore-motion': [
    '/images/products/anker-soundcore-motion-1.jpg',
    '/images/products/anker-soundcore-motion-2.jpg',
  ],
  'anker-65w-gan-charger': [
    '/images/products/anker-65w-gan-charger-1.webp',
    '/images/products/anker-65w-gan-charger-2.webp',
  ],
  'oraimo-33w-fast-charger': [
    '/images/products/oraimo-33w-fast-charger-1.webp',
    '/images/products/oraimo-33w-fast-charger-2.webp',
  ],
  'anker-737-power-bank-24000mah': [
    '/images/products/anker-737-power-bank-24000mah-1.webp',
    '/images/products/anker-737-power-bank-24000mah-2.webp',
  ],
  'oraimo-20000mah-power-bank': [
    '/images/products/oraimo-20000mah-power-bank-1.webp',
    '/images/products/oraimo-20000mah-power-bank-2.webp',
  ],
  'oraimo-usb-c-to-lightning-cable': [
    '/images/products/oraimo-usb-c-to-lightning-cable-1.jpg',
  ],
  'anker-maggo-magnetic-ring': [
    '/images/products/anker-maggo-magnetic-ring-1.avif',
    '/images/products/anker-maggo-magnetic-ring-2.webp',
  ],
  'jbl-quantum-100-gaming-headset': [
    '/images/products/jbl-quantum-100-gaming-headset-1.webp',
    '/images/products/jbl-quantum-100-gaming-headset-2.png',
  ],
  'anker-622-maggo-battery': [
    '/images/products/anker-622-maggo-battery-1.webp',
    '/images/products/anker-622-maggo-battery-2.webp',
  ],
  'xiaomi-smart-band-8': [
    '/images/products/xiaomi-smart-band-8-1.webp',
    '/images/products/xiaomi-smart-band-8-2.png',
  ],
};

export function productImagesFor(product) {
  if (!product) return [];
  if (Array.isArray(product.images) && product.images.length) return product.images;
  const slug = product.slug || '';
  return productImages[slug] || [];
}

export function firstProductImage(product) {
  return productImagesFor(product)[0] || '';
}
