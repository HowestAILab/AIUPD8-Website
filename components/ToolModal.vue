<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    header="Review"
    class="w-full max-w-3xl"
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h2 class="font-semibold text-xl">Review</h2>
        <NuxtLink
          v-if="item"
          :to="`/tools/${item.title}`"
          class="bg-black text-white text-sm font-semibold rounded-full px-4 py-2 mr-2 hover:bg-gray-800"
        >
          Open in Full Page
        </NuxtLink>
      </div>
    </template>
    <div v-if="item" class="p-8">
      <div class="rounded-3xl bg-blue-200 p-8">
        <div class="pb-6 relative">
          <h2 class="text-5xl font-semibold text-black pb-6">
            {{ item.title }}
          </h2>
          <div
            v-if="item.isFavourite"
            class="absolute top-2 right-2 bg-accent-extra text-light-page-text-dark text-sm px-4 py-1 rounded-full"
          >
            our favourite
          </div>
          <div class="description mb-6" v-if="Array.isArray(item?.description)">
            <SanityPortableText :blocks="item.description" />
          </div>
          <div class="description mb-6" v-else-if="item?.description">
            <p>{{ item.description }}</p>
          </div>
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

        <div class="border-b border-gray-900 my-4"></div>

        <!-- Input/Output information -->
        <div class="grid grid-cols-2 pt-8">
          <div v-if="item.inputs && item.inputs.length > 0">
            <div class="mb-2 font-semibold text-black">input type</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="input in item.inputs"
                :key="input"
                class="px-7 py-1 bg-white text-gray-600 rounded-full"
              >
                {{ input }}
              </span>
            </div>
          </div>
          <div v-if="item.tasks && item.tasks.length > 0">
            <div class="mb-2 font-semibold text-black">specific task</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="task in item.tasks"
                :key="task"
                class="px-7 py-1 bg-white text-gray-600 rounded-full"
              >
                {{ task }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 pt-8">
          <div v-if="item.outputs && item.outputs.length > 0">
            <div class="mb-2 font-semibold text-black">output type</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="output in item.outputs"
                :key="output"
                class="px-7 py-1 bg-white text-gray-600 rounded-full"
              >
                {{ output }}
              </span>
            </div>
          </div>
          <div v-if="item.profiles && item.profiles.length > 0">
            <div class="mb-2 font-semibold text-black">profile</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="profile in item.profiles"
                :key="profile"
                class="px-7 py-1 bg-white text-gray-600 rounded-full"
              >
                {{ profile }}
              </span>
            </div>
          </div>
        </div>

        <div class="pt-10 flex items-center justify-end">
          <label
            class="flex items-center text-sm text-light-page-text-light space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              v-model="compareChecked"
              @change="handleCompareChange"
            />
            <span class="text-black font-semibold">add to comparison</span>
          </label>
        </div>
      </div>
      <div class="py-8" v-if="carouselItems.length > 0">
        <ToolCarousel
          v-if="item"
          :title="item.title"
          :showcase-images="item.showcaseImages"
          :youtube-link="item.youtubeLink"
          class="mt-8 mb-8"
        />
      </div>
      <div class="p-8 bg-gray-100 rounded-3xl">
        <div>
          <h2 class="text-lg font-semibold">Specifications</h2>
        </div>
        <Divider />
        <div class="flex flex-col gap-4 pt-4">
          <div v-if="item.uses && item.uses.length > 0">
            <div
              class="font-bold text-sm rounded-lg text-light-page-text-light"
            >
              use
            </div>
            <div
              class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
            >
              <span
                v-for="option in ['no-code', 'low-code', 'code']"
                :key="option"
                class="sm:flex-1 basis-1/2 text-center px-4 py-1 rounded-full transition-all"
                :class="{
                  'bg-blue-200 text-blue-500 font-semibold':
                    item.uses.includes(option),
                  'text-gray-500': !item.uses.includes(option),
                }"
                >{{ option }}</span
              >
            </div>
          </div>

          <div v-if="item.setups && item.setups.length > 0">
            <div class="font-bold text-sm text-light-page-text-light">
              setup
            </div>
            <div
              class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
            >
              <span
                v-for="option in ['no-code', 'low-code', 'code']"
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

          <div v-if="item.pricings && item.pricings.length > 0">
            <div class="font-bold text-sm text-light-page-text-light">
              pricing
            </div>
            <div
              class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
            >
              <span
                v-for="option in [
                  'free',
                  'subscription',
                  'credits',
                ]"
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

          <div v-if="item.licenses && item.licenses.length > 0">
            <div class="font-bold text-sm text-light-page-text-light">
              license
            </div>
            <div
              class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
            >
              <span
                v-for="option in ['personal', 'commercial']"
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

          <div v-if="item.generationTimes && item.generationTimes.length > 0">
            <div class="font-bold text-sm text-light-page-text-light">
              average time
            </div>
            <div
              class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
            >
              <span
                v-for="option in ['seconds', 'minutes', 'hours', 'days']"
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
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import Galleria from "primevue/galleria";
import { ref, computed, watch } from "vue";
import { useRuntimeConfig } from "#app";
import Divider from "primevue/divider";
import { useRichText } from "~/composables/useRichText";
import { useMedia } from "~/composables/useMedia";
import type { ToolItem } from "~/composables/useDatabase";
import SanityPortableText from "./SanityPortableText.vue";
import ToolCarousel from "./ToolCarousel.vue";

const { parseRichText } = useRichText();
const { getMediaUrl, getCarouselImageUrl, getYoutubeEmbedUrl } = useMedia();

const visible = ref(false);
const item = ref<ToolItem | null>(null);
const compareChecked = ref(false);

const props = defineProps({
  itemsInComparison: {
    type: Set,
    default: () => new Set(),
  },
});

const emit = defineEmits(["add-to-comparison", "remove-from-comparison"]);

function handleCompareChange(event) {
  if (!item.value) return;

  if (event.target.checked) {
    emit("add-to-comparison", item.value);
  } else {
    emit("remove-from-comparison", item.value);
  }
}

watch(visible, (newValue) => {
  if (!newValue) {
    compareChecked.value = false;
  }
});

const parsedDescription = computed(() => {
  if (!item.value || !item.value.description) return "";
  return parseRichText(item.value.description);
});

const open = (toolItem: ToolItem) => {
  item.value = toolItem;
  console.log("Opening modal with item:", toolItem);
  if (toolItem.showcaseImages) {
    console.log("Showcase images in modal:", toolItem.showcaseImages);
  }

  if (props.itemsInComparison && item.value) {
    compareChecked.value = props.itemsInComparison.has(item.value.id);
  }

  visible.value = true;
};

// New computed property for modal carousel items
const carouselItems = computed(() => {
  if (!item.value) return [];
  const slides = item.value.showcaseImages ? [...item.value.showcaseImages] : [];
  if (item.value.youtubeLink) {
    slides.push({ type: "youtube", url: item.value.youtubeLink });
  }
  return slides;
});

defineExpose({ open });
</script>

<style>
.p-dialog-mask {
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, 0.4) !important;
}

/* Update Galleria styles */
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
