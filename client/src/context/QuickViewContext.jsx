import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import QuickView from '../components/product/QuickView';

const QuickViewContext = createContext(null);

export function QuickViewProvider({ children }) {
  const [product, setProduct] = useState(null);
  const [open, setOpen] = useState(false);

  const openQuickView = useCallback((next) => {
    if (!next) return;
    setProduct(next);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ openQuickView }), [openQuickView]);

  return (
    <QuickViewContext.Provider value={value}>
      {children}
      <QuickView product={product} open={open} onClose={close} />
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const ctx = useContext(QuickViewContext);
  if (!ctx) throw new Error('useQuickView must be used within QuickViewProvider');
  return ctx;
}
