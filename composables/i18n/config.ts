/**
 * i18n configuration for AIUPD8 website.
 *
 * Dutch (nl) is the default language.
 * English (en) is the secondary language.
 *
 * Keep this as the single source-of-truth for locale settings.
 */

export const LOCALES = ['nl', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'nl'

export const LOCALE_NAMES: Record<Locale, string> = {
  nl: 'Nederlands',
  en: 'English',
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  nl: '🇧🇪',
  en: '🇬🇧',
}

/** Browser date-format locale codes */
export const LOCALE_DATE_CODES: Record<Locale, string> = {
  nl: 'nl-BE',
  en: 'en-GB',
}
