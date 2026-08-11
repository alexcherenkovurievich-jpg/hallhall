import { Reveal, RevealGroup, RevealItem, MaskedHeading } from './Reveal.jsx';
import { Photo } from './Photo.jsx';
import { HOUSE_SPECS, ZONES, FIRE_ZONE, SERVICES } from '../lib/content.js';

/* ═══════════ 3. О МЕСТЕ ═══════════ */
export function About() {
  return (
    <section id="about">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal as="p" className="eyebrow">О месте</Reveal>
          <MaskedHeading>
            Целая территория — <em className="acc">только ваша</em>
          </MaskedHeading>
        </div>

        <Reveal>
          <Photo
            src="/images/photos/02-about-panorama.jpg" w={2000} h={900} ar="20/9"
            alt="Панорама территории: ветка с листьями на переднем плане, за ней баня-бочка и беседка"
          />
        </Reveal>

        <Reveal className="prose">
          <p>
            Здесь вся территория принадлежит только вам — свой мир, где рядом лишь близкие.
            Тёплый дом, живой огонь, вечера без спешки. Место, где время замедляется,
            в любое время года.
          </p>
        </Reveal>

        <Reveal className="audience">
          <p className="eyebrow">Для семей · пар · компаний · корпоративов</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════ 4. ДОМ ═══════════ */
export function House() {
  return (
    <section id="house" className="house">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal as="p" className="eyebrow">Дом</Reveal>
          <MaskedHeading>
            Уют, что <em className="acc">обнимает</em> с порога
          </MaskedHeading>
        </div>

        {/* дом-шалаш вертикальный: широкая рамка срезала бы и шпиль, и настил */}
        <Reveal>
          <Photo
            className="ph--tall"
            src="/images/photos/03-house.jpg" w={1125} h={1500} ar="4/5"
            alt="Дом-шалаш A-frame с панорамным остеклением и гирляндой по скатам на закате"
          />
        </Reveal>

        <div className="house__grid">
          <RevealGroup className="mini">
            <RevealItem>
              <Photo src="/images/photos/04-house-interior-1.jpg" w={2000} h={1500} ar="1/1"
                     alt="Гостиная: обеденный стол на шесть персон, кресло-качели, зеркало с лампами" />
            </RevealItem>
            <RevealItem>
              <Photo src="/images/photos/05-house-interior-2.jpg" w={1500} h={2000} ar="1/1"
                     pos="center 40%"
                     alt="Второй этаж под скатом крыши: спальное место у перил и подвесной светильник" />
            </RevealItem>
            <RevealItem>
              <Photo src="/images/photos/06-house-interior-3.jpg" w={1500} h={2000} ar="1/1"
                     pos="center 55%"
                     alt="Кухонный уголок: сушилка с посудой, раковина, утварь на рейлинге" />
            </RevealItem>
          </RevealGroup>

          <RevealGroup as="ul" className="spec">
            {HOUSE_SPECS.map((s) => (
              <RevealItem as="li" key={s}>{s}</RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

/* ═══════════ 5. ТЕРРИТОРИЯ ═══════════ */
/** Все три подзоны на тёмно-лесном фоне; свечение — только у костровой. */
function Zone({ zone, glow = false }) {
  return (
    <div className={`zone-block ${glow ? 'zone-block--fire' : ''}`}>
      <div className="zone-block__in">
        <div className={`zone ${zone.flip ? 'zone--flip' : ''}`}>
          <RevealGroup className="zone__txt">
            <RevealItem as="p" className="eyebrow">{zone.n}</RevealItem>
            <RevealItem as="h3">{zone.title}</RevealItem>
            <RevealItem as="ul" className="zone__list">
              {zone.items.map((t) => <li key={t}>{t}</li>)}
            </RevealItem>
          </RevealGroup>
          <Reveal>
            <Photo src={zone.photo.src} w={zone.photo.w} h={zone.photo.h} alt={zone.photo.alt} />
          </Reveal>
        </div>

        {zone.gallery && (
          <RevealGroup className="mini zone__mini">
            {zone.gallery.map((g) => (
              <RevealItem key={g.src}>
                <Photo src={g.src} w={g.w} h={g.h} ar="1/1" alt={g.alt} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </div>
  );
}

export function Area() {
  return (
    <section id="area">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal as="p" className="eyebrow">Территория</Reveal>
          <MaskedHeading>
            Здесь вечер длиннее, <em className="acc">а небо ближе</em>
          </MaskedHeading>
        </div>
      </div>

      {ZONES.map((z) => <Zone key={z.n} zone={z} />)}
      <Zone zone={FIRE_ZONE} glow />
    </section>
  );
}

/* ═══════════ 6. УСЛУГИ ═══════════ */
export function Services() {
  return (
    <section id="services" className="services">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal as="p" className="eyebrow">Услуги</Reveal>
          <MaskedHeading>
            Удовольствия, что добавляют <em className="acc">глубины</em>
          </MaskedHeading>
          <Reveal as="p" className="sub">Добавьте к отдыху столько, сколько хочется.</Reveal>
        </div>

        <RevealGroup className="cards">
          {SERVICES.map((s) => (
            <RevealItem as="article" className="card" key={s.title}>
              <Photo src={s.photo.src} w={s.photo.w} h={s.photo.h}
                     pos={s.photo.pos} alt={s.photo.alt} />
              <div className="card__body">
                <h3>{s.title}</h3>
                <ul className="card__list">
                  {s.items.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
