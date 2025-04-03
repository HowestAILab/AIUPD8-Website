<template>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <!-- New filter for tool name -->
    <div class="w-full sm:w-48 flex flex-col">
      <h3 class="font-semibold">Name</h3>
      <input
        v-model="filters.name"
        type="text"
        placeholder="Search by name"
        class="w-full p-2 border rounded"
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
      <div class="flex gap-2 w-full justify-center sm:justify-start">
        <Button
          label="Search"
          icon="pi pi-search"
          @click="applyFilters"
          class="flex-grow search-button"
        />
        <Button
          label="More Filters"
          icon="pi pi-filter"
          @click="toggleFilters"
          class="p-button-outlined more-filters-button"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import MultiSelect from "primevue/multiselect";
import Button from "primevue/button";
import { useTaxonomyTypes, TaxonomyItem } from "~/composables/useTaxonomyTypes";

// Updated FilterState to include 'name'
interface FilterState {
  name: string;
  inputs: TaxonomyItem[];
  outputs: TaxonomyItem[];
  profiles: TaxonomyItem[];
}

const filters = reactive<FilterState>({
  name: "",
  inputs: [],
  outputs: [],
  profiles: [],
});

const inputOptions = ref<TaxonomyItem[]>([]);
const outputOptions = ref<TaxonomyItem[]>([]);
const profileOptions = ref<TaxonomyItem[]>([]);

// Initialize the taxonomy types composable
const { loading, error, fetchTaxonomyByType } = useTaxonomyTypes();

// Fetch filter options using the dynamic route
async function fetchFilterOptions() {
  try {
    // Fetch all taxonomy types in parallel for better performance
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

const emits = defineEmits(["toggle-filters", "apply-filters"]);

const toggleFilters = () => {
  emits("toggle-filters");
};

const applyFilters = () => {
  // Include name filter along with others
  const filterParams = {
    name: filters.name,
    inputs: filters.inputs.map((item) => item.name),
    outputs: filters.outputs.map((item) => item.name),
    profiles: filters.profiles.map((item) => item.name),
  };

  // Emit the event with filter parameters
  emits("apply-filters", filterParams);
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
  min-width: 140px;
  text-align: center;
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
