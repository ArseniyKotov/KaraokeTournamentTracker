/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#0F172A',
          container: '#1E293B',
          accent: '#3B82F6',
          text: '#F3F4F6',
          highlight: '#10B981'
        }
      }
    },
  },
  plugins: [],
}
