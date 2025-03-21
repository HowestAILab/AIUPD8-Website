import { ref } from 'vue';
import axios from 'axios';

// Keep the interfaces similar to maintain compatibility
export interface ToolItem {
  id: string;
  title: string;
  description: any[]; // Updated to array for Portable Text
  isFavourite: boolean;
  uses: string[];
  setups: string[];
  pricings: string[];
  licenses: string[];
  generationTimes: string[];
  inputs: string[];
  outputs: string[];
  tasks: string[];
  profiles: string[];
  Image: any;
  showcaseImages: any[];
  link: string;
  youtubeLink: string;
  // For backward compatibility
  use?: string;
  setup?: string;
  pricing?: string;
  license?: string;
  averageTimeToGenerate?: string;
}

export function useDatabase() {
  const items = ref<ToolItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const connected = ref(true);

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
  const mapDatabaseItemToToolItem = (item: any): ToolItem => {
    const attrs = item.attributes || item;
    
    const result: ToolItem = {
      id: item.id || item._id || '',
      title: attrs.title || "Untitled",
      description: Array.isArray(attrs.description) ? attrs.description : [],
      isFavourite: !!attrs.isFavourite,
      uses: extractRelationNames(attrs.uses),
      setups: extractRelationNames(attrs.setups),
      pricings: extractRelationNames(attrs.pricings),
      licenses: extractRelationNames(attrs.licenses),
      generationTimes: extractRelationNames(attrs.generationTimes),
      inputs: extractRelationNames(attrs.inputs),
      outputs: extractRelationNames(attrs.outputs),
      tasks: extractRelationNames(attrs.tasks),
      profiles: extractRelationNames(attrs.profiles),
      // For backward compatibility
      use: null,
      setup: null,
      pricing: null,
      license: null,
      averageTimeToGenerate: null,
      // Media fields
      Image: attrs.Image?.data?.attributes || null,
      showcaseImages: attrs.showcaseImages?.data
        ? attrs.showcaseImages.data.map((img: any) => img.attributes)
        : [],
      // Simple fields
      link: attrs.link || "",
      youtubeLink: attrs.youtubeLink || ""
    };
    
    // Set the backward compatibility fields after extraction
    result.use = result.uses[0] || null;
    result.setup = result.setups[0] || null;
    result.pricing = result.pricings[0] || null;
    result.license = result.licenses[0] || null;
    result.averageTimeToGenerate = result.generationTimes[0] || null;
    
    return result;
  };

  async function fetchDatabaseItems() {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get('/api/tools');
      if (response.data.data) {
        // Log raw data for debugging if needed
        console.log("Raw tools data received:", response.data.data);
        items.value = response.data.data.map(mapDatabaseItemToToolItem);
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
      const response = await axios.get(`/api/tools/${encodeURIComponent(title)}`);
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
