/**
 * Единый почерк анимаций по всему сайту — значения из брифа.
 * Всё, что двигается, берёт длительность и easing отсюда, чтобы
 * темп нигде не разъезжался.
 */
export const EASE = [0.16, 1, 0.3, 1];

export const DURATION = 1.1;   // сек
export const DELAY = 0.15;     // «запоздалый» старт
export const STAGGER = 0.11;   // каскад списков и карточек

/** opacity 0→1 + translateY(40px→0) */
export const revealUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: EASE, delay: DELAY },
  },
};

/** Родитель каскада: сам не двигается, только раздаёт задержки детям. */
export const staggerParent = {
  hidden: {},
  visible: {
    transition: { delayChildren: DELAY, staggerChildren: STAGGER },
  },
};

/** Ребёнок каскада — без собственной задержки, её задаёт родитель. */
export const staggerChild = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
};

/** Заголовок выезжает из-под невидимой маски снизу вверх. */
export const maskReveal = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: DURATION, ease: EASE, delay: DELAY } },
};

/** Блок входит в кадр примерно на 20% высоты — как в брифе. */
export const VIEWPORT = { once: true, amount: 0.2 };

/**
 * При включённом «уменьшить движение» оставляем только мягкий fade.
 * Читаем один раз при загрузке: смена настройки на лету — редкий случай,
 * а подписка на изменение потребовала бы ре-рендера всего дерева.
 */
export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const softFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

/** Возвращает подходящий вариант с учётом настройки движения. */
export function variant(normal) {
  return prefersReducedMotion ? softFade : normal;
}
