import { useRef, useState } from 'react';
import { Reveal, MaskedHeading } from './Reveal.jsx';
import { PhotoStub } from './Photo.jsx';
import { REVIEWS } from '../lib/content.js';
import { prefersReducedMotion } from '../lib/motion.js';

/**
 * Лента отзывов: бесконечная петля на CSS-анимации.
 * Список дублируется — сдвиг на -50% приходится ровно на стык копий,
 * поэтому петля не видна. Перетаскивание мышью/пальцем останавливает
 * автопрокрутку, чтобы лента не выдиралась из-под руки.
 */
export function Reviews() {
  const railRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ startX: 0, startScroll: 0 });

  const items = prefersReducedMotion ? REVIEWS : [...REVIEWS, ...REVIEWS];

  const onDown = (e) => {
    setDragging(true);
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    drag.current = { startX: x, startScroll: railRef.current.scrollLeft };
  };
  const onMove = (e) => {
    if (!dragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    railRef.current.scrollLeft = drag.current.startScroll - (x - drag.current.startX);
  };
  const onUp = () => setDragging(false);

  return (
    <section className="reviews">
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="p" className="eyebrow">Отзывы</Reveal>
          <MaskedHeading className="on-dark">
            Дни, которые <em className="acc">не хочется забывать</em>
          </MaskedHeading>
          <Reveal as="p" className="sub">Гости делятся тем, что здесь почувствовали.</Reveal>
        </div>
      </div>

      <div
        className="rail-mask"
        ref={railRef}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
      >
        <div
          className={`rail rail--drag ${prefersReducedMotion ? '' : 'rail--auto'}`}
          style={dragging ? { animationPlayState: 'paused' } : undefined}
        >
          {items.map((r, i) => (
            <PhotoStub
              key={`${r.label}-${i}`}
              tone={r.tone}
              label={r.label}
              ar="3/4"
              aria-hidden={i >= REVIEWS.length ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
