<template>
  <div>
    <HeaderBar variant="white" />

    <!-- main content area -->
    <div class="pt-16 min-h-screen bg-light-page-background flex">
      <!-- Left column: advanced filter -->
      <aside
        v-show="showFilters"
        class="w-full md:w-1/4 p-4"
        ref="filterSidebar"
      >
        <AdvancedFilter
          :is-visible="showFilters"
          @apply-filters="handleAdvancedFilters"
          @update:is-visible="showFilters = $event"
        />
      </aside>

      <!-- 
          Right column: 
            - Filter bar (some top filters or search bar)
            - Cards grid
        -->
      <main class="w-full md:w-3/4 p-4 max-w-7xl mx-auto">
        <div class="mb-6">
          <FilterBar
            @toggle-filters="toggleFilters"
            @apply-filters="handleFiltersApplied"
          />
        </div>

        <div v-if="loading" class="text-center py-8">
          <p class="mb-2">Loading tools...</p>
        </div>
        <div v-else-if="error" class="text-center text-red-500 py-8">
          {{ error }}
        </div>
        <div v-else-if="filteredItems.length === 0" class="text-center py-8">
          <p>
            No tools match your current filters. Try adjusting your search
            criteria.
          </p>
        </div>
        <div
          v-else
          class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6"
        >
          <DatabaseItem
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            :items-in-comparison="itemsInComparison"
            @add-to-comparison="addToComparison"
            @remove-from-comparison="removeFromComparison"
          />
        </div>
      </main>
    </div>

    <button
      class="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors duration-300 z-50"
      @click="handleButtonClick"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        class="w-6 h-6"
      >
        <path
          fill="currentColor"
          d="M384 32l128 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L398.4 96c-5.2 25.8-22.9 47.1-46.4 57.3L352 448l160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-192 0-192 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0 0-294.7c-23.5-10.3-41.2-31.6-46.4-57.3L128 96c-17.7 0-32-14.3-32-32s14.3-32 32-32l128 0c14.6-19.4 37.8-32 64-32s49.4 12.6 64 32zm55.6 288l144.9 0L512 195.8 439.6 320zM512 416c-62.9 0-115.2-34-126-78.9c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1C627.2 382 574.9 416 512 416zM126.8 195.8L54.4 320l144.9 0L126.8 195.8zM.9 337.1c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1C242 382 189.7 416 126.8 416S11.7 382 .9 337.1z"
        />
      </svg>
    </button>

    <ComparisonModal ref="comparisonModal" @item-removed="handleItemRemoved" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import HeaderBar from "~/components/layout/HeaderBar.vue";
import AdvancedFilter from "~/components/AdvancedFilter.vue";
import FilterBar from "~/components/FilterBar.vue";
import DatabaseItem from "~/components/DatabaseItem.vue";
import ComparisonModal from "~/components/ComparisonModal.vue";
import type { ToolItem } from "~/composables/useDatabase";

const { items, loading, error, fetchDatabaseItems } = useDatabase();
const filteredItems = ref<ToolItem[]>([]);

// Show/hide advanced filter sidebar
const showFilters = ref(false);

const comparisonModal = ref(null);

const handleButtonClick = () => {
  comparisonModal.value?.open();
};

// Create a ref to track which items are in comparison
const itemsInComparison = ref(new Set());

// Function to add item to comparison
const addToComparison = (item: ToolItem) => {
  comparisonModal.value?.addItem(item);
  itemsInComparison.value.add(item.id);
};

// Function to remove item from comparison
const removeFromComparison = (item: ToolItem) => {
  // Just call the removeItem method directly with the item
  comparisonModal.value?.removeItem(item);
  itemsInComparison.value.delete(item.id);
};

// Handle when an item is removed from the comparison modal
const handleItemRemoved = (item: ToolItem) => {
  itemsInComparison.value.delete(item.id);
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

// Open comparison modal
const openComparisonModal = () => {
  comparisonModal.value?.open();
};

// Filter items based on selected filters
function filterItems(filters: any) {
  if (!items.value) return [];

  let result = [...items.value];

  // Filter by uses if selected
  if (filters.uses && filters.uses.length > 0) {
    result = result.filter((item) =>
      item.uses.some((use) => filters.uses.includes(use))
    );
  }

  // Filter by setups if selected
  if (filters.setups && filters.setups.length > 0) {
    result = result.filter((item) =>
      item.setups.some((setup) => filters.setups.includes(setup))
    );
  }

  // Filter by pricings if selected
  if (filters.pricings && filters.pricings.length > 0) {
    result = result.filter((item) =>
      item.pricings.some((pricing) => filters.pricings.includes(pricing))
    );
  }

  // Filter by licenses if selected
  if (filters.licenses && filters.licenses.length > 0) {
    result = result.filter((item) =>
      item.licenses.some((license) => filters.licenses.includes(license))
    );
  }

  // Filter by generation times if selected
  if (filters.generationTimes && filters.generationTimes.length > 0) {
    result = result.filter((item) =>
      item.generationTimes.some((time) =>
        filters.generationTimes.includes(time)
      )
    );
  }

  // Filter by inputs if selected
  if (filters.inputs && filters.inputs.length > 0) {
    result = result.filter((item) =>
      item.inputs.some((input) => filters.inputs.includes(input))
    );
  }

  // Filter by outputs if selected
  if (filters.outputs && filters.outputs.length > 0) {
    result = result.filter((item) =>
      item.outputs.some((output) => filters.outputs.includes(output))
    );
  }

  // Filter by profiles if selected
  if (filters.profiles && filters.profiles.length > 0) {
    result = result.filter((item) =>
      item.profiles.some((profile) => filters.profiles.includes(profile))
    );
  }

  // Filter by tasks if selected
  if (filters.tasks && filters.tasks.length > 0) {
    result = result.filter((item) =>
      item.tasks.some((task) => filters.tasks.includes(task))
    );
  }

  return result;
}

// Apply filters from the top filter bar
const handleFiltersApplied = (filters) => {
  console.log("Filters applied:", filters);
  filteredItems.value = filterItems(filters);
};

// Apply filters from the advanced sidebar
const handleAdvancedFilters = (advancedFilters) => {
  console.log("Advanced filters applied:", advancedFilters);
  filteredItems.value = filterItems(advancedFilters);
};

onMounted(async () => {
  await fetchDatabaseItems();
  // Initialize filteredItems with all items when first loading
  filteredItems.value = items.value;
});
</script>
