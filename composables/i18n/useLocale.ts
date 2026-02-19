/**
 * useLocale – composable for reading and setting the active locale.
 *
 * Usage in any component:
 *   const { locale, setLocale, isNl, isEn } = useLocale()
 *
 * The locale is persisted in localStorage so it survives page reloads.
 * Default is Dutch (nl).
 */

import { ref, computed } from 'vue'
import type { Locale } from './config'
import { DEFAULT_LOCALE, LOCALES } from './config'

const STORAGE_KEY = 'aiupd8-locale'

// Module-level reactive state – shared across all composable instances
const _locale = ref<Locale>(DEFAULT_LOCALE)
let _hydrated = false

function hydrateFromStorage(): void {
  if (_hydrated || typeof window === 'undefined') return
  _hydrated = true
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && LOCALES.includes(stored as Locale)) {
      _locale.value = stored as Locale
    }
  } catch {
    // localStorage may be unavailable (SSR / private browsing)
  }
}

export function useLocale() {
  // Hydrate once on first call inside browser
  if (process.client) {
    hydrateFromStorage()
  }

  const locale = _locale

  const setLocale = (newLocale: Locale) => {
    if (!LOCALES.includes(newLocale)) return
    _locale.value = newLocale
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, newLocale)
      } catch { /* noop */ }
    }
  }

  const isNl = computed(() => _locale.value === 'nl')
  const isEn = computed(() => _locale.value === 'en')

  return { locale, setLocale, isNl, isEn }
}
