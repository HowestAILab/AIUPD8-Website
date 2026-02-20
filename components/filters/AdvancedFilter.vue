<template>
  <div class="w-full h-full flex flex-col">
    <!-- Fixed header with title and close button -->
    <div
      class="flex-shrink-0 bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200 shadow-sm"
    >
      <h2 class="text-2xl font-bold">{{ t('filter.advancedTitle') }}</h2>

      <!-- Close button next to title -->
      <button
        type="button"
        class="ml-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
        aria-label="Close filters"
        @click="closeFilters"
      >
        <i class="pi pi-times text-lg" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Scrollable content area -->
    <div class="flex-1 overflow-y-auto min-h-0 px-4 pt-4 pb-6">
      <!-- GENERAL FILTERS (Always visible for all projects) -->
      <template v-for="filter in generalFilters" :key="filter.id">
        <!-- Button Group Filters -->
        <div v-if="getFilterComponentType(filter.id) === 'button-group'" class="mb-6">
          <h3 class="text-lg font-bold mb-2">{{ filter.title }}</h3>
          <div class="flex w-full overflow-x-auto">
            <ButtonGroup
              :modelValue="getFilterStateValue(filter)"
              @update:modelValue="(val) => { setFilterStateValue(filter, val); emitInstantFilters(); }"
              :options="getOptionsForFilter(filter)"
              optionLabel="label"
              optionValue="value"
              multiple
            />
          </div>
        </div>

        <!-- Multi-Select Filters -->
        <div v-else class="mb-6">
          <h3 class="text-lg font-bold mb-2">{{ filter.title }}</h3>
          <MultiSelect
            filter
            :modelValue="getFilterStateValue(filter)"
            @update:modelValue="(val) => { setFilterStateValue(filter, val); emitInstantFilters(); }"
            :options="getOptionsForFilter(filter)"
            optionLabel="label"
            optionValue="value"
            :placeholder="`Select ${filter.title.toLowerCase()}`"
            :loading="loading"
            class="w-full"
          />
        </div>
      </template>

      <!-- SHOW OLD TOOLS TOGGLE -->
      <div class="mb-6">
        <label
          class="flex items-center text-sm text-gray-700 cursor-pointer hover:text-gray-900"
        >
          <input
            type="checkbox"
            v-model="showOldTools"
            class="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            @change="emitInstantFilters"
          />
          <span>{{ t('filter.showOldTools') }}</span>
        </label>
      </div>

      <!-- PROJECT-SPECIFIC FILTERS -->
      <template v-if="hasSpecificFilters">
        <Divider class="mb-6" />

        <div class="mb-4 p-3 rounded-lg border" :style="badgeStyles">
          <p class="text-sm font-medium">
            {{ activeProjectId === 'aiupd8' ? 'AI-UPD8' : activeProjectId === 'psyaid' ? 'PSY-AID' : 'Project' }} {{ t('filter.specificFilters') }}
          </p>
        </div>

        <template v-for="filter in specificFilters" :key="filter.id">
          <!-- Button Group Filters -->
          <div v-if="getFilterComponentType(filter.id) === 'button-group'" class="mb-6">
            <h3 class="text-lg font-bold mb-2 flex items-center gap-1">
              {{ filter.title }}
              <InfoBubble v-if="filter.description" :text="filter.description" />
            </h3>
            <div class="flex w-full overflow-x-auto">
              <ButtonGroup
                :modelValue="getFilterStateValue(filter)"
                @update:modelValue="(val) => { setFilterStateValue(filter, val); emitInstantFilters(); }"
                :options="getOptionsForFilter(filter)"
                optionLabel="label"
                optionValue="value"
                multiple
              />
            </div>
          </div>

          <!-- Multi-Select Filters -->
          <div v-else class="mb-6">
            <h3 class="text-lg font-bold mb-2 flex items-center gap-1">
              {{ filter.title }}
              <InfoBubble v-if="filter.description" :text="filter.description" />
            </h3>
            <MultiSelect
              filter
              :modelValue="getFilterStateValue(filter)"
              @update:modelValue="(val) => { setFilterStateValue(filter, val); emitInstantFilters(); }"
              :options="getOptionsForFilter(filter)"
              optionLabel="label"
              optionValue="value"
              :placeholder="`Select ${filter.title.toLowerCase()}`"
              :loading="loading"
              class="w-full"
              showClear
            />
          </div>
        </template>
      </template>

      <!-- CLEAR FILTERS BUTTON -->
      <div class="w-full mb-2 sm:mb-0 flex flex-col gap-2">
        <Button
          :label="t('filter.clearFilters')"
          icon="pi pi-trash"
          class="p-button-outlined p-button-danger w-full pd-2"
          @click="clearFilters"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, onBeforeUnmount, watch } from "vue";
