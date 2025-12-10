import { ref } from 'vue';
import axios from 'axios';
import { useRuntimeConfig } from '#app';

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

// Keep the interfaces similar to maintain compatibility
export interface ToolItem {
  id: string;
  title: string;
  toolsentence: string;
  about: string; // CHANGED: was description (BlockContent), now plain text
  advantages: string[]; // NEW: required, min 3 items
  disadvantages: string[]; // NEW: required, min 2 items
  isFavourite: boolean;
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
  Image: any;
  showcaseImages: any[];
  link: string;
  youtubeLink: string;
  privacyPolicy: string; // CHANGED: now required
  aiupdateWorkflows?: AiupdateWorkflow[]; // NEW: project-specific workflows for Aiupdate
  dateAdded?: string;
  lastChanged?: string;
  // For backward compatibility
  use?: string;
  setup?: string;
  pricing?: string;
  license?: string;
  averageTimeToGenerate?: string;
  description?: any[]; // DEPRECATED: kept for backward compatibility
  dataStorageLocation?: string; // DEPRECATED: use dataStorageLocations array
}

// Updated helper to extract relation names:
const extractRelationNames = (relation: any): string[] => {
  if (!relation) return [];
  
  let arr = [];
  if (relation.data) {
    arr = Array.isArray(relation.data) ? relation.data : [relation.data];
  } else if (Array.isArray(relation)) {
    arr = relation;
  }
  
  return arr
    .map((r: any) => {
      // First try to get name from attributes
      if (r.attributes && (r.attributes.name || r.attributes.title)) {
        return r.attributes.name || r.attributes.title;
      }
      // Then try direct properties
      return r.name || r.title || '';
    })
    .filter((val: string) => val.trim() !== '');
};

// Reworked mapping function for better compatibility
export const mapDatabaseItemToToolItem = (item: any): ToolItem => {
  const attrs = item.attributes || item;
  console.log(attrs)
  const result: ToolItem = {
    id: item.id || item._id || '',
    title: attrs.title || "Untitled",
    toolsentence: attrs.toolsentence || "",
    about: attrs.about || "", // NEW: plain text description
    advantages: attrs.advantages || [], // NEW: array of strings
    disadvantages: attrs.disadvantages || [], // NEW: array of strings
    isFavourite: !!attrs.isFavourite,
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
    // For backward compatibility
    use: undefined,
    setup: undefined,
    pricing: undefined,
    license: undefined,
    averageTimeToGenerate: undefined,
    description: Array.isArray(attrs.description) ? attrs.description : undefined, // DEPRECATED
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
  };
}
