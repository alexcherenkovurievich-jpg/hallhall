import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal, RevealGroup, RevealItem, MaskedHeading } from './Reveal.jsx';
import { PhotoStub } from './Photo.jsx';
import { GALLERY } from '../lib/content.js';

/**
 * Галерея с лайтбоксом. Кадров пока нет — стоят заглушки, и открывать
 * в лайтбоксе нечего, поэтому клик включается только у реальных фото
 * (у элемента есть src). Разметка и логика листания готовы: как только
 * в GALLERY появятся src, всё заработает без правок.
 */
export function Gallery() {
  const shots = GALLERY.filter((g) => g.src);
  const [index, setIndex] = useState(-1);
  const open = index >= 0;

  const close = useCallback(() => setIndex(-1), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + shots.length) % shots.length), [shots.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % shots.length), [shots.length]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    // страница под лайтбоксом не должна прокручиваться
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  return (
    <section id="gallery">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal as="p" className="eyebrow">Галерея</Reveal>
          <MaskedHeading>
            Место, в которое влюбляются <em className="acc">с первого взгляда</em>
          </MaskedHeading>
          <Reveal as="p" className="sub">
            Загляните — и почувствуете, каким будет ваш день.
          </Reveal>
        </div>

        <RevealGroup className="masonry">
          {GALLERY.map((item, i) => (
            <RevealItem key={item.label}>
              {item.src ? (
                <figure
                  className="ph ph--photo ph--zoom"
                  style={{ '--ar': '4/5' }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Открыть фото ${i + 1}`}
                  onClick={() => setIndex(shots.indexOf(item))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIndex(shots.indexOf(item));
                    }
                  }}
                >
                  <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
                  <span className="zoom-hint" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m16.5 16.5 4 4" strokeLinecap="round" />
                    </svg>
                  </span>
                </figure>
              ) : (
                <PhotoStub tone={item.tone} label={item.label} ar="4/5" />
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

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
            transition={{ duration: 0.3 }}
            onClick={close}
          >
            <button className="lightbox__close" type="button" aria-label="Закрыть"
                    onClick={close}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
                   stroke="currentColor" strokeWidth="1.6">
                <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </button>
            <button className="lightbox__nav lightbox__nav--prev" type="button" aria-label="Предыдущее"
                    onClick={(e) => { e.stopPropagation(); prev(); }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
                   stroke="currentColor" strokeWidth="1.6">
                <path d="m14 5-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <motion.img
              key={index}
              src={shots[index]?.src}
              alt={shots[index]?.alt || ''}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button className="lightbox__nav lightbox__nav--next" type="button" aria-label="Следующее"
                    onClick={(e) => { e.stopPropagation(); next(); }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
                   stroke="currentColor" strokeWidth="1.6">
                <path d="m10 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="lightbox__count">{index + 1} / {shots.length}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
