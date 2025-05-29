/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#39ff14',
        'neon-cyan': '#00f3ff',
        'neon-pink': '#ff00ff',
        'dark-100': '#0a0a0a',
        'dark-200': '#151515',
        'dark-300': '#202020',
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
}