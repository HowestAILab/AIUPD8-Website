/**
 * Project Filter Configuration
 * 
 * This is the SINGLE SOURCE OF TRUTH for all project-specific and general filters.
 * 
 * Configuration Structure:
 * - General filters: Shared across all projects
 * - Project-specific filters: Unique to each project (e.g., Aiupdate, PsyAid)
 * 
 * Each filter configuration includes:
 * - id: Unique identifier (matches backend field name)
 * - title: Display name shown in UI
 * - fieldName: Field name in tool documents (for querying)
 * - filterType: Sanity document type for filter options
 * - category: 'general' or 'project-specific'
 * - description: Optional description for tooltip/help text
 * - apiEndpoint: API endpoint to fetch filter options
 */

export interface FilterConfig {
  id: string;
  title: string;
  fieldName: string;
  filterType: string;
  category: 'general' | 'project-specific';
  description?: string;
  apiEndpoint: string;
}

export interface ProjectFilterConfig {
  projectId: string;
  projectName: string;
  favouriteField: string;
  workflowsField: string;
  generalFilters: FilterConfig[];
  specificFilters: FilterConfig[];
}

/**
 * General filters shared across all projects
 */
export const generalFilters: FilterConfig[] = [
  {
    id: 'uses',
    title: 'Use Type',
    fieldName: 'uses',
    filterType: 'useType',
    category: 'general',
    description: 'How you plan to use the tool',
    apiEndpoint: 'use'
  },
  {
    id: 'setups',
    title: 'Setup Type',
    fieldName: 'setups',
    filterType: 'setupType',
    category: 'general',
    description: 'Required setup and installation',
    apiEndpoint: 'setup'
  },
  {
    id: 'pricings',
    title: 'Pricing Type',
    fieldName: 'pricings',
    filterType: 'pricingType',
    category: 'general',
    description: 'Pricing and payment models',
    apiEndpoint: 'pricing'
  },
  {
    id: 'licenses',
    title: 'License Type',
    fieldName: 'licenses',
    filterType: 'licenseType',
    category: 'general',
    description: 'Software licensing models',
    apiEndpoint: 'license'
  },
  {
    id: 'inputs',
    title: 'Input Type',
    fieldName: 'inputs',
    filterType: 'inputType',
    category: 'general',
    description: 'Types of input the tool accepts',
    apiEndpoint: 'input'
  },
  {
    id: 'outputs',
    title: 'Output Type',
    fieldName: 'outputs',
    filterType: 'outputType',
    category: 'general',
    description: 'Types of output the tool produces',
    apiEndpoint: 'output'
  },
  {
    id: 'dataStorageLocations',
    title: 'Data Storage Location',
    fieldName: 'dataStorageLocations',
    filterType: 'dataStorageLocation',
    category: 'general',
    description: 'Where your data is stored',
    apiEndpoint: 'dataStorageLocation'
  }
];

/**
 * Project-specific filter configurations
 */
