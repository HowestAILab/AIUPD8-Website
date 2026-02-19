/**
 * locale-init.client.ts
 *
 * Runs on the client only (browser).
 * Initialises the locale from localStorage on app boot.
 * If no locale is stored, Dutch (nl) is used as the default.
 */

import { defineNuxtPlugin } from '#app'
import { useLocale } from '~/composables/i18n'

export default defineNuxtPlugin(() => {
  // Calling useLocale() here triggers the hydration from localStorage.
  // The composable already handles the default (nl) if nothing is stored.
  useLocale()
})
