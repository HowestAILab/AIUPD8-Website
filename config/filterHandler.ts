import { reactive, ref } from 'vue';
import { getAllFiltersForProject, getProjectFilters, type FilterConfig } from './projectFilters';
import { getFilterLabel, getFilterOptions, shouldUseButtonGroup } from './filterLabels';

// Filter option interface - simplified for string-based filters
export interface FilterOption {
  value: string;
  label: string;
}

// Dynamic filter state that adapts to current project
export interface DynamicFilterState {
  name: string | null;
  [key: string]: string | string[] | null;
}

// Base filter state for general filters (v3.0 - all string arrays)
export interface FilterState {
  name: string | null;
  uses: string[];
  setups: string[];
  pricings: string[];
  licenses: string[];
  generationTimes: string[];
  inputs: string[];
  outputs: string[];
  profiles: string[];
  tasks: string[];
  dataStorageLocations: string[];
  // PSY-AID specific filters
  dataDeletionCapabilities: string[];
  suitabilityRobustnesses: string[];
  onboardingEases: string[];
  offlineFunctionalities: string[];
}

// Create a reactive filter state with all possible filters (v3.0 - string arrays)
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
  dataStorageLocations: [],
  // PSY-AID specific filters
  dataDeletionCapabilities: [],
  suitabilityRobustnesses: [],
  onboardingEases: [],
  offlineFunctionalities: [],
});

// Loading state for taxonomy data
export const loading = ref(false);

// Show old tools toggle (tools older than 1 year)
export const showOldTools = ref(false);

// Option stores for each filter type - now using FilterOption[] with labels
export const filterOptions = reactive({
  useOptions: [] as FilterOption[],
  setupOptions: [] as FilterOption[],
  pricingOptions: [] as FilterOption[],
  licenseOptions: [] as FilterOption[],
  generationTimeOptions: [] as FilterOption[],
  inputOptions: [] as FilterOption[],
  outputOptions: [] as FilterOption[],
  profileOptions: [] as FilterOption[],
  taskOptions: [] as FilterOption[],
  dataStorageLocationOptions: [] as FilterOption[],
  toolOptions: [] as { name: string }[],
  // PSY-AID specific filter options
  dataDeletionCapabilityOptions: [] as FilterOption[],
  suitabilityRobustnessOptions: [] as FilterOption[],
  onboardingEaseOptions: [] as FilterOption[],
  offlineFunctionalityOptions: [] as FilterOption[],
});

