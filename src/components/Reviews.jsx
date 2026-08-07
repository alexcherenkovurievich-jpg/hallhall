import { useRef, useState } from 'react';
import { Reveal, MaskedHeading } from './Reveal.jsx';
import { Photo } from './Photo.jsx';
import { REVIEWS } from '../lib/content.js';
import { prefersReducedMotion } from '../lib/motion.js';

/**
 * Лента отзывов: бесконечная петля на CSS-анимации.
 * Список дублируется — сдвиг на -50% приходится ровно на стык копий,
 * поэтому петля не видна. Дубли не попадают в лайтбокс и скрыты от
 * скринридеров, иначе каждый отзыв считался бы дважды.
 */
export function Reviews() {
  const railRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ startX: 0, startScroll: 0, moved: 0 });

  const loop = !prefersReducedMotion;
  const items = loop ? [...REVIEWS, ...REVIEWS] : REVIEWS;

  const onDown = (e) => {
    setDragging(true);
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    drag.current = { startX: x, startScroll: railRef.current.scrollLeft, moved: 0 };
  };
  const onMove = (e) => {
    if (!dragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    drag.current.moved = Math.abs(x - drag.current.startX);
    railRef.current.scrollLeft = drag.current.startScroll - (x - drag.current.startX);
  };
  const onUp = () => setDragging(false);
  // после перетаскивания клик не должен открывать лайтбокс
  const onClickCapture = (e) => {
    if (drag.current.moved > 8) { e.stopPropagation(); e.preventDefault(); }
  };

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
        onClickCapture={onClickCapture}
      >
        <div
          className={`rail rail--drag ${loop ? 'rail--auto' : ''}`}
          style={dragging ? { animationPlayState: 'paused' } : undefined}
        >
          {items.map((r, i) => {
            const isCopy = i >= REVIEWS.length;
            return (
              <Photo
                key={`${r.src}-${i}`}
                src={r.src}
                alt={r.alt}
                w={r.w}
                h={r.h}
                ar="3/4"
                lightbox={!isCopy}
                zoom={false}
                aria-hidden={isCopy ? 'true' : undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
