import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/format';

export default function Modal({ open, onClose, title, children, className = '', panelClassName = '' }) {
  useEffect(() => {
    if (!open) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn('fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6', className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 30, opacity: 0, scale: 0.99 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'modal-panel-scroll relative z-10 w-full max-w-lg rounded-t-3xl bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-lift sm:rounded-3xl sm:pb-6',
              panelClassName
            )}
          >
            {(title || onClose) && (
              <div className="mb-4 flex items-start justify-between gap-4">
                {title && <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>}
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full p-2 text-smoke transition hover:bg-mist hover:text-ink"
                    aria-label="Close dialog"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
