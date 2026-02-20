<template>
  <div>
    <HeaderBar variant="white" />

    <div class="pt-16 min-h-screen bg-light-page-background flex">
      <!-- Sidebar Filter (desktop only) -->
      <transition name="slide-fade">
        <div
          v-if="showFilters"
          class="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] md:w-[18%] bg-white shadow-lg z-30 border-r border-gray-200"
        >
          <AdvancedFilter
            :is-visible="showFilters"
            @apply-filters="handleAdvancedFilters"
            @update:is-visible="(val) => (showFilters = val)"
          />
        </div>
      </transition>

      <!-- Main content area, with left margin for sidebar on desktop -->

      <div class="w-full p-4 md:max-w-[65%] mx-auto">
        <!-- Project Selector -->
        <div class="mb-6">
          <ProjectSelector />
        </div>

        <!-- Filter Bar -->
        <div class="mb-6 hidden md:block">
          <FilterBar
            :toolOptions="toolOptions"
            :comparisonCount="comparisonCount"
            @toggle-filters="toggleFilters"
            @apply-filters="handleFiltersApplied"
            @open-comparison="openComparisonModal"
          />
        </div>

        <!-- New Comparison Bar - only shows when items are selected -->
        <div
          v-if="comparisonCount > 0"
          class="comparison-bar mb-6 p-4 bg-white shadow-md rounded-lg flex justify-between items-center"
        >
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              class="w-5 h-5 mr-2 text-primary"
            >
              <path
                fill="currentColor"
                d="M384 32l128 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L398.4 96c-5.2 25.8-22.9 47.1-46.4 57.3L352 448l160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-192 0-192 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0 0-294.7c-23.5-10.3-41.2-31.6-46.4-57.3L128 96c-17.7 0-32-14.3-32-32s14.3-32 32-32l128 0c14.6-19.4 37.8-32 64-32s49.4 12.6 64 32zm55.6 288l144.9 0L512 195.8 439.6 320zM512 416c-62.9 0-115.2-34-126-78.9c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1C627.2 382 574.9 416 512 416zM126.8 195.8L54.4 320l144.9 0L126.8 195.8zM.9 337.1c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1C242 382 189.7 416 126.8 416S11.7 382 .9 337.1z"
              />
            </svg>
            <span class="font-medium"
              >{{ comparisonCount }} tool{{ comparisonCount !== 1 ? 's' : '' }}
              {{ t('database.comparison.suffix') }}</span
            >
          </div>
          <button
            @click="openComparisonModal"
            class="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors duration-300 flex items-center"
          >
            {{ t('database.comparison.button') }}
          </button>
        </div>

        <div v-if="loading" class="text-center py-8">
          <p class="mb-2">{{ t('database.loading') }}</p>
        </div>
        <div v-else-if="error" class="text-center text-red-500 py-8">
          {{ error }}
        </div>
        <div v-else-if="filteredItems.length === 0" class="text-center py-8">
          <p>{{ t('database.empty') }}</p>
        </div>
        <div
          v-else
          class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6"
        >
          <DatabaseItem
            v-for="(item, index) in filteredItems"
            :key="item.id"
            :item="item"
            :is-first="index === 0"
            :items-in-comparison="itemsInComparison"
            @add-to-comparison="addToComparison"
            @remove-from-comparison="removeFromComparison"
          />
        </div>
      </div>
    </div>

    <!-- Floating buttons section -->
    <div class="fixed-buttons-container">
      <!-- Comparison floating button (already exists) -->
      <button
        v-if="comparisonCount > 0"
        class="fixed-button comparison-button"
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
        <span
          v-if="comparisonCount > 0"
          class="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
        >
          {{ comparisonCount }}
        </span>
        <span class="filter-label z-10">{{ t('database.comparison.button') }}</span>
      </button>

      <!-- New Mobile Filter Button (visible only on mobile) -->
      <button
        class="fixed-button filter-button md:hidden"
        @click="showMobileFilter = true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="4" y1="21" x2="4" y2="14"></line>
          <line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line>
          <line x1="20" y1="12" x2="20" y2="3"></line>
          <line x1="1" y1="14" x2="7" y2="14"></line>
          <line x1="9" y1="8" x2="15" y2="8"></line>
          <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
        <span class="filter-label">{{ t('database.filter.label') }}</span>
      </button>
    </div>

    <!-- Mobile Filter Modal -->
    <MobileFilterModal
      v-model="showMobileFilter"
      :toolOptions="toolOptions"
      @apply-filters="handleFiltersApplied"
    />

    <ComparisonModal ref="comparisonModal" @item-removed="handleItemRemoved" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import HeaderBar from "~/components/layout/HeaderBar.vue";
