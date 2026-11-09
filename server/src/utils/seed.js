import { pathToFileURL } from 'node:url';
import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { Category } from '../models/Category.js';
import { Brand } from '../models/Brand.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { getSettings } from '../models/Settings.js';
import { toSlug } from './slug.js';

const categories = [
  ['Smartphones', 'Phones & Tablets', 'Flagship and everyday smartphones from leading brands.', 1],
  ['Tablets', 'Phones & Tablets', 'Tablets for work, study, creativity and entertainment.', 2],
  ['Laptops', 'Computers', 'Laptops for productivity, school and creative work.', 3],
  ['Smartwatches', 'Wearables', 'Smartwatches that keep you connected and active.', 4],
  ['Earbuds', 'Audio', 'Wireless earbuds for calls, music and commuting.', 5],
  ['Headphones', 'Audio', 'Over-ear and on-ear headphones with rich sound.', 6],
  ['Speakers', 'Audio', 'Portable and home speakers with bold sound.', 7],
  ['Chargers', 'Accessories', 'Fast chargers and adapters for every device.', 8],
  ['Power Banks', 'Accessories', 'Portable power for long days away from a socket.', 9],
  ['Phone Accessories', 'Accessories', 'Cables, cases, mounts and everyday phone essentials.', 10],
  ['Gaming Accessories', 'Gaming', 'Gaming headsets and gear for mobile and PC play.', 11],
  ['Other Gadgets', 'Gadgets', 'Smart accessories and useful everyday gadgets.', 12],
];

const brands = [
  ['Apple', 'Innovation that feels effortless.'],
  ['Samsung', 'Everyday technology, thoughtfully designed.'],
  ['Tecno', 'Smart technology for everyday life.'],
  ['Infinix', 'Bold performance for the next generation.'],
  ['Xiaomi', 'Innovation for everyone.'],
  ['Oraimo', 'Smart accessories for smarter living.'],
  ['JBL', 'Sound that moves you.'],
  ['Anker', 'Power and charging you can rely on.'],
  ['HP', 'Technology that works the way you do.'],
  ['Lenovo', 'Smarter technology for all.'],
];

