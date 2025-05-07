/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        blue: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c5d9ff',
          300: '#a2c0ff',
          400: '#799efd',
          500: '#547bfa',
          600: '#3f5ff0',
          700: '#3248d8',
          800: '#1E3A8A', // primary blue
          900: '#192659',
        },
        teal: {
          50: '#edfcf9',
          100: '#d2f9f3',
          200: '#a9f2e9',
          300: '#72e5dc',
          400: '#3acfc7',
          500: '#19b6af',
          600: '#0D9488', // secondary teal
          700: '#0a7069',
          800: '#0b5854',
          900: '#0a4945',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};