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

      <div
        class="w-full p-4 md:max-w-[65%] mx-auto"
      >
        <!-- Project Selector -->
        <div class="mb-6">
          <ProjectSelector />
        </div>

        <!-- Filter Bar -->
        <div class="mb-6 hidden md:block">
          <FilterBar
            ref="filterBarRef"
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

        <!-- Active Filter Chips -->
        <div v-if="activeFilterChips.length > 0" class="mb-6 p-4 bg-white shadow-sm rounded-xl border border-gray-100 flex flex-wrap gap-2 items-center">
          <span class="text-xs text-gray-400 font-bold uppercase tracking-wider mr-2">{{ t('filter.activeFilterChips') }}</span>
          <div
            v-for="chip in activeFilterChips"
            :key="chip.type + '-' + chip.value"
            class="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full border border-purple-100 transition-all hover:bg-purple-100"
          >
            <span>{{ chip.label }}</span>
            <button
              @click="removeSingleFilter(chip.type, chip.value)"
              class="w-4 h-4 rounded-full flex items-center justify-center hover:bg-purple-200 text-purple-500 hover:text-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:ring-offset-1"
              aria-label="Remove filter"
            >
              <i class="pi pi-times text-[10px]" aria-hidden="true"></i>
            </button>
          </div>
          <button
            @click="handleClearAllFilters"
            class="text-sm font-medium text-red-600 hover:text-red-800 transition-colors ml-auto flex items-center gap-1 focus:outline-none focus:underline"
          >
            <i class="pi pi-trash text-xs" aria-hidden="true"></i>
            {{ t('filter.clearAll') }}
          </button>
        </div>

        <div v-if="loading" class="text-center py-8">
          <p class="mb-2">{{ t('database.loading') }}</p>
        </div>
        <div v-else-if="error" class="text-center text-red-500 py-8">
          {{ error }}
        </div>
        <!-- Upgraded premium empty state -->
        <div v-else-if="filteredItems.length === 0" class="text-center py-16 px-4 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto my-8">
          <div class="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ t('filter.emptyHeadline') }}</h3>
          <p class="text-sm text-gray-500 mb-6">{{ t('filter.emptyDescription') }}</p>
          <button
            @click="handleClearAllFilters"
            class="px-5 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {{ t('filter.clearAll') }}
          </button>
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
        <span
          v-if="activeFiltersCount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold"
        >
          {{ activeFiltersCount }}
        </span>
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
import { onMounted, ref, computed, watch, nextTick } from "vue";
import Fuse from "fuse.js";
import HeaderBar from "~/components/layout/HeaderBar.vue";
import { useTranslations, useToolI18n, useLocale, resolveI18nString } from "~/composables/i18n";

const { t } = useTranslations();
const { toolHasLocaleContent } = useToolI18n();
import AdvancedFilter from "~/components/filters/AdvancedFilter.vue";
import FilterBar from "~/components/filters/FilterBar.vue";
import DatabaseItem from "~/components/items/DatabaseItem.vue";
import ComparisonModal from "~/components/modals/ComparisonModal.vue";
import MobileFilterModal from "~/components/filters/MobileFilterModal.vue";
import ProjectSelector from "~/components/selectors/ProjectSelector.vue";
import { useRouter, useRoute } from "vue-router";
import type { ToolItem } from "~/composables/useDatabase";
import { hasProjectSpecificData } from "~/composables/useDatabase";
import { isToolNotUpdatedForOverOneYear } from "~/utils/toolAge";
import {
  getFilterParams,
  clearAllFilters,
  setToolOptions,
  activeProjectFilter,
  showOldTools,
  initializeFilterOptions,
  filterState,
  filterOptions,
  setProjectFilter,
} from "~/config/filterHandler";
import { getFilterLabel, getFilterOptions } from "~/config/filterLabels";
import { useProjectProfile } from "~/composables/useProjectProfile";

const { items, loading, error, fetchDatabaseItems, toolLangFilter } = useDatabase();
const filteredItems = ref<ToolItem[]>([]);
const isMounted = ref(false);

// Show/hide advanced filter sidebar
const showFilters = ref(false);
const filterBarRef = ref(null);

// Return focus to the More Filters button when Advanced Filter sidebar is closed to improve A11y
watch(showFilters, (visible) => {
  if (!visible) {
    nextTick(() => {
      const btn = filterBarRef.value?.$el?.querySelector('.more-filters-button');
      btn?.focus();
    });
  }
});

// Show/hide mobile filter modal
const showMobileFilter = ref(false);

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

