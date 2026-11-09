import crypto from 'node:crypto';

export function generateOrderNumber() {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `QT-${stamp}-${random}`;
}
