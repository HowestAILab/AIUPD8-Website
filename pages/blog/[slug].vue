<template>
  <div>
    <HeaderBar variant="white" />
    <div class="pt-16 min-h-screen bg-light-page-background">
      <div class="container mx-auto p-4">
        <div v-if="loading" class="text-center py-8">
          <p>{{ t('blog.postLoading') }}</p>
        </div>
        <div v-else-if="error" class="text-center text-red-500 py-8">
          {{ error }}
        </div>
        <div
          v-else-if="post"
          class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md"
        >
          <h1 class="text-4xl font-bold mb-4">{{ postTitle }}</h1>
          <p class="text-gray-500 mb-4">{{ formatDate(post.publishedAt) }}</p>
          <img
            v-if="post.mainImage"
            :src="getMediaUrl(post.mainImage)"
            :alt="postTitle"
            class="w-full h-auto object-cover rounded-lg mb-8"
          />

          <!-- Content not available notice -->
          <ContentNotAvailable
            v-if="!hasBody"
            :locale="locale"
            kind="post"
          />

          <template v-else>
            <SanityPortableText :blocks="postBody" />

            <!-- Outro Section -->
            <div
              v-if="postOutro.length"
              class="mt-8 p-8 bg-blue-200 rounded-3xl text-black"
            >
              <div class="prose max-w-none">
                <SanityPortableText :blocks="postOutro" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import HeaderBar from "~/components/layout/HeaderBar.vue";
import SanityPortableText from "~/components/content/SanityPortableText.vue";
import ContentNotAvailable from "~/components/ui/ContentNotAvailable.vue";
import { useBlog, type BlogPost } from "~/composables/useBlog";
import { useMedia } from "~/composables/useMedia";
import { useLocale, getI18n, hasI18n, useTranslations } from "~/composables/i18n";

const { t } = useTranslations();

const route = useRoute();
const { loading, error, fetchBlogPostBySlug } = useBlog();
const { getMediaUrl } = useMedia();
const { locale } = useLocale();
const post = ref<BlogPost | null>(null);

const postTitle = computed(() =>
  post.value ? (getI18n(post.value.title, locale.value) ?? '—') : ''
)

const hasBody = computed(() =>
  post.value ? hasI18n(post.value.body, locale.value) : false
)

const postBody = computed(() =>
  post.value ? (getI18n(post.value.body, locale.value) ?? []) : []
)

const postOutro = computed(() =>
  post.value ? (getI18n(post.value.outro, locale.value) ?? []) : []
)

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(
    locale.value === 'nl' ? 'nl-BE' : 'en-GB',
    options,
  );
};

onMounted(async () => {
  const slug = route.params.slug as string;
  post.value = await fetchBlogPostBySlug(slug);
});
</script>
