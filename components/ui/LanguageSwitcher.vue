<template>
  <div class="relative" ref="dropdownRef">
    <button
      :aria-label="`Taal / Language: ${LOCALE_NAMES[locale]}`"
      aria-haspopup="listbox"
      :aria-expanded="open"
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 select-none"
      @click="open = !open"
    >
      <span>{{ LOCALE_FLAGS[locale] }}</span>
      <span class="uppercase tracking-wide">{{ locale }}</span>
      <svg
        :class="['w-3.5 h-3.5 transition-transform', open && 'rotate-180']"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <ul
        v-if="open"
        role="listbox"
        class="absolute right-0 mt-1.5 w-36 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 origin-top-right"
      >
        <li
          v-for="loc in LOCALES"
          :key="loc"
          role="option"
          :aria-selected="locale === loc"
          class="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors"
          :class="locale === loc
            ? 'bg-main/10 text-main font-semibold'
            : 'text-gray-700 hover:bg-gray-50'"
          @click="select(loc)"
        >
          <span>{{ LOCALE_FLAGS[loc] }}</span>
          <span>{{ LOCALE_NAMES[loc] }}</span>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useLocale, LOCALES, LOCALE_NAMES, LOCALE_FLAGS } from '~/composables/i18n'
import type { Locale } from '~/composables/i18n'

const { locale, setLocale } = useLocale()
const open = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function select(loc: Locale) {
  setLocale(loc)
  open.value = false
}

function handleOutsideClick(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleOutsideClick))
</script>
