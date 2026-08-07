import { useEffect, useRef, useState } from 'react';
import { Reveal, MaskedHeading } from './Reveal.jsx';

/* ─── настройки карты — менять здесь ─────────────────────────── */
export const YANDEX_MAPS_API_KEY = '12b4f2cc-e850-4735-a329-bc49a259c93f';
export const VENUE_COORDS = [54.272215, 48.248568];   // [широта, долгота]
export const VENUE_ZOOM = 16;
/* в ссылке Яндекса порядок обратный: долгота, широта */
export const YANDEX_MAPS_LINK =
  `https://yandex.ru/maps/?pt=${VENUE_COORDS[1]},${VENUE_COORDS[0]}&z=${VENUE_ZOOM}&l=map`;

/** Подключает скрипт API один раз на страницу. */
function loadYandexMaps() {
  if (window.ymaps) return Promise.resolve(window.ymaps);
  if (window.__ymapsPromise) return window.__ymapsPromise;

  window.__ymapsPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_MAPS_API_KEY}&lang=ru_RU`;
    s.async = true;
    s.onload = () => (window.ymaps ? window.ymaps.ready(() => resolve(window.ymaps)) : reject(new Error('ymaps missing')));
    s.onerror = () => reject(new Error('yandex maps failed'));
    document.head.appendChild(s);
  });
  return window.__ymapsPromise;
}

export function Location() {
  const holder = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let map;
    let cancelled = false;

    loadYandexMaps()
      .then((ymaps) => {
        if (cancelled || !holder.current) return;
        map = new ymaps.Map(holder.current, {
          center: VENUE_COORDS,
          zoom: VENUE_ZOOM,
          controls: ['zoomControl'],
        }, { suppressMapOpenBlock: true });

        // страница должна прокручиваться над картой, а не зумить её
        map.behaviors.disable('scrollZoom');

        map.geoObjects.add(new ymaps.Placemark(VENUE_COORDS, {
          hintContent: 'Юго-Запад Hall',
          balloonContent: 'Ульяновск, ул. Авиационная, 2 «А»',
        }, {
          draggable: false,
          preset: 'islands#circleIcon',
          iconColor: '#A9834F',
        }));
      })
      .catch(() => { if (!cancelled) setFailed(true); });

    return () => {
      cancelled = true;
      map?.destroy?.();
    };
  }, []);

  return (
    <section id="location">
      <div className="wrap">
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <Reveal as="p" className="eyebrow">Расположение</Reveal>
          <MaskedHeading style={{ marginTop: 20 }}>
            Рядом с <span className="nb">«Юго-Западным»,</span>{' '}
            <em className="acc">но вдали от суеты</em>
          </MaskedHeading>
          <Reveal as="p" className="sub">
            Ульяновск, Засвияжье, ул. Авиационная, <span className="nb">2 «А».</span> Всего
            10 минут от микрорайона <span className="nb">«Юго-Западный»,</span> в районе
            старого аэропорта.
          </Reveal>
        </div>

        <Reveal className="map">
          <div className="map__canvas" ref={holder} hidden={failed} />
          {failed && (
            <div className="map__fallback">
              <p className="eyebrow">Мы здесь</p>
              <p>Ульяновск, Засвияжье,<br />ул. Авиационная, <span className="nb">2 «А»</span></p>
              <a className="btn btn--ghost" target="_blank" rel="noopener"
                 href={YANDEX_MAPS_LINK}>Открыть в Яндекс.Картах</a>
            </div>
          )}
        </Reveal>

        <Reveal className="map__actions">
          <a className="btn btn--ghost" target="_blank" rel="noopener" href={YANDEX_MAPS_LINK}>
            Открыть в Яндекс.Картах
          </a>
        </Reveal>
      </div>
    </section>
  );
}
