import { formatNaira } from './format';

export const DEFAULT_WHATSAPP = '2349025068558';

export function buildWhatsAppUrl(number, message) {
  const digits = String(number || DEFAULT_WHATSAPP).replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function productInquiryMessage(product, { quantity = 1, color = '' } = {}) {
  return [
    'Hello Queen Terry!',
    '',
    "I'm interested in this product and would like more information.",
    '',
    `PRODUCT: ${product.name}`,
    `Brand: ${product.brand?.name || product.brand || '—'}`,
    color ? `Colour: ${color}` : null,
    `Quantity: ${quantity}`,
    `Price: ${formatNaira(product.price)}`,
    product.compareAtPrice > product.price
      ? `Listed offer: ${formatNaira(product.price)} (was ${formatNaira(product.compareAtPrice)})`
      : null,
    '',
    'Please confirm availability, delivery and payment details.',
    '',
    'Thank you!',
  ]
    .filter((line) => line !== null)
    .join('\n');
}
