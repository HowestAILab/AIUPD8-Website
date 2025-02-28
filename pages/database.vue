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
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import HeaderBar from "~/components/layout/HeaderBar.vue";
import AdvancedFilter from "~/components/AdvancedFilter.vue";
import FilterBar from "~/components/FilterBar.vue";
import DatabaseItem from "~/components/DatabaseItem.vue";
import type { ToolItem } from "~/composables/useDatabase";

const { items, loading, error, fetchDatabaseItems } = useDatabase();
const filteredItems = ref<ToolItem[]>([]);

// Show/hide advanced filter sidebar
const showFilters = ref(false);

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
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
