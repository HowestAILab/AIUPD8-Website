<template>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <!-- Modified filter for tool name as dropdown -->
    <div class="w-full sm:w-48 flex flex-col">
      <h3 class="font-semibold">tool name</h3>
      <Dropdown
        v-model="filterState.name"
        :options="filterOptions.toolOptions"
        optionLabel="name"
        placeholder="Select tool"
        class="w-full"
        filter
        showClear
      />
    </div>
    <div class="w-full sm:w-48 flex flex-col">
      <h3 class="font-semibold">input</h3>
      <MultiSelect
        v-model="filterState.inputs"
        :options="filterOptions.inputOptions"
        optionLabel="name"
        placeholder="search"
        :loading="loading"
        filter
        class="w-full"
        showClear
      />
    </div>
    <div class="w-full sm:w-48 flex flex-col">
      <h3 class="font-semibold">output</h3>
      <MultiSelect
        v-model="filterState.outputs"
        :options="filterOptions.outputOptions"
        optionLabel="name"
        placeholder="search"
        :loading="loading"
        filter
        class="w-full"
        showClear
      />
    </div>
    <div class="w-full sm:w-48 flex flex-col">
      <h3 class="font-semibold">profile</h3>
      <MultiSelect
        v-model="filterState.profiles"
        :options="filterOptions.profileOptions"
        optionLabel="name"
        placeholder="search"
        :loading="loading"
        filter
        class="w-full"
        showClear
      />
    </div>
    <div class="w-full sm:w-48 flex flex-col justify-end mt-[24px]">
      <div class="flex flex-col sm:flex-row gap-2 w-full">
        <!-- Search button in its own container -->
        <div class="w-full mb-2 sm:mb-0">
          <Button
            label="search"
            icon="pi pi-search"
            @click="applyFilters"
            class="w-full search-button"
          />
        </div>

        <!-- Filter and Clear buttons -->
        <div class="flex gap-2 w-full justify-center sm:justify-start">
          <Button
            label="filters"
            icon="pi pi-filter"
            @click="toggleFilters"
            class="p-button-outlined more-filters-button flex-grow"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import MultiSelect from "primevue/multiselect";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { useTaxonomyTypes } from "~/composables/useTaxonomyTypes";
import {
  filterState,
  filterOptions,
  loading,
  getFilterParams,
} from "~/config/filterHandler";

// Accept toolOptions from parent and rename input props
const props = defineProps<{
  toolOptions: any[];
}>();

// Update toolOptions in the shared filter state
onMounted(() => {
  filterOptions.toolOptions = props.toolOptions;
});

// Initialize the taxonomy types composable
const { fetchTaxonomyByType } = useTaxonomyTypes();

// Fetch filter options for non-tool taxonomies
async function fetchFilterOptions() {
  try {
    loading.value = true;
    const [inputs, outputs, profiles] = await Promise.all([
      fetchTaxonomyByType("input"),
      fetchTaxonomyByType("output"),
      fetchTaxonomyByType("profile"),
    ]);

    // Only update if they're not already loaded by AdvancedFilter
    if (filterOptions.inputOptions.length === 0) {
      filterOptions.inputOptions = inputs;
    }
    if (filterOptions.outputOptions.length === 0) {
      filterOptions.outputOptions = outputs;
    }
    if (filterOptions.profileOptions.length === 0) {
      filterOptions.profileOptions = profiles;
    }
  } catch (error) {
    console.error("Error fetching filter options:", error);
  } finally {
    loading.value = false;
  }
}

const emits = defineEmits(["toggle-filters", "apply-filters"]);

const toggleFilters = () => {
  emits("toggle-filters");
};

const applyFilters = () => {
  emits("apply-filters", getFilterParams());
};

onMounted(() => {
  fetchFilterOptions();
});
</script>

<style scoped>
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.w-full {
  width: 100%;
}

.sm\:w-48 {
  width: 12rem;
}

.flex-grow {
  flex-grow: 1;
}

.search-button {
  min-width: 100px;
  text-align: center;
}

.more-filters-button {
  min-width: 120px;
  text-align: center;
  white-space: nowrap;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .more-filters-button {
    width: 100%;
  }
}

/* Remove compare button related styles */
.compare-button-container,
.compare-button,
.comparison-badge {
  display: none;
}

/* Add styles to ensure filter input is visible */
:deep(.p-multiselect-filter-container) {
  width: 100%;
  padding: 0.5rem;
}

:deep(.p-multiselect-filter) {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--surface-200);
  border-radius: 4px;
}

:deep(.p-multiselect-panel) {
  min-width: 100%;
}
</style>