const demoImages = {
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

const products = [
  {
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'smartphones',
    price: 1850000,
    compareAtPrice: 1990000,
    featured: true,
    stock: 12,
    salesCount: 48,
    rating: 4.9,
    reviewsCount: 126,
    warranty: '1 year manufacturer warranty',
    description:
      'A pro-grade flagship with a strong titanium build, an advanced camera system and all-day battery life.',
    highlights: ['48MP pro camera system', 'A17 Pro chip', 'USB-C connectivity'],
    colors: [
      { name: 'Natural Titanium', hex: '#B4A99A' },
      { name: 'Blue Titanium', hex: '#4C5B6B' },
      { name: 'Black Titanium', hex: '#2B2B2E' },
    ],
    specs: [
      { label: 'Display', value: '6.7-inch Super Retina XDR OLED' },
      { label: 'Processor', value: 'A17 Pro' },
      { label: 'Storage', value: '256GB' },
      { label: 'Main camera', value: '48MP' },
      { label: 'Operating system', value: 'iOS' },
    ],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    price: 1650000,
    compareAtPrice: 1790000,
    featured: true,
    stock: 9,
    salesCount: 35,
    rating: 4.8,
    reviewsCount: 98,
    warranty: '1 year manufacturer warranty',
    description:
      'A premium flagship with a large flat display, built-in S Pen and a high-resolution camera system.',
    highlights: ['200MP camera', 'Built-in S Pen', 'Galaxy AI features'],
    colors: [
      { name: 'Titanium Gray', hex: '#6E6E73' },
      { name: 'Titanium Violet', hex: '#8A7F94' },
    ],
    specs: [
      { label: 'Display', value: '6.8-inch Dynamic AMOLED 2X' },
      { label: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { label: 'Storage', value: '256GB' },
      { label: 'Main camera', value: '200MP' },
      { label: 'Battery', value: '5000mAh' },
      { label: 'Operating system', value: 'Android' },
    ],
  },
  {
    name: 'Tecno Camon 30 Pro 5G',
    brand: 'Tecno',
    category: 'smartphones',
    price: 420000,
    compareAtPrice: 465000,
    stock: 20,
    salesCount: 62,
    rating: 4.5,
    reviewsCount: 41,
    warranty: '1 year manufacturer warranty',
    description:
      'A 5G smartphone built for photography and entertainment, with a large AMOLED display and fast charging.',
    highlights: ['5G connectivity', 'AMOLED display', 'Fast charging support'],
    colors: [
      { name: 'Iceland Basaltic Dark', hex: '#2E2E33' },
      { name: 'Alps Snow Silver', hex: '#C9CACD' },
    ],
    specs: [
      { label: 'Display', value: '6.78-inch AMOLED' },
      { label: 'Network', value: '5G' },
      { label: 'Storage', value: '256GB' },
      { label: 'Battery', value: '5000mAh' },
      { label: 'Operating system', value: 'Android' },
    ],
  },
  {
    name: 'Infinix Note 40 Pro',
    brand: 'Infinix',
    category: 'smartphones',
    price: 310000,
    compareAtPrice: 345000,
    stock: 18,
    salesCount: 74,
    rating: 4.4,
    reviewsCount: 57,
    warranty: '1 year manufacturer warranty',
    description:
      'A feature-rich smartphone with a smooth display, a high-resolution camera and all-day battery capacity.',
    highlights: ['108MP camera', '120Hz display', '45W fast charging'],
    colors: [
      { name: 'Obsidian Black', hex: '#1B1B1E' },
      { name: 'Titan Gold', hex: '#C2A36B' },
    ],
    specs: [
      { label: 'Display', value: '6.78-inch AMOLED, 120Hz' },
      { label: 'Main camera', value: '108MP' },
      { label: 'Storage', value: '256GB' },
      { label: 'Battery', value: '5000mAh' },
      { label: 'Operating system', value: 'Android' },
    ],
  },
  {
    name: 'Xiaomi Redmi Note 13 Pro',
    brand: 'Xiaomi',
    category: 'smartphones',
    price: 280000,
    compareAtPrice: 315000,
    stock: 25,
    salesCount: 58,
    rating: 4.5,
    reviewsCount: 63,
    warranty: '1 year manufacturer warranty',
    description:
      'A balanced everyday phone with a sharp AMOLED display, a 200MP main camera and quick charging.',
    highlights: ['200MP main camera', 'AMOLED display', '67W turbo charging'],
    colors: [
      { name: 'Midnight Black', hex: '#191A1D' },
      { name: 'Ocean Teal', hex: '#2C6F73' },
    ],
    specs: [
      { label: 'Display', value: '6.67-inch AMOLED' },
      { label: 'Main camera', value: '200MP' },
      { label: 'Storage', value: '256GB' },
      { label: 'Battery', value: '5100mAh' },
      { label: 'Operating system', value: 'Android' },
    ],
  },
  {
    name: 'Samsung Galaxy A55 5G',
    brand: 'Samsung',
    category: 'smartphones',
    price: 420000,
    compareAtPrice: 450000,
    stock: 22,
    salesCount: 51,
    rating: 4.6,
    reviewsCount: 39,
    warranty: '1 year manufacturer warranty',
    description:
      'A reliable mid-range Galaxy with a vivid display, dependable battery life and 5G connectivity.',
    highlights: ['5G connectivity', 'Super AMOLED display', '50MP camera'],
    colors: [
      { name: 'Awesome Navy', hex: '#2B3A55' },
      { name: 'Awesome Iceblue', hex: '#B7D3E8' },
    ],
    specs: [
      { label: 'Display', value: '6.6-inch Super AMOLED, 120Hz' },
      { label: 'Network', value: '5G' },
      { label: 'Storage', value: '128GB' },
      { label: 'Main camera', value: '50MP' },
      { label: 'Battery', value: '5000mAh' },
    ],
  },
  {
    name: 'Apple iPad Air (M2)',
    brand: 'Apple',
    category: 'tablets',
    price: 950000,
    compareAtPrice: 1020000,
    featured: true,
    stock: 10,
    salesCount: 28,
    rating: 4.8,
    reviewsCount: 44,
    warranty: '1 year manufacturer warranty',
    description:
      'A thin, light and powerful tablet for creative work, study and entertainment on the move.',
    highlights: ['M2 chip', 'Liquid Retina display', 'Works with Apple Pencil'],
    colors: [
      { name: 'Space Grey', hex: '#5B5B5F' },
      { name: 'Blue', hex: '#A7C4D8' },
    ],
    specs: [
      { label: 'Display', value: '11-inch Liquid Retina' },
      { label: 'Processor', value: 'Apple M2' },
      { label: 'Storage', value: '128GB' },
      { label: 'Operating system', value: 'iPadOS' },
    ],
  },
  {
    name: 'Samsung Galaxy Tab S9 FE',
    brand: 'Samsung',
    category: 'tablets',
    price: 680000,
    stock: 14,
    salesCount: 19,
    rating: 4.6,
    reviewsCount: 21,
    warranty: '1 year manufacturer warranty',
    description:
      'A capable tablet with an included S Pen, a clear display and long battery life for daily use.',
    highlights: ['S Pen included', 'Large display', 'Long battery life'],
    colors: [
      { name: 'Graphite', hex: '#3B3B3F' },
      { name: 'Mint', hex: '#BFD8CC' },
    ],
    specs: [
      { label: 'Display', value: '10.9-inch' },
      { label: 'Storage', value: '128GB' },
      { label: 'Battery', value: '8000mAh' },
      { label: 'Operating system', value: 'Android' },
    ],
  },
  {
    name: 'Lenovo Tab P12',
    brand: 'Lenovo',
    category: 'tablets',
    price: 390000,
    stock: 16,
    salesCount: 12,
    rating: 4.4,
    reviewsCount: 11,
    warranty: '1 year manufacturer warranty',
    description:
      'A large-screen tablet for streaming, reading and productivity, with an included pen.',
    highlights: ['12.7-inch 3K display', 'Pen included', 'Quad speakers'],
    colors: [{ name: 'Storm Grey', hex: '#585B60' }],
    specs: [
      { label: 'Display', value: '12.7-inch 3K' },
      { label: 'Memory', value: '8GB RAM' },
      { label: 'Storage', value: '128GB' },
      { label: 'Operating system', value: 'Android' },
    ],
  },
  {
    name: 'Xiaomi Pad 6',
    brand: 'Xiaomi',
    category: 'tablets',
    price: 380000,
    compareAtPrice: 420000,
    stock: 19,
    salesCount: 22,
    rating: 4.5,
    reviewsCount: 17,
    warranty: '1 year manufacturer warranty',
    description:
      'A slim tablet with a smooth high-refresh display, ideal for entertainment and light productivity.',
    highlights: ['144Hz display', 'Slim metal body', 'Long battery life'],
    colors: [
      { name: 'Gravity Gray', hex: '#6C6F73' },
      { name: 'Mist Blue', hex: '#9FB6C9' },
    ],
    specs: [
      { label: 'Display', value: '11-inch, 144Hz' },
      { label: 'Processor', value: 'Snapdragon 870' },
      { label: 'Storage', value: '128GB' },
      { label: 'Operating system', value: 'Android' },
    ],
  },
  {
    name: 'Apple MacBook Air 13-inch (M3)',
    brand: 'Apple',
    category: 'laptops',
    price: 1750000,
    compareAtPrice: 1890000,
    featured: true,
    stock: 5,
    salesCount: 24,
    rating: 4.9,
    reviewsCount: 52,
    warranty: '1 year manufacturer warranty',
    description:
      'A thin and quiet laptop with the M3 chip, a bright display and excellent battery life.',
    highlights: ['Apple M3 chip', 'Liquid Retina display', 'Silent fanless design'],
    colors: [
      { name: 'Midnight', hex: '#2E3440' },
      { name: 'Silver', hex: '#D3D4D6' },
    ],
    specs: [
      { label: 'Display', value: '13.6-inch Liquid Retina' },
      { label: 'Processor', value: 'Apple M3' },
      { label: 'Memory', value: '8GB unified memory' },
      { label: 'Storage', value: '256GB SSD' },
      { label: 'Operating system', value: 'macOS' },
    ],
  },
  {
    name: 'HP Pavilion 15',
    brand: 'HP',
    category: 'laptops',
    price: 780000,
    stock: 3,
    salesCount: 31,
    rating: 4.3,
    reviewsCount: 27,
    warranty: '1 year manufacturer warranty',
    description:
      'A dependable everyday laptop for work and school, with a full-size keyboard and clear display.',
    highlights: ['Full HD display', 'Fast SSD storage', 'Windows 11'],
    colors: [{ name: 'Natural Silver', hex: '#C2C3C6' }],
    specs: [
      { label: 'Display', value: '15.6-inch Full HD' },
      { label: 'Processor', value: 'Intel Core i5' },
      { label: 'Memory', value: '8GB RAM' },
      { label: 'Storage', value: '512GB SSD' },
      { label: 'Operating system', value: 'Windows 11' },
    ],
  },
  {
    name: 'Lenovo IdeaPad Slim 5',
    brand: 'Lenovo',
    category: 'laptops',
    price: 720000,
    compareAtPrice: 760000,
    stock: 7,
    salesCount: 18,
    rating: 4.4,
    reviewsCount: 15,
    warranty: '1 year manufacturer warranty',
    description:
      'A slim, practical laptop with dependable performance for daily productivity and study.',
    highlights: ['Slim chassis', 'Full HD display', 'Fast SSD storage'],
    colors: [{ name: 'Cloud Grey', hex: '#8A8D91' }],
    specs: [
      { label: 'Display', value: '15.6-inch Full HD' },
      { label: 'Processor', value: 'AMD Ryzen 5' },
      { label: 'Memory', value: '8GB RAM' },
      { label: 'Storage', value: '512GB SSD' },
      { label: 'Operating system', value: 'Windows 11' },
    ],
  },
  {
    name: 'Apple Watch Series 9',
    brand: 'Apple',
    category: 'smartwatches',
    price: 650000,
    compareAtPrice: 690000,
    featured: true,
    stock: 13,
    salesCount: 33,
    rating: 4.8,
    reviewsCount: 47,
    warranty: '1 year manufacturer warranty',
    description:
      'A connected smartwatch with a bright always-on display, health insights and everyday convenience.',
    highlights: ['Always-On Retina display', 'Health and fitness tracking', 'GPS'],
    colors: [
      { name: 'Midnight Aluminium', hex: '#2B2D33' },
      { name: 'Silver Aluminium', hex: '#D3D4D6' },
    ],
    specs: [
      { label: 'Case size', value: '45mm' },
      { label: 'Display', value: 'Always-On Retina' },
      { label: 'Chip', value: 'S9 SiP' },
      { label: 'Connectivity', value: 'GPS' },
    ],
  },
  {
    name: 'Samsung Galaxy Watch 6',
    brand: 'Samsung',
    category: 'smartwatches',
    price: 420000,
    compareAtPrice: 460000,
    stock: 4,
    salesCount: 26,
    rating: 4.5,
    reviewsCount: 29,
    warranty: '1 year manufacturer warranty',
    description:
      'A stylish smartwatch with detailed health tracking, sleep insights and a bright display.',
    highlights: ['AMOLED display', 'Sleep coaching', 'GPS tracking'],
    colors: [
      { name: 'Graphite', hex: '#3A3A3E' },
      { name: 'Gold', hex: '#C6A97C' },
    ],
    specs: [
      { label: 'Case size', value: '40mm' },
      { label: 'Display', value: 'Super AMOLED' },
      { label: 'Connectivity', value: 'GPS' },
      { label: 'Operating system', value: 'Wear OS' },
    ],
  },
  {
    name: 'Oraimo Watch 4 Plus',
    brand: 'Oraimo',
    category: 'smartwatches',
    price: 65000,
    compareAtPrice: 78000,
    stock: 40,
    salesCount: 120,
    rating: 4.3,
    reviewsCount: 88,
    warranty: '6 months warranty',
    description:
      'A value-focused smartwatch with a bright AMOLED screen, Bluetooth calling and long battery life.',
    highlights: ['Bluetooth calling', 'AMOLED display', 'Multiple sports modes'],
    colors: [
      { name: 'Midnight Black', hex: '#1E1F23' },
      { name: 'Silver', hex: '#BFC1C4' },
    ],
    specs: [
      { label: 'Display', value: '1.78-inch AMOLED' },
      { label: 'Calling', value: 'Bluetooth calling' },
      { label: 'Battery', value: 'Up to 7 days typical use' },
    ],
  },
  {
    name: 'Apple AirPods Pro (2nd generation)',
    brand: 'Apple',
    category: 'earbuds',
    price: 380000,
    compareAtPrice: 410000,
    featured: true,
    stock: 16,
    salesCount: 88,
    rating: 4.8,
    reviewsCount: 102,
    warranty: '1 year manufacturer warranty',
    description:
      'Compact wireless earbuds with active noise cancellation, transparency mode and a USB-C case.',
    highlights: ['Active Noise Cancellation', 'Adaptive Audio', 'USB-C charging case'],
    colors: [{ name: 'White', hex: '#F2F2F2' }],
    specs: [
      { label: 'Type', value: 'In-ear wireless earbuds' },
      { label: 'Noise control', value: 'Active Noise Cancellation' },
      { label: 'Charging', value: 'USB-C' },
    ],
  },
  {
    name: 'Oraimo FreePods 4',
    brand: 'Oraimo',
    category: 'earbuds',
    price: 28000,
    compareAtPrice: 35000,
    stock: 60,
    salesCount: 210,
    rating: 4.3,
    reviewsCount: 164,
    warranty: '6 months warranty',
    description:
      'Affordable wireless earbuds with noise cancellation and a long-lasting charging case.',
    highlights: ['Active Noise Cancellation', 'Long playtime', 'Clear calls'],
    colors: [
      { name: 'Black', hex: '#1C1D21' },
      { name: 'White', hex: '#F0F0F0' },
    ],
    specs: [
      { label: 'Type', value: 'In-ear wireless earbuds' },
      { label: 'Noise control', value: 'Active Noise Cancellation' },
      { label: 'Connectivity', value: 'Bluetooth' },
    ],
  },
  {
    name: 'JBL Tune Buds',
    brand: 'JBL',
    category: 'earbuds',
    price: 75000,
    compareAtPrice: 85000,
    stock: 30,
    salesCount: 64,
    rating: 4.4,
    reviewsCount: 48,
    warranty: '1 year manufacturer warranty',
    description:
      'True wireless earbuds with active noise cancellation and JBL signature sound.',
    highlights: ['Active Noise Cancellation', 'JBL Pure Bass sound', 'Long battery life'],
    colors: [
      { name: 'Black', hex: '#191A1E' },
      { name: 'White', hex: '#EFEFEF' },
      { name: 'Purple', hex: '#8C7BB5' },
    ],
    specs: [
      { label: 'Type', value: 'True wireless earbuds' },
      { label: 'Noise control', value: 'Active Noise Cancellation' },
      { label: 'Connectivity', value: 'Bluetooth' },
    ],
  },
  {
    name: 'JBL Tune 770NC',
    brand: 'JBL',
    category: 'headphones',
    price: 120000,
    compareAtPrice: 135000,
    stock: 15,
    salesCount: 37,
    rating: 4.5,
    reviewsCount: 33,
    warranty: '1 year manufacturer warranty',
    description:
      'Over-ear wireless headphones with adaptive noise cancellation and long battery life.',
    highlights: ['Adaptive Noise Cancellation', 'JBL Pure Bass sound', 'Long battery life'],
    colors: [
      { name: 'Black', hex: '#1A1B1F' },
      { name: 'White', hex: '#EDEDED' },
      { name: 'Blue', hex: '#3D5A80' },
    ],
    specs: [
      { label: 'Type', value: 'Over-ear wireless headphones' },
      { label: 'Noise control', value: 'Adaptive Noise Cancellation' },
      { label: 'Connectivity', value: 'Bluetooth' },
    ],
  },
  {
    name: 'Anker Soundcore Life Q30',
    brand: 'Anker',
    category: 'headphones',
    price: 85000,
    stock: 24,
    salesCount: 54,
    rating: 4.4,
    reviewsCount: 71,
    warranty: '18 months warranty',
    description:
      'Comfortable over-ear headphones with hybrid noise cancellation and a long playtime.',
    highlights: ['Hybrid ANC', 'Long playtime', 'Foldable design'],
    colors: [
      { name: 'Black', hex: '#1B1C20' },
      { name: 'Blue', hex: '#4B6E8C' },
    ],
    specs: [
      { label: 'Type', value: 'Over-ear wireless headphones' },
      { label: 'Noise control', value: 'Hybrid Active Noise Cancellation' },
      { label: 'Connectivity', value: 'Bluetooth' },
    ],
  },
  {
    name: 'JBL Flip 6',
    brand: 'JBL',
    category: 'speakers',
    price: 110000,
    compareAtPrice: 125000,
    featured: true,
    stock: 18,
    salesCount: 70,
    rating: 4.6,
    reviewsCount: 59,
    warranty: '1 year manufacturer warranty',
    description:
      'A portable Bluetooth speaker with bold sound, a rugged build and water resistance.',
    highlights: ['JBL Original Pro Sound', 'IP67 water and dust resistance', 'Portable design'],
    colors: [
      { name: 'Black', hex: '#191A1D' },
      { name: 'Blue', hex: '#38618C' },
      { name: 'Red', hex: '#A3333A' },
    ],
    specs: [
      { label: 'Type', value: 'Portable Bluetooth speaker' },
      { label: 'Water resistance', value: 'IP67' },
      { label: 'Connectivity', value: 'Bluetooth' },
    ],
  },
  {
    name: 'Anker Soundcore Motion+',
    brand: 'Anker',
    category: 'speakers',
    price: 135000,
    stock: 12,
    salesCount: 23,
    rating: 4.5,
    reviewsCount: 26,
    warranty: '18 months warranty',
    description:
      'A high-output portable speaker with detailed sound and a water-resistant body.',
    highlights: ['High-resolution audio', 'IPX7 water resistance', 'Long battery life'],
    colors: [{ name: 'Black', hex: '#18191D' }],
    specs: [
      { label: 'Type', value: 'Portable Bluetooth speaker' },
      { label: 'Water resistance', value: 'IPX7' },
      { label: 'Connectivity', value: 'Bluetooth' },
    ],
  },
  {
    name: 'Anker 65W GaN Charger',
    brand: 'Anker',
    category: 'chargers',
    price: 45000,
    compareAtPrice: 52000,
    stock: 35,
    salesCount: 96,
    rating: 4.7,
    reviewsCount: 64,
    warranty: '18 months warranty',
    description:
      'A compact multi-port GaN charger for phones, tablets and laptops, with fast charging support.',
    highlights: ['65W output', 'GaN technology', 'Compact travel design'],
    colors: [{ name: 'Black', hex: '#1A1B1F' }],
    specs: [
      { label: 'Power', value: '65W' },
      { label: 'Ports', value: 'USB-C and USB-A' },
      { label: 'Technology', value: 'GaN' },
    ],
  },
  {
    name: 'Oraimo 33W Fast Charger',
    brand: 'Oraimo',
    category: 'chargers',
    price: 12500,
    compareAtPrice: 15000,
    stock: 80,
    salesCount: 240,
    rating: 4.4,
    reviewsCount: 132,
    warranty: '6 months warranty',
    description:
      'An affordable fast charger designed for everyday phone charging at home or in the office.',
    highlights: ['33W fast charging', 'Compact design', 'USB-C output'],
    colors: [{ name: 'White', hex: '#F1F1F1' }],
    specs: [
      { label: 'Power', value: '33W' },
      { label: 'Port', value: 'USB-C' },
    ],
  },
  {
    name: 'Anker 737 Power Bank (24,000mAh)',
    brand: 'Anker',
    category: 'power-banks',
    price: 95000,
    compareAtPrice: 105000,
    stock: 15,
    salesCount: 42,
    rating: 4.7,
    reviewsCount: 38,
    warranty: '18 months warranty',
    description:
      'A high-capacity power bank with fast output for laptops and phones, plus a digital display.',
    highlights: ['24,000mAh capacity', 'High-speed charging', 'Digital display'],
    colors: [{ name: 'Black', hex: '#1A1B1F' }],
    specs: [
      { label: 'Capacity', value: '24,000mAh' },
      { label: 'Output', value: 'Fast charging' },
      { label: 'Ports', value: 'USB-C and USB-A' },
    ],
  },
  {
    name: 'Oraimo 20,000mAh Power Bank',
    brand: 'Oraimo',
    category: 'power-banks',
    price: 32000,
    compareAtPrice: 38000,
    stock: 45,
    salesCount: 150,
    rating: 4.4,
    reviewsCount: 110,
    warranty: '6 months warranty',
    description:
      'A dependable everyday power bank with enough capacity to keep multiple devices charged.',
    highlights: ['20,000mAh capacity', 'Dual output', 'Fast charging support'],
    colors: [
      { name: 'Black', hex: '#1B1C20' },
      { name: 'White', hex: '#F0F0F0' },
    ],
    specs: [
      { label: 'Capacity', value: '20,000mAh' },
      { label: 'Output', value: 'Dual output' },
      { label: 'Ports', value: 'USB-A and USB-C' },
    ],
  },
  {
    name: 'Oraimo USB-C to Lightning Cable',
    brand: 'Oraimo',
    category: 'phone-accessories',
    price: 8500,
    compareAtPrice: 10000,
    stock: 100,
    salesCount: 300,
    rating: 4.4,
    reviewsCount: 205,
    warranty: '3 months warranty',
    description:
      'A durable everyday charging cable for compatible Apple devices, built for daily use.',
    highlights: ['USB-C to Lightning', 'Durable build', 'Fast charging support'],
    colors: [{ name: 'White', hex: '#F1F1F1' }],
    specs: [
      { label: 'Connector', value: 'USB-C to Lightning' },
      { label: 'Length', value: '1m' },
    ],
  },
  {
    name: 'Anker MagGo Magnetic Ring',
    brand: 'Anker',
    category: 'phone-accessories',
    price: 15000,
    stock: 50,
    salesCount: 61,
    rating: 4.5,
    reviewsCount: 22,
    warranty: '18 months warranty',
    description:
      'A magnetic ring accessory that adds a comfortable grip and magnetic mounting to compatible phones.',
    highlights: ['Magnetic attachment', 'Comfortable grip', 'Slim profile'],
    colors: [{ name: 'Black', hex: '#1A1B1F' }],
    specs: [
      { label: 'Compatibility', value: 'Magnetic phone mounting' },
      { label: 'Type', value: 'Phone grip ring' },
    ],
  },
  {
    name: 'JBL Quantum 100 Gaming Headset',
    brand: 'JBL',
    category: 'gaming-accessories',
    price: 55000,
    compareAtPrice: 62000,
    stock: 20,
    salesCount: 45,
    rating: 4.3,
    reviewsCount: 36,
    warranty: '1 year manufacturer warranty',
    description:
      'A lightweight wired gaming headset with a detachable microphone and JBL sound.',
    highlights: ['Detachable microphone', 'Lightweight design', 'Wired connectivity'],
    colors: [
      { name: 'Black', hex: '#1A1B1F' },
      { name: 'White', hex: '#EFEFEF' },
    ],
    specs: [
      { label: 'Type', value: 'Wired gaming headset' },
      { label: 'Microphone', value: 'Detachable boom mic' },
      { label: 'Connectivity', value: '3.5mm' },
    ],
  },
  {
    name: 'Anker 622 MagGo Battery',
    brand: 'Anker',
    category: 'other-gadgets',
    price: 65000,
    stock: 16,
    salesCount: 34,
    rating: 4.5,
    reviewsCount: 27,
    warranty: '18 months warranty',
    description:
      'A compact magnetic battery pack with a foldable stand for convenient on-the-go charging.',
    highlights: ['5,000mAh capacity', 'Magnetic attachment', 'Foldable stand'],
    colors: [
      { name: 'Black', hex: '#1A1B1F' },
      { name: 'White', hex: '#F0F0F0' },
    ],
    specs: [
      { label: 'Capacity', value: '5,000mAh' },
      { label: 'Attachment', value: 'Magnetic' },
      { label: 'Charging', value: 'Wireless' },
    ],
  },
  {
    name: 'Xiaomi Smart Band 8',
    brand: 'Xiaomi',
    category: 'other-gadgets',
    price: 35000,
    compareAtPrice: 42000,
    stock: 38,
    salesCount: 95,
    rating: 4.5,
    reviewsCount: 82,
    warranty: '6 months warranty',
    description:
      'A lightweight fitness band with a bright display, activity tracking and long battery life.',
    highlights: ['AMOLED display', 'Fitness tracking', 'Long battery life'],
    colors: [
      { name: 'Black', hex: '#1B1C20' },
      { name: 'Gold', hex: '#C7A97C' },
    ],
    specs: [
      { label: 'Display', value: '1.62-inch AMOLED' },
      { label: 'Battery', value: 'Up to 16 days typical use' },
      { label: 'Fitness', value: 'Multiple activity modes' },
    ],
  },
];

export async function seedDatabase({ fresh = false, includeDemo = env.seedDemo } = {}) {
  const categoryMap = new Map();
  for (const [name, group, description, order] of categories) {
    const slug = toSlug(name);
    const doc = await Category.findOneAndUpdate(
      { slug },
      { name, slug, group, description, order, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    categoryMap.set(slug, doc);
  }
  console.log(`[seed] Categories ready: ${categoryMap.size}`);

  const brandMap = new Map();
  for (const [name, tagline] of brands) {
    const slug = toSlug(name);
    const doc = await Brand.findOneAndUpdate(
      { slug },
      { name, slug, tagline, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    brandMap.set(name, doc);
  }
  console.log(`[seed] Brands ready: ${brandMap.size}`);

  let admin = await User.findOne({ email: env.admin.email });
  if (!admin) {
    admin = await User.create({
      name: env.admin.name,
      email: env.admin.email,
      phone: env.admin.phone,
      password: env.admin.password,
      role: 'admin',
    });
    console.log(`[seed] Admin created: ${admin.email}`);
  } else {
    if (admin.role !== 'admin') {
      admin.role = 'admin';
      await admin.save({ validateModifiedOnly: true });
    }
    console.log(`[seed] Admin already exists: ${admin.email} (password unchanged)`);
  }
  console.log(`[seed] Admin password comes from ADMIN_PASSWORD in server/.env`);

  const settings = await getSettings();
  if (env.whatsappNumber) settings.whatsappNumber = env.whatsappNumber;
  if (!settings.supportPhone) settings.supportPhone = env.admin.phone;
  await settings.save();

  if (includeDemo) {
    const existing = await Product.countDocuments();
    if (existing === 0 || fresh) {
      if (fresh) await Product.deleteMany({ isDemo: true });
      const docs = products
        .map((item) => {
          const category = categoryMap.get(item.category);
          const brand = brandMap.get(item.brand);
          if (!category || !brand) {
            console.warn(`[seed] Skipped ${item.name}: missing category or brand`);
            return null;
          }
          return {
            ...item,
            brand: brand._id,
            category: category._id,
            slug: toSlug(item.name),
            images: demoImages[toSlug(item.name)] || [],
            isDemo: true,
            isActive: true,
            sku: `QT-${toSlug(item.name).slice(0, 16).toUpperCase()}`,
            description: `${item.description} (Demo catalogue listing — confirm current price, availability and specifications with our team.)`,
          };
        })
        .filter(Boolean);

      await Product.insertMany(docs);
      console.log(`[seed] Demo products inserted: ${docs.length}`);
    } else {
      console.log(
        `[seed] ${existing} products already exist. Skipping demo catalogue. Run "npm run seed -- --fresh" to reseed demo products.`
      );
    }
  } else {
    console.log('[seed] SEED_DEMO=false - skipping demo products.');
  }

  return { categories: categoryMap.size, brands: brandMap.size };
}

async function run() {
  await connectDB();
  await seedDatabase({ fresh: process.argv.includes('--fresh') });
  await disconnectDB();
  console.log('[seed] Done.');
  process.exit(0);
}

const isDirectRun = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;

if (isDirectRun) {
  run().catch(async (err) => {
    console.error('[seed] Failed:', err);
    await disconnectDB().catch(() => {});
    process.exit(1);
  });
}
