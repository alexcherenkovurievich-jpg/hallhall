/**
 * Кадр в рамке сайта. Либо настоящее фото, либо тональная заглушка —
 * рамка, скругление и пропорция у них одни и те же, чтобы подстановка
 * реального снимка не сдвигала вёрстку.
 */
export function Photo({ src, alt, w, h, ar = '4/3', pos, className = '', zoom = true,
                        eager = false, children, ...rest }) {
  return (
    <figure
      className={`ph ph--photo ${zoom ? 'ph--zoom' : ''} ${className}`}
      style={{ '--ar': ar, ...(pos ? { '--pos': pos } : null) }}
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
