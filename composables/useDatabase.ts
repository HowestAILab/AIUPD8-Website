import { ref } from 'vue';
import axios from 'axios';
import { useRuntimeConfig } from '#app';
import type { ToolI18n } from '~/composables/i18n/useToolI18n';

// ============================================
// PROJECT-SPECIFIC WORKFLOW TYPES
// ============================================

// Aiupdate Workflow Step
export interface AiupdateWorkflowStep {
  _key: string;
  stepNumber: number; // Required, min 1
  title: string; // Required
  shortDescription?: string; // Optional
  image?: any; // Optional - image URL or Sanity asset
  imageAlt?: string; // Optional
}

// Aiupdate Workflow (project-specific)
export interface AiupdateWorkflow {
  _key: string;
  name: string; // Required - workflow name
  steps?: AiupdateWorkflowStep[];
}

// Generic project-specific data wrapper for extensibility
export interface ProjectSpecificData {
  [projectId: string]: any; // Allow any project-specific data structure
}

// Keep the interfaces similar to maintain compatibility
export interface ToolItem {
  id: string;
  title: string;
  toolsentence: string;
  about: string; // CHANGED: was description (BlockContent), now plain text
  advantages: string[]; // NEW: required, min 3 items
  disadvantages: string[]; // NEW: required, min 2 items
  limitations: string[]; // Technical limitations
  /** Raw i18n arrays from Sanity – use useToolI18n() to resolve per locale. */
  i18n?: ToolI18n | null;
  // NEW: Project-specific favorites instead of single isFavourite
  // Map of projectId -> boolean indicating if favorite for that project
  favorites?: Record<string, boolean>;
  isFavourite?: boolean; // DEPRECATED: kept for backward compatibility
  isExperimental: boolean;
  uses: string[];
  setups: string[];
  pricings: string[];
  licenses: string[];
  generationTimes: string[];
  inputs: string[];
  outputs: string[];
  tasks: string[];
  profiles: string[];
  dataStorageLocations: string[]; // NEW: required filter
  // PSY-AID project-specific filters
  dataDeletionCapabilities: string[]; // Data-verwijdering
  suitabilityRobustnesses: string[]; // Geschiktheid / Robuustheid
  onboardingEases: string[]; // Onboarding
  offlineFunctionalities: string[]; // Offline functionaliteit
  Image: any;
  showcaseImages: any[];
  link: string;
  youtubeLink: string;
  privacyPolicy: string; // CHANGED: now required
  aiupdateWorkflows?: AiupdateWorkflow[]; // NEW: project-specific workflows for Aiupdate
  psyaidWorkflows?: any[]; // NEW: project-specific workflows for PSYaid (follow same pattern)
  dateAdded?: string;
  lastChanged?: string;
  // For backward compatibility
  use?: string;
  setup?: string;
  pricing?: string;
  license?: string;
  averageTimeToGenerate?: string;
  description?: string; // Optional plain-text description shown above pros and cons (resolved i18n string from Sanity)
  dataStorageLocation?: string; // DEPRECATED: use dataStorageLocations array
}

// Updated helper to extract filter strings (v3.0 - now direct strings, not references)
// Backend API now returns filter fields as string arrays directly (e.g., ["no-code", "low-code"])
// This function ensures we always return a clean string array, filtering out any null values
const extractRelationNames = (relation: any): string[] => {
  if (!relation) return [];
  
  // If it's already an array, clean it up
  if (Array.isArray(relation)) {
    return relation
      .filter((item: any) => item !== null && item !== undefined)
      .map((item: any) => {
        // Handle strings directly (v3.0 format)
        if (typeof item === 'string') {
          return item;
        }
        // Fallback for any old Strapi format that might still exist
        if (typeof item === 'object' && item !== null) {
          if (item.attributes && (item.attributes.name || item.attributes.title)) {
            return item.attributes.name || item.attributes.title;
          }
          return item.name || item.title || '';
        }
        return '';
      })
      .filter((val: string) => val && val.trim() !== '');
  }
  
  // Single string value
  if (typeof relation === 'string') {
    return relation.trim() ? [relation] : [];
  }
  
  return [];
};

