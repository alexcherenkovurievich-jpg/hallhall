import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { EASE, prefersReducedMotion } from '../lib/motion.js';

export function Hero({ onNavigate }) {
  const ref = useRef(null);

  // Параллакс: фон уезжает медленнее контента.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  const seq = (i) => ({
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, ease: EASE, delay: 0.35 + i * 0.18 },
  });

  const fade = (i) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, delay: 0.1 + i * 0.1 },
  });

  const anim = prefersReducedMotion ? fade : seq;

  return (
    <section className="hero" ref={ref} id="top">
      <motion.div
        className="hero__parallax"
        style={prefersReducedMotion ? undefined : { y: bgY }}
      >
        <motion.img
          className="hero__photo"
          src="/images/photos/01-hero-pool.jpg"
          width={1125}
          height={1066}
          fetchPriority="high"
          alt="Бассейн с деревянным настилом, шезлонги под перголой, высокие деревья вокруг"
          initial={prefersReducedMotion ? { opacity: 0 } : { scale: 1.1, opacity: 0 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0.5 : 1.8, ease: EASE }}
        />
      </motion.div>
      <div className="hero__veil" />

      <div className="hero__inner">
        <div className="hero__grid">
          <motion.h1 {...anim(0)}>
            Отдых, в котором есть только вы и <em className="acc">тишина</em>
          </motion.h1>
          <motion.p className="sub" {...anim(1)}>
            Закрытая территория рядом с <span className="nb">«Юго-Западным»,</span> где город
            остаётся за воротами.
          </motion.p>
          <motion.div className="hero__cta" {...anim(2)}>
            <a
              className="btn btn--solid"
              href="#contacts"
              onClick={(e) => { e.preventDefault(); onNavigate('#contacts'); }}
            >
              Связаться с нами
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
