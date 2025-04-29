// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  colorMode: {
    preference: "light",
  },
  content: [
    "./app.vue",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./components/**/*.vue",
    "./plugins/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        main: "#4285F4",
        highlight: "#C6DAFB",
        accent: "#FC7509",
        "accent-extra": "#FFDADB",
        "accent-extra2": "#FDFD96",
        "light-page": {
          "text-dark": "#000000",
          "text-light": "#535353",
          background: "#FFFFFF",
        },
        "dark-page": {
          "text-dark": "#FFFFFF",
          "text-light": "#A9A9A9",
          background: "#000000",
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', "sans-serif"],
      },
      keyframes: {
        slideDown: {
          "0%": { height: "0px" },
          "100%": { height: "var(--reka-accordion-content-height)" },
        },
        slideUp: {
          "0%": { height: "var(--reka-accordion-content-height)" },
          "100%": { height: "0px" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        fadeIn: "fadeIn 500ms ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-primeui")],
};
