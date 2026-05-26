/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#03070a',   
        'brand-text': '#001624',    
        'brand-primary': '#475569', 
        'brand-accent': '#334154',   
        'brand-border': '#E2E8F0',  
        'brand-surface': '#FFFFFF', 
      },
      fontFamily: {
        sans: ['Instrument Sans', 'sans-serif'],
        mono: ['Chivo Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}