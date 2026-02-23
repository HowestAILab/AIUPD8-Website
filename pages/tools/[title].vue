<template>
  <div>
    <HeaderBar variant="white" />
    <div class="pt-16 min-h-screen bg-light-page-background">
      <div class="max-w-6xl mx-auto px-4">
        <div class="py-4">
          <NuxtLink
            to="/database"
            class="inline-flex items-center text-light-page-text-dark hover:underline"
          >
            <i class="pi pi-arrow-left"></i>
            {{ t('tool.backToList') }}
          </NuxtLink>
        </div>
        <div v-if="item" class="py-2">
          <div class="rounded-3xl bg-blue-200 p-8 relative">
            <div class="pb-6">
              <img
                :src="getMediaUrl(item.Image)"
                alt=""
                class="mb-4 w-full object-cover h-80 rounded-xl"
              />
              <div class="flex items-center pb-4 gap-3 flex-wrap">
                <h2 class="text-5xl font-semibold text-black">
                  {{ item.title }}
                </h2>
                <div
                  v-if="item.isFavourite"
                  class="bg-accent-extra text-light-page-text-dark text-md px-6 py-1 rounded-full cursor-default"
                >
                  {{ t('tool.favourite') }}
                </div>
                <div
                  v-if="item.lastChanged && isToolOutdated(item.lastChanged)"
                  class="bg-orange-500 text-white text-md px-6 py-1 rounded-full cursor-default"
                >
                  {{ t('tool.outdated') }}
                </div>
              </div>

              <!-- Beta Badge - Bottom Left -->
              <div class="absolute bottom-8 left-8">
                <div
                  v-if="item.isExperimental"
                  class="bg-blue-500 text-white text-md px-6 py-1 rounded-full cursor-default font-semibold"
                >
                  beta
                </div>
              </div>

              <!-- About section (plain text) -->
              <div class="description mb-6" v-if="item.about">
                <p class="text-gray-700 text-lg">{{ item.about }}</p>
              </div>

              <!-- Description section (plain text) -->
              <div class="description mb-6" v-if="item.description">
                <p class="text-gray-700 text-lg">{{ item.description }}</p>
              </div>

              <!-- Advantages section -->
              <div
                v-if="item.advantages && item.advantages.length > 0"
                class="mb-6"
              >
                <h3 class="font-semibold text-xl mb-3 text-green-700">
                  {{ t('tool.advantages') }}
                </h3>
                <ul class="list-disc list-inside space-y-2">
                  <li
                    v-for="(advantage, index) in item.advantages"
                    :key="index"
                    class="text-gray-700"
                  >
                    {{ advantage }}
                  </li>
                </ul>
              </div>

              <!-- Disadvantages section -->
              <div
                v-if="item.disadvantages && item.disadvantages.length > 0"
                class="mb-6"
              >
                <h3 class="font-semibold text-xl mb-3 text-red-700">
                  {{ t('tool.disadvantages') }}
                </h3>
                <ul class="list-disc list-inside space-y-2">
                  <li
                    v-for="(disadvantage, index) in item.disadvantages"
                    :key="index"
                    class="text-gray-700"
                  >
                    {{ disadvantage }}
                  </li>
                </ul>
              </div>

              <!-- Buttons -->
              <div class="flex gap-3 mt-6">
                <NuxtLink
                  v-if="item.link"
                  :href="item.link"
                  target="_blank"
                  class="inline-flex items-center bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 text-lg"
                >
                  {{ t('tool.goToWebsite') }}
                </NuxtLink>
                <NuxtLink
                  v-if="item.privacyPolicy"
                  :href="item.privacyPolicy"
                  target="_blank"
                  class="inline-flex items-center bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 text-lg"
                >
                  {{ t('tool.privacyPolicy') }}
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Gallery -->
          <div class="py-8" v-if="carouselItems.length > 0">
            <Galleria
              :value="carouselItems"
              :showThumbnails="false"
              :showIndicators="true"
              class="w-full rounded-3xl overflow-hidden"
            >
              <template #item="slotProps">
                <div
                  v-if="slotProps.item.type === 'youtube'"
                  class="video-container w-full"
                >
                  <div class="relative pt-[56.25%]">
                    <iframe
                      :src="getYoutubeEmbedUrl(slotProps.item.url)"
                      frameborder="0"
                      allowfullscreen
                      class="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                  </div>
                </div>
                <div v-else>
                  <img
                    :src="getMediaUrl(slotProps.item)"
                    :alt="item.title"
                    class="w-full h-[416px] object-cover"
                    decoding="async"
                    loading="lazy"
                  />
                </div>
              </template>
            </Galleria>
          </div>

          <!-- Specifications -->
          <div class="p-8 mb-8 bg-gray-100 rounded-3xl">
            <div>
              <h2 class="text-lg font-semibold">{{ t('tool.specifications') }}</h2>
            </div>
            <Divider />
            <div class="flex flex-col gap-4 pt-4">
              <div v-if="item.uses.length > 0">
                <div class="font-bold text-sm text-light-page-text-light">
                  {{ t('tool.use') }}
                </div>
                <div
                  class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
                >
                  <!-- <span
                      v-for="option in specifications.use.options"
                      :key="option"
                      class="sm:flex-1 basis-1/2 text-center px-4 py-1 rounded-full transition-all"
                      :class="{
                        'bg-blue-200 text-blue-500 font-semibold':
                          item.uses.includes(option),
                        'text-gray-500': !item.uses.includes(option),
                      }"
                      >{{ option }}</span
                    > -->
                </div>
              </div>

              <div v-if="item.setups.length > 0">
                <div class="font-bold text-sm text-light-page-text-light">
                  {{ t('tool.setup') }}
                </div>
                <div
                  class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
                >
                  <span
                    v-for="option in specifications.setup.options"
                    :key="option"
                    class="sm:flex-1 basis-1/2 text-center px-4 py-1 rounded-full transition-all"
                    :class="{
                      'bg-blue-200 text-blue-500 font-semibold':
                        item.setups.includes(option),
                      'text-gray-500': !item.setups.includes(option),
                    }"
                    >{{ option }}</span
                  >
                </div>
              </div>

              <div v-if="item.pricings.length > 0">
                <div class="font-bold text-sm text-light-page-text-light">
                  {{ t('tool.pricing') }}
                </div>
                <div
                  class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
                >
                  <span
                    v-for="option in specifications.pricing.options"
                    :key="option"
                    class="sm:flex-1 basis-1/2 text-center px-4 py-1 rounded-full transition-all"
                    :class="{
                      'bg-blue-200 text-blue-500 font-semibold':
                        item.pricings.includes(option),
                      'text-gray-500': !item.pricings.includes(option),
                    }"
                    >{{ option }}</span
                  >
                </div>
              </div>

              <div v-if="item.licenses.length > 0">
                <div class="font-bold text-sm text-light-page-text-light">
                  {{ t('tool.license') }}
                </div>
                <div
                  class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
                >
                  <span
                    v-for="option in specifications.license.options"
                    :key="option"
                    class="sm:flex-1 basis-1/2 text-center px-4 py-1 rounded-full transition-all"
                    :class="{
                      'bg-blue-200 text-blue-500 font-semibold':
                        item.licenses.includes(option),
                      'text-gray-500': !item.licenses.includes(option),
                    }"
                    >{{ option }}</span
                  >
                </div>
              </div>

              <div v-if="item.generationTimes.length > 0">
                <div class="font-bold text-sm text-light-page-text-light">
                  {{ t('tool.averageTime') }}
                </div>
                <div
                  class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
                >
                  <span
                    v-for="option in specifications.averageTime.options"
                    :key="option"
                    class="sm:flex-1 basis-1/2 text-center px-4 py-1 rounded-full transition-all"
                    :class="{
                      'bg-blue-200 text-blue-500 font-semibold':
                        item.generationTimes.includes(option),
                      'text-gray-500': !item.generationTimes.includes(option),
                    }"
                    >{{ option }}</span
                  >
                </div>
              </div>

              <!-- Data Storage Locations -->
              <div
                v-if="
                  item.dataStorageLocations &&
                  item.dataStorageLocations.length > 0
                "
                class="mt-4"
              >
                <div class="font-bold text-sm text-light-page-text-light mb-2">
                  {{ t('tool.dataStorage') }}
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="location in item.dataStorageLocations"
                    :key="location"
                    class="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {{ location }}
                  </span>
                </div>
              </div>

              <!-- Date Added -->
              <div v-if="item.dateAdded" class="mt-4">
                <div class="font-bold text-sm text-light-page-text-light mb-1">
                  {{ t('tool.dateAdded') }}
                </div>
                <span class="text-sm text-gray-700">{{
                  formatDate(item.dateAdded)
                }}</span>
              </div>

              <!-- Last Updated -->
              <div v-if="item.lastChanged" class="mt-4">
                <div class="font-bold text-sm text-light-page-text-light mb-1">
                  {{ t('tool.lastUpdated') }}
                </div>
                <span class="text-sm text-gray-700">{{
                  formatDate(item.lastChanged)
                }}</span>
              </div>
            </div>

            <!-- Additional specifications for inputs, outputs, tasks, and profiles -->
            <div class="mt-8">
              <h2 class="text-lg font-semibold mb-4">{{ t('tool.additionalInfo') }}</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-if="item.inputs.length > 0">
                  <div
                    class="font-bold text-sm text-light-page-text-light mb-2"
                  >
                    {{ t('tool.inputTypes') }}
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="input in item.inputs"
                      :key="input"
                      class="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                    >
                      {{ input }}
                    </span>
                  </div>
                </div>

                <div v-if="item.outputs.length > 0">
                  <div
                    class="font-bold text-sm text-light-page-text-light mb-2"
                  >
                    {{ t('tool.outputTypes') }}
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="output in item.outputs"
                      :key="output"
                      class="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                    >
                      {{ output }}
                    </span>
                  </div>
                </div>

                <div v-if="item.tasks.length > 0">
                  <div
                    class="font-bold text-sm text-light-page-text-light mb-2"
                  >
                    {{ t('tool.tasks') }}
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="task in item.tasks"
                      :key="task"
                      class="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                    >
                      {{ task }}
                    </span>
                  </div>
                </div>

                <div v-if="item.profiles.length > 0">
                  <div
                    class="font-bold text-sm text-light-page-text-light mb-2"
                  >
                    {{ t('tool.suitableFor') }}
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="profile in item.profiles"
                      :key="profile"
                      class="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                    >
                      {{ profile }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Workflows Section: all projects grouped, active project pre-expanded -->
          <div class="mt-8 pb-8">
            <ToolWorkflows
              :aiupdateWorkflows="item.aiupdateWorkflows"
              :psyaidWorkflows="item.psyaidWorkflows"
              :defaultExpandedProjectId="activeProjectId !== 'general' ? activeProjectId : undefined"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import HeaderBar from "~/components/layout/HeaderBar.vue";
import Galleria from "primevue/galleria";
import Divider from "primevue/divider";
import ToolWorkflows from "~/components/workflows/ToolWorkflows.vue";
import { useDatabase, type ToolItem } from "~/composables/useDatabase";
import { useRichText } from "~/composables/useRichText";
import { useMedia } from "~/composables/useMedia";
import { useProjectProfile } from "~/composables/useProjectProfile";
import { useLocale, useTranslations } from "~/composables/i18n";

const { locale } = useLocale();
const { t } = useTranslations();

const route = useRoute();
const item = ref<ToolItem | null>(null);
const { parseRichText } = useRichText();
const { getMediaUrl, getYoutubeEmbedUrl } = useMedia();
const { activeProjectId } = useProjectProfile();

// Format date helper
function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(locale.value === 'nl' ? 'nl-BE' : 'en-GB', {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Check if tool is outdated (> 5 months)
function isToolOutdated(lastChangedDate: string): boolean {
  if (!lastChangedDate) return false;
  const lastChanged = new Date(lastChangedDate);
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
  return lastChanged < fiveMonthsAgo;
}

// Update computed property for carousel items using normal media loader
const carouselItems = computed(() => {
  if (!item.value) return [];
  // Copy showcase images to avoid mutating original array.
  const slides = item.value.showcaseImages
    ? [...item.value.showcaseImages]
    : [];
  // Add a youtube slide if present with a new property "type"
  if (item.value.youtubeLink) {
    slides.push({ type: "youtube", url: item.value.youtubeLink });
  }
  return slides;
});

const specifications = {
  use: { options: ["no-code", "low-code", "code"] },
  setup: { options: ["no-code", "low-code", "code"] },
  pricing: { options: ["free", "subscription", "credits"] },
  license: { options: ["personal", "commercial"] },
  averageTime: { options: ["seconds", "minutes", "hours", "days"] },
};

onMounted(async () => {
  const { fetchToolById } = useDatabase();
  const titleParam = Array.isArray(route.params.title)
    ? route.params.title[0]
    : route.params.title;
  item.value = await fetchToolById(titleParam);
  console.log("Tool data:", item.value);
  if (item.value && item.value.showcaseImages) {
    console.log("Showcase images:", item.value.showcaseImages);
  }
});

function preloadImages(items: Array<any>) {
  if (!items || items.length === 0) return;
  items.forEach((media) => {
    if (media && media.type !== "youtube") {
      try {
        const url = getMediaUrl(media);
        const img = new Image();
        img.decoding = "async" as any;
        img.loading = "eager" as any;
        img.src = url;
        if (img.decode) {
          img.decode().catch(() => {});
        }
      } catch (_) {
        // ignore preload errors
      }
    }
  });
}

watch(
  () => carouselItems.value,
  (newItems: any) => {
    preloadImages(newItems);
  },
  { immediate: true }
);
</script>

<style scoped>
.p-galleria {
  border: none !important;
  border-radius: 1.5rem !important;
  overflow: hidden;
}

.p-galleria .p-galleria-content,
.p-galleria .p-galleria-item-wrapper,
.p-galleria .p-galleria-item,
.p-galleria-item-container {
  border-radius: 1.5rem !important;
  overflow: hidden;
}

.p-galleria-item img {
  border-radius: 1.5rem !important;
}

.rich-text-content :deep(p) {
  margin-bottom: 1rem;
}

.rich-text-content :deep(h1),
.rich-text-content :deep(h2),
.rich-text-content :deep(h3),
.rich-text-content :deep(h4),
.rich-text-content :deep(h5),
.rich-text-content :deep(h6) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.rich-text-content :deep(h1) {
  font-size: 1.8rem;
}

.rich-text-content :deep(h2) {
  font-size: 1.5rem;
}

.rich-text-content :deep(h3) {
  font-size: 1.25rem;
}

.rich-text-content :deep(a) {
  color: #3178f2;
  text-decoration: underline;
}

.rich-text-content :deep(ul),
.rich-text-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.rich-text-content :deep(li) {
  margin-bottom: 0.25rem;
}

.rich-text-content :deep(blockquote) {
  border-left: 4px solid #e2e8f0;
  padding-left: 1rem;
  margin-left: 0;
  margin-right: 0;
  font-style: italic;
}

.rich-text-content :deep(code) {
  background: #f1f5f9;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.rich-text-content :deep(pre) {
  background: #1e293b;
  color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.rich-text-content :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
}

.video-container {
  max-width: 100%;
  margin: 0 auto;
}

/* pt-[56.25%] gives us a 16:9 aspect ratio (9/16 = 0.5625 or 56.25%) */
.video-container .relative {
  background-color: #000;
}
</style>
