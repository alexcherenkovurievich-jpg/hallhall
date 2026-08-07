import { useEffect, useRef, useState } from 'react';
import { Reveal, MaskedHeading } from './Reveal.jsx';
import { Photo } from './Photo.jsx';
import { REVIEWS } from '../lib/content.js';
import { prefersReducedMotion } from '../lib/motion.js';

const SPEED = 26;   // пикселей в секунду

/**
 * Лента отзывов, которая едет по кругу без конца.
 *
 * Раньше это была CSS-анимация внутри прокручиваемого контейнера:
 * лента доезжала до конца списка и упиралась. Теперь сдвиг считается
 * сам и заворачивается на ширине одной копии списка — за последней
 * карточкой сразу идёт первая, в обе стороны и без стыка.
 */
export function Reviews() {
  const trackRef = useRef(null);
  const offset = useRef(0);          // текущий сдвиг, всегда в пределах одной копии
  const paused = useRef(false);
  const drag = useRef(null);
  const [grabbing, setGrabbing] = useState(false);

  // список дублируется: пока уезжает первая копия, её место занимает вторая
  const items = prefersReducedMotion ? REVIEWS : [...REVIEWS, ...REVIEWS];

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const track = trackRef.current;
    if (!track) return undefined;

    let frame;
    let last = performance.now();

    const step = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused.current && !drag.current) offset.current -= SPEED * dt;

      // ширина одной копии — точка, на которой лента незаметно повторяется
      const span = track.scrollWidth / 2;
      if (span > 0) {
        if (offset.current <= -span) offset.current += span;
        if (offset.current > 0) offset.current -= span;
      }
      track.style.transform = `translate3d(${offset.current}px,0,0)`;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  const pointerDown = (e) => {
    drag.current = { x: e.clientX ?? e.touches?.[0]?.clientX, moved: 0 };
    setGrabbing(true);
  };
  const pointerMove = (e) => {
    if (!drag.current) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    const dx = x - drag.current.x;
    drag.current.x = x;
    drag.current.moved += Math.abs(dx);
    offset.current += dx;
  };
  const pointerUp = () => {
    setGrabbing(false);
    // сбрасываем не сразу: клик приходит после отпускания
    setTimeout(() => { drag.current = null; }, 0);
  };
  // потянули — значит не кликнули, лайтбокс открывать не надо
  const clickCapture = (e) => {
    if (drag.current && drag.current.moved > 8) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <section id="reviews" className="reviews">
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
        onMouseEnter={() => { paused.current = true; }}
        onMouseLeave={() => { paused.current = false; pointerUp(); }}
        onMouseDown={pointerDown}
        onMouseMove={pointerMove}
        onMouseUp={pointerUp}
        onTouchStart={pointerDown}
        onTouchMove={pointerMove}
        onTouchEnd={pointerUp}
        onClickCapture={clickCapture}
      >
        <div
          ref={trackRef}
          className={`rail ${grabbing ? 'rail--grabbing' : ''}`}
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
