<template>
  <ScrollAreaRoot
    class="w-full h-full relative overflow-hidden"
    style="--scrollbar-size: 4px"
  >
    <ScrollAreaViewport class="w-full h-full px-4 py-6">
      <h2 class="text-2xl font-bold mb-4">Advanced Filters</h2>

      <Divider />
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

      <!-- AVERAGE TIME TO GENERATE -->
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

      <!-- PROFILE -->
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

      <!-- TASK - Changed to MultiSelect dropdown -->
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
    </ScrollAreaViewport>

    <!-- Optional Reka scrollbars -->
    <ScrollAreaScrollbar
      orientation="vertical"
      class="bg-blackA2 hover:bg-blackA3"
    >
      <ScrollAreaThumb class="bg-mauve10 rounded" />
    </ScrollAreaScrollbar>
  </ScrollAreaRoot>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
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
} from "~/config/filterHandler";

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

onMounted(() => {
  fetchFilterOptions();
});
</script>