/**
 * Check if a tool has project-specific data filled in
 * A tool belongs to a project if:
 * 1. It has workflows for that project, OR
 * 2. It's marked as a favorite for that project
 * @param tool - The tool item to check
 * @param projectId - The project ID to check for
 * @returns true if the tool has project-specific data for this project
 */
export const hasProjectSpecificData = (tool: ToolItem, projectId: string): boolean => {
  // General project shows all tools
  if (projectId === 'general') return true;
  
  // Check if this tool is marked as favorite for this project
  const isFavorite = tool.favorites && tool.favorites[projectId];
  
  // aiupd8 project - check for workflows OR favorite
  if (projectId === 'aiupd8') {
    const hasWorkflows = !!(tool.aiupdateWorkflows && tool.aiupdateWorkflows.length > 0);
    return isFavorite || hasWorkflows;
  }
  
  // psyaid project - check for workflows OR favorite
  if (projectId === 'psyaid') {
    const hasWorkflows = !!(tool.psyaidWorkflows && tool.psyaidWorkflows.length > 0);
    return isFavorite || hasWorkflows;
  }
  
  // For other projects, implement similar pattern
  // Check for {projectId}Workflows in the tool OR favorite status
  const workflowFieldName = `${projectId}Workflows`;
  const workflows = (tool as any)[workflowFieldName];
  const hasWorkflows = !!(workflows && Array.isArray(workflows) && workflows.length > 0);
  return isFavorite || hasWorkflows;
};

// Reworked mapping function for better compatibility
export const mapDatabaseItemToToolItem = (item: any): ToolItem => {
  const attrs = item.attributes || item;
  console.log(attrs)
  
  // Build project-specific favorites map from schema fields
  // Automatically maps is{Project}Favourite fields to project IDs
  const favorites: Record<string, boolean> = {};
  if (attrs.isAiupdateFavourite) favorites['aiupd8'] = true;
  if (attrs.isPsyaidFavourite) favorites['psyaid'] = true;
  // When adding new projects, add their favorite field here:
  // if (attrs.isNewprojectFavourite) favorites['newproject'] = true;
  
  const result: ToolItem = {
    id: item.id || item._id || '',
    title: attrs.title || "Untitled",
    toolsentence: attrs.toolsentence || "",
    about: attrs.about || "", // NEW: plain text description
    advantages: attrs.advantages || [], // NEW: array of strings
    disadvantages: attrs.disadvantages || [], // NEW: array of strings
    limitations: attrs.limitations || [],
    i18n: attrs.i18n || null,
    favorites: favorites, // NEW: project-specific favorites
    isFavourite: Object.keys(favorites).length > 0, // For backward compatibility
    isExperimental: !!attrs.isExperimental,
    uses: extractRelationNames(attrs.uses),
    setups: extractRelationNames(attrs.setups),
    pricings: extractRelationNames(attrs.pricings),
    licenses: extractRelationNames(attrs.licenses),
    generationTimes: extractRelationNames(attrs.generationTimes),
    inputs: extractRelationNames(attrs.inputs),
    outputs: extractRelationNames(attrs.outputs),
    tasks: extractRelationNames(attrs.tasks),
    profiles: extractRelationNames(attrs.profiles),
    dataStorageLocations: extractRelationNames(attrs.dataStorageLocations), // NEW: required filter
    // PSY-AID project-specific filters
    dataDeletionCapabilities: extractRelationNames(attrs.dataDeletionCapabilities),
    suitabilityRobustnesses: extractRelationNames(attrs.suitabilityRobustnesses),
    onboardingEases: extractRelationNames(attrs.onboardingEases),
    offlineFunctionalities: extractRelationNames(attrs.offlineFunctionalities),
    // For backward compatibility
    use: undefined,
    setup: undefined,
    pricing: undefined,
    license: undefined,
    averageTimeToGenerate: undefined,
    description: typeof attrs.description === 'string' && attrs.description ? attrs.description : undefined,
    dataStorageLocation: undefined, // DEPRECATED
    // Media fields
    Image: attrs.Image?.data?.attributes || attrs.image || null,
    showcaseImages: attrs.showcaseImages?.data
      ? attrs.showcaseImages.data.map((img: any) => img.attributes)
      : attrs.showcaseImages || [],
    // Simple fields
    link: attrs.link || "",
    youtubeLink: attrs.youtubeLink || "",
    privacyPolicy: attrs.privacyPolicy || attrs.privacy_policy || "", // NOW REQUIRED
    // NEW: Project-specific workflows
    aiupdateWorkflows: attrs.aiupdateWorkflows || undefined,
    psyaidWorkflows: attrs.psyaidWorkflows || undefined,
    dateAdded: attrs.dateAdded || attrs.date_added || attrs.createdAt || attrs._createdAt || "",
    lastChanged: attrs.lastChanged || attrs.last_changed || attrs.updatedAt || attrs._updatedAt || ""
  };
  
  // Set the backward compatibility fields after extraction
  result.use = result.uses[0] || undefined;
  result.setup = result.setups[0] || undefined;
  result.pricing = result.pricings[0] || undefined;
  result.license = result.licenses[0] || undefined;
  result.averageTimeToGenerate = result.generationTimes[0] || undefined;
  result.dataStorageLocation = result.dataStorageLocations[0] || undefined;
  
  return result;
};

