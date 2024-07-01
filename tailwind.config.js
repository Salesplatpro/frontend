// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ['./index.html', '../src/**/*.{js,ts,jsx,tsx}'],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust according to your project structure
    './src/**/*.scss', // Include SCSS files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
