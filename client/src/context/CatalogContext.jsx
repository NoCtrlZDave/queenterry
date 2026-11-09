import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [categoryData, brandData] = await Promise.all([api('/categories'), api('/brands')]);
      setCategories(categoryData.items || []);
      setBrands(brandData.items || []);
    } catch {
      // The rest of the storefront can still render from fallbacks.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      categories,
      brands,
      loading,
      refresh,
      categoryBySlug: (slug) => categories.find((c) => c.slug === slug),
    }),
    [categories, brands, loading, refresh]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
