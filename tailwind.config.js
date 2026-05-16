/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d67a5c',
        brandDark: '#1A1A1A',
        brandCream: '#FAFAF7'
      },
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],
      },
      borderRadius: {
        'eight': '8px'
      }
    },
  },
  plugins: [],
}
