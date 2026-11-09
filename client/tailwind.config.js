/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0F',
        coal: '#17171D',
        smoke: '#6B6B76',
        mist: '#F4F4F7',
        cloud: '#FAFAFB',
        line: '#E6E6EB',
        accent: {
          DEFAULT: '#5B21B6',
          50: '#F4EEFF',
          100: '#E9DDFF',
          200: '#D4BFFF',
          300: '#B79AFF',
          400: '#9A73F5',
          500: '#7C4DEA',
          600: '#6730D6',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#3B147A',
        },
        gold: '#C9A227',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        shell: '1320px',
      },
      boxShadow: {
        soft: '0 18px 50px -24px rgba(11, 11, 15, 0.28)',
        card: '0 1px 2px rgba(11, 11, 15, 0.04), 0 18px 45px -30px rgba(11, 11, 15, 0.35)',
        lift: '0 24px 60px -28px rgba(11, 11, 15, 0.4)',
      },
      borderRadius: {
        xl2: '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        shimmer: 'shimmer 1.8s infinite',
        floaty: 'floaty 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
