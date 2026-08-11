import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal, RevealGroup, RevealItem, MaskedHeading } from './Reveal.jsx';
import { EASE, prefersReducedMotion } from '../lib/motion.js';
import {
  SEASONS, PRICE_DAILY, PRICE_EXTRAS, PRICE_INCLUDED, PRICE_DAY, PRICE_ACCESSORIES,
} from '../lib/content.js';

/** Строка «одинакова в оба сезона» — просто текст; иначе объект по ключу сезона. */
const bySeason = (v, season) => (typeof v === 'string' ? v : v[season]);

/**
 * Значение, которое меняется при переключении сезона.
 * Постоянные значения не оборачиваем: иначе они мигали бы вместе
 * с сезонными, хотя не менялись.
 */
function Value({ value, season, className = '' }) {
  const text = bySeason(value, season);
  const fixed = typeof value === 'string';

  if (fixed || prefersReducedMotion) {
    return <span className={`price-val ${className}`}>{text}</span>;
  }
  return (
    <span className={`price-val price-val--swap ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={season}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Строка «название … цена» с точечной линией между ними. */
function Row({ name, value, season }) {
  return (
    <li className="price-row">
      <span className="price-row__name">
        <Value value={name} season={season} className="price-val--name" />
      </span>
      <span className="price-row__dots" aria-hidden="true" />
      <Value value={value} season={season} />
    </li>
  );
}

/**
 * Сворачиваемый пункт. Закрыт по умолчанию: вторичные блоки не должны
 * растягивать секцию. Заголовок — настоящая кнопка, поэтому клавиатура
 * и screen reader работают без дополнительных обработчиков.
 */
function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  // useId выдаёт ':r3:' — двоеточия ломают querySelector, чистим
  const uid = useId().replace(/:/g, '');
  const headId = `acc-${uid}-head`;
  const panelId = `acc-${uid}-panel`;

  return (
    <div className={`price-acc__item ${open ? 'is-open' : ''}`}>
      <h3 className="price-acc__h">
        <button
          type="button"
          id={headId}
          className="price-acc__head"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="price-acc__title">{title}</span>
          <span className="price-acc__chev" aria-hidden="true">
            <svg viewBox="0 0 20 20" width="20" height="20" focusable="false">
              <path
                d="M4.5 7.5 10 13l5.5-5.5"
                fill="none" stroke="currentColor" strokeWidth="1.7"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={headId}
            className="price-acc__panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={prefersReducedMotion
              ? { duration: 0 }
              : { height: { duration: 0.45, ease: EASE }, opacity: { duration: 0.3, ease: EASE } }}
          >
            <div className="price-acc__inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Price() {
  const [season, setSeason] = useState(SEASONS[0].id);
  const active = SEASONS.find((s) => s.id === season);

  return (
    <section id="price" className="price">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal as="p" className="eyebrow">Прайс</Reveal>
          <MaskedHeading className="on-dark">
            Цены — честно и <em className="acc">без сюрпризов</em>
          </MaskedHeading>
        </div>

        {/* переключатель сезона */}
        <Reveal className="season">
          <div className="season__pills" role="group" aria-label="Сезон">
            {SEASONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`season__pill ${s.id === season ? 'is-active' : ''}`}
                aria-pressed={s.id === season}
                onClick={() => setSeason(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="season__caption" aria-live="polite">{active.caption}</p>
        </Reveal>

        {/* Дом посуточно */}
        <RevealGroup className="price-card price-card--wide">
          <RevealItem as="h3">{PRICE_DAILY.title}</RevealItem>
          <RevealItem as="p" className="price-note">{PRICE_DAILY.note}</RevealItem>
          <RevealItem as="ul" className="price-list">
            {PRICE_DAILY.rows.map((r) => (
              <Row key={r.name} name={r.name} value={r.value} season={season} />
            ))}
          </RevealItem>
          <RevealItem as="p" className="price-foot">
            <Value value={PRICE_DAILY.footnote} season={season} className="price-val--flow" />
          </RevealItem>
        </RevealGroup>

        {/* Дополнительно */}
        <Reveal as="h3" className="price-subhead">{PRICE_EXTRAS.title}</Reveal>
        <RevealGroup className="price-tiles">
          {PRICE_EXTRAS.items.map((it) => (
            <RevealItem as="div" className="price-tile" key={bySeason(it.name, 'summer')}>
              <span className="price-tile__name">
                <Value value={it.name} season={season} className="price-val--name" />
              </span>
              <Value value={it.value} season={season} className="price-val--tile" />
            </RevealItem>
          ))}
        </RevealGroup>

        {/* что входит */}
        <RevealGroup className="price-included">
          <RevealItem as="p" className="price-included__title">{PRICE_INCLUDED.title}</RevealItem>
          <RevealItem as="ul" className="chips">
            {PRICE_INCLUDED.chips.map((c) => <li className="chip" key={c}>{c}</li>)}
          </RevealItem>
        </RevealGroup>

        {/* вторичные блоки — свёрнуты, чтобы главная цена читалась сразу */}
        <Reveal className="price-acc">
          <Accordion title={PRICE_DAY.title}>
            <p className="price-note">{PRICE_DAY.note}</p>
            <ul className="price-list">
              {PRICE_DAY.rows.map((r) => (
                <Row key={r.name} name={r.name} value={r.value} season={season} />
              ))}
            </ul>
            <p className="price-subnote">{PRICE_DAY.subTitle}</p>
            <ul className="price-list price-list--tight">
              {PRICE_DAY.subRows.map((r) => (
                <Row key={r.name} name={r.name} value={r.value} season={season} />
              ))}
            </ul>
          </Accordion>

          <Accordion title={PRICE_ACCESSORIES.title}>
            <ul className="price-list">
              {PRICE_ACCESSORIES.rows.map((r) => (
                <Row key={r.name} name={r.name} value={r.value} season={season} />
              ))}
            </ul>
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
