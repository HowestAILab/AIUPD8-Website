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
        <h2 class="text-2xl font-bold">Filters</h2>
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
        <h3 class="text-lg font-semibold mb-3">Quick Filters</h3>

        <!-- Tool name filter -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Tool Name</h4>
          <Dropdown
            v-model="filterState.name"
            :options="filterOptions.toolOptions"
            optionLabel="name"
            placeholder="Select tool"
            class="ml-1 w-[90%]"
            filter
            showClear
          />
        </div>

        <!-- Input filter -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Input</h4>
          <MultiSelect
            v-model="filterState.inputs"
            :options="filterOptions.inputOptions"
            optionLabel="name"
            placeholder="Select inputs"
            class="ml-1 w-[90%]"
            filter
            showClear
          />
        </div>

        <!-- Output filter -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Output</h4>
          <MultiSelect
            v-model="filterState.outputs"
            :options="filterOptions.outputOptions"
            optionLabel="name"
            placeholder="Select outputs"
            class="ml-1 w-[90%]"
            filter
            showClear
          />
        </div>

        <!-- Data Storage Location filter -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Data Storage Location</h4>
          <MultiSelect
            v-model="filterState.dataStorageLocations"
            :options="filterOptions.dataStorageLocationOptions"
            optionLabel="name"
            placeholder="Select storage locations"
            class="ml-1 w-[90%]"
            filter
            showClear
          />
        </div>

        <!-- Profile Selector -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Profile</h4>
          <Dropdown
            v-model="localSelectedProject"
            :options="projectOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Profile"
            class="ml-1 w-[90%]"
            @change="handleProjectChange"
          />
        </div>
      </div>

      <Divider class="filter-divider" />

      <!-- Advanced Filter Options -->
      <div class="filter-section">
        <h3 class="text-lg font-semibold mb-3">Advanced Filters</h3>

        <!-- SETUP -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Setup</h4>
          <div class="ml-1 w-[90%]">
            <ButtonGroup
              v-model="filterState.setups"
              :options="filterOptions.setupOptions"
              optionLabel="name"
              multiple
            />
          </div>
        </div>

        <!-- USE -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Use</h4>
          <div class="ml-1 w-[90%]">
            <ButtonGroup
              v-model="filterState.uses"
              :options="filterOptions.useOptions"
              optionLabel="name"
              multiple
            />
          </div>
        </div>

        <!-- PRICING -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Pricing</h4>
          <div class="ml-1 w-[90%]">
            <ButtonGroup
              v-model="filterState.pricings"
              :options="filterOptions.pricingOptions"
              optionLabel="name"
              multiple
            />
          </div>
        </div>

        <!-- LICENSE -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">License</h4>
          <div class="ml-1 w-[90%]">
            <ButtonGroup
              v-model="filterState.licenses"
              :options="filterOptions.licenseOptions"
              optionLabel="name"
              multiple
            />
          </div>
        </div>

        <!-- GENERATION TIME -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Average Time to Generate</h4>
          <div class="ml-1 w-[90%]">
            <ButtonGroup
              v-model="filterState.generationTimes"
              :options="filterOptions.generationTimeOptions"
              optionLabel="name"
              multiple
            />
          </div>
        </div>

        <!-- SHOW OLD TOOLS TOGGLE -->
        <div class="mb-4">
          <label
            class="flex items-center text-sm text-gray-700 cursor-pointer hover:text-gray-900 ml-1"
          >
            <input
              type="checkbox"
              v-model="showOldTools"
              class="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span>Show tools older than 1 year</span>
          </label>
        </div>
      </div>

      <!-- PROJECT-SPECIFIC FILTERS (Only for AI-UPD8) -->
      <template v-if="isAIUpd8Project">
        <Divider class="filter-divider" />

        <div class="filter-section">
          <div
            class="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200"
          >
            <p class="text-sm text-purple-800 font-medium">
              AI-UPD8 Specific Filters
            </p>
          </div>

          <!-- PROFILE (AI-UPD8 Only) -->
          <div class="mb-4">
            <h4 class="font-medium mb-1">Profile</h4>
            <MultiSelect
              filter
              v-model="filterState.profiles"
              :options="filterOptions.profileOptions"
              optionLabel="name"
              placeholder="Select profiles"
              class="ml-1 w-[90%]"
              showClear
            />
          </div>

          <!-- TASKS (AI-UPD8 Only) -->
          <div class="mb-4">
            <h4 class="font-medium mb-1">Specific Task</h4>
            <MultiSelect
              filter
              v-model="filterState.tasks"
              :options="filterOptions.taskOptions"
              optionLabel="name"
              placeholder="Select tasks"
              class="ml-1 w-[90%]"
              showClear
            />
          </div>
        </div>
      </template>
    </div>

    <template #footer>
      <div class="flex flex-col w-full gap-3 mt-4">
        <Button
          label="Apply Filters"
          icon="pi pi-search"
          @click="applyFilters"
          class="w-full"
        />
        <Button
          label="Clear Filters"
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
import { useTaxonomyTypes } from "~/composables/useTaxonomyTypes";
import {
  filterState,
  filterOptions,
  loading,
  clearAllFilters,
  getFilterParams,
  reorderOptions,
  showOldTools,
  setProjectFilter,
} from "~/config/filterHandler";
import { defaultSelectionOrder } from "~/config/selectionOrder";
import { useProjectProfile } from "~/composables/useProjectProfile";
import { useRouter } from "vue-router";