const router = useRouter();
const route = useRoute();

// Base dataset matching active project and language/search constraints
const projectItems = computed(() => {
  if (!items.value) return [];
  let result = [...items.value];

  // Filter by language content (localized only vs. all)
  if (toolLangFilter.value === 'localized') {
    result = result.filter((item) => toolHasLocaleContent(item.i18n));
  }

  // Filter by project-specific data
  const { activeProjectId } = useProjectProfile();
  if (activeProjectId.value && activeProjectId.value !== "general") {
    result = result.filter((item) =>
      hasProjectSpecificData(item, activeProjectId.value)
    );
  }

  // Filter by search query for dynamic options
  if (filterState.searchQuery && filterState.searchQuery.trim() !== "") {
    const originalQuery = filterState.searchQuery.trim();
    const expandedQuery = expandQueryWithSynonyms(originalQuery);
    
    const options = {
      keys: [
        { name: 'title', weight: 2.0 },
        { name: 'toolsentence', weight: 1.5 },
        { name: 'about', weight: 1.2 },
        { name: 'advantages', weight: 1.0 },
        { name: 'disadvantages', weight: 0.8 },
        { name: 'limitations', weight: 0.8 },
        { name: 'tasks', weight: 1.2 },
        { name: 'uses', weight: 1.0 },
        { name: 'inputs', weight: 1.0 },
        { name: 'outputs', weight: 1.0 },
        { name: 'profiles', weight: 1.0 },
        { name: 'pricings', weight: 1.0 },
        { name: 'aiupdateWorkflows.name', weight: 1.2 },
        { name: 'aiupdateWorkflows.steps.title', weight: 1.0 },
        { name: 'aiupdateWorkflows.steps.shortDescription', weight: 0.8 },
        { name: 'psyaidWorkflows.name', weight: 1.2 },
        { name: 'psyaidWorkflows.steps.title', weight: 1.0 },
        { name: 'psyaidWorkflows.steps.shortDescription', weight: 0.8 },
      ],
      threshold: 0.4,
      shouldSort: true,
    };
    
    const fuse = new Fuse(result, options);
    const searchResults = fuse.search(expandedQuery);
    result = searchResults.map(r => r.item);
  }

  return result;
});

