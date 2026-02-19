<template>
  <Dialog
    :visible="isVisible"
    @update:visible="updateVisibility"
    :modal="true"
    :dismissableMask="true"
    :closable="false"
    :style="{ width: '90vw', maxWidth: '500px' }"
    position="bottom"
    class="mobile-filter-dialog pl-4"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-2xl font-bold">{{ t('database.filters') }}</h2>
        <Button
          icon="pi pi-times"
          @click="close"
          class="p-button-rounded p-button-text p-button-plain"
        />
      </div>
    </template>

    <div class="filter-sections">
      <!-- Basic Filter Options -->
      <div class="filter-section">
        <h3 class="text-lg font-semibold mb-3">{{ t('filter.quickFilters') }}</h3>

        <!-- Tool name filter -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">{{ t('filter.toolName') }}</h4>
          <Dropdown
            v-model="filterState.name"
            :options="filterOptions.toolOptions"
            optionLabel="name"
            :placeholder="t('filter.selectTool')"
            class="ml-1 w-[90%]"
            filter
            showClear
          />
        </div>

        <!-- Profile Selector -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">{{ t('filter.profile') }}</h4>
          <Dropdown
            v-model="localSelectedProject"
            :options="projectOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="t('filter.selectProfile')"
            class="ml-1 w-[90%]"
            @change="handleProjectChange"
          />
        </div>
        
        <!-- Show old tools toggle -->
        <div class="mb-4">
          <label
            class="flex items-center text-sm text-gray-700 cursor-pointer hover:text-gray-900 ml-1"
          >
            <input
              type="checkbox"
              v-model="showOldTools"
              class="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span>{{ t('filter.showOldTools') }}</span>
          </label>
        </div>
      </div>

      <Divider class="filter-divider" />

      <!-- All Filter Options (Dynamic) -->
      <div class="filter-section">
        <h3 class="text-lg font-semibold mb-3">{{ t('filter.allFilters') }}</h3>

        <template v-for="filter in allFilters" :key="filter.id">
          <!-- Button Group Filters -->
          <div v-if="getFilterComponentType(filter.id) === 'button-group'" class="mb-4">
            <h4 class="font-medium mb-1">{{ filter.title }}</h4>
            <div class="ml-1 w-[90%]">
              <ButtonGroup
                :modelValue="getFilterStateValue(filter)"
                @update:modelValue="(val) => setFilterStateValue(filter, val)"
                :options="getOptionsForFilter(filter)"
                optionLabel="label"
                optionValue="value"
                multiple
              />
            </div>
          </div>

          <!-- Multi-Select Filters -->
          <div v-else class="mb-4">
            <h4 class="font-medium mb-1">
              {{ filter.title }}
              <i 
                v-if="filter.description" 
                class="pi pi-info-circle text-xs text-gray-500 ml-1 cursor-help" 
                :title="filter.description"
              ></i>
            </h4>
            <MultiSelect
              filter
              :modelValue="getFilterStateValue(filter)"
              @update:modelValue="(val) => setFilterStateValue(filter, val)"
              :options="getOptionsForFilter(filter)"
              optionLabel="label"
              optionValue="value"
              :placeholder="`Select ${filter.title.toLowerCase()}`"
              class="ml-1 w-[90%]"
              showClear
            />
          </div>
        </template>
      </div>

      <!-- Project-Specific Filters Badge -->
      <template v-if="hasSpecificFilters">
        <Divider class="filter-divider" />
        <div class="filter-section">
          <div class="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p class="text-sm text-purple-800 font-medium">
              {{ activeProjectId === 'aiupd8' ? 'AI-UPD8' : activeProjectId === 'psyaid' ? 'PsyAid' : 'Project' }} {{ t('filter.specificFilters') }}
            </p>
            <p class="text-xs text-purple-600 mt-1">
              {{ specificFilters.length }} {{ t('filter.specializedFilters') }}
            </p>
          </div>
        </div>
      </template>
    </div>

    <template #footer>
      <div class="flex flex-col w-full gap-3 mt-4">
        <Button
          :label="t('filter.applyFilters')"
          icon="pi pi-search"
          @click="applyFilters"
          class="w-full"
        />
        <Button
          :label="t('filter.clearFilters')"
          icon="pi pi-trash"
          class="p-button-outlined p-button-danger w-full"
          @click="clearFilters"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted, computed, watch, ref } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import Divider from "primevue/divider";
