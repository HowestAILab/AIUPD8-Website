/**
 * InternationalizedArray helpers.
 *
 * The `sanity-plugin-internationalized-array` stores values as:
 *   [{ _key: 'nl', value: 'Hallo' }, { _key: 'en', value: 'Hello' }]
 *
 * These utilities make it easy to read from that shape in Vue components.
 */

import type { Locale } from './config'
import { DEFAULT_LOCALE } from './config'

/** The raw array element stored by sanity-plugin-internationalized-array */
export interface I18nEntry<T = unknown> {
  _key: string
  value: T
}

export type I18nArray<T = unknown> = I18nEntry<T>[] | null | undefined

/**
 * Get the value for a locale from an InternationalizedArray.
 * Falls back to DEFAULT_LOCALE, then to the first entry available.
 */
export function getI18n<T>(
  data: I18nArray<T>,
  locale: Locale,
  fallback: Locale = DEFAULT_LOCALE,
): T | undefined {
  if (!Array.isArray(data) || !data.length) return undefined

  const exact = data.find((e) => e._key === locale)
  if (exact?.value !== undefined && exact?.value !== null && exact?.value !== '')
    return exact.value

  const fb = data.find((e) => e._key === fallback)
  if (fb?.value !== undefined && fb?.value !== null && fb?.value !== '')
    return fb.value

  // Last resort: first non-empty entry
  const first = data.find(
    (e) => e.value !== undefined && e.value !== null && e.value !== '',
  )
  return first?.value
}

/**
 * Check whether the field has content for the requested locale.
 * Does NOT fall back – used to determine if a translation exists.
 */
export function hasI18n<T>(data: I18nArray<T>, locale: Locale): boolean {
  if (!Array.isArray(data)) return false
  const entry = data.find((e) => e._key === locale)
  if (!entry) return false
  if (Array.isArray(entry.value)) return entry.value.length > 0
  return entry.value !== undefined && entry.value !== null && entry.value !== ''
}
