const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans': ['Quicksand'],
    },
    extend: {
      colors: {
        fuchsia: colors.fuchsia,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
      require("@tailwindcss/forms")
  ],
}
