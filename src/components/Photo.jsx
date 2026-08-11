import { useLightbox, LB_ATTR } from './Lightbox.jsx';

/**
 * Кадр в рамке сайта. Либо настоящее фото, либо тональная заглушка —
 * рамка, скругление и пропорция у них одни и те же, чтобы подстановка
 * реального снимка не сдвигала вёрстку.
 *
 * По клику кадр открывается на весь экран. `lightbox={false}` выключает
 * это для дублей (например, для второй копии ленты отзывов, которая
 * нужна только чтобы петля не была видна).
 */
export function Photo({
  src, alt, w, h, ar = '4/3', pos, className = '', zoom = true,
  eager = false, lightbox = true, children, ...rest
}) {
  const lb = useLightbox();

  const clickable = lightbox && lb;
  const open = (e) => clickable && lb.openFrom(e.currentTarget);

  return (
    <figure
      className={`ph ph--photo ${zoom ? 'ph--zoom' : ''} ${clickable ? 'ph--clickable' : ''} ${className}`}
      style={{ '--ar': ar, ...(pos ? { '--pos': pos } : null) }}
      {...(clickable ? {
        [LB_ATTR]: true,
        'data-lb-src': src,
        'data-lb-alt': alt,
        role: 'button',
        tabIndex: 0,
        'aria-label': `Открыть фото: ${alt}`,
        onClick: open,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(e); }
        },
      } : null)}
      {...rest}
    >
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        {...(eager ? { fetchPriority: 'high' } : null)}
      />
      {children}
    </figure>
  );
}

/** Заглушка под кадр, которого ещё нет. */
export function PhotoStub({ tone = 't-linen', label, ar = '4/3', className = '', ...rest }) {
  return (
    <figure
      className={`ph ${tone} ${className}`}
      style={{ '--ar': ar }}
      data-label={label}
      {...rest}
    />
  );
}
