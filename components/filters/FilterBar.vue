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
        @change="emitInstantFilters"
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
        @change="emitInstantFilters"
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
        @change="emitInstantFilters"
      />
    </div>
    <!-- Project/Profile Selector -->
    <div class="w-full sm:w-48 flex flex-col">
      <h3 class="font-semibold">profile</h3>
      <Dropdown
        v-model="localSelectedProject"
        :options="projectOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Select Profile"
        class="w-full"
        @change="handleProjectChange"
      />
    </div>
    <div class="w-full sm:w-48 flex flex-col justify-end mt-[24px]">
      <div class="flex flex-col sm:flex-row gap-2 w-full">
        <!-- Filter button only -->
        <div class="flex gap-2 w-full justify-center sm:justify-start">
          <Button
            label="more filters"
            icon="pi pi-filter"
            @click="toggleFilters"
            class="p-button more-filters-button flex-grow"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import MultiSelect from "primevue/multiselect";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { useTaxonomyTypes } from "~/composables/useTaxonomyTypes";
import { useProjectProfile } from "~/composables/useProjectProfile";
import {
  filterState,
  filterOptions,
  loading,
  getFilterParams,
  setProjectFilter,
} from "~/config/filterHandler";

const router = useRouter();
const route = useRoute();

const { projects, activeProjects, activeProjectId, setActiveProject } =
  useProjectProfile();

// Local state for project selection
const localSelectedProject = ref<string>(activeProjectId.value);

// Create options for dropdown with profile names
const projectOptions = computed(() => {
  return [
    { label: "General User", value: "general" },
    ...activeProjects.value.map((project: any) => ({
      label: project.profile?.name || project.name,
      value: project.id,
    })),
  ];
});

// Handle project change
function handleProjectChange(): void {
  const newProject = localSelectedProject.value;
  setActiveProject(newProject);
  setProjectFilter(newProject);

  // Update URL with project parameter
  if (newProject === "general") {
    router.push({ path: "/database", query: {} });
  } else {
    router.push({ path: "/database", query: { project: newProject } });
  }

  // Emit filters to refresh results
  emitInstantFilters();
}

// Sync with global state
watch(activeProjectId, (newValue: string) => {
  localSelectedProject.value = newValue;
});

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
    const [inputs, outputs] = await Promise.all([
      fetchTaxonomyByType("input"),
      fetchTaxonomyByType("output"),
    ]);

    // Only update if they're not already loaded by AdvancedFilter
    if (filterOptions.inputOptions.length === 0) {
      filterOptions.inputOptions = inputs;
    }
    if (filterOptions.outputOptions.length === 0) {
      filterOptions.outputOptions = outputs;
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

// Emit filters instantly on any change
const emitInstantFilters = () => {
  emits("apply-filters", getFilterParams());
};

onMounted(() => {
  fetchFilterOptions();

  // Initialize project from URL parameter
  const projectParam = route.query.project as string;
  if (projectParam && projects.value.some((p: any) => p.id === projectParam)) {
    localSelectedProject.value = projectParam;
  }
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
