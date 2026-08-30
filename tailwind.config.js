/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        na: {
          blue: '#1e3a8a',
          dark: '#0f172a',
          slate: '#334155',
          gold: '#d97706',
        }
      }
    },
  },
  plugins: [],
}
