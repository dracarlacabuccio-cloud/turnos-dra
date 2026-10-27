/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F7F3EA',
        sage: '#A9B9A6',
        deepGreen: '#315D5A',
        terracotta: '#C9826B',
        charcoal: '#263333',
        sand: '#E7D8B5',
      }
    },
  },
  plugins: [],
}
