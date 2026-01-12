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
        primary: '#111827', // gray-900
        secondary: '#1F2937', // gray-800
      },
      screens: {
        'sm': '375px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      }
    },
  },
  plugins: [],
}