import { useTranslations, useToolI18n } from "~/composables/i18n";

const { t } = useTranslations();
const { toolHasLocaleContent } = useToolI18n();
import AdvancedFilter from "~/components/filters/AdvancedFilter.vue";
import FilterBar from "~/components/filters/FilterBar.vue";
import DatabaseItem from "~/components/items/DatabaseItem.vue";
import ComparisonModal from "~/components/modals/ComparisonModal.vue";
import MobileFilterModal from "~/components/filters/MobileFilterModal.vue";
import ProjectSelector from "~/components/selectors/ProjectSelector.vue";
import type { ToolItem } from "~/composables/useDatabase";
import { hasProjectSpecificData } from "~/composables/useDatabase";
import {
  getFilterParams,
  clearAllFilters,
  setToolOptions,
  activeProjectFilter,
  showOldTools,
  initializeFilterOptions,
} from "~/config/filterHandler";
import { useProjectProfile } from "~/composables/useProjectProfile";

const { items, loading, error, fetchDatabaseItems, toolLangFilter } = useDatabase();
const filteredItems = ref<ToolItem[]>([]);

// Show/hide advanced filter sidebar
const showFilters = ref(false);

// Show/hide mobile filter modal
const showMobileFilter = ref(false);

// Helper function to check if tool is older than 1 year
function isToolOlderThanOneYear(dateAdded: string): boolean {
  if (!dateAdded) return false;
  const added = new Date(dateAdded);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return added < oneYearAgo;
}

const comparisonModal = ref(null);

const handleButtonClick = () => {
  comparisonModal.value?.open();
};

// Create a ref to track which items are in comparison
const itemsInComparison = ref(new Set());

// Computed property to get the count of items in comparison
const comparisonCount = computed(() => itemsInComparison.value.size);

// Function to add item to comparison
const addToComparison = (item: ToolItem) => {
  comparisonModal.value?.addItem(item);
  itemsInComparison.value.add(item.id);
  itemsInComparison.value = new Set(itemsInComparison.value); // force reactivity
};

// Function to remove item from comparison
const removeFromComparison = (item: ToolItem) => {
  // Just call the removeItem method directly with the item
  comparisonModal.value?.removeItem(item);
  itemsInComparison.value.delete(item.id);
  itemsInComparison.value = new Set(itemsInComparison.value); // force reactivity
};

