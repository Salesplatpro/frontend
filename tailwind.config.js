/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust according to your project structure
    './src/**/*.scss', // Include SCSS files
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ['Raleway, san-serif'],
      },
      boxShadow: {
        custom: '0px 1.52px 3.05px 0px rgba(16, 24, 40, 0.05)',
      },
    },
  },
  plugins: [],
}
