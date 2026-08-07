import { useCallback, useRef } from 'react';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { About, House, Area, Services } from './components/Sections.jsx';
import { Gallery } from './components/Gallery.jsx';
import { Reviews } from './components/Reviews.jsx';
import { Location } from './components/Location.jsx';
import { Contacts, Footer } from './components/Contacts.jsx';
import { useLenis } from './lib/useLenis.js';

export default function App() {
  const lenisRef = useRef(null);
  const onLenisReady = useCallback((l) => { lenisRef.current = l; }, []);
  useLenis(onLenisReady);

  /**
   * Переход по якорю. Идёт через Lenis, если он жив: нативный
   * scrollIntoView рвёт инерцию и якорь дёргается.
   */
  const navigate = useCallback((href) => {
    const el = href === '#top' ? document.body : document.querySelector(href);
    if (!el) return;
    // фиксированная шапка перекрывает верх секции — оставляем под неё запас
    const offset = -(document.querySelector('.hdr')?.offsetHeight ?? 0) - 8;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset, duration: 1.4 });
    } else {
      const top = href === '#top'
        ? 0
        : el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <Header onNavigate={navigate} />
      <main>
        <Hero onNavigate={navigate} />
        <About />
        <House />
        <Area />
        <Services />
        <Gallery />
        <Reviews />
        <Location />
        <Contacts />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
