/** Дизайн-токены — из брифа, значение в значение. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream:    '#F7F3EC',
        'cream-alt': '#EFE8DB',
        hairline: '#DED4C4',
        espresso: '#1A1611',
        forest:   '#232B23',
        ink:      '#221D17',
        'ink-2':  '#6E655A',
        'on-dark':   '#F1E9DA',
        'on-dark-2': '#B7AC9C',
        brass:    '#A9834F',
        'brass-h':'#8E6B3D',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero:     ['clamp(2.75rem, 7vw, 6rem)',   { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        section:  ['clamp(2rem, 4vw, 3.25rem)',   { lineHeight: '1.1',  letterSpacing: '-0.015em' }],
        sub:      ['clamp(1.1rem, 1.6vw, 1.35rem)', { lineHeight: '1.5' }],
        eyebrow:  ['0.8rem', { lineHeight: '1.4', letterSpacing: '0.18em' }],
        btn:      ['0.95rem', { lineHeight: '1', letterSpacing: '0.04em' }],
      },
      maxWidth: { content: '1240px', column: '680px' },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
        sm: 'var(--radius-sm)',
      },
      transitionTimingFunction: {
        // единый easing reveal-анимаций из брифа
        reveal: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
