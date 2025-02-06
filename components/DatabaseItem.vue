<template>
  <div
    class="border bg-white shadow-sm rounded-lg overflow-hidden flex flex-col"
  >
    <!-- Top image -->
    <div class="relative">
      <img
        :src="item.image || placeholder"
        alt=""
        class="w-full object-cover h-48"
      />
      <div
        v-if="item.isFavorite"
        class="absolute top-2 right-2 bg-pink-400 text-white text-xs px-2 py-1 rounded-full"
      >
        our favourite
      </div>
    </div>

    <!-- Content area -->
    <div class="p-4 flex flex-col gap-2 flex-grow">
      <h3 class="text-xl font-semibold">{{ item.title }}</h3>

      <!-- example “Use/Setup/Pricing” lines or pills -->
      <div class="flex flex-col gap-1 text-sm text-gray-600">
        <div class="flex items-center gap-2">
          <span class="font-bold">Use:</span>
          <span>{{ item.use }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-bold">Setup:</span>
          <span>{{ item.setup }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-bold">Pricing:</span>
          <span>{{ item.pricing }}</span>
        </div>
      </div>
    </div>

    <!-- Footer / Actions -->
    <div class="px-4 py-2 bg-gray-100 flex items-center justify-between">
      <button
        @click="seeMore(item)"
        class="text-blue-600 hover:text-blue-800 font-medium"
      >
        see more
      </button>

      <label class="flex items-center text-sm text-gray-600 space-x-2">
        <input type="checkbox" v-model="compareChecked" />
        <span>Add to comparison</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType } from "vue";

// Just a placeholder image if item.image is not given:
const placeholder = "https://via.placeholder.com/600x400?text=No+Image";

// Props
interface DBItem {
  id: number;
  title: string;
  image?: string;
  isFavorite?: boolean;
  use?: string;
  setup?: string;
  pricing?: string;
}

const props = defineProps<{
  item: DBItem;
}>();

const compareChecked = ref(false);

function seeMore(item: DBItem) {
  // Simple stub
  alert(`See more about ${item.title}`);
}
</script>
