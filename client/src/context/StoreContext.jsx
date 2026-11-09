import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { DEFAULT_WHATSAPP } from '../lib/whatsapp';

const StoreContext = createContext(null);

const fallbackSettings = {
  storeName: 'Queen Terry',
  tagline: 'Tech that moves you.',
  whatsappNumber: DEFAULT_WHATSAPP,
  supportEmail: '',
  supportPhone: '',
  address: '',
  openingHours: '',
  announcements: [
    'Order directly on WhatsApp — fast, simple and personal',
    'New arrivals across smartphones, audio and accessories',
    'Quality electronics from brands you trust',
  ],
  socials: { instagram: '', facebook: '', x: '', tiktok: '' },
  delivery: { fee: 0, freeThreshold: 0, info: '' },
};

export function StoreProvider({ children }) {
  const [settings, setSettings] = useState(fallbackSettings);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await api('/settings');
      setSettings((prev) => ({
        ...prev,
        ...data.settings,
        socials: { ...prev.socials, ...(data.settings.socials || {}) },
        delivery: { ...prev.delivery, ...(data.settings.delivery || {}) },
        announcements: data.settings.announcements?.length
          ? data.settings.announcements
          : prev.announcements,
      }));
    } catch {
      // Keep sensible fallbacks when the API is unreachable.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      settings,
      loading,
      refresh,
      whatsappNumber: settings.whatsappNumber || fallbackSettings.whatsappNumber,
    }),
    [settings, loading, refresh]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
