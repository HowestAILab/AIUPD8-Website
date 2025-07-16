<template>
  <div>
    <HeaderBar variant="white" />
    <div class="pt-16 min-h-screen bg-light-page-background">
      <div class="container mx-auto p-4">
        <div v-if="loading" class="text-center py-8">
          <p>Loading post...</p>
        </div>
        <div v-else-if="error" class="text-center text-red-500 py-8">
          {{ error }}
        </div>
        <div v-else-if="post" class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>
          <p class="text-gray-500 mb-4">{{ formatDate(post.publishedAt) }}</p>
          <img v-if="post.mainImage" :src="getMediaUrl(post.mainImage)" :alt="post.title" class="w-full h-auto object-cover rounded-lg mb-8">
          <SanityPortableText :blocks="post.body" />
          
          <!-- Outro Section -->
          <div v-if="post.outro && post.outro.length > 0" class="mt-8 p-6 bg-highlight rounded-lg text-gray-700">
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Conclusion</h3>
            <SanityPortableText :blocks="post.outro" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import HeaderBar from '~/components/layout/HeaderBar.vue';
import SanityPortableText from '~/components/SanityPortableText.vue';
import { useBlog, type BlogPost } from '~/composables/useBlog';
import { useMedia } from '~/composables/useMedia';

const route = useRoute();
const { loading, error, fetchBlogPostBySlug } = useBlog();
const { getMediaUrl } = useMedia();
const post = ref<BlogPost | null>(null);

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(async () => {
  const slug = route.params.slug as string;
  post.value = await fetchBlogPostBySlug(slug);
});
</script> 