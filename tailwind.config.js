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
    },
  },
  plugins: [],
}
