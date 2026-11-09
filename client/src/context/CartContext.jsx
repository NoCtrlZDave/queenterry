import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { firstProductImage } from '../lib/productImages';
import { useToast } from './ToastContext';

const CartContext = createContext(null);
const STORAGE_KEY = 'qt_cart_v1';

function read() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

const lineKey = (productId, color = '') => `${productId}::${color || ''}`;

export function CartProvider({ children }) {
  const [items, setItems] = useState(read);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback(
    (product, { quantity = 1, color = '', silent = false } = {}) => {
      if (!product?._id) return;
      const stock = Number(product.stock ?? 0);
      if (stock <= 0) {
        toast('This product is currently out of stock', 'error');
        return;
      }

      setItems((prev) => {
        const key = lineKey(product._id, color);
        const index = prev.findIndex((item) => lineKey(item.productId, item.color) === key);
        if (index > -1) {
          const next = [...prev];
          const line = next[index];
          next[index] = {
            ...line,
            quantity: Math.min(stock, line.quantity + quantity),
          };
          return next;
        }
        return [
          ...prev,
          {
            productId: product._id,
            slug: product.slug,
            name: product.name,
            brand: product.brand?.name || product.brand || '',
            price: product.price,
            image: firstProductImage(product),
            category: product.category?.slug || '',
            color: color || '',
            quantity: Math.min(stock, Math.max(1, quantity)),
            stock,
          },
        ];
      });

      if (!silent) {
        toast(`${product.name} added to cart`);
        setDrawerOpen(true);
      }
    },
    [toast]
  );

  const updateQty = useCallback((productId, color, quantity) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId !== productId || (item.color || '') !== (color || '')) return item;
        const max = item.stock || 99;
        return { ...item, quantity: Math.min(max, Math.max(1, Number(quantity) || 1)) };
      })
    );
  }, []);

  const removeItem = useCallback((productId, color) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && (item.color || '') === (color || ''))
      )
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      addItem,
      updateQty,
      removeItem,
      clear,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [items, count, subtotal, addItem, updateQty, removeItem, clear, drawerOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
