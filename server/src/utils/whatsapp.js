const naira = (value) =>
  `₦${Number(value || 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;

export function buildWhatsAppMessage(order) {
  const lines = [
    'Hello Queen Terry!',
    '',
    'I would like to place an order.',
    '',
    'CUSTOMER DETAILS:',
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Delivery Location: ${[order.customer.address, order.customer.city, order.customer.state]
      .filter(Boolean)
      .join(', ')}`,
    '',
    'ORDER DETAILS:',
    '',
  ];

  order.items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name}${item.color ? ` (${item.color})` : ''}`);
    lines.push(`   Quantity: ${item.quantity}`);
    lines.push(`   Unit price: ${naira(item.price)}`);
    lines.push(`   Line total: ${naira(item.price * item.quantity)}`);
    lines.push('');
  });

  lines.push(`ORDER SUBTOTAL: ${naira(order.subtotal)}`);
  if (order.deliveryFee) {
    lines.push(`DELIVERY: ${naira(order.deliveryFee)}`);
    lines.push(`ORDER TOTAL: ${naira(order.total)}`);
  }
  lines.push(`ORDER REFERENCE: ${order.orderNumber}`);
  lines.push('');
  lines.push('Additional Instructions:');
  lines.push(order.customer.notes?.trim() || 'None');
  lines.push('');
  lines.push('Please confirm product availability and provide delivery and payment details.');
  lines.push('');
  lines.push('Thank you!');

  return lines.join('\n');
}

export function buildWhatsAppUrl(number, message) {
  const digits = String(number || '').replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
