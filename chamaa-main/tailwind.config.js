/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e8f5f0',
          100: '#c5e6d6',
          200: '#9bd4ba',
          300: '#6cbd9a',
          400: '#3fa078',
          500: '#1f855e',
          600: '#156948',
          700: '#0f5238',
          800: '#0a3d2b',
          900: '#062819',
        },
        gold: {
          50: '#fdf6e3',
          100: '#f8e3b0',
          200: '#f0cd7a',
          300: '#e6b548',
          400: '#d99e2a',
          500: '#c08820',
          600: '#9a6c18',
          700: '#755313',
          800: '#52390d',
          900: '#2e2007',
        },
        ink: {
          50: '#f4f5f7',
          100: '#e3e5e9',
          200: '#c4c8d0',
          300: '#9aa0ac',
          400: '#6b7280',
          500: '#4a5160',
          600: '#353c4a',
          700: '#262c38',
          800: '#1a1f28',
          900: '#0f1319',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
