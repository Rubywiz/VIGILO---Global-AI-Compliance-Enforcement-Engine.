/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          950: '#070B14',
          925: '#0A0F1A',
          900: '#0D1117',
          800: '#161B22',
          700: '#1C2333',
          600: '#252D40',
        },
        accent: {
          DEFAULT: '#6C63FF',
          50: '#EEEDFF',
          100: '#DDDBFF',
          200: '#BBB7FF',
          300: '#9993FF',
          400: '#7B75FF',
          500: '#6C63FF',
          600: '#5548E8',
          700: '#3D30C7',
          800: '#2A1FA6',
          900: '#1A1285',
        },
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        crimson: {
          400: '#F87171',
          500: '#DC2626',
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'spin-slow': 'spin 1.5s linear infinite',
        'pop-in': 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '70%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
