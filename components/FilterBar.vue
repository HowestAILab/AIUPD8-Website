<template>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <!-- Modified filter for tool name as dropdown -->
    <div class="w-full sm:w-48 flex flex-col">
      <h3 class="font-semibold">Tool Name</h3>
      <Dropdown
        v-model="filters.name"
        :options="toolOptions"
        optionLabel="name"
        placeholder="Select tool"
        class="w-full"
        filter
      />
    </div>
    <div class="w-full sm:w-48 flex flex-col">
      <h3 class="font-semibold">input</h3>
      <MultiSelect
        v-model="filters.inputs"
        :options="inputOptions"
        optionLabel="name"
        placeholder="search"
        :loading="loading"
        filter
        class="w-full"
      />
    </div>
    <div class="w-full sm:w-48 flex flex-col">
      <h3 class="font-semibold">output</h3>
      <MultiSelect
        v-model="filters.outputs"
        :options="outputOptions"
        optionLabel="name"
        placeholder="search"
        :loading="loading"
        filter
        class="w-full"
      />
    </div>
    <div class="w-full sm:w-48 flex flex-col">
      <h3 class="font-semibold">profile</h3>
      <MultiSelect
        v-model="filters.profiles"
        :options="profileOptions"
        optionLabel="name"
        placeholder="search"
        :loading="loading"
        filter
        class="w-full"
      />
    </div>
    <div class="w-full sm:w-48 flex flex-col justify-end mt-[24px]">
      <div class="flex flex-col sm:flex-row gap-2 w-full">
        <!-- Search button in its own container -->
        <div class="w-full mb-2 sm:mb-0">
          <Button
            label="Search"
            icon="pi pi-search"
            @click="applyFilters"
            class="w-full search-button"
          />
        </div>

        <!-- Filter and Compare buttons in a separate container -->
        <div class="flex gap-2 w-full justify-center sm:justify-start">
          <Button
            label="More Filters"
            icon="pi pi-filter"
            @click="toggleFilters"
            class="p-button-outlined more-filters-button flex-grow sm:flex-grow-0"
          />
          <div class="compare-button-container flex-grow sm:flex-grow-0">
            <Button
              label="Compare"
              class="p-button-outlined compare-button w-full"
              @click="openComparisonModal"
            >
              <span class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  class="w-4 h-4 mr-1"
                >
                  <path
                    fill="currentColor"
                    d="M384 32l128 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L398.4 96c-5.2 25.8-22.9 47.1-46.4 57.3L352 448l160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-192 0-192 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0 0-294.7c-23.5-10.3-41.2-31.6-46.4-57.3L128 96c-17.7 0-32-14.3-32-32s14.3-32 32-32l128 0c14.6-19.4 37.8-32 64-32s49.4 12.6 64 32zm55.6 288l144.9 0L512 195.8 439.6 320zM512 416c-62.9 0-115.2-34-126-78.9c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1C627.2 382 574.9 416 512 416zM126.8 195.8L54.4 320l144.9 0L126.8 195.8zM.9 337.1c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1C242 382 189.7 416 126.8 416S11.7 382 .9 337.1z"
                  />
                </svg>
                Compare
              </span>
            </Button>
            <span v-if="comparisonCount > 0" class="comparison-badge">
              {{ comparisonCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import MultiSelect from "primevue/multiselect";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { useTaxonomyTypes, TaxonomyItem } from "~/composables/useTaxonomyTypes";

// Accept toolOptions from parent and add comparisonCount prop
const props = defineProps<{
  toolOptions: TaxonomyItem[];
  comparisonCount: number;
}>();

// Updated FilterState: change type of 'name'
interface FilterState {
  name: TaxonomyItem | null;
  inputs: TaxonomyItem[];
  outputs: TaxonomyItem[];
  profiles: TaxonomyItem[];
}

const filters = reactive<FilterState>({
  name: null,
  inputs: [],
  outputs: [],
  profiles: [],
});

const inputOptions = ref<TaxonomyItem[]>([]);
const outputOptions = ref<TaxonomyItem[]>([]);
const profileOptions = ref<TaxonomyItem[]>([]);

// Initialize the taxonomy types composable
const { loading, error, fetchTaxonomyByType } = useTaxonomyTypes();

// Fetch filter options for non-tool taxonomies
async function fetchFilterOptions() {
  try {
    const [inputs, outputs, profiles] = await Promise.all([
      fetchTaxonomyByType("input"),
      fetchTaxonomyByType("output"),
      fetchTaxonomyByType("profile"),
    ]);
    inputOptions.value = inputs;
    outputOptions.value = outputs;
    profileOptions.value = profiles;
  } catch (error) {
    console.error("Error fetching filter options:", error);
  }
}

const emits = defineEmits([
  "toggle-filters",
  "apply-filters",
  "open-comparison",
]);

const toggleFilters = () => {
  emits("toggle-filters");
};

const applyFilters = () => {
  const filterParams = {
    name: filters.name ? filters.name.name : "",
    inputs: filters.inputs.map((item) => item.name),
    outputs: filters.outputs.map((item) => item.name),
    profiles: filters.profiles.map((item) => item.name),
  };
  emits("apply-filters", filterParams);
};

// Add method to open the comparison modal
const openComparisonModal = () => {
  emits("open-comparison");
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
  .more-filters-button,
  .compare-button {
    width: 100%;
  }
}

.compare-button-container {
  position: relative;
  display: inline-block;
}

.compare-button {
  min-width: 120px;
  text-align: center;
  white-space: nowrap;
}

.comparison-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border: 1px solid white;
  z-index: 1000;
}

.p-button-outlined {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  background-color: transparent;
}

.p-button-outlined:hover {
  background-color: var(--primary-color);
  color: white;
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
