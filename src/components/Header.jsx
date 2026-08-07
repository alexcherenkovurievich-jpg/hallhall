import { useEffect, useRef, useState } from 'react';
import { NAV } from '../lib/content.js';

export function Header({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onDocClick = (e) => {
      if (!panelRef.current?.contains(e.target) && !btnRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();   // иначе фокус остаётся в скрытой панели
      }
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    onNavigate(href);
  };

  return (
    <header className="hdr">
      <a className="hdr__brand" href="#top" onClick={(e) => go(e, '#top')}>
        Юго-Запад Hall
      </a>

      <button
        ref={btnRef}
        className="menu-btn"
        type="button"
        aria-expanded={open}
        aria-controls="menuPanel"
        onClick={() => setOpen((v) => !v)}
      >
        Меню
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m5 9 7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div ref={panelRef} className={`menu-panel ${open ? 'is-open' : ''}`} id="menuPanel">
        <nav>
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={(e) => go(e, item.href)}>
              {item.label}
            </a>
          ))}
          <a className="is-cta" href="#contacts" onClick={(e) => go(e, '#contacts')}>
            Забронировать
          </a>
        </nav>
      </div>
    </header>
  );
}
