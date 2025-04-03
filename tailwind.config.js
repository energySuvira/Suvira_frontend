/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'btn': '2px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      },
      backgroundColor: {
        'virablue': '#05A6F0',
      },
      objectPosition: {
        'center-bottom': 'center bottom',
      },
      backgroundPosition: {
        'center-top-4': 'center top -2rem',
      }
    },
  },
  plugins: [],
}