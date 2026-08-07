import { Reveal, RevealGroup, RevealItem, MaskedHeading } from './Reveal.jsx';
import { Photo } from './Photo.jsx';
import { PhotoStub } from './Photo.jsx';
import { CONTACTS } from '../lib/content.js';

const PhoneIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.8 2Z" />
  </svg>
);

export const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21.5 3.5 2.8 10.8c-.9.3-.9 1.5 0 1.8l4.7 1.6 1.8 5.4c.3.8 1.3 1 1.8.3l2.5-3 4.8 3.5c.7.5 1.6.1 1.8-.7l3-14.4c.2-.9-.7-1.6-1.7-1.3Z" />
    <path d="m7.5 14.2 11-8-8.4 9.9" />
  </svg>
);

export const VkIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 7.6c.7 5.4 4.3 9.4 9.6 9.4h1.1v-3c2 1.5 2.7 3 4.5 3H21c-.7-2.5-2.9-4.5-4.6-5.4 1.5-1.2 3-3.4 3.6-6h-2.7c-.7 2.4-2.2 4.6-3.8 5.3V5.6h-2.9v6c-2-.8-3.5-3.4-3.8-6H4Z" strokeLinejoin="round" />
  </svg>
);

export function Socials({ className = '' }) {
  return (
    <div className={`socials ${className}`}>
      <a href={CONTACTS.telegram} target="_blank" rel="noopener"
         aria-label="Telegram" title="Telegram"><TelegramIcon /></a>
      <a href={CONTACTS.vk} target="_blank" rel="noopener"
         aria-label="ВКонтакте" title="ВКонтакте"><VkIcon /></a>
    </div>
  );
}

export function Contacts() {
  const people = [CONTACTS.yuriy, CONTACTS.ekaterina];

  return (
    <section id="contacts" className="contacts">
      <div className="wrap">
        <div className="contacts__grid">
          <div>
            <Reveal as="p" className="eyebrow">Контакты</Reveal>
            <MaskedHeading className="on-dark" style={{ marginTop: 20 }}>
              Давайте подберём вам <em className="acc">дату</em>
            </MaskedHeading>
            <Reveal as="p" className="sub">
              Расскажите, когда хотите приехать, — подскажем свободные даты и подготовим
              всё к заезду. Пишите или звоните, как удобнее.
            </Reveal>

            <RevealGroup as="ul" className="clist">
              {people.map((p) => (
                <RevealItem as="li" key={p.tel}>
                  <PhoneIcon />
                  <span>{p.name}</span>
                  <a className="link-u" href={`tel:${p.tel}`}>{p.phone}</a>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal><Socials /></Reveal>

            <Reveal className="contacts__cta">
              <a className="btn btn--solid" href={CONTACTS.telegram} target="_blank" rel="noopener">
                Написать в Telegram
              </a>
              <a className="btn btn--ghost-light" href={`tel:${CONTACTS.yuriy.tel}`}>
                Позвонить
              </a>
            </Reveal>
          </div>

          <Reveal>
            <PhotoStub tone="t-night" label="ФОТО · вечерний двор" ar="4/5" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr__in">
        <p style={{ margin: 0 }}><b>Юго-Запад Hall</b></p>
        <div className="ftr__links">
          <a className="link-u" href={`tel:${CONTACTS.yuriy.tel}`}>
            {CONTACTS.yuriy.name} {CONTACTS.yuriy.phone}
          </a>
          <i>·</i>
          <a className="link-u" href={`tel:${CONTACTS.ekaterina.tel}`}>
            {CONTACTS.ekaterina.name} {CONTACTS.ekaterina.phone}
          </a>
          <Socials className="socials--ftr" />
        </div>
      </div>
    </footer>
  );
}
