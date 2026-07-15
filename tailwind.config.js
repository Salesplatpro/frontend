/** @type {import('tailwindcss').Config} */
// Theme values resolve to the design tokens in src/styles/tokens.css so that
// Tailwind utilities and CSS modules share a single source of truth.
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust according to your project structure
    './src/**/*.scss', // Include SCSS files
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--color-brand-50)',
          100: 'var(--color-brand-100)',
          200: 'var(--color-brand-200)',
          300: 'var(--color-brand-300)',
          500: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
          800: 'var(--color-brand-800)',
        },
        grey: {
          50: 'var(--color-grey-50)',
          200: 'var(--color-grey-200)',
          300: 'var(--color-grey-300)',
          400: 'var(--color-grey-400)',
          500: 'var(--color-grey-500)',
          600: 'var(--color-grey-600)',
          700: 'var(--color-grey-700)',
          900: 'var(--color-grey-900)',
        },
        charcoal: 'var(--color-charcoal)',
        midnight: 'var(--color-midnight)',
        danger: 'var(--color-danger)',
        accent: 'var(--color-accent)',
        info: 'var(--color-info)',
        success: 'var(--color-success)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          strong: 'var(--color-primary-strong)',
          tint: 'var(--color-primary-tint)',
        },
      },
      fontFamily: {
        raleway: ['var(--font-heading)'],
        poppins: ['var(--font-accent)'],
        inter: ['var(--font-body)'],
      },
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-md)',
        md: 'var(--text-md)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
        '6xl': 'var(--text-6xl)',
        '7xl': 'var(--text-7xl)',
        '8xl': 'var(--text-8xl)',
      },
      boxShadow: {
        custom: 'var(--shadow-sm)',
        'custom-1': 'var(--shadow-md)',
        'custom-2': 'var(--shadow-lg)',
        'custom-blue': 'var(--shadow-glow)',
      },
      zIndex: {
        sticky: 'var(--z-sticky)',
        dropdown: 'var(--z-dropdown)',
        drawer: 'var(--z-drawer)',
        modal: 'var(--z-modal)',
        tooltip: 'var(--z-tooltip)',
        toast: 'var(--z-toast)',
      },
    },
  },
  plugins: [],
}
