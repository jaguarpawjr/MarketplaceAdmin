/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0faf3',
          100: '#dcf2e2',
          200: '#bce4ca',
          300: '#8bcfab',
          400: '#56b07f',
          500: '#339463',
          600: '#24764e',
          700: '#1d5e3f',
          800: '#1a4b35',
          900: '#163e2d',
          950: '#0a2317',
        },
        sand: {
          50: '#fbf9f4',
          100: '#f5f0e4',
          200: '#ebe0c8',
          300: '#dcc99a',
          400: '#caad6e',
          500: '#bd9651',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae2',
          300: '#b0bac8',
          400: '#8593a8',
          500: '#65748b',
          600: '#515e73',
          700: '#434d5f',
          800: '#3a4250',
          900: '#1f2530',
          950: '#141821',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16,24,40,0.04), 0 1px 3px 0 rgba(16,24,40,0.06)',
        'card-hover': '0 4px 12px -2px rgba(16,24,40,0.08), 0 2px 6px -2px rgba(16,24,40,0.06)',
        pop: '0 12px 32px -8px rgba(16,24,40,0.18), 0 4px 12px -4px rgba(16,24,40,0.08)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'scale-in': 'scale-in 0.18s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
