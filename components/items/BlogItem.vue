<template>
  <div class="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
    <nuxt-link :to="`/blog/${post.slug}`">
      <img :src="getMediaUrl(post.mainImage)" alt="" class="w-full object-cover h-48">
      <div class="p-5">
        <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
        <p class="text-gray-600 mb-4">{{ excerpt }}</p>
        <p class="text-sm text-gray-500">{{ formatDate(post.publishedAt) }}</p>
      </div>
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMedia } from '~/composables/useMedia';
import type { BlogPost } from '~/composables/useBlog';
import { useLocale, getI18n } from '~/composables/i18n';

const { getMediaUrl } = useMedia();
const { locale } = useLocale();

const props = defineProps<{
  post: BlogPost;
}>();

const title = computed(() =>
  getI18n(props.post.title, locale.value) ?? '—'
)

const excerpt = computed(() =>
  getI18n(props.post.excerpt, locale.value) ?? ''
)

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(locale.value === 'nl' ? 'nl-BE' : 'en-GB', options);
};
</script> 