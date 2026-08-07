import { Reveal, RevealGroup, RevealItem, MaskedHeading } from './Reveal.jsx';
import { Photo } from './Photo.jsx';
import { GALLERY } from '../lib/content.js';

/** Галерея: ровная сетка 5×2 на десктопе и 2×5 на мобильном. */
export function Gallery() {
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
          {GALLERY.map((item) => (
            <RevealItem key={item.src}>
              <Photo src={item.src} alt={item.alt} w={item.w} h={item.h} ar="4/5" />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
