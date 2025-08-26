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
        poppins: ['Poppins, san-serif'],
        inter: ['inter, san-serif'],
      },
      boxShadow: {
        custom: '0px 1.52px 3.05px 0px rgba(16, 24, 40, 0.05)',
        'custom-1': '0px 4.09px 6.14px -2.05px rgba(16, 24, 40, 0.05)',
        'custom-2': '0px 12.28px 16.38px -4.09px rgba(16, 24, 40, 0.10)',
        'custom-blue': '0 4px 200px rgba(60, 111, 212, 0.6)',
      },
    },
  },
  plugins: [],
}
