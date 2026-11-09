import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'qt_wishlist_v1';

function read() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(read);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const toggle = useCallback(
    (productId) => {
      setIds((prev) => {
        if (prev.includes(productId)) {
          toast('Removed from wishlist', 'info');
          return prev.filter((id) => id !== productId);
        }
        toast('Saved to wishlist');
        return [...prev, productId];
      });
    },
    [toast]
  );

  const remove = useCallback((productId) => {
    setIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const has = useCallback((productId) => ids.includes(productId), [ids]);

  const value = useMemo(
    () => ({ ids, count: ids.length, toggle, remove, has }),
    [ids, toggle, remove, has]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
