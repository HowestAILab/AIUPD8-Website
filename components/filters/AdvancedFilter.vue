<template>
  <div class="w-full h-full flex flex-col">
    <!-- Fixed header with title and close button -->
    <div
      class="flex-shrink-0 bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200 shadow-sm"
    >
      <h2 class="text-2xl font-bold">Advanced Filters</h2>

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
      <!-- BASE FILTERS (Always visible for all projects) -->

      <!-- SETUP -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Setup</h3>
        <div class="flex w-full overflow-x-auto">
          <ButtonGroup
            v-model="filterState.setups"
            :options="filterOptions.setupOptions"
            optionLabel="name"
            multiple
            @update:modelValue="emitInstantFilters"
          />
        </div>
      </div>

      <!-- USE -->
      <div class="mt-8 mb-6">
        <h3 class="text-lg font-bold mb-2">Use</h3>
        <div class="flex w-full overflow-x-auto">
          <ButtonGroup
            v-model="filterState.uses"
            :options="filterOptions.useOptions"
            optionLabel="name"
            multiple
            @update:modelValue="emitInstantFilters"
          />
        </div>
      </div>

      <!-- PRICING -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Pricing</h3>
        <div class="flex w-full overflow-x-auto">
          <ButtonGroup
            v-model="filterState.pricings"
            :options="filterOptions.pricingOptions"
            optionLabel="name"
            multiple
            @update:modelValue="emitInstantFilters"
          />
        </div>
      </div>

      <!-- LICENSE -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">License</h3>
        <div class="flex w-full overflow-x-auto">
          <ButtonGroup
            v-model="filterState.licenses"
            :options="filterOptions.licenseOptions"
            optionLabel="name"
            multiple
            @update:modelValue="emitInstantFilters"
          />
        </div>
      </div>

      <Divider class="mb-6" />

      <!-- INPUT TYPE -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Input type</h3>
        <MultiSelect
          filter
          v-model="filterState.inputs"
          :options="filterOptions.inputOptions"
          optionLabel="name"
          placeholder="Select input types"
          :loading="loading"
          class="w-full"
          @change="emitInstantFilters"
        />
      </div>

      <!-- OUTPUT TYPE -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Output</h3>
        <MultiSelect
          filter
          v-model="filterState.outputs"
          :options="filterOptions.outputOptions"
          optionLabel="name"
          placeholder="Select output types"
          :loading="loading"
          class="w-full"
          @change="emitInstantFilters"
        />
      </div>

      <!-- DATA STORAGE LOCATION -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Data Storage Location</h3>
        <MultiSelect
          filter
          v-model="filterState.dataStorageLocations"
          :options="filterOptions.dataStorageLocationOptions"
          optionLabel="name"
          placeholder="Select storage locations"
          :loading="loading"
          class="w-full"
          @change="emitInstantFilters"
        />
      </div>

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
          <span>Show tools older than 1 year</span>
        </label>
      </div>

      <!-- PROJECT-SPECIFIC FILTERS (Only for AI-UPD8) -->
      <template v-if="isAIUpd8Project">
        <Divider class="mb-6" />

        <div class="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p class="text-sm text-purple-800 font-medium">
            AI-UPD8 Specific Filters
          </p>
        </div>

        <!-- PROFILE (AI-UPD8 Only) -->
        <div class="mb-6">
          <h3 class="text-lg font-bold mb-2">Profile</h3>
          <MultiSelect
            filter
            v-model="filterState.profiles"
            :options="filterOptions.profileOptions"
            optionLabel="name"
            placeholder="Select profiles"
            :loading="loading"
            class="w-full"
            @change="emitInstantFilters"
          />
        </div>

        <!-- SPECIFIC TASK (AI-UPD8 Only) -->
        <div class="mb-6">
          <h3 class="text-lg font-bold mb-2">Specific task</h3>
          <MultiSelect
            filter
            v-model="filterState.tasks"
            :options="filterOptions.taskOptions"
            optionLabel="name"
            placeholder="Select tasks"
            :loading="loading"
            class="w-full"
            showClear
            @change="emitInstantFilters"
          />
        </div>

        <!-- AVERAGE TIME TO GENERATE (AI-UPD8 Only) -->
        <div class="mb-6">
          <h3 class="text-lg font-bold mb-2">Average time to generate</h3>
          <div class="flex w-full overflow-x-auto">
            <ButtonGroup
              v-model="filterState.generationTimes"
              :options="filterOptions.generationTimeOptions"
              optionLabel="name"
              multiple
              @update:modelValue="emitInstantFilters"
            />
          </div>
        </div>
      </template>

      <!-- APPLY FILTERS BUTTON -->
      <!-- Removed Apply Filters button for web -->
      <div class="w-full mb-2 sm:mb-0 flex flex-col gap-2">
        <Button
          label="Clear Filters"
          icon="pi pi-trash"
          class="p-button-outlined p-button-danger w-full pd-2"
          @click="clearFilters"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, onBeforeUnmount } from "vue";
import MultiSelect from "primevue/multiselect";
import ButtonGroup from "~/components/ui/ButtonGroup.vue";
import { useTaxonomyTypes } from "~/composables/useTaxonomyTypes";
import { defaultSelectionOrder } from "~/config/selectionOrder";
import {
  filterState,
  filterOptions,
  clearAllFilters,
  loading,
  reorderOptions,
  getFilterParams,
  showOldTools,
} from "~/config/filterHandler";
import { useProjectProfile } from "~/composables/useProjectProfile";

const { activeProjectId } = useProjectProfile();

// Check if current project is AI-UPD8 to show additional filters
const isAIUpd8Project = computed(() => activeProjectId.value === "aiupd8");

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["apply-filters", "update:isVisible"]);

// Initialize the taxonomy types composable
const { fetchTaxonomyByType } = useTaxonomyTypes();

// Fetch all filter options using the dynamic route
async function fetchFilterOptions() {
  try {
    loading.value = true;
    // Fetch all taxonomy types in parallel for better performance
    const [
      uses,
      setups,
      pricings,
      licenses,
      generationTimes,
      inputs,
      outputs,
      profiles,
      tasks,
      dataStorageLocations,
    ] = await Promise.all([
      fetchTaxonomyByType("use"),
      fetchTaxonomyByType("setup"),
      fetchTaxonomyByType("pricing"),
      fetchTaxonomyByType("license"),
      fetchTaxonomyByType("generationTime"),
      fetchTaxonomyByType("input"),
      fetchTaxonomyByType("output"),
      fetchTaxonomyByType("profile"),
      fetchTaxonomyByType("task"),
      fetchTaxonomyByType("dataStorageLocation"),
    ]);

    // Reorder options for use, setup and pricing using defaultSelectionOrder
    filterOptions.useOptions = reorderOptions(uses, defaultSelectionOrder.use);
    filterOptions.setupOptions = reorderOptions(
      setups,
      defaultSelectionOrder.setup
    );
    filterOptions.pricingOptions = reorderOptions(
      pricings,
      defaultSelectionOrder.pricing
    );

    // Other options remain unchanged
    filterOptions.licenseOptions = licenses;
    filterOptions.generationTimeOptions = generationTimes;
    filterOptions.inputOptions = inputs;
    filterOptions.outputOptions = outputs;
    filterOptions.profileOptions = profiles;
    filterOptions.taskOptions = tasks;
    filterOptions.dataStorageLocationOptions = dataStorageLocations;
  } catch (error) {
    console.error("Error fetching filter options:", error);
  } finally {
    loading.value = false;
  }
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
  fetchFilterOptions();
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>
