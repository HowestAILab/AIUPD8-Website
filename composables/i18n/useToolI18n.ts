/**
 * useToolI18n.ts
 *
 * Utilities for resolving internationalized field values on Tool documents.
 *
 * Tools store translatable content as:
 *   - string fields  → [{ _key: 'nl', value: 'text' }, { _key: 'en', value: 'text' }]
 *   - factList fields → [{ _key: 'nl', value: ['item 1', 'item 2'] }, ...]
 *
 * Old (pre-migration) documents may still have plain string / string[] values.
 * All helpers handle both formats gracefully.
 *
 * The `useToolI18n()` composable is locale-aware and re-evaluates when
 * the active locale changes.
 */

import { computed } from 'vue'
import { useLocale } from '~/composables/i18n'
import { DEFAULT_LOCALE } from '~/composables/i18n/config'

// ── Types ────────────────────────────────────────────────────────────────────

/** One language entry inside an internationalizedArray field. */
export interface I18nEntry<T> {
  _key: string
  value: T
}

/** Raw i18n payload attached to each Tool, keyed by field name. */
export interface ToolI18n {
  title?: I18nEntry<string>[]
  toolsentence?: I18nEntry<string>[]
  advantages?: I18nEntry<string[]>[]
  disadvantages?: I18nEntry<string[]>[]
  limitations?: I18nEntry<string[]>[]
}

export interface WorkflowI18n {
  nameI18n?: I18nEntry<string>[]
  steps?: WorkflowStepI18n[]
}

export interface WorkflowStepI18n {
  titleI18n?: I18nEntry<string>[]
  shortDescriptionI18n?: I18nEntry<string>[]
}

// ── Pure resolution helpers (no Vue reactivity, importable anywhere) ──────────

/**
 * Resolve a string field that is either:
 *   - a plain string (old data)
 *   - an internationalizedArray [{_key, value}] (new data)
 *
 * Tries `locale`, then `fallback`, then first available entry.
 */
export function resolveI18nString(
  field: string | I18nEntry<string>[] | null | undefined,
  locale: string,
  fallback: string = DEFAULT_LOCALE,
): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  if (!Array.isArray(field)) return ''
  const byLocale = field.find((e) => e._key === locale)?.value
  if (byLocale) return byLocale
  const byFallback = field.find((e) => e._key === fallback)?.value
  if (byFallback) return byFallback
  return field[0]?.value ?? ''
}

/**
 * Resolve a fact-list field that is either:
 *   - a plain string[] (old data)
 *   - an internationalizedArray [{_key, value: string[]}] (new data)
 */
export function resolveI18nStringArray(
  field: string[] | I18nEntry<string[]>[] | null | undefined,
  locale: string,
  fallback: string = DEFAULT_LOCALE,
): string[] {
  if (!field) return []
  if (!Array.isArray(field) || field.length === 0) return []
  // Detect old format: first element is a plain string
  if (typeof field[0] === 'string') return field as string[]
  const entries = field as I18nEntry<string[]>[]
  const byLocale = entries.find((e) => e._key === locale)?.value
  if (byLocale?.length) return byLocale
  const byFallback = entries.find((e) => e._key === fallback)?.value
  if (byFallback?.length) return byFallback
  return entries[0]?.value ?? []
}

/**
 * Returns true if the given i18n array has a non-empty value for `locale`.
 * Returns true for plain (non-i18n) fields so old data is never hidden.
 */
export function hasLocaleContent(
  i18nField: I18nEntry<string | string[]>[] | null | undefined,
  locale: string,
): boolean {
  if (!i18nField || !Array.isArray(i18nField) || i18nField.length === 0) return true
  // Detect old format (plain string array rather than i18n entries)
  if (typeof i18nField[0] === 'string') return true
  const entry = i18nField.find((e) => e._key === locale)
  if (!entry) return false
  const v = entry.value
  if (typeof v === 'string') return v.trim().length > 0
  if (Array.isArray(v)) return v.length > 0
  return !!v
}

// ── Composable ───────────────────────────────────────────────────────────────

/**
 * Locale-aware helper composable for resolving tool i18n fields.
 *
 * Usage:
 *   const { resolveString, resolveStringArray, toolHasLocaleContent } = useToolI18n()
 *   const title = resolveString(tool.i18n?.title)
 */
export function useToolI18n() {
  const { locale } = useLocale()

  /** Resolve a string field to the active locale. */
  const resolveString = (field: string | I18nEntry<string>[] | null | undefined) =>
    resolveI18nString(field, locale.value)

  /** Resolve a fact-list field to the active locale. */
  const resolveStringArray = (field: string[] | I18nEntry<string[]>[] | null | undefined) =>
    resolveI18nStringArray(field, locale.value)

  /** Returns true if the tool has the active locale's content in the given field. */
  const fieldHasLocaleContent = (
    i18nField: I18nEntry<string | string[]>[] | null | undefined,
  ) => hasLocaleContent(i18nField, locale.value)

  /**
   * Returns true if the tool has any localized content for the active locale.
   * Used for the "localized only" toggle – checks the title field as proxy.
   */
  const toolHasLocaleContent = (toolI18n: ToolI18n | undefined | null): boolean => {
    if (!toolI18n?.title) return true // no i18n data → old tool, always show
    return hasLocaleContent(toolI18n.title, locale.value)
  }

  return { resolveString, resolveStringArray, fieldHasLocaleContent, toolHasLocaleContent }
}
