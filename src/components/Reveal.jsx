import { motion } from 'framer-motion';
import {
  revealUp, staggerParent, staggerChild, maskReveal, VIEWPORT, variant,
  prefersReducedMotion,
} from '../lib/motion.js';

/** Блок появляется при входе в кадр: opacity + сдвиг снизу. */
export function Reveal({ children, className, as = 'div', delay = 0, ...rest }) {
  const Tag = motion[as] ?? motion.div;
  const v = variant(revealUp);
  return (
    <Tag
      className={className}
      variants={v}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={delay ? { ...v.visible.transition, delay } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Обёртка каскада: дети появляются по очереди. */
export function RevealGroup({ children, className, as = 'div', ...rest }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Элемент внутри RevealGroup. */
export function RevealItem({ children, className, as = 'div', ...rest }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag className={className} variants={variant(staggerChild)} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Заголовок выезжает из-под маски. Маска — это overflow:hidden на обёртке,
 * поэтому текст должен быть в отдельном строчном слое, иначе обрежутся
 * выносные элементы букв (у Fraunces они заметные).
 */
export function MaskedHeading({ children, className, as: Tag = 'h2', ...rest }) {
  if (prefersReducedMotion) {
    return <Tag className={className} {...rest}>{children}</Tag>;
  }
  // Наблюдаем за обёрткой, а не за самим текстом: текст сдвинут на 110%
  // вниз и в зону видимости попадает с запозданием или не попадает вовсе,
  // а с viewport.once заголовок так и остаётся под маской.
  return (
    <Tag className={className} {...rest}>
      <motion.span
        style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em' }}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <motion.span style={{ display: 'block' }} variants={maskReveal}>
          {children}
        </motion.span>
      </motion.span>
    </Tag>
  );
}