const router = useRouter();

const { projects, activeProjects, activeProjectId, setActiveProject } =
  useProjectProfile();

// Check if current project is AI-UPD8 to show additional filters
const isAIUpd8Project = computed(() => activeProjectId.value === "aiupd8");

// Local state for project selection
const localSelectedProject = ref<string>(activeProjectId.value);

// Create options for dropdown with profile names
const projectOptions = computed(() => {
  const options = [
    { label: "General User", value: "general" },
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

// Initialize the taxonomy types composable
const { fetchTaxonomyByType } = useTaxonomyTypes();

// Fetch all filter options
async function fetchFilterOptions() {
  try {
    loading.value = true;
    // Only fetch options that aren't already loaded
    const promises = [];
    const results = [];

    // Check each option type and only fetch if needed
    if (filterOptions.useOptions.length === 0) {
      promises.push(fetchTaxonomyByType("use"));
      results.push("use");
    }

    if (filterOptions.setupOptions.length === 0) {
      promises.push(fetchTaxonomyByType("setup"));
      results.push("setup");
    }

    if (filterOptions.pricingOptions.length === 0) {
      promises.push(fetchTaxonomyByType("pricing"));
      results.push("pricing");
    }

    if (filterOptions.licenseOptions.length === 0) {
      promises.push(fetchTaxonomyByType("license"));
      results.push("license");
    }

    if (filterOptions.generationTimeOptions.length === 0) {
      promises.push(fetchTaxonomyByType("generationTime"));
      results.push("generationTime");
    }

    if (filterOptions.inputOptions.length === 0) {
      promises.push(fetchTaxonomyByType("input"));
      results.push("input");
    }

    if (filterOptions.outputOptions.length === 0) {
      promises.push(fetchTaxonomyByType("output"));
      results.push("output");
    }

    if (filterOptions.profileOptions.length === 0) {
      promises.push(fetchTaxonomyByType("profile"));
      results.push("profile");
    }

    if (filterOptions.taskOptions.length === 0) {
      promises.push(fetchTaxonomyByType("task"));
      results.push("task");
    }

    if (filterOptions.dataStorageLocationOptions.length === 0) {
      promises.push(fetchTaxonomyByType("dataStorageLocation"));
      results.push("dataStorageLocation");
    }

    // Fetch all needed taxonomies
    if (promises.length > 0) {
      const data = await Promise.all(promises);

      // Assign fetched data to corresponding filter options
      data.forEach((items, index) => {
        const type = results[index];

        if (type === "use") {
          filterOptions.useOptions = reorderOptions(
            items,
            defaultSelectionOrder.use
          );
        } else if (type === "setup") {
          filterOptions.setupOptions = reorderOptions(
            items,
            defaultSelectionOrder.setup
          );
        } else if (type === "pricing") {
          filterOptions.pricingOptions = reorderOptions(
            items,
            defaultSelectionOrder.pricing
          );
        } else if (type === "license") {
          filterOptions.licenseOptions = items;
        } else if (type === "generationTime") {
          filterOptions.generationTimeOptions = items;
        } else if (type === "input") {
          filterOptions.inputOptions = items;
        } else if (type === "output") {
          filterOptions.outputOptions = items;
        } else if (type === "profile") {
          filterOptions.profileOptions = items;
        } else if (type === "task") {
          filterOptions.taskOptions = items;
        } else if (type === "dataStorageLocation") {
          filterOptions.dataStorageLocationOptions = items;
        }
      });
    }
  } catch (error) {
    console.error("Error fetching filter options:", error);
  } finally {
    loading.value = false;
  }
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