// Helper function to reorder filter options based on provided order
export function reorderOptions(
  options: FilterOption[],
  order: string[]
): FilterOption[] {
  return options.sort((a, b) => {
    const idxA = order.indexOf(a.value.toLowerCase());
    const idxB = order.indexOf(b.value.toLowerCase());
    if (idxA === -1 && idxB === -1) return b.label.localeCompare(a.label); // fallback: reversed alphabetical
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
  filterState.dataStorageLocations = [];
  // PSY-AID filters
  filterState.dataDeletionCapabilities = [];
  filterState.suitabilityRobustnesses = [];
  filterState.onboardingEases = [];
  filterState.offlineFunctionalities = [];
}

// Function to add a filter item (v3.0 - now working with strings)
export function addFilter(type: keyof FilterState, value: string) {
  if (type === 'name') {
    filterState.name = value;
  } else if (Array.isArray(filterState[type])) {
    const array = filterState[type] as string[];
    if (!array.includes(value)) {
      array.push(value);
    }
  }
}

// Function to remove a filter item (v3.0 - now working with strings)
export function removeFilter(type: keyof FilterState, value: string) {
  if (type === 'name' && filterState.name === value) {
    filterState.name = null;
  } else if (Array.isArray(filterState[type])) {
    const array = filterState[type] as string[];
    const index = array.indexOf(value);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}

// Function to get filter params for API/filtering (v3.0 - now returns string values directly)
export function getFilterParams() {
  return {
    name: filterState.name || "",
    uses: filterState.uses,
    setups: filterState.setups,
    pricings: filterState.pricings,
    licenses: filterState.licenses,
    generationTimes: filterState.generationTimes,
    inputs: filterState.inputs,
    outputs: filterState.outputs,
    profiles: filterState.profiles,
    tasks: filterState.tasks,
    dataStorageLocations: filterState.dataStorageLocations,
    // PSY-AID filters
    dataDeletionCapabilities: filterState.dataDeletionCapabilities,
    suitabilityRobustnesses: filterState.suitabilityRobustnesses,
    onboardingEases: filterState.onboardingEases,
    offlineFunctionalities: filterState.offlineFunctionalities,
  };
}

// Function to set tool options from database items
export function setToolOptions(tools: Array<{ name: string }>) {
  if (tools && Array.isArray(tools)) {
    filterOptions.toolOptions = tools;
  }
}

// ============================================================================
// PROJECT-SPECIFIC FILTER SUPPORT
// ============================================================================

// Current active project for filtering context
export const activeProjectFilter = ref<string>('general');

// Custom filter values for project-specific filters
export const customFilterState = reactive<Record<string, any>>({});

/**
 * Set the active project for filtering context
 */
export function setProjectFilter(projectId: string) {
  activeProjectFilter.value = projectId;
  // Clear custom filters when switching projects
  Object.keys(customFilterState).forEach(key => {
    delete customFilterState[key];
  });
}

/**
 * Set a custom filter value
 */
export function setCustomFilter(filterId: string, value: any) {
  customFilterState[filterId] = value;
}

/**
 * Get a custom filter value
 */
export function getCustomFilter(filterId: string): any {
  return customFilterState[filterId];
}

/**
 * Clear all custom filters
 */
export function clearCustomFilters() {
  Object.keys(customFilterState).forEach(key => {
    delete customFilterState[key];
  });
}

/**
 * Get all filter params including project and custom filters
 */
export function getFullFilterParams() {
  return {
    ...getFilterParams(),
    project: activeProjectFilter.value,
    customFilters: { ...customFilterState },
  };
}

/**
 * Check if a general filter should be visible based on current project context
 * This is used by filter UI components to hide/show filters
 */
export function shouldShowFilter(filterId: string, hiddenFilters: string[]): boolean {
  return !hiddenFilters.includes(filterId);
}

/**
 * Get the filter options key for a given filter config
 * Maps filter IDs to their corresponding option store keys
 */
export function getFilterOptionsKey(filterId: string): string {
  const mapping: Record<string, string> = {
    'uses': 'useOptions',
    'setups': 'setupOptions',
    'pricings': 'pricingOptions',
    'licenses': 'licenseOptions',
    'inputs': 'inputOptions',
    'outputs': 'outputOptions',
    'dataStorageLocations': 'dataStorageLocationOptions',
    'generationTimes': 'generationTimeOptions',
    'tasks': 'taskOptions',
    'profiles': 'profileOptions',
    'dataDeletionCapabilities': 'dataDeletionCapabilityOptions',
    'suitabilityRobustnesses': 'suitabilityRobustnessOptions',
    'onboardingEases': 'onboardingEaseOptions',
    'offlineFunctionalities': 'offlineFunctionalityOptions',
  };
  
  return mapping[filterId] || `${filterId}Options`;
}

/**
 * Get active filters for current project
 * Only returns filters that have values and are relevant to the project
 */
export function getActiveFiltersForProject(projectId: string): Record<string, string[]> {
  const projectFilters = getAllFiltersForProject(projectId);
  const activeFilters: Record<string, string[]> = {};
  
  projectFilters.forEach(filter => {
    const stateKey = filter.fieldName;
    const value = filterState[stateKey as keyof FilterState];
    
    if (Array.isArray(value) && value.length > 0) {
      activeFilters[stateKey] = value;
    }
  });
  
  return activeFilters;
}

/**
 * Initialize filter options for all filter types (v3.0)
 * This creates FilterOption objects with labels from the filterLabels configuration
 */
export function initializeFilterOptions() {
  // General filters
  filterOptions.useOptions = getFilterOptions('uses');
  filterOptions.setupOptions = getFilterOptions('setups');
  filterOptions.pricingOptions = getFilterOptions('pricings');
  filterOptions.licenseOptions = getFilterOptions('licenses');
  filterOptions.inputOptions = getFilterOptions('inputs');
  filterOptions.outputOptions = getFilterOptions('outputs');
  filterOptions.dataStorageLocationOptions = getFilterOptions('dataStorageLocations');
  
  // Aiupdate filters
  filterOptions.generationTimeOptions = getFilterOptions('generationTimes');
  filterOptions.taskOptions = getFilterOptions('tasks');
  filterOptions.profileOptions = getFilterOptions('profiles');
  
  // PSY-AID filters
  filterOptions.dataDeletionCapabilityOptions = getFilterOptions('dataDeletionCapabilities');
  filterOptions.suitabilityRobustnessOptions = getFilterOptions('suitabilityRobustnesses');
  filterOptions.onboardingEaseOptions = getFilterOptions('onboardingEases');
  filterOptions.offlineFunctionalityOptions = getFilterOptions('offlineFunctionalities');
}
