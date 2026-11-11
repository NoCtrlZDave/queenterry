import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

export default function WhatsAppFloat() {
  const { whatsappNumber } = useStore();
  const { pathname } = useLocation();

  if (pathname.startsWith('/admin') || pathname === '/checkout') return null;

  return (
    <a
      href={buildWhatsAppUrl(
        whatsappNumber,
        'Hello Queen Terry! I would like to ask about a product.'
      )}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-xs font-semibold text-ink shadow-soft transition hover:brightness-105 lg:bottom-6 lg:right-6 lg:px-5 lg:py-3.5 lg:text-sm"
      aria-label="Chat with Queen Terry on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