// Handle when an item is removed from the comparison modal
const handleItemRemoved = (item: ToolItem) => {
  itemsInComparison.value.delete(item.id);
  itemsInComparison.value = new Set(itemsInComparison.value); // force reactivity
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

// Open comparison modal
const openComparisonModal = () => {
  comparisonModal.value?.open();
};

// Compute distinct tool options from database items
const toolOptions = computed(() => {
  const seen = new Set();
  return items.value.reduce((acc, item) => {
    if (!seen.has(item.title)) {
      seen.add(item.title);
      acc.push({ name: item.title });
    }
    return acc;
  }, [] as { name: string }[]);
});

// Update shared filter tool options when toolOptions changes
watch(
  () => toolOptions.value,
  (newToolOptions) => {
    if (newToolOptions && newToolOptions.length > 0) {
      setToolOptions(newToolOptions);
    }
  },
  { immediate: true }
);

// Filter items based on selected filters
function filterItems(filters: any) {
  if (!items.value) return [];

  let result = [...items.value];

  // Filter by language content (localized only vs. all)
  if (toolLangFilter.value === 'localized') {
    result = result.filter((item) => toolHasLocaleContent(item.i18n));
  }

  // Filter by project-specific data (NEW)
  // Only show tools that have data for the selected project
  const { activeProjectId } = useProjectProfile();
  if (activeProjectId.value && activeProjectId.value !== "general") {
    result = result.filter((item) =>
      hasProjectSpecificData(item, activeProjectId.value)
    );
  }

  // New filter: tool name
  if (filters.name && filters.name.trim() !== "") {
    const search = filters.name.toLowerCase();
    result = result.filter((item) => item.title.toLowerCase().includes(search));
  }

  // Dynamic filtering based on filter configuration
  // This handles all general and project-specific filters automatically
  const filterFields = [
    'uses', 'setups', 'pricings', 'licenses', 'generationTimes',
    'inputs', 'outputs', 'profiles', 'tasks', 'dataStorageLocations',
    // PSY-AID filters
    'dataDeletionCapabilities',
    'suitabilityRobustnesses', 'onboardingEases', 'offlineFunctionalities'
  ];

  filterFields.forEach(fieldName => {
    if (filters[fieldName] && filters[fieldName].length > 0) {
      result = result.filter((item) => {
        const itemValues = (item as any)[fieldName];
        if (!itemValues || !Array.isArray(itemValues)) return false;
        
        return itemValues.some((value: string) =>
          filters[fieldName].includes(value)
        );
      });
    }
  });

  // Filter out tools older than 1 year unless showOldTools is true
  if (!showOldTools.value) {
    result = result.filter(
      (item) => !isToolOlderThanOneYear(item.dateAdded || "")
    );
  }

  return result;
}

// Apply filters from the top filter bar or mobile filter modal
const handleFiltersApplied = (filters) => {
  console.log("Filters applied:", filters);
  filteredItems.value = filterItems(filters);
  showMobileFilter.value = false; // Close mobile filter modal after applying filters
};

// Apply filters from the advanced sidebar
const handleAdvancedFilters = () => {
  console.log("Advanced filters applied:", getFilterParams());
  filteredItems.value = filterItems(getFilterParams());
};

// Watch for changes to showOldTools toggle
watch(showOldTools, () => {
  // Re-apply current filters when toggle changes
  filteredItems.value = filterItems(getFilterParams());
});

// Re-filter when language mode changes
watch(toolLangFilter, () => {
  filteredItems.value = filterItems(getFilterParams());
});

// Watch for changes to active project and reapply filters
const { activeProjectId } = useProjectProfile();
watch(activeProjectId, () => {
  // Re-apply current filters when project changes
  filteredItems.value = filterItems(getFilterParams());
});

onMounted(async () => {
  // Initialize filter options from hardcoded labels (v3.0)
  initializeFilterOptions();
  
  await fetchDatabaseItems();
  // Apply filters on initial load to respect preselected project
  filteredItems.value = filterItems(getFilterParams());

  // Set tool options in the filter handler
  if (toolOptions.value.length > 0) {
    setToolOptions(toolOptions.value);
  }
});
</script>

<style scoped>
.comparison-bar {
  animation: fadeIn 0.3s ease-in-out;
  border: 1px solid var(--surface-200);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fixed-buttons-container {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
  gap: 16px;
  z-index: 50;
  pointer-events: none;
}

.fixed-button {
  width: 56px;
  height: 56px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  pointer-events: auto;
  position: relative;
  transition: all 0.2s ease;
}

.filter-button {
  background-color: white;
  color: #3178f2;
  border: 1px solid #3178f2;
}

.comparison-button {
  background-color: #3178f2;
  color: white;
}

.filter-label {
  position: absolute;
  bottom: -20px;
  font-size: 12px;
  font-weight: 500;
  color: #333; /* Added specific text color */
  text-shadow: 0px 0px 2px white; /* Added text shadow for better visibility */
  width: 100%; /* Ensure the label takes full width of button */
  text-align: center; /* Center the text */
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .filter-button {
    display: none;
  }

  .fixed-buttons-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 40px;
  }

  .comparison-button {
    position: relative;
    right: auto;
  }
}

/* For larger screens, ensure buttons don't get too far to the edge */
@media (min-width: 1536px) {
  .fixed-buttons-container {
    margin-bottom: 2%;
    margin-right: 7%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Sidebar styles */
@media (min-width: 768px) {
  aside {
    min-width: 20rem;
    max-width: 20rem;
  }
  main {
    margin-left: 20rem;
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
