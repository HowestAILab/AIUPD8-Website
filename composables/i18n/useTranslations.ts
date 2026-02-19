/**
 * useTranslations
 *
 * Returns a reactive `t(key)` function for the current locale.
 * Falls back to DEFAULT_LOCALE when a key is missing.
 *
 * Usage:
 *   const { t } = useTranslations()
 *   t('nav.database') // → 'database' | 'database'
 */
import { useLocale } from './useLocale'
import { DEFAULT_LOCALE } from './config'
import { translations } from './translations'

export type TranslationKey = keyof typeof translations['nl']

export function useTranslations() {
  const { locale } = useLocale()

  function t(key: TranslationKey): string {
    const dict = (translations as any)[locale.value] ?? (translations as any)[DEFAULT_LOCALE]
    return dict[key] ?? (translations as any)[DEFAULT_LOCALE][key] ?? key
  }

  return { t }
}