// Compute distinct tool options from database items matching project/search
const toolOptions = computed(() => {
  const seen = new Set();
  return projectItems.value.reduce((acc, item) => {
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

// Recalculate and update filterOptions dynamically as current project matches change
watch(projectItems, () => {
  const currentTools = projectItems.value;

  // Helper to extract unique values for a field from currentTools
  const getUniqueValuesForField = (fieldName: string): Set<string> => {
    const values = new Set<string>();
    currentTools.forEach(item => {
      const itemValues = (item as any)[fieldName];
      if (Array.isArray(itemValues)) {
        itemValues.forEach(val => {
          if (val) values.add(val);
        });
      } else if (typeof itemValues === 'string' && itemValues) {
        values.add(itemValues);
      }
    });
    return values;
  };

  // Update all options dynamically
  const updateOptionStore = (filterId: string, optionsKey: string) => {
    const uniqueValues = getUniqueValuesForField(filterId);
    const allOptions = getFilterOptions(filterId);
    (filterOptions as any)[optionsKey] = allOptions.filter(opt => uniqueValues.has(opt.value));
  };

  updateOptionStore('uses', 'useOptions');
  updateOptionStore('setups', 'setupOptions');
  updateOptionStore('pricings', 'pricingOptions');
  updateOptionStore('licenses', 'licenseOptions');
  updateOptionStore('inputs', 'inputOptions');
  updateOptionStore('outputs', 'outputOptions');
  updateOptionStore('dataStorageLocations', 'dataStorageLocationOptions');
  
  // Project specific
  updateOptionStore('generationTimes', 'generationTimeOptions');
  updateOptionStore('tasks', 'taskOptions');
  updateOptionStore('profiles', 'profileOptions');
  
  // PSY-AID specific
  updateOptionStore('dataDeletionCapabilities', 'dataDeletionCapabilityOptions');
  updateOptionStore('suitabilityRobustnesses', 'suitabilityRobustnessOptions');
  updateOptionStore('onboardingEases', 'onboardingEaseOptions');
  updateOptionStore('offlineFunctionalities', 'offlineFunctionalityOptions');
}, { immediate: true });

// Computed active filter chips for display
const activeFilterChips = computed(() => {
  const chips: Array<{ type: string; value: string; label: string }> = [];

  // Search query chip
  if (filterState.searchQuery) {
    chips.push({
      type: 'searchQuery',
      value: filterState.searchQuery,
      label: `"${filterState.searchQuery}"`,
    });
  }

  if (filterState.capabilitySearch) {
    chips.push({
      type: 'capabilitySearch',
      value: filterState.capabilitySearch,
      label: `${t('filter.capabilities')}: "${filterState.capabilitySearch}"`,
    });
  }

  // Tool name dropdown chip
  if (filterState.name) {
    chips.push({
      type: 'name',
      value: filterState.name,
      label: filterState.name,
    });
  }

  const filterFields = [
    'uses', 'setups', 'pricings', 'licenses', 'generationTimes',
    'inputs', 'outputs', 'profiles', 'tasks', 'dataStorageLocations',
    'dataDeletionCapabilities',
    'suitabilityRobustnesses', 'onboardingEases', 'offlineFunctionalities'
  ];

  filterFields.forEach(fieldName => {
    const value = filterState[fieldName as keyof typeof filterState];
    if (Array.isArray(value)) {
      value.forEach(val => {
        chips.push({
          type: fieldName,
          value: val,
          label: getFilterLabel(fieldName, val),
        });
      });
    }
  });

  return chips;
});

// Computed active filters count
const activeFiltersCount = computed(() => activeFilterChips.value.length);

// Remove a single active filter chip
function removeSingleFilter(type: string, value: string) {
  if (type === 'searchQuery') {
    filterState.searchQuery = "";
  } else if (type === 'capabilitySearch') {
    filterState.capabilitySearch = "";
  } else if (type === 'name') {
    filterState.name = null;
  } else {
    const array = filterState[type as keyof typeof filterState] as string[];
    if (Array.isArray(array)) {
      const idx = array.indexOf(value);
      if (idx !== -1) {
        array.splice(idx, 1);
      }
    }
  }
  // Trigger filter refresh
  filteredItems.value = filterItems(getFilterParams());
}

// Clear all active filters and project selector back to general
function handleClearAllFilters() {
  clearAllFilters();
  const { setActiveProject } = useProjectProfile();
  setActiveProject('general');
  setProjectFilter('general');
  // Update URL to clean state
  router.push({ path: "/database", query: {} });
  // Trigger filter refresh
  filteredItems.value = filterItems(getFilterParams());
}

// Expand search query with common synonyms
function expandQueryWithSynonyms(query: string): string {
  const synonyms: Record<string, string> = {
    "make easier": "simplify",
    "picture": "image",
    "movie": "video",
    "voice": "audio",
    "free": "no cost gratis",
    "afbeelding": "image",
    "foto": "image",
    "geluid": "audio",
    "stem": "audio",
    "filmpje": "video",
    "vertalen": "translate",
  };

  let expanded = query.toLowerCase();
  Object.entries(synonyms).forEach(([synonym, replacement]) => {
    if (expanded.includes(synonym)) {
      expanded += " " + replacement;
    }
  });
  return expanded;
}

// Filter items based on selected filters
function filterItems(filters: any) {
  // We start with projectItems (which handles active language, active project, and search fuzzy queries)
  let result = [...projectItems.value];

  // Tool name filter
  if (filters.name && filters.name.trim() !== "") {
    const search = filters.name.toLowerCase();
    result = result.filter((item) => item.title.toLowerCase().includes(search));
  }

  // Capability search filter – locale-aware title & toolsentence, word-based
  if (filters.capabilitySearch && filters.capabilitySearch.trim() !== "") {
    const words = filters.capabilitySearch.trim().toLowerCase().split(/\s+/).filter(Boolean);
    result = result.filter((item) => {
      // Resolve title and toolsentence for the active locale
      const titleText = resolveI18nString(item.i18n?.title, locale.value) || item.title || "";
      const sentenceText = resolveI18nString(item.i18n?.toolsentence, locale.value) || item.toolsentence || "";
      const combined = (titleText + " " + sentenceText).toLowerCase();
      // Every word in the query must appear as a whole word somewhere
      return words.every((word: string) => new RegExp(`\\b${word}`, 'i').test(combined));
    });
  }

  // Dynamic filtering based on active filter fields
  const filterFields = [
    'uses', 'setups', 'pricings', 'licenses', 'generationTimes',
    'inputs', 'outputs', 'profiles', 'tasks', 'dataStorageLocations',
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

  // Filter out tools older than 1 year only when showOldTools is turned off (default: on)
  if (!showOldTools.value) {
    // Based on last updated date (falls back to dateAdded)
    result = result.filter((item) => !isToolNotUpdatedForOverOneYear(item));
  }

  return result;
}

// Sync active filters to URL query parameters
function syncFiltersToUrl() {
  if (!isMounted.value) return;
  const query: Record<string, string | string[]> = {};
  
  const { activeProjectId } = useProjectProfile();
  if (activeProjectId.value && activeProjectId.value !== 'general') {
    query.project = activeProjectId.value;
  }
  
  if (filterState.searchQuery) {
    query.search = filterState.searchQuery;
  }

  if (filterState.capabilitySearch) {
    query.capabilities = filterState.capabilitySearch;
  }

  if (filterState.name) {
    query.name = filterState.name;
  }

  const filterFields = [
    'uses', 'setups', 'pricings', 'licenses', 'generationTimes',
    'inputs', 'outputs', 'profiles', 'tasks', 'dataStorageLocations',
    'dataDeletionCapabilities',
    'suitabilityRobustnesses', 'onboardingEases', 'offlineFunctionalities'
  ];

  filterFields.forEach(fieldName => {
    const value = filterState[fieldName as keyof typeof filterState];
    if (Array.isArray(value) && value.length > 0) {
      query[fieldName] = value.join(',');
    }
  });

  router.push({ path: '/database', query });
}

// Sync URL query parameters to reactive filterState
function syncUrlToFilters() {
  const query = route.query;
  
  if (typeof query.search === 'string') {
    filterState.searchQuery = query.search;
  } else {
    filterState.searchQuery = "";
  }

  if (typeof query.capabilities === 'string') {
    filterState.capabilitySearch = query.capabilities;
  } else {
    filterState.capabilitySearch = "";
  }

  if (typeof query.name === 'string') {
    filterState.name = query.name;
  } else {
    filterState.name = null;
  }

  const filterFields = [
    'uses', 'setups', 'pricings', 'licenses', 'generationTimes',
    'inputs', 'outputs', 'profiles', 'tasks', 'dataStorageLocations',
    'dataDeletionCapabilities',
    'suitabilityRobustnesses', 'onboardingEases', 'offlineFunctionalities'
  ];

  filterFields.forEach(fieldName => {
    const queryVal = query[fieldName];
    if (typeof queryVal === 'string' && queryVal.trim() !== '') {
      (filterState as any)[fieldName] = queryVal.split(',');
    } else {
      (filterState as any)[fieldName] = [];
    }
  });

  const { setActiveProject, activeProjectId: profileActiveProjectId } = useProjectProfile();
  if (typeof query.project === 'string') {
    if (profileActiveProjectId.value !== query.project) {
      setActiveProject(query.project);
      setProjectFilter(query.project);
    }
  } else {
    if (profileActiveProjectId.value !== 'general') {
      setActiveProject('general');
      setProjectFilter('general');
    }
  }
}

// Watch for changes to route query (browser navigation) and sync to filters
watch(() => route.query, () => {
  syncUrlToFilters();
  filteredItems.value = filterItems(getFilterParams());
}, { deep: true });

// Apply filters from the top filter bar or mobile filter modal
const handleFiltersApplied = (filters) => {
  console.log("Filters applied:", filters);
  filteredItems.value = filterItems(getFilterParams());
  syncFiltersToUrl();
  showMobileFilter.value = false; // Close mobile filter modal after applying filters
};

// Apply filters from the advanced sidebar
const handleAdvancedFilters = () => {
  console.log("Advanced filters applied:", getFilterParams());
  syncFiltersToUrl();
};

// Watch for changes to showOldTools toggle
watch(showOldTools, () => {
  syncFiltersToUrl();
});

// Re-filter when language mode changes
watch(toolLangFilter, () => {
  syncFiltersToUrl();
});

// Reactively reinitialize filter options on active locale switch to translate dropdowns instantly
const { locale } = useLocale();
watch(locale, () => {
  initializeFilterOptions();
});

onMounted(async () => {
  // Initialize filter options from hardcoded labels (v3.0)
  initializeFilterOptions();
  
  // Sync URL parameters to filterState on load
  syncUrlToFilters();
  
  await fetchDatabaseItems();
  
  // Apply filters on initial load to respect preselected project/query parameters
  filteredItems.value = filterItems(getFilterParams());

  // Set tool options in the filter handler
  if (toolOptions.value.length > 0) {
    setToolOptions(toolOptions.value);
  }

  nextTick(() => {
    isMounted.value = true;
  });
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
