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
            ← Back to List
          </NuxtLink>
        </div>
        <div v-if="item" class="py-2">
          <div class="rounded-3xl bg-blue-200 p-8">
            <div class="pb-6 relative">
              <img
                :src="getMediaUrl(item.Image)"
                alt=""
                class="mb-4 w-full object-cover h-80 rounded-xl"
              />
              <div class="flex items-center pb-4">
                <h2 class="text-5xl font-semibold text-black mr-5">
                  {{ item.title }}
                </h2>
                <div
                  v-if="item.isFavourite"
                  class="bg-accent-extra text-light-page-text-dark text-md px-6 py-1 rounded-full cursor-default"
                >
                  our favourite
                </div>
              </div>
              <div
                class="w-full break-words rich-text-content"
                v-html="parsedDescription"
              ></div>
              <!-- New website button -->
              <div v-if="item.link" class="mt-4">
                <NuxtLink
                  :href="item.link"
                  target="_blank"
                  class="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                >
                  Go to Tool Website
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
                <div v-if="slotProps.item.type === 'youtube'">
                  <iframe
                    :src="getYoutubeEmbedUrl(slotProps.item.url)"
                    frameborder="0"
                    allowfullscreen
                    class="w-full h-[416px]"
                  ></iframe>
                </div>
                <div v-else>
                  <img
                    :src="getMediaUrl(slotProps.item)"
                    :alt="item.title"
                    class="w-full h-[416px] object-cover"
                  />
                </div>
              </template>
            </Galleria>
          </div>

          <!-- Specifications -->
          <div class="p-8 mb-8 bg-gray-100 rounded-3xl">
            <div>
              <h2 class="text-lg font-semibold">Specifications</h2>
            </div>
            <Divider />
            <div class="flex flex-col gap-4 pt-4">
              <div v-if="item.uses.length > 0">
                <div class="font-bold text-sm text-light-page-text-light">
                  use
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
                  setup
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
                  pricing
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
                  license
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
                  average time
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
            </div>

            <!-- Additional specifications for inputs, outputs, tasks, and profiles -->
            <div class="mt-8">
              <h2 class="text-lg font-semibold mb-4">Additional Information</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-if="item.inputs.length > 0">
                  <div
                    class="font-bold text-sm text-light-page-text-light mb-2"
                  >
                    Input Types
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
                    Output Types
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
                    Supported Tasks
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
                    Suitable For
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import HeaderBar from "~/components/layout/HeaderBar.vue";
import Galleria from "primevue/galleria";
import Divider from "primevue/divider";
import { useDatabase } from "~/composables/useDatabase";
import { useRichText } from "~/composables/useRichText";
import { useMedia } from "~/composables/useMedia";

const route = useRoute();
const item = ref(null);
const { parseRichText } = useRichText();
const { getMediaUrl, getYoutubeEmbedUrl } = useMedia();

// Update computed property for carousel items using normal media loader
const carouselItems = computed(() => {
  if (!item.value) return [];
  // Use the showcase images directly.
  let slides = item.value.showcaseImages || [];
  // Add a youtube slide if present with a new property "type"
  if (item.value.youtubeLinks) {
    slides.push({ type: "youtube", url: item.value.youtubeLinks });
  }
  return slides;
});

const parsedDescription = computed(() => {
  if (!item.value || !item.value.description) return "";
  return parseRichText(item.value.description);
});

const specifications = {
  use: { options: ["no-code", "low-code", "code"] },
  setup: { options: ["no-code", "low-code", "code"] },
  pricing: { options: ["free", "freemium", "subscription", "credits"] },
  license: { options: ["personal", "commercial"] },
  averageTime: { options: ["seconds", "minutes", "hours", "days"] },
};

onMounted(async () => {
  const { fetchToolById } = useDatabase();
  item.value = await fetchToolById(route.params.title);
  console.log("Tool data:", item.value);
  if (item.value && item.value.showcaseImages) {
    console.log("Showcase images:", item.value.showcaseImages);
  }
});
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
</style>