import ButtonGroup from "~/components/ui/ButtonGroup.vue";
import {
  filterState,
  filterOptions,
  loading,
  clearAllFilters,
  getFilterParams,
  showOldTools,
  setProjectFilter,
  getFilterOptionsKey,
  initializeFilterOptions,
} from "~/config/filterHandler";
import { shouldUseButtonGroup } from "~/config/filterLabels";
import { useProjectProfile } from "~/composables/useProjectProfile";
import { useTranslations } from "~/composables/i18n";
import { useRouter } from "vue-router";
import { 
  getAllFiltersForProject,
  getSpecificFiltersForProject,
  type FilterConfig 
} from "~/config/projectFilters";

const router = useRouter();
const { t } = useTranslations();

const { projects, activeProjects, activeProjectId, setActiveProject } =
  useProjectProfile();

// Get filters for current project
const allFilters = computed(() => getAllFiltersForProject(activeProjectId.value));
const specificFilters = computed(() => getSpecificFiltersForProject(activeProjectId.value));
const hasSpecificFilters = computed(() => specificFilters.value.length > 0);

// Local state for project selection
const localSelectedProject = ref<string>(activeProjectId.value);

// Create options for dropdown with profile names
const projectOptions = computed(() => {
  const options = [
    { label: t('filter.generalUser'), value: "general" },
    ...activeProjects.value.map((p) => ({
      label: p.profile?.name || p.name,
      value: p.id,
    })),
  ];
  return options;
});

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  toolOptions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "apply-filters"]);

// Computed property for dialog visibility
const isVisible = computed(() => props.modelValue);

/**
 * Get filter component type based on filter ID (v3.0)
 */
function getFilterComponentType(filterId: string): 'button-group' | 'multi-select' | 'dropdown' {
  return shouldUseButtonGroup(filterId) ? 'button-group' : 'multi-select';
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

// Watch for changes in activeProjectId and sync with localSelectedProject
watch(
  () => activeProjectId.value,
  (newValue) => {
    localSelectedProject.value = newValue;
  }
);

// Handle project change
const handleProjectChange = () => {
  const selectedProjectId = localSelectedProject.value;
  setActiveProject(selectedProjectId);
  setProjectFilter(selectedProjectId);

  // Navigate to database page with project query if not already there
  if (router.currentRoute.value.path === "/database") {
    const query =
      selectedProjectId === "general" ? {} : { project: selectedProjectId };
    router.push({ path: "/database", query });
  }

  // Fetch filters for new project
  fetchFilterOptions();
  
  // Emit filters to refresh the results
  emit("apply-filters", getFilterParams());
};

// Update tool options in the filter handler when props change
watch(
  () => props.toolOptions,
  (newTools) => {
    if (newTools && newTools.length > 0) {
      filterOptions.toolOptions = newTools;
    }
  },
  { immediate: true }
);

// Function to update visibility and emit the update event
function updateVisibility(value) {
  emit("update:modelValue", value);
}

// Initialize filter options from hardcoded labels (v3.0)
function fetchFilterOptions() {
  initializeFilterOptions();
}

// Function to close the dialog
function close() {
  emit("update:modelValue", false);
}

function applyFilters() {
  emit("apply-filters", getFilterParams());
  close();
}

function clearFilters() {
  clearAllFilters();
}

onMounted(() => {
  fetchFilterOptions();
});
</script>
