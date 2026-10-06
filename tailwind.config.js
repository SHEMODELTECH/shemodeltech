// Black scale used in place of yellow and green.
const INK = {
  50: '#F5F5F5', 100: '#EBEBEB', 200: '#D4D4D4', 300: '#A3A3A3', 400: '#404040',
  500: '#111111', 600: '#000000', 700: '#000000', 800: '#000000', 900: '#000000', 950: '#000000',
};

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      // Brand: She Model Tech logo pink, black, and white.
      colors: {
        pink: {
          50: '#FDF2F7', 100: '#FCE4EF', 200: '#F9C6DD', 300: '#F49BC2', 400: '#EC5C9C',
          500: '#E0146C', 600: '#D41470', 700: '#B0105C', 800: '#8C0D49', 900: '#6E0A3A',
        },
        gray: {
          50: '#FAFAFA', 100: '#F5F5F5', 200: '#E5E5E5', 300: '#D4D4D4', 400: '#A3A3A3',
          500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#111111', 950: '#000000',
        },
        brand: { pink: '#D41470', black: '#000000', white: '#FFFFFF' },
        // No yellow or green on She Model Tech: every yellow, amber, green,
        // emerald and lime class shows as black (light shades as light grey).
        yellow: INK, amber: INK, green: INK, emerald: INK, lime: INK,
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