/**
 * Module-level language display mode.
 * 'localized' → only show tools that have content in the active locale.
 * 'all'        → show all tools regardless of language coverage.
 *
 * Shared across all instances of useDatabase() so the toggle persists
 * while navigating between the database list and tool detail pages.
 */
export type ToolLangFilter = 'localized' | 'all';
const toolLangFilter = ref<ToolLangFilter>('localized');

export function useDatabase() {
  const config = useRuntimeConfig();
  
  // Create an axios instance with the baseURL
  const api = axios.create({
    baseURL: config.public.apiBaseUrl
  });
  
  const items = ref<ToolItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const connected = ref(true);

  async function fetchDatabaseItems() {
    loading.value = true;
    error.value = null;

    // Caching logic: use localStorage to cache for 1 day (24h)
    const CACHE_KEY = 'aiupd8_tools_cache';
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day in ms
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            console.log('Using tools data from localStorage cache');
            items.value = data;
            loading.value = false;
            connected.value = true;
            return;
          }
        }
      }

      const response = await api.get('/api/tools');
      if (response.data.data) {
        // Log raw data for debugging if needed
        console.log("Raw tools data received:", response.data.data);
        const mappedItems = response.data.data.map(mapDatabaseItemToToolItem);
        // Sort tools alphabetically by title
        items.value = mappedItems.sort((a: ToolItem, b: ToolItem) => {
          if (a.isFavourite === b.isFavourite) {
            return a.title.localeCompare(b.title);
          }
          return a.isFavourite ? -1 : 1;
        });
        // Save to cache
        if (typeof window !== 'undefined') {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: items.value,
            timestamp: Date.now()
          }));
          console.log('Saved tools data to localStorage cache');
        }
      } else {
        items.value = [];
      }
      connected.value = true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to fetch database items";
      console.error("Error fetching database items:", e);
      connected.value = false;
      items.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchToolById(title: string): Promise<ToolItem | null> {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.get(`/api/tools/${encodeURIComponent(title)}`);
      if (response.data.data) {
        return mapDatabaseItemToToolItem(response.data.data);
      }
      return null;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to fetch tool";
      console.error("Error fetching tool:", e);
      connected.value = false;
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    items,
    loading,
    error,
    connected,
    fetchDatabaseItems,
    fetchToolById,
    // Language filter mode – shared across instances
    toolLangFilter,
  };
}
