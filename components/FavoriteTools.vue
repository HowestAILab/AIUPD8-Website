<template>
  <div v-if="favoriteCount > 0">
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-4 flex items-center">
        <i class="pi pi-star-fill text-yellow-500 mr-2"></i>
        Your Favorite Tools
        <span class="text-sm font-normal ml-2 text-gray-500"
          >({{ favoriteCount }})</span
        >
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DatabaseItem
          v-for="tool in favoriteTools"
          :key="tool.id"
          :item="tool"
          :items-in-comparison="itemsInComparison"
          @add-to-comparison="$emit('add-to-comparison', $event)"
          @remove-from-comparison="$emit('remove-from-comparison', $event)"
        />
      </div>
      <Divider />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import DatabaseItem from "./DatabaseItem.vue";
import Divider from "primevue/divider";
import { useFavorites } from "~/composables/useFavorites";
import { useDatabase, type ToolItem } from "~/composables/useDatabase";

const props = defineProps<{
  allTools: ToolItem[];
  itemsInComparison?: Set<number>;
}>();

defineEmits(["add-to-comparison", "remove-from-comparison"]);

const { favorites, favoriteCount } = useFavorites();

// Get only favorited tools from all tools
const favoriteTools = computed(() => {
  return props.allTools.filter((tool) => favorites.value.includes(tool.id));
});
</script>
