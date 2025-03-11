<template>
  <Card>
    <template #header>
      <div class="pt-5 px-5">
        <div class="relative">
          <img
            :src="getImageUrl(item.Image)"
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
        </div>
      </div>
    </template>
    <template #title>
      <div class="flex justify-between">
        <h3 class="text-xl font-semibold">{{ item.title }}</h3>
        <button
          @click="openModal"
          class="bg-black text-white text-sm font-semibold rounded-full px-4 py-1"
        >
          see more
        </button>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4 text-sm text-light-page-text-light">
        <div v-if="item.uses && item.uses.length > 0">
          <span class="font-bold">use</span>
          <div
            class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-2xl md:rounded-full w-full mt-1 border border-gray-200"
          >
            <span
              v-for="option in selections.use"
              :key="option"
              class="sm:flex-1 basis-1/2 text-center px-4 py-1 rounded-full transition-all"
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

        <div v-if="item.setups && item.setups.length > 0">
          <span class="font-bold">setup</span>
          <div
            class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-2xl md:rounded-full w-full mt-1 border border-gray-200"
          >
            <span
              v-for="option in selections.setup"
              :key="option"
              class="sm:flex-1 basis-1/2 text-center px-4 py-1 rounded-full transition-all"
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

        <div v-if="item.pricings && item.pricings.length > 0">
          <span class="font-bold">pricing</span>
          <div
            class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-2xl md:rounded-full w-full mt-1 border border-gray-200"
          >
            <span
              v-for="option in selections.pricing"
              :key="option"
              class="sm:flex-1 basis-1/2 text-center px-4 py-1 rounded-full transition-all"
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
      <div class="pt-6 flex items-center justify-between">
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
import { useRuntimeConfig } from "#app";
import type { ToolItem } from "~/composables/useDatabase";

const modalRef = ref(null);

const selections = ref({
  use: ["no-code", "low-code", "code"],
  setup: ["no-code", "low-code", "code"],
  pricing: ["free", "freemium", "subscription", "credits"],
});

const props = defineProps<{
  item: ToolItem;
  itemsInComparison?: Set<number>;
}>();

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

const config = useRuntimeConfig();

const getImageUrl = (image: any) => {
  if (!image) {
    return "";
  }

  const imageUrl =
    image.formats?.medium?.url || image.formats?.small?.url || image.url;

  return imageUrl ? `${config.public.dbUrl}${imageUrl}` : "";
};
</script>
