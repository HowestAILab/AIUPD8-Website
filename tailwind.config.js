// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app.vue",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./components/**/*.vue",
    "./plugins/**/*.js",
  ],
  theme: {
    extend: {
      // Example custom colors for branding (remove or modify as needed)
      colors: {
        blueBrand: "#3178F2",
        darkBlueBrand: "#1E50A2",
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
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
  plugins: [],
};
