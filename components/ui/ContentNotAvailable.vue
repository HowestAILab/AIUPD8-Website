<template>
  <div
    class="flex items-start gap-3 bg-amber-50 border-l-4 border-amber-400 px-4 py-3 my-6 rounded-r-lg"
    role="alert"
  >
    <!-- Warning icon -->
    <svg
      class="flex-shrink-0 h-5 w-5 text-amber-500 mt-0.5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clip-rule="evenodd"
      />
    </svg>

    <p class="text-sm text-amber-700">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Locale } from '~/composables/i18n'

export type ContentKind = 'artikel' | 'post' | 'project' | 'pagina'

const props = withDefaults(
  defineProps<{
    /** The locale the user is currently viewing */
    locale: Locale
    /** What kind of content item is missing the translation */
    kind?: ContentKind
  }>(),
  { kind: 'artikel' },
)

/**
 * Messages keyed by [locale (what we're trying to show)][kind]
 * When locale is 'nl' it means the nl translation is missing → show Dutch fallback notice.
 * When locale is 'en' it means the en translation is missing → show English notice.
 */
const MESSAGES: Record<Locale, Record<ContentKind, string>> = {
  nl: {
    artikel: 'Dit artikel is niet beschikbaar in het Nederlands.',
    post: 'Deze post is niet beschikbaar in het Nederlands.',
    project: 'Dit project is niet beschikbaar in het Nederlands.',
    pagina: 'Deze pagina is niet beschikbaar in het Nederlands.',
  },
  en: {
    artikel: 'This article is not available in English.',
    post: 'This post is not available in English.',
    project: 'This project is not available in English.',
    pagina: 'This page is not available in English.',
  },
}

const message = computed(() => MESSAGES[props.locale][props.kind])
</script>
