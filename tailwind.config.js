/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Couleurs extraites de votre Brand Kit
          'brand-text': '#001624',     // [cite: 12]
          'brand-primary': '#475569',  // [cite: 14]
          'brand-accent': '#334154',   // 
          'brand-border': '#E2E8F0',   // [cite: 23]
          'brand-surface': '#FFFFFF',  // [cite: 19]
        },
        fontFamily: {
          // Vos deux polices choisies sur Fontpair
          sans: ['"Instrument Sans"', 'sans-serif'], // [cite: 21, 28]
          mono: ['"Chivo Mono"', 'monospace'],      // [cite: 22, 28]
        },
      },
    },
    plugins: [],
  }