// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  // Optional date or versioning
  // compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ["@nuxtjs/strapi", "@nuxtjs/tailwindcss", "@nuxtjs/google-fonts"],

  // Basic Strapi config:
  strapi: {
    // If your Strapi is running at, e.g., http://localhost:1337
    url: process.env.STRAPI_URL || "http://localhost:1337",
    // You can adjust options here if needed
  },

  googleFonts: {
    families: {
      'Space Grotesk': [400, 500, 600, 700],
    },
  },

  compatibilityDate: "2025-01-30",
});