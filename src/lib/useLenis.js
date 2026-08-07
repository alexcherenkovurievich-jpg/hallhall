import { useEffect } from 'react';
import Lenis from 'lenis';
import { prefersReducedMotion } from './motion.js';

/**
 * Инерционный скролл + плавный переход по якорям.
 *
 * Возвращает ref на экземпляр через колбэк, чтобы навигация могла
 * скроллить через Lenis, а не через нативный scrollIntoView —
 * иначе якорь прыгает рывком поверх инерции.
 */
export function useLenis(onReady) {
  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    onReady?.(lenis);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      onReady?.(null);
    };
  }, [onReady]);
}
