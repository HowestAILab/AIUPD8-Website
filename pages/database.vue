<template>
  <div>
    <HeaderBar variant="white" />

    <!-- main content area -->
    <div class="pt-16 min-h-screen bg-gray-50 flex">
      <!-- Left column: advanced filter -->
      <aside class="hidden md:block w-full md:w-1/4 p-4">
        <AdvancedFilter />
      </aside>

      <!-- 
          Right column: 
            - Filter bar (some top filters or search bar)
            - Cards grid
        -->
      <main class="w-full md:w-3/4 p-4">
        <div class="mb-6">
          <FilterBar />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <DatabaseItem v-for="item in items" :key="item.id" :item="item" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import HeaderBar from "~/components/layout/HeaderBar.vue";
import AdvancedFilter from "~/components/AdvancedFilter.vue";
import FilterBar from "~/components/FilterBar.vue";
import DatabaseItem from "~/components/DatabaseItem.vue";

// Example items
const items = ref([
  {
    id: 1,
    title: "Midjourney",
    image: "/images/midjourney.jpg", // put your actual image path
    isFavorite: true,
    use: "no-code",
    setup: "no-code",
    pricing: "subscription",
  },
  {
    id: 2,
    title: "Stable Diffusion",
    image: "/images/stablediff.jpg", // placeholder
    use: "code",
    setup: "low-code",
    pricing: "free",
  },
  {
    id: 3,
    title: "DALL·E",
    image: "/images/dalle.jpg",
    use: "no-code",
    setup: "no-code",
    pricing: "credits",
  },
]);
</script>
