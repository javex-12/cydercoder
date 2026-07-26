/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Calm night + soft terracotta
        paper: '#121110',
        surface: '#1C1A17',
        ink: '#F2EFE8',
        'ink-muted': '#B5AFA4',
        void: '#0A0908',
        orange: '#D4653A',
        'orange-soft': '#E8A07A',
        blue: '#8AB0E8',
        primary: '#D4653A',
        brandDark: '#0A0908',
        brandCream: '#F2EFE8',
      },
      fontFamily: {
        display: ['"Big Shoulders Stencil Display"', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'sans-serif'],
        mono: ['"Martian Mono"', 'monospace'],
        sans: ['"Hanken Grotesk"', 'sans-serif'],
      },
      fontSize: {
        caption: ['12px', { lineHeight: '1.5', letterSpacing: '0.08em' }],
        'body-lg': ['20px', { lineHeight: '1.5', fontWeight: '500' }],
        h4: ['24px', { lineHeight: '1.15', fontWeight: '500' }],
        h3: ['34px', { lineHeight: '0.95', fontWeight: '700' }],
        h2: ['48px', { lineHeight: '0.9', fontWeight: '900' }],
        h1: ['96px', { lineHeight: '0.82', fontWeight: '900' }],
      },
      maxWidth: {
        doc: '980px',
      },
      transitionTimingFunction: {
        guillotine: 'cubic-bezier(0.83, 0, 0.17, 1)',
      },
    },
  },
  plugins: [],
}
