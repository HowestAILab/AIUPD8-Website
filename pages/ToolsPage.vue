<template>
  <div class="container mx-auto py-12 px-4">
    <!-- Use FilterBar component -->
    <FilterBar
      @apply-filters="handleFiltering"
      @toggle-filters="toggleAdvancedFilter"
    />

    <!-- Show advanced filter if open -->
    <AdvancedFilter
      :is-visible="showAdvancedFilter"
      @apply-filters="handleAdvancedFiltering"
      @update:isVisible="showAdvancedFilter = $event"
    />

    <!-- Display favorite tools section if any exist -->
    <FavoriteTools
      v-if="favoriteCount > 0 && !filtersApplied.showFavoritesOnly"
      :all-tools="allTools"
      :items-in-comparison="itemsInComparison"
      @add-to-comparison="addToComparison"
      @remove-from-comparison="removeFromComparison"
    />

    <!-- Tools grid -->
    <div>
      <h2 class="text-2xl font-bold mb-6">
        {{ filtersApplied.showFavoritesOnly ? "Favorite Tools" : "All Tools" }}
        <span class="text-sm text-gray-500 ml-2">
          ({{ filteredItems.length }}
          {{ filteredItems.length === 1 ? "tool" : "tools" }})
        </span>
      </h2>

      <div
        v-if="filtersApplied.showFavoritesOnly && filteredItems.length === 0"
        class="text-center py-8"
      >
        <i class="pi pi-star text-yellow-400 text-4xl mb-4"></i>
        <p class="text-gray-500">You haven't favorited any tools yet.</p>
        <p class="text-gray-500">
          Click the star icon on tools you'd like to save for later.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DatabaseItem
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          :items-in-comparison="itemsInComparison"
          @add-to-comparison="addToComparison"
          @remove-from-comparison="removeFromComparison"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useDatabase } from "~/composables/useDatabase";
import { useFavorites } from "~/composables/useFavorites";
import FilterBar from "~/components/FilterBar.vue";
import AdvancedFilter from "~/components/AdvancedFilter.vue";
import DatabaseItem from "~/components/DatabaseItem.vue";
import FavoriteTools from "~/components/FavoriteTools.vue";

// Get database tools
const { items: allTools, loading, fetchDatabaseItems } = useDatabase();
const { favoriteCount, filterByFavorites, favorites } = useFavorites();

// Comparison state
const itemsInComparison = ref(new Set());

// Filter state
const showAdvancedFilter = ref(false);
const filtersApplied = ref({
  inputs: [],
  outputs: [],
  profiles: [],
  showFavoritesOnly: false,
  // Additional filters from advanced filter
  uses: [],
  setups: [],
  pricings: [],
  licenses: [],
  generationTimes: [],
  tasks: [],
});

// Filter tools based on selected criteria
const filteredItems = computed(() => {
  // Ensure dependency on favorites is tracked
  const currentFavs = favorites.value;
  let filtered = [...allTools.value];
  console.log(`Starting with ${filtered.length} tools`);

  // When favorites filter is active use the helper to return only favorited tools
  if (filtersApplied.value.showFavoritesOnly) {
    filtered = filterByFavorites(filtered, true);
    console.log(`After favorites filter: ${filtered.length} tools`);
  }

  // Apply other filters
  if (filtersApplied.value.inputs.length > 0) {
    filtered = filtered.filter((item) =>
      filtersApplied.value.inputs.some((input) => item.inputs.includes(input))
    );
  }

  if (filtersApplied.value.outputs.length > 0) {
    filtered = filtered.filter((item) =>
      filtersApplied.value.outputs.some((output) =>
        item.outputs.includes(output)
      )
    );
  }

  if (filtersApplied.value.profiles.length > 0) {
    filtered = filtered.filter((item) =>
      filtersApplied.value.profiles.some((profile) =>
        item.profiles.includes(profile)
      )
    );
  }

  // Apply advanced filters if any are selected
  if (filtersApplied.value.uses.length > 0) {
    filtered = filtered.filter((item) =>
      filtersApplied.value.uses.some((use) => item.uses.includes(use))
    );
  }

  if (filtersApplied.value.setups.length > 0) {
    filtered = filtered.filter((item) =>
      filtersApplied.value.setups.some((setup) => item.setups.includes(setup))
    );
  }

  if (filtersApplied.value.pricings.length > 0) {
    filtered = filtered.filter((item) =>
      filtersApplied.value.pricings.some((pricing) =>
        item.pricings.includes(pricing)
      )
    );
  }

  if (filtersApplied.value.licenses.length > 0) {
    filtered = filtered.filter((item) =>
      filtersApplied.value.licenses.some((license) =>
        item.licenses.includes(license)
      )
    );
  }

  if (filtersApplied.value.generationTimes.length > 0) {
    filtered = filtered.filter((item) =>
      filtersApplied.value.generationTimes.some((time) =>
        item.generationTimes.includes(time)
      )
    );
  }

  if (filtersApplied.value.tasks.length > 0) {
    filtered = filtered.filter((item) =>
      filtersApplied.value.tasks.some((task) => item.tasks.includes(task))
    );
  }

  console.log(`Final filtered count: ${filtered.length} tools`);
  return filtered;
});

// Add a watcher to log when favorites toggle changes
watch(
  () => filtersApplied.value.showFavoritesOnly,
  (newVal) => {
    console.log("Favorites only filter changed to:", newVal);
  }
);

// Handle filters from FilterBar
function handleFiltering(filters) {
  console.log("Received filters:", filters);
  // Update the filters
  filtersApplied.value = {
    ...filtersApplied.value,
    inputs: filters.inputs || [],
    outputs: filters.outputs || [],
    profiles: filters.profiles || [],
    showFavoritesOnly: filters.showFavoritesOnly,
  };
  console.log("Updated filtersApplied:", filtersApplied.value);
}

// Handle advanced filters
function handleAdvancedFiltering(filters) {
  filtersApplied.value = {
    ...filtersApplied.value,
    uses: filters.uses || [],
    setups: filters.setups || [],
    pricings: filters.pricings || [],
    licenses: filters.licenses || [],
    generationTimes: filters.generationTimes || [],
    tasks: filters.tasks || [],
  };

  // Close advanced filter after applying
  showAdvancedFilter.value = false;
}

// Toggle advanced filter visibility
function toggleAdvancedFilter() {
  showAdvancedFilter.value = !showAdvancedFilter.value;
}

// Comparison functions
function addToComparison(item) {
  itemsInComparison.value.add(item.id);
}

function removeFromComparison(item) {
  itemsInComparison.value.delete(item.id);
}

// Fetch data on mount
onMounted(async () => {
  await fetchDatabaseItems();
});
</script>
