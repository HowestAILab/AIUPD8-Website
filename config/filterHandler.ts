import { reactive, ref } from 'vue';
import { TaxonomyItem } from '~/composables/useTaxonomyTypes';

// Define the filter state interface
export interface FilterState {
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

// Create a reactive filter state
export const filterState = reactive<FilterState>({
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

// Loading state for taxonomy data
export const loading = ref(false);

// Option stores for each filter type
export const filterOptions = reactive({
  useOptions: [] as TaxonomyItem[],
  setupOptions: [] as TaxonomyItem[],
  pricingOptions: [] as TaxonomyItem[],
  licenseOptions: [] as TaxonomyItem[],
  generationTimeOptions: [] as TaxonomyItem[],
  inputOptions: [] as TaxonomyItem[],
  outputOptions: [] as TaxonomyItem[],
  profileOptions: [] as TaxonomyItem[],
  taskOptions: [] as TaxonomyItem[],
  toolOptions: [] as TaxonomyItem[],
});

// Helper function to reorder taxonomy options based on provided order
export function reorderOptions(
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

// Function to clear all filters
export function clearAllFilters() {
  filterState.name = null;
  filterState.uses = [];
  filterState.setups = [];
  filterState.pricings = [];
  filterState.licenses = [];
  filterState.generationTimes = [];
  filterState.inputs = [];
  filterState.outputs = [];
  filterState.profiles = [];
  filterState.tasks = [];
}

// Function to add a filter item
export function addFilter(type: keyof FilterState, item: TaxonomyItem) {
  if (type === 'name') {
    filterState.name = item;
  } else if (Array.isArray(filterState[type])) {
    const array = filterState[type] as TaxonomyItem[];
    if (!array.some(i => i.name === item.name)) {
      array.push(item);
    }
  }
}

// Function to remove a filter item
export function removeFilter(type: keyof FilterState, item: TaxonomyItem) {
  if (type === 'name' && filterState.name?.name === item.name) {
    filterState.name = null;
  } else if (Array.isArray(filterState[type])) {
    const array = filterState[type] as TaxonomyItem[];
    const index = array.findIndex(i => i.name === item.name);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}

// Function to get filter params for API/filtering
export function getFilterParams() {
  return {
    name: filterState.name ? filterState.name.name : "",
    uses: filterState.uses.map(item => item.name),
    setups: filterState.setups.map(item => item.name),
    pricings: filterState.pricings.map(item => item.name),
    licenses: filterState.licenses.map(item => item.name),
    generationTimes: filterState.generationTimes.map(item => item.name),
    inputs: filterState.inputs.map(item => item.name),
    outputs: filterState.outputs.map(item => item.name),
    profiles: filterState.profiles.map(item => item.name),
    tasks: filterState.tasks.map(item => item.name),
  };
}

// Function to set tool options from database items
export function setToolOptions(tools: TaxonomyItem[]) {
  if (tools && Array.isArray(tools)) {
    filterOptions.toolOptions = tools;
  }
}
