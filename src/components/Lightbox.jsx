import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE, prefersReducedMotion } from '../lib/motion.js';

const LightboxContext = createContext(null);
export const useLightbox = () => useContext(LightboxContext);

/** Атрибут, по которому лайтбокс собирает список кадров. */
export const LB_ATTR = 'data-lb';

export function LightboxProvider({ children }) {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(-1);
  const open = index >= 0;

  /**
   * Список собираем в момент клика прямо из DOM, а не через реестр:
   * так порядок гарантированно совпадает с порядком на странице,
   * и не нужно следить за монтированием каждой карточки.
   */
  const openFrom = useCallback((el) => {
    const nodes = [...document.querySelectorAll(`[${LB_ATTR}]`)];
    const i = nodes.indexOf(el);
    if (i < 0) return;
    setItems(nodes.map((n) => ({ src: n.dataset.lbSrc, alt: n.dataset.lbAlt || '' })));
    setIndex(i);
  }, []);

  const close = useCallback(() => setIndex(-1), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    // страница под затемнением не должна прокручиваться
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  const dur = prefersReducedMotion ? 0.2 : 0.45;

  return (
    <LightboxContext.Provider value={{ openFrom }}>
      {children}

      <AnimatePresence>
        {open && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Просмотр фотографии"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur * 0.7, ease: EASE }}
            onClick={close}
          >
            <button className="lightbox__close" type="button" aria-label="Закрыть" onClick={close}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
                   stroke="currentColor" strokeWidth="1.6">
                <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </button>

            {items.length > 1 && (
              <button className="lightbox__nav lightbox__nav--prev" type="button"
                      aria-label="Предыдущее фото"
                      onClick={(e) => { e.stopPropagation(); prev(); }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
                     stroke="currentColor" strokeWidth="1.6">
                  <path d="m14 5-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            <motion.img
              key={index}
              src={items[index]?.src}
              alt={items[index]?.alt}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: dur, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            />

            {items.length > 1 && (
              <button className="lightbox__nav lightbox__nav--next" type="button"
                      aria-label="Следующее фото"
                      onClick={(e) => { e.stopPropagation(); next(); }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
                     stroke="currentColor" strokeWidth="1.6">
                  <path d="m10 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {items.length > 1 && (
              <span className="lightbox__count">{index + 1} / {items.length}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}