import MultiSelect from "primevue/multiselect";
import ButtonGroup from "~/components/ui/ButtonGroup.vue";
import InfoBubble from "~/components/ui/InfoBubble.vue";
import { defaultSelectionOrder } from "~/config/selectionOrder";
import { useTranslations } from "~/composables/i18n";
import {
  filterState,
  filterOptions,
  clearAllFilters,
  loading,
  reorderOptions,
  getFilterParams,
  showOldTools,
  getFilterOptionsKey,
  initializeFilterOptions,
} from "~/config/filterHandler";
import { useProjectProfile } from "~/composables/useProjectProfile";
import { shouldUseButtonGroup } from "~/config/filterLabels";
import { 
  getAllFiltersForProject, 
  getGeneralFilters,
  getSpecificFiltersForProject,
  type FilterConfig 
} from "~/config/projectFilters";

const { activeProjectId, activeProject } = useProjectProfile();
const { t } = useTranslations();

// Get filters for current project
const generalFilters = computed(() => getGeneralFilters());
const specificFilters = computed(() => getSpecificFiltersForProject(activeProjectId.value));
const hasSpecificFilters = computed(() => specificFilters.value.length > 0);

// Get project-specific color for the badge
const projectColor = computed(() => activeProject.value?.color || '#8B5CF6'); // Default to purple if no project

// Helper to convert hex to Tailwind-compatible background and text colors
const badgeStyles = computed(() => {
  const color = projectColor.value;
  return {
    backgroundColor: `${color}15`, // 15 is roughly 8% opacity in hex
    borderColor: `${color}40`, // 40 is roughly 25% opacity in hex
    color: color,
  };
});

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["apply-filters", "update:isVisible"]);

/**
 * Get filter component type based on filter ID and option count (v3.0)
 * Returns 'button-group' for filters with 3 or fewer options, 'multi-select' for others
 */
function getFilterComponentType(filterId: string): 'button-group' | 'multi-select' {
  const options = getOptionsForFilter({ id: filterId } as FilterConfig);
  const optionCount = options.length;
  return shouldUseButtonGroup(filterId, optionCount) ? 'button-group' : 'multi-select';
}

/**
 * Get filter options for a specific filter
 */
function getOptionsForFilter(filter: FilterConfig) {
  const optionsKey = getFilterOptionsKey(filter.id) as keyof typeof filterOptions;
  return filterOptions[optionsKey] || [];
}

/**
 * Get filter state value for a specific filter
 * Returns empty array if value is null, or ensures array type for components
 */
function getFilterStateValue(filter: FilterConfig): string[] {
  const stateKey = filter.fieldName as keyof typeof filterState;
  const value = filterState[stateKey];
  // Handle the name field which is a single string
  if (stateKey === 'name') {
    return [];
  }
  // Ensure we return an array
  return (Array.isArray(value) ? value : []) as string[];
}

/**
 * Update filter state value for a specific filter
 */
function setFilterStateValue(filter: FilterConfig, value: any) {
  const stateKey = filter.fieldName as keyof typeof filterState;
  (filterState as any)[stateKey] = value;
}

function emitInstantFilters() {
  emits("apply-filters", getFilterParams());
}

function clearFilters() {
  clearAllFilters();
}

// Close handler for the Close/Done button and other programmatic closes
function closeFilters() {
  emits("update:isVisible", false);
}

// Allow closing with the Escape key for desktop/keyboard users
function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") closeFilters();
}

onMounted(() => {
  // Initialize filter options from hardcoded labels (v3.0)
  initializeFilterOptions();
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});

// Watch for project changes and clear filters
watch(() => activeProjectId.value, () => {
  clearFilters(); // Clear filters when switching projects
}, { immediate: false });
</script>
