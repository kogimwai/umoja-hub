/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        umoja: {
          gold:       '#D4A017',
          'gold-light': '#E8B84B',
          terra:      '#C1440E',
          forest:     '#1E3A1A',
          cream:      '#F5ECD7',
          dark:       '#0F0E0B',
          mid:        '#1C1A16',
          muted:      '#8A8070',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4A017, #E8B84B)',
        'dark-gradient': 'linear-gradient(180deg, #1C1A16, #0F0E0B)',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'pulse-gold': 'pulseGold 2s infinite',
        'bid-flash':  'bidFlash 1s ease',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 160, 23, 0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(212, 160, 23, 0)' },
        },
        bidFlash: {
          '0%':   { backgroundColor: 'rgba(212, 160, 23, 0.3)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
