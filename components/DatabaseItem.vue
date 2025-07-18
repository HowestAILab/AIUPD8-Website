<template>
  <Card>
    <template #header>
      <div class="pt-5 px-5">
        <div class="relative">
          <img
            :src="getMediaUrl(item.Image)"
            alt=""
            class="w-full object-cover h-48 rounded-md"
          />
          <div class="">
            <div
              v-if="item.isFavourite"
              class="absolute top-2 right-2 bg-accent-extra text-light-page-text-dark text-xs px-4 py-1 rounded-full"
            >
              our favourite
            </div>
          </div>
          <div class="">
            <div
              v-if="item.isExperimental"
              class="absolute top-2 left-2 bg-accent-extra2 text-light-page-text-dark text-xs px-4 py-1 rounded-full"
            >
              experimental
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #title>
      <div class="flex justify-between items-start gap-4">
        <div class="w-[80%] min-w-0">
          <h3
            class="text-xl font-semibold truncate whitespace-normal break-words"
          >
            {{ item.title }}
          </h3>
          <p class="text-primary text-sm mt-1">
            <span class="font-bold">{{ item.toolsentence }} </span>
          </p>
        </div>
        <div class="w-[20%] flex items-center justify-end">
          <button
            @click="openModal"
            class="bg-black text-white text-sm font-semibold rounded-full px-4 py-1 whitespace-nowrap"
          >
            see more
          </button>
        </div>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4 text-sm text-light-page-text-light">
        <div
          v-if="showDescription && Array.isArray(item.description)"
          class="mb-4"
        >
          <SanityPortableText :blocks="item.description" />
        </div>

        <div v-if="item.setups && item.setups.length > 0">
          <span class="font-bold">setup</span>
          <div
            class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-2xl md:rounded-full w-full mt-1 border border-gray-200"
          >
            <span
              v-for="option in selections.setup"
              :key="option"
              class="sm:flex-1 basis-1/3 text-center px-4 py-1 rounded-full transition-all"
              :class="{
                'bg-blue-200 text-blue-500 font-semibold':
                  item.setups.includes(option),
                'text-gray-500': !item.setups.includes(option),
              }"
            >
              {{ option }}
            </span>
          </div>
        </div>

        <div v-if="item.uses && item.uses.length > 0">
          <span class="font-bold">use</span>
          <div
            class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-2xl md:rounded-full w-full mt-1 border border-gray-200"
          >
            <span
              v-for="option in selections.use"
              :key="option"
              class="sm:flex-1 basis-1/3 text-center px-4 py-1 rounded-full transition-all"
              :class="{
                'bg-blue-200 text-blue-500 font-semibold':
                  item.uses.includes(option),
                'text-gray-500': !item.uses.includes(option),
              }"
            >
              {{ option }}
            </span>
          </div>
        </div>

        <div v-if="item.pricings && item.pricings.length > 0">
          <span class="font-bold">pricing</span>
          <div
            class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-2xl md:rounded-full w-full mt-1 border border-gray-200"
          >
            <span
              v-for="option in selections.pricing"
              :key="option"
              class="flex-1 basis-1/3 text-center py-1 rounded-full transition-all"
              :class="{
                'bg-blue-200 text-blue-500 font-semibold':
                  item.pricings.includes(option),
                'text-gray-500': !item.pricings.includes(option),
              }"
            >
              {{ option }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div v-if="props.showComparison" class="pt-6 flex items-center justify-between">
        <label
          class="flex items-center text-sm text-light-page-text-light space-x-2 cursor-pointer"
        >
          <input
            type="checkbox"
            :checked="isInComparison"
            @change="handleCompareChange"
          />
          <span>Add to comparison</span>
        </label>
      </div>
    </template>
  </Card>
  <ToolModal
    ref="modalRef"
    :items-in-comparison="itemsInComparison"
    @add-to-comparison="handleAddToComparison"
    @remove-from-comparison="handleRemoveFromComparison"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Card from "primevue/card";
import ToolModal from "./ToolModal.vue";
import SanityPortableText from "./SanityPortableText.vue";
import { useMedia } from "~/composables/useMedia";
import type { ToolItem } from "~/composables/useDatabase";
import { defaultSelectionOrder } from "~/config/selectionOrder";

const { getMediaUrl } = useMedia();
const modalRef = ref(null);

// Use config from selectionOrder to allow easy reordering
const selections = ref({
  use: defaultSelectionOrder.use,
  setup: defaultSelectionOrder.setup,
  pricing: defaultSelectionOrder.pricing,
});

interface Props {
  item: ToolItem;
  itemsInComparison?: Set<number>;
  showComparison?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showComparison: true,
});

const isInComparison = computed(() => {
  return props.itemsInComparison?.has(props.item.id) || false;
});

const emit = defineEmits(["add-to-comparison", "remove-from-comparison"]);

function handleCompareChange(event) {
  if (event.target.checked) {
    emit("add-to-comparison", props.item);
  } else {
    emit("remove-from-comparison", props.item);
  }
}

function handleAddToComparison(item) {
  emit("add-to-comparison", item);
}

function handleRemoveFromComparison(item) {
  emit("remove-from-comparison", item);
}

function openModal() {
  modalRef.value.open(props.item);
}

// Control whether to show description in card (optional)
const showDescription = ref(false);
</script>
