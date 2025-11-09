/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#40A9FF',
          50: '#E6F7FF',
          100: '#BAE7FF',
          200: '#91D5FF',
          300: '#69C0FF',
          400: '#40A9FF',
          500: '#1890FF',
          600: '#096DD9',
          700: '#0050B3',
          800: '#003A8C',
          900: '#002766',
        },
        secondary: {
          DEFAULT: '#708238',
          50: '#F4F6EC',
          100: '#E8EDD9',
          200: '#D1DBB3',
          300: '#BAC98D',
          400: '#A3B767',
          500: '#708238',
          600: '#5A682D',
          700: '#434E22',
          800: '#2D3417',
          900: '#161A0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
