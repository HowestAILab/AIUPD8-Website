<template>
  <ScrollAreaRoot
    class="w-full h-full relative overflow-hidden"
    style="--scrollbar-size: 8px"
  >
    <ScrollAreaViewport class="w-full h-full px-4 py-6">
      <h2 class="text-2xl font-bold mb-4">Advanced Filters</h2>

      <Divider />
      <!-- SETUP -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Setup</h3>
        <div class="flex w-full overflow-x-auto">
          <ButtonGroup
            v-model="filters.setups"
            :options="setupOptions"
            optionLabel="name"
            multiple
          />
        </div>
      </div>

      <!-- USE -->
      <div class="mt-8 mb-6">
        <h3 class="text-lg font-bold mb-2">Use</h3>
        <div class="flex w-full overflow-x-auto">
          <ButtonGroup
            v-model="filters.uses"
            :options="useOptions"
            optionLabel="name"
            multiple
          />
        </div>
      </div>

      <!-- PRICING -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Pricing</h3>
        <div class="flex w-full overflow-x-auto">
          <ButtonGroup
            v-model="filters.pricings"
            :options="pricingOptions"
            optionLabel="name"
            multiple
          />
        </div>
      </div>

      <!-- LICENSE -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">License</h3>
        <div class="flex w-full overflow-x-auto">
          <ButtonGroup
            v-model="filters.licenses"
            :options="licenseOptions"
            optionLabel="name"
            multiple
          />
        </div>
      </div>

      <!-- AVERAGE TIME TO GENERATE -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Average time to generate</h3>
        <div class="flex w-full overflow-x-auto">
          <ButtonGroup
            v-model="filters.generationTimes"
            :options="generationTimeOptions"
            optionLabel="name"
            multiple
          />
        </div>
      </div>

      <Divider class="mb-6" />

      <!-- INPUT TYPE - Changed to MultiSelect dropdown -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Input type</h3>
        <MultiSelect
          filter
          v-model="filters.inputs"
          :options="inputOptions"
          optionLabel="name"
          placeholder="Select input types"
          :loading="loading"
          class="w-full"
        />
      </div>

      <!-- OUTPUT TYPE - Changed to MultiSelect dropdown -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Output</h3>
        <MultiSelect
          filter
          v-model="filters.outputs"
          :options="outputOptions"
          optionLabel="name"
          placeholder="Select output types"
          :loading="loading"
          class="w-full"
        />
      </div>

      <!-- PROFILE - Changed to MultiSelect dropdown -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Profile</h3>
        <MultiSelect
          filter
          v-model="filters.profiles"
          :options="profileOptions"
          optionLabel="name"
          placeholder="Select profiles"
          :loading="loading"
          class="w-full"
        />
      </div>

      <!-- TASK - Changed to MultiSelect dropdown -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Specific task</h3>
        <MultiSelect
          filter
          v-model="filters.tasks"
          :options="taskOptions"
          optionLabel="name"
          placeholder="Select tasks"
          :loading="loading"
          class="w-full"
        />
      </div>

      <!-- APPLY FILTERS BUTTON -->
      <RecurringButton variant="neutral" class="mt-4" @click="applyFilters">
        Apply Filters
      </RecurringButton>
      <!-- CLEAR FILTERS BUTTON -->
      <RecurringButton
        variant="neutral"
        class="mt-4 max-w-[50%] mx-auto"
        @click="clearFilters"
      >
        Clear Filters
      </RecurringButton>
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
import { reactive, ref, onMounted } from "vue";
import MultiSelect from "primevue/multiselect";
import RecurringButton from "~/components/ui/RecurringButton.vue";
import ButtonGroup from "~/components/ui/ButtonGroup.vue";
import { useTaxonomyTypes, TaxonomyItem } from "~/composables/useTaxonomyTypes";
import { defaultSelectionOrder } from "~/config/selectionOrder";

interface FilterState {
  uses: TaxonomyItem[];
  setups: TaxonomyItem[];
  pricings: TaxonomyItem[];
  licenses: TaxonomyItem[];
  generationTimes: TaxonomyItem[];
  inputs: TaxonomyItem[];
  outputs: TaxonomyItem[];
  profiles: TaxonomyItem[];
  tasks: TaxonomyItem[];
}

// Refs for filter options
const useOptions = ref<TaxonomyItem[]>([]);
const setupOptions = ref<TaxonomyItem[]>([]);
const pricingOptions = ref<TaxonomyItem[]>([]);
const licenseOptions = ref<TaxonomyItem[]>([]);
const generationTimeOptions = ref<TaxonomyItem[]>([]);
const inputOptions = ref<TaxonomyItem[]>([]);
const outputOptions = ref<TaxonomyItem[]>([]);
const profileOptions = ref<TaxonomyItem[]>([]);
const taskOptions = ref<TaxonomyItem[]>([]);

// Initialize the taxonomy types composable
const { loading, error, fetchTaxonomyByType } = useTaxonomyTypes();

// Filter state
const filters = reactive<FilterState>({
  uses: [],
  setups: [],
  pricings: [],
  licenses: [],
  generationTimes: [],
  inputs: [],
  outputs: [],
  profiles: [],
  tasks: [],
});

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["apply-filters", "update:isVisible"]);

// Helper function to reorder taxonomy options based on provided order
function reorderOptions(
  options: TaxonomyItem[],
  order: string[]
): TaxonomyItem[] {
  return options.sort((a, b) => {
    const idxA = order.indexOf(a.name.toLowerCase());
    const idxB = order.indexOf(b.name.toLowerCase());
    if (idxA === -1 && idxB === -1) return b.name.localeCompare(a.name); // fallback: reversed alphabetical
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });
}

// Fetch all filter options using the dynamic route
async function fetchFilterOptions() {
  try {
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
    useOptions.value = reorderOptions(uses, defaultSelectionOrder.use);
    setupOptions.value = reorderOptions(setups, defaultSelectionOrder.setup);
    pricingOptions.value = reorderOptions(
      pricings,
      defaultSelectionOrder.pricing
    );

    // Other options remain unchanged
    licenseOptions.value = licenses;
    generationTimeOptions.value = generationTimes;
    inputOptions.value = inputs;
    outputOptions.value = outputs;
    profileOptions.value = profiles;
    taskOptions.value = tasks;
  } catch (error) {
    console.error("Error fetching filter options:", error);
  }
}

function applyFilters() {
  // Convert selected objects to name arrays for filtering
  const filterParams = {
    uses: filters.uses.map((item) => item.name),
    setups: filters.setups.map((item) => item.name),
    pricings: filters.pricings.map((item) => item.name),
    licenses: filters.licenses.map((item) => item.name),
    generationTimes: filters.generationTimes.map((item) => item.name),
    inputs: filters.inputs.map((item) => item.name),
    outputs: filters.outputs.map((item) => item.name),
    profiles: filters.profiles.map((item) => item.name),
    tasks: filters.tasks.map((item) => item.name),
  };

  // Emit the event with filter parameters
  emits("apply-filters", filterParams);
}

function clearFilters() {
  filters.uses = [];
  filters.setups = [];
  filters.pricings = [];
  filters.licenses = [];
  filters.generationTimes = [];
  filters.inputs = [];
  filters.outputs = [];
  filters.profiles = [];
  filters.tasks = [];
}

onMounted(() => {
  fetchFilterOptions();
});
</script>
