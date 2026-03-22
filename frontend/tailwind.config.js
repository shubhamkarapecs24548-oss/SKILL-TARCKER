/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        caramel: {
          100: '#fcf8f4',
          200: '#f2dac3',
          300: '#e5c198',
          400: '#d8a878',
          500: '#ca8a56',
          600: '#bc6a36',
          700: '#9b5128',
          800: '#7c4324',
          900: '#643820',
        },
        dark: {
          bg: '#1a1614',
          card: '#241e1c',
          border: '#332b28'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