export const projectFilterConfigs: ProjectFilterConfig[] = [
  {
    projectId: 'general',
    projectName: 'General Database',
    favouriteField: '',
    workflowsField: '',
    generalFilters: generalFilters,
    specificFilters: [] // No specific filters for general view
  },
  {
    projectId: 'aiupd8',
    projectName: 'AI-UPD8',
    favouriteField: 'isAiupdateFavourite',
    workflowsField: 'aiupdateWorkflows',
    generalFilters: generalFilters,
    specificFilters: [
      {
        id: 'tasks',
        title: 'Task Type',
        fieldName: 'tasks',
        filterType: 'taskType',
        category: 'project-specific',
        description: 'Type of tasks this tool can perform',
        apiEndpoint: 'task'
      },
      {
        id: 'profiles',
        title: 'Profile Type',
        fieldName: 'profiles',
        filterType: 'profileType',
        category: 'project-specific',
        description: 'User profiles this tool is designed for',
        apiEndpoint: 'profile'
      },
      {
        id: 'generationTimes',
        title: 'Generation Time',
        fieldName: 'generationTimes',
        filterType: 'generationTime',
        category: 'project-specific',
        description: 'How quickly the tool generates results',
        apiEndpoint: 'generationTime'
      }
    ]
  },
  {
    projectId: 'psyaid',
    projectName: 'PsyAid',
    favouriteField: 'isPsyaidFavourite',
    workflowsField: 'psyaidWorkflows',
    generalFilters: generalFilters,
    // NOTE: Data-opslaglocatie (dataStorageLocations) is already in generalFilters above.
    specificFilters: [
      {
        id: 'dataDeletionCapabilities',
        title: 'Data-verwijdering',
        fieldName: 'dataDeletionCapabilities',
        filterType: 'dataDeletionCapability',
        category: 'project-specific',
        description: 'Kan de gebruiker zijn/haar eigen gegevens volledig verwijderen uit het systeem?',
        apiEndpoint: 'dataDeletionCapability'
      },
      {
        id: 'suitabilityRobustnesses',
        title: 'Geschiktheid / Robuustheid',
        fieldName: 'suitabilityRobustnesses',
        filterType: 'suitabilityRobustness',
        category: 'project-specific',
        description: 'Mate waarin de tool geschikt is om informatie en psycho-educatie op maat aan te passen of te creëren',
        apiEndpoint: 'suitabilityRobustness'
      },
      {
        id: 'onboardingEases',
        title: 'Onboarding',
        fieldName: 'onboardingEases',
        filterType: 'onboardingEase',
        category: 'project-specific',
        description: 'Hoe eenvoudig is het om een account aan te maken en in te loggen? Onboarding verwijst naar het proces waarmee een nieuwe gebruiker snel en vlot aan de slag kan met de tool.',
        apiEndpoint: 'onboardingEase'
      },
      {
        id: 'offlineFunctionalities',
        title: 'Offline functionaliteit',
        fieldName: 'offlineFunctionalities',
        filterType: 'offlineFunctionality',
        category: 'project-specific',
        description: 'In welke mate is de tool bruikbaar zonder actieve internetverbinding?',
        apiEndpoint: 'offlineFunctionality'
      }
    ]
  }
];

/**
 * Get project filter configuration by project ID
 */
export const getProjectFilters = (projectId: string): ProjectFilterConfig | undefined => {
  return projectFilterConfigs.find(p => p.projectId === projectId);
};

/**
 * Get all filters for a project (general + specific)
 */
export const getAllFiltersForProject = (projectId: string): FilterConfig[] => {
  const config = getProjectFilters(projectId);
  if (!config) return generalFilters;
  
  return [...config.generalFilters, ...config.specificFilters];
};

/**
 * Get only specific filters for a project
 */
export const getSpecificFiltersForProject = (projectId: string): FilterConfig[] => {
  const config = getProjectFilters(projectId);
  return config?.specificFilters || [];
};

/**
 * Get general filters
 */
export const getGeneralFilters = (): FilterConfig[] => {
  return generalFilters;
};

/**
 * Check if a filter is available for a project
 */
export const isFilterAvailableForProject = (filterId: string, projectId: string): boolean => {
  const allFilters = getAllFiltersForProject(projectId);
  return allFilters.some(f => f.id === filterId);
};

/**
 * Get filter config by ID
 */
export const getFilterConfig = (filterId: string): FilterConfig | undefined => {
  // Search in general filters first
  const generalFilter = generalFilters.find(f => f.id === filterId);
  if (generalFilter) return generalFilter;
  
  // Search in all project-specific filters
  for (const projectConfig of projectFilterConfigs) {
    const specificFilter = projectConfig.specificFilters.find(f => f.id === filterId);
    if (specificFilter) return specificFilter;
  }
  
  return undefined;
};
