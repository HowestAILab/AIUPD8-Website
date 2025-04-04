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
            v-model="filters.name"
            :options="toolOptions"
            optionLabel="name"
            placeholder="Select tool"
            class="w-full"
            filter
            showClear
          />
        </div>

        <!-- Input filter -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Input</h4>
          <MultiSelect
            v-model="filters.inputs"
            :options="inputOptions"
            optionLabel="name"
            placeholder="Select inputs"
            class="w-full"
            filter
            showClear
          />
        </div>

        <!-- Output filter -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Output</h4>
          <MultiSelect
            v-model="filters.outputs"
            :options="outputOptions"
            optionLabel="name"
            placeholder="Select outputs"
            class="w-full"
            filter
            showClear
          />
        </div>

        <!-- Profile filter -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Profile</h4>
          <MultiSelect
            v-model="filters.profiles"
            :options="profileOptions"
            optionLabel="name"
            placeholder="Select profiles"
            class="w-full"
            filter
            showClear
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
          <div class="w-full">
            <ButtonGroup
              v-model="filters.setups"
              :options="setupOptions"
              optionLabel="name"
              multiple
            />
          </div>
        </div>

        <!-- USE -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Use</h4>
          <div class="w-full">
            <ButtonGroup
              v-model="filters.uses"
              :options="useOptions"
              optionLabel="name"
              multiple
            />
          </div>
        </div>

        <!-- PRICING -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Pricing</h4>
          <div class="w-full">
            <ButtonGroup
              v-model="filters.pricings"
              :options="pricingOptions"
              optionLabel="name"
              multiple
            />
          </div>
        </div>

        <!-- LICENSE -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">License</h4>
          <div class="w-full">
            <ButtonGroup
              v-model="filters.licenses"
              :options="licenseOptions"
              optionLabel="name"
              multiple
            />
          </div>
        </div>

        <!-- GENERATION TIME -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Average Time to Generate</h4>
          <div class="w-full">
            <ButtonGroup
              v-model="filters.generationTimes"
              :options="generationTimeOptions"
              optionLabel="name"
              multiple
            />
          </div>
        </div>

        <!-- TASKS -->
        <div class="mb-4">
          <h4 class="font-medium mb-1">Specific Task</h4>
          <MultiSelect
            filter
            v-model="filters.tasks"
            :options="taskOptions"
            optionLabel="name"
            placeholder="Select tasks"
            class="w-full"
            showClear
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex flex-col w-full gap-3">
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
import { reactive, ref, onMounted, watch, computed } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import Divider from "primevue/divider";
import ButtonGroup from "~/components/ui/ButtonGroup.vue";
import { useTaxonomyTypes, TaxonomyItem } from "~/composables/useTaxonomyTypes";
import { defaultSelectionOrder } from "~/config/selectionOrder";

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

// Function to update visibility and emit the update event
function updateVisibility(value) {
  emit("update:modelValue", value);
}

// Interface for filter state
interface FilterState {
  name: TaxonomyItem | null;
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

const filters = reactive<FilterState>({
  name: null,
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

// Helper function to reorder taxonomy options
function reorderOptions(
  options: TaxonomyItem[],
  order: string[]
): TaxonomyItem[] {
  return options.sort((a, b) => {
    const idxA = order.indexOf(a.name.toLowerCase());
    const idxB = order.indexOf(b.name.toLowerCase());
    if (idxA === -1 && idxB === -1) return a.name.localeCompare(b.name);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });
}

// Fetch all filter options
async function fetchFilterOptions() {
  try {
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

    useOptions.value = reorderOptions(uses, defaultSelectionOrder.use);
    setupOptions.value = reorderOptions(setups, defaultSelectionOrder.setup);
    pricingOptions.value = reorderOptions(
      pricings,
      defaultSelectionOrder.pricing
    );
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

// Function to close the dialog
function close() {
  emit("update:modelValue", false);
}

function applyFilters() {
  const filterParams = {
    name: filters.name ? filters.name.name : "",
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

  emit("apply-filters", filterParams);
  close();
}

function clearFilters() {
  filters.name = null;
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
