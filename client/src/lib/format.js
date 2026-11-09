export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatNaira(value) {
  const number = Number(value || 0);
  return `₦${number.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

export function formatDate(value, options = {}) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  });
}

export function formatDateTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const ORDER_STATUS_META = {
  awaiting_whatsapp: {
    label: 'Awaiting WhatsApp Confirmation',
    short: 'Awaiting confirmation',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  confirmed: {
    label: 'Confirmed',
    short: 'Confirmed',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  processing: {
    label: 'Processing',
    short: 'Processing',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  shipped: {
    label: 'Shipped',
    short: 'Shipped',
    className: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  delivered: {
    label: 'Delivered',
    short: 'Delivered',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  cancelled: {
    label: 'Cancelled',
    short: 'Cancelled',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

export function discountPercent(product) {
  if (!product?.compareAtPrice || product.compareAtPrice <= product.price) return 0;
  return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
