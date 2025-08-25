<template>
  <section class="max-w-6xl mx-auto px-4 py-10">
    <div :class="containerClass">
      <div class="flex-1">
        <h3 class="text-2xl font-semibold mb-1 text-primary">{{ heading }}</h3>
        <p v-if="subtitle" class="text-sm font-medium text-gray-500 mb-3">{{ subtitle }}</p>
        <SanityPortableText v-if="blocks && blocks.length" :blocks="blocks" />
        <p v-else-if="text" class="text-gray-700">{{ text }}</p>
      </div>
      <div class="flex-1">
        <div class="relative rounded-2xl overflow-hidden shadow bg-white">
          <img :src="imageUrl" :alt="imageAlt || heading" class="w-full h-auto object-cover" />
          <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-main rounded-full blur-xl opacity-60 pointer-events-none" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SanityPortableText from '~/components/SanityPortableText.vue';
import { useMedia } from '~/composables/useMedia';

const props = defineProps<{
  heading: string;
  subtitle?: string;
  blocks?: any[];
  text?: string;
  image: any; // Can be Sanity image or direct URL string
  imageAlt?: string;
  reverse?: boolean;
}>();

const { getMediaUrl, getSanityImageUrl } = useMedia();

const imageUrl = computed(() => {
  if (!props.image) return '';
  // Support both Sanity image and string URLs
  if (typeof props.image === 'string') return props.image;
  return getSanityImageUrl(props.image) || getMediaUrl(props.image);
});

const containerClass = computed(() => {
  return [
    'grid grid-cols-1 md:grid-cols-2 gap-8 items-center',
    props.reverse ? 'md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1' : ''
  ].join(' ');
});
</script>


