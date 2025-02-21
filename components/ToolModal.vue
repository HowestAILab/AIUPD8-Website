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
          :to="`/tools/${item.documentId}`" 
          class="bg-black text-white text-sm font-semibold rounded-full px-4 py-2 mr-2 hover:bg-gray-800"
        >
          Open in Full Page
        </NuxtLink>
      </div>
    </template>
    <div v-if="item">
      <div class="rounded-3xl bg-blue-200 p-8">
        <div class="pb-6 relative">
          <h2 class="text-5xl font-semibold text-black pb-6">
            {{ item.title }}
          </h2>
          <div
            v-if="item.isFavorite"
            class="absolute top-2 right-2 bg-accent-extra text-light-page-text-dark text-sm px-4 py-1 rounded-full"
          >
            our favourite
          </div>
          <p class="w-full break-words">
            gsjlfhgiwefhkbsfhfjkskfjehfebwuhgjebrschgsjlfhgiwefhkbsfhfjkskfjehfebwuhgjebrschgsjlfhgiwefhkbsfhfjkskfjehfebwuhgjebrschgsjlfhgiwefhkbsfhfjkskfjehfebwuhgjebrschgsjlfhgiwefhkbsfhfjkskfjehfebwuhgjebrsch
          </p>
        </div>
        <div class="border-b border-gray-900 my-4"></div>
        <div class="grid grid-cols-2 pt-8">
          <div>
            <div class="mb-2 font-semibold text-black">input type</div>
            <div class="flex gap-2">
              <span class="px-7 py-1 bg-white text-gray-600 rounded-full"
                >text</span
              >
              <span class="px-7 py-1 bg-white text-gray-600 rounded-full"
                >image</span
              >
            </div>
          </div>
          <div>
            <div class="mb-2 font-semibold text-black">specific task</div>
            <div class="flex gap-2">
              <span class="px-7 py-1 bg-white text-gray-600 rounded-full"
                >image</span
              >
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 pt-8">
          <div>
            <div class="mb-2 font-semibold text-black">output type</div>
            <div class="flex gap-2">
              <span class="px-7 py-1 bg-white text-gray-600 rounded-full"
                >image</span
              >
            </div>
          </div>
          <div>
            <div class="mb-2 font-semibold text-black">profile</div>
            <div class="flex gap-2">
              <span class="px-7 py-1 bg-white text-gray-600 rounded-full"
                >all creatives</span
              >
            </div>
          </div>
        </div>
        <div class="pt-10 flex items-center justify-end">
          <label
            class="flex items-center text-sm text-light-page-text-light space-x-2 cursor-pointer"
          >
            <input type="checkbox" v-model="compareChecked" />
            <span class="text-black font-semibold">add to comparison</span>
          </label>
        </div>
      </div>
      <div class="py-8">
        <Galleria
          :value="item.images"
          :showThumbnails="false"
          :showIndicators="true"
          class="w-full rounded-3xl overflow-hidden"
        >
          <template #item="slotProps">
            <img
              :src="slotProps.item"
              :alt="item.title"
              class="w-full h-[416px] object-cover"
            />
          </template>
        </Galleria>
      </div>
      <div class="p-8 bg-gray-100 rounded-3xl">
        <div>
            <h2 class="text-lg font-semibold">Specifications</h2>
        </div>
        <Divider />
        <div class="flex flex-col gap-4 pt-4">
          <div>
            <div class="font-bold text-sm rounded-lg text-light-page-text-light">use</div>
            <div class="flex w-full bg-gray-100 rounded-full mt-1 border border-gray-200">
              <span 
                v-for="option in ['no-code', 'low-code', 'code']" 
                :key="option"
                class="flex-1 text-center px-4 py-1 rounded-full transition-all"
                :class="{
                  'bg-blue-200 text-blue-500 font-semibold': item.use === option,
                  'text-gray-500': item.use !== option
                }"
              >{{ option }}</span>
            </div>
          </div>
          <div>
            <div class="font-bold text-sm text-light-page-text-light">setup</div>
            <div class="flex bg-gray-100 rounded-full w-full mt-1 border border-gray-200">
              <span 
                v-for="option in ['no-code', 'low-code', 'code']" 
                :key="option"
                class="flex-1 text-center px-4 py-1 rounded-full transition-all"
                :class="{
                  'bg-blue-200 text-blue-500 font-semibold': item.setup === option,
                  'text-gray-500': item.setup !== option
                }"
              >{{ option }}</span>
            </div>
          </div>
          <div>
            <div class="font-bold text-sm text-light-page-text-light">pricing</div>
            <div class="flex bg-gray-100 rounded-full w-full mt-1 border border-gray-200">
              <span 
                v-for="option in ['free', 'freemium', 'subscription', 'credits']" 
                :key="option"
                class="flex-1 text-center px-4 py-1 rounded-full transition-all"
                :class="{
                  'bg-blue-200 text-blue-500 font-semibold': item.pricing === option,
                  'text-gray-500': item.pricing !== option
                }"
              >{{ option }}</span>
            </div>
          </div>
          <div>
            <div class="font-bold text-sm text-light-page-text-light">license</div>
            <div class="flex bg-gray-100 rounded-full w-full mt-1 border border-gray-200">
              <span 
                v-for="option in ['personal', 'commercial']" 
                :key="option"
                class="flex-1 text-center px-4 py-1 rounded-full transition-all"
                :class="{
                  'bg-blue-200 text-blue-500 font-semibold': item.license === option,
                  'text-gray-500': item.license !== option
                }"
              >{{ option }}</span>
            </div>
          </div>
          <div>
            <div class="font-bold text-sm text-light-page-text-light">average time </div>
            <div class="flex bg-gray-100 rounded-full w-full mt-1 border border-gray-200">
              <span 
                v-for="option in ['seconds', 'minutes', 'hours', 'days']" 
                :key="option"
                class="flex-1 text-center px-4 py-1 rounded-full transition-all"
                :class="{
                  'bg-blue-200 text-blue-500 font-semibold': item.averageTimeToGenerate === option,
                  'text-gray-500': item.averageTimeToGenerate !== option
                }"
              >{{ option }}</span>
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
import { ref } from "vue";
import type { DBItem } from "./DatabaseItem.vue";

const visible = ref(false);
const item = ref<DBItem | null>(null);

// Method to open the modal
const open = (toolItem: DBItem) => {
  toolItem.images = [
    "/images/midjourney.jpeg",
    "/images/midi.jpeg",
    "/images/midjourney2.jpeg",
  ];
  item.value = toolItem;
  visible.value = true;
};

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
</style>
