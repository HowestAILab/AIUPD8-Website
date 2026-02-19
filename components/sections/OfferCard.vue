<template>
  <div class="w-full flex flex-col h-full">
    <div class="mb-3">
      <h3 class="text-4xl font-semibold text-primary">{{ localHeading }}</h3>
      <p v-if="localSubtitle" class="text-md font-medium text-gray-500 mt-1">
        {{ localSubtitle }}
      </p>
    </div>

    <div v-if="hasBody" class="text-gray-700">
      <SanityPortableText :blocks="localBody" />
    </div>

    <div v-if="hasVariants" class="mt-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="(v, i) in localVariants"
          :key="i"
          class="p-4 bg-white rounded-xl border shadow-sm"
        >
          <p class="font-semibold">{{ v.name }}</p>
          <p v-if="v.description" class="text-sm text-gray-600 mt-1">
            {{ v.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SanityPortableText from "~/components/content/SanityPortableText.vue";
import { useMedia } from "~/composables/useMedia";
import { useLocale, getI18n } from "~/composables/i18n";
import type { OfferItem } from "~/composables/useOffer";

const props = defineProps<{
  heading: OfferItem['heading'];
  subtitle?: OfferItem['subtitle'];
  blocks?: OfferItem['body'];
  variants?: OfferItem['variants'];
  image?: any;
  imageAlt?: string;
  contactEmail?: string;
}>();

const { locale } = useLocale();

const localHeading = computed(() => getI18n(props.heading, locale.value) ?? '')
const localSubtitle = computed(() => getI18n(props.subtitle, locale.value) ?? '')

// Use getI18n (with DEFAULT_LOCALE fallback) so Dutch body shows even when locale=en.
const localBody = computed(() => getI18n(props.blocks, locale.value) ?? [])
const hasBody = computed(() => Array.isArray(localBody.value) && localBody.value.length > 0)

const hasVariants = computed(
  () => Array.isArray(props.variants) && props.variants.length > 0
)
const localVariants = computed(() =>
  (props.variants ?? []).map((v) => ({
    name: getI18n(v.name, locale.value) ?? '',
    description: getI18n(v.description, locale.value) ?? '',
  }))
)

const { getSanityImageUrl, getMediaUrl } = useMedia();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
