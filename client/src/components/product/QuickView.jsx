import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Heart, MessageCircle, ShoppingBag, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import { cn, discountPercent, formatNaira } from '../../lib/format';
import { buildWhatsAppUrl, productInquiryMessage } from '../../lib/whatsapp';
import Modal from '../ui/Modal';
import Price from '../ui/Price';
import Rating from '../ui/Rating';
import QuantityStepper from '../ui/QuantityStepper';
import ProductImage from './ProductImage';

export default function QuickView({ product, open, onClose }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { whatsappNumber } = useStore();
  const navigate = useNavigate();
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) return;
    setColor(product.colors?.[0]?.name || '');
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const stock = Number(product.stock) || 0;
  const outOfStock = stock <= 0;
  const saved = has(product._id);
  const discount = discountPercent(product);
  const whatsappHref = buildWhatsAppUrl(
    whatsappNumber,
    productInquiryMessage(product, { quantity, color })
  );

  const handleAdd = () => {
    addItem(product, { quantity, color });
    onClose();
  };

  const handleBuyNow = () => {
    addItem(product, { quantity, color, silent: true });
    onClose();
    navigate('/checkout');
  };

  return (
    <Modal open={open} onClose={onClose} panelClassName="max-w-3xl">
      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          to={`/product/${product.slug}`}
          onClick={onClose}
          className="group relative aspect-square overflow-hidden rounded-2xl bg-mist"
        >
          <ProductImage
            product={product}
            className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
          />
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              -{discount}%
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-col">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
            {product.brand?.name || product.brand || 'Queen Terry'}
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold leading-tight tracking-[-0.02em] text-ink">
            {product.name}
          </h3>

          <Rating value={product.rating} count={product.reviewsCount} className="mt-2" />

          <div className="mt-4">
            <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" showDiscount />
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs font-medium">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                outOfStock ? 'bg-rose-500' : stock <= 5 ? 'bg-amber-500' : 'bg-emerald-500'
              )}
            />
            <span className={outOfStock ? 'text-rose-600' : 'text-smoke'}>
              {outOfStock ? 'Out of stock' : stock <= 5 ? `Only ${stock} left` : 'In stock'}
            </span>
          </div>

          {product.colors?.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">Colour</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((option) => {
                  const selected = color === option.name;
                  return (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() => setColor(option.name)}
                      className={cn(
                        'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition',
                        selected
                          ? 'border-ink bg-ink text-white'
                          : 'border-line text-ink hover:border-ink/40'
                      )}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: option.hex }}
                      />
                      {option.name}
                      {selected && <Check className="h-3 w-3" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={Math.max(1, stock)}
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              className="btn-primary flex-1 py-3"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to cart
            </button>
          </div>

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="btn-accent py-3 text-xs"
            >
              <Zap className="h-4 w-4" />
              Buy now
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="btn inline-flex items-center justify-center gap-2 rounded-full border border-[#25D366] bg-[#25D366]/10 py-3 text-xs font-semibold text-ink transition hover:bg-[#25D366]/20"
            >
              <MessageCircle className="h-4 w-4 text-[#128C4A]" />
              Ask on WhatsApp
            </a>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-5">
            <button
              type="button"
              onClick={() => toggle(product._id)}
              className={cn(
                'inline-flex items-center gap-1.5 text-xs font-semibold transition',
                saved ? 'text-accent' : 'text-smoke hover:text-ink'
              )}
            >
              <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
              {saved ? 'Saved' : 'Save'}
            </button>
            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="text-xs font-semibold text-accent hover:underline"
            >
              View full details →
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
