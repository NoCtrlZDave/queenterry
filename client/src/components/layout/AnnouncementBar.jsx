import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

export default function AnnouncementBar() {
  const { settings, whatsappNumber } = useStore();
  const messages = settings.announcements || [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length < 2) return undefined;
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % messages.length), 5200);
    return () => clearInterval(timer);
  }, [messages.length]);

  if (!messages.length) return null;

  const chatUrl = buildWhatsAppUrl(
    whatsappNumber,
    'Hello Queen Terry! I have a question about your store.'
  );

  return (
    <div className="bg-ink text-white">
      <div className="shell flex h-9 items-center justify-between gap-4 text-[11px] sm:text-xs">
        <div className="hidden items-center gap-2 text-white/60 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-300" />
          <span>Official Queen Terry store</span>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="truncate text-center font-medium tracking-wide text-white/90"
            >
              {messages[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <a
            href={chatUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-white/70 transition hover:text-white"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Chat with us
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-0.5 text-white/70 transition hover:text-white"
          >
            Support
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
