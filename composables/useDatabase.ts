import axios from "axios";
import { useRuntimeConfig } from '#app';

interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: null;
  width: number;
  height: number;
  size: number;
  url: string;
}

interface Image {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
    medium?: ImageFormat;
    small?: ImageFormat;
    large?: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: null;
}

interface RelationItem {
  id: number;
  attributes: {
    name: string;
  };
}

interface RelationData {
  data: RelationItem[];
}

export interface DatabaseItem {
  id: number;
  attributes: {
    title: string;
    description: any; // Rich text can be complex
    isFavourite: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    // Relations
    uses: RelationData;
    setups: RelationData;
    pricings: RelationData;
    licenses: RelationData;
    generationTimes: RelationData;
    inputs: RelationData;
    outputs: RelationData;
    tasks: RelationData;
    profiles: RelationData;
    // Media
    Image: {
      data: {
        id: number;
        attributes: Image;
      } | null;
    };
    showcaseImages: {
      data: {
        id: number;
        attributes: Image;
      }[];
    };
  };
}

// Simplified interface for components
export interface ToolItem {
  id: number;
  title: string;
  description: any;
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
  youtubeLinks: string;
  // For backward compatibility
  use?: string;
  setup?: string;
  pricing?: string;
  license?: string;
  averageTimeToGenerate?: string;
}

interface ApiResponse {
  data: DatabaseItem[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export function useDatabase() {
  const items = ref<ToolItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const runtimeConfig = useRuntimeConfig();

  const mapDatabaseItemToToolItem = (item: any): ToolItem => {
    // Debug the actual structure if needed
    console.log("Raw item:", JSON.stringify(item, null, 2));
    
    // Handle different response formats (direct item or item in attributes)
    const attributes = item.attributes || item;
    
    // Extract relation arrays with defensive coding for both formats
    const extractRelationNames = (relation: any): string[] => {
      // Case 1: Direct array of objects with name property
      if (Array.isArray(relation)) {
        return relation
          .filter(rel => rel && rel.name)
          .map(rel => rel.name);
      }
      
      // Case 2: Nested data structure from Strapi
      if (relation && relation.data) {
        const dataArray = Array.isArray(relation.data) ? relation.data : [relation.data].filter(Boolean);
        return dataArray
          .filter(rel => rel && rel.attributes && rel.attributes.name)
          .map(rel => rel.attributes.name);
      }
      
      return [];
    };
    
    // Extract image data safely
    const getImage = (imageData: any) => {
      // Case 1: Direct image object
      if (imageData && !imageData.data) {
        return imageData;
      }
      
      // Case 2: Nested data structure
      if (imageData && imageData.data) {
        return imageData.data.attributes || null;
      }
      
      return null;
    };
    
    const getImages = (imagesData: any): any[] => {
      // Case 1: Direct array of image objects
      if (Array.isArray(imagesData)) {
        return imagesData;
      }
      
      // Case 2: Nested data structure
      if (imagesData && imagesData.data) {
        if (!Array.isArray(imagesData.data)) return [];
        return imagesData.data
          .filter(img => img && img.attributes)
          .map(img => img.attributes);
      }
      
      return [];
    };
    
    // Get relation arrays (supports both formats)
    const uses = extractRelationNames(attributes.uses);
    const setups = extractRelationNames(attributes.setups);
    const pricings = extractRelationNames(attributes.pricings);
    const licenses = extractRelationNames(attributes.licenses);
    const generationTimes = extractRelationNames(attributes.generationTimes);
    const inputs = extractRelationNames(attributes.inputs);
    const outputs = extractRelationNames(attributes.outputs);
    const tasks = extractRelationNames(attributes.tasks);
    const profiles = extractRelationNames(attributes.profiles);
    
    // Map to simplified format
    return {
      id: item.id,
      title: attributes.title || "Untitled",
      description: attributes.description || "",
      isFavourite: !!attributes.isFavourite,
      uses,
      setups,
      pricings,
      licenses,
      generationTimes,
      inputs,
      outputs,
      tasks,
      profiles,
      // For backward compatibility
      use: uses[0] || null,
      setup: setups[0] || null,
      pricing: pricings[0] || null,
      license: licenses[0] || null,
      averageTimeToGenerate: generationTimes[0] || null,
      // Media fields
      Image: getImage(attributes.Image),
      showcaseImages: getImages(attributes.showcaseImages) || [],
      // New schema fields
      link: attributes.link || "",
      youtubeLinks: attributes.youtubeLinks || ""
    };
  };

  async function fetchDatabaseItems() {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(
        `${runtimeConfig.public.dbUrl}/api/tools?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${runtimeConfig.public.apiToken}`
          }
        }
      );
      
      // Transform data to simpler format
      if (response.data.data) {
        // Standard Strapi format
        items.value = response.data.data.map(mapDatabaseItemToToolItem);
      } else if (Array.isArray(response.data)) {
        // Direct array format
        items.value = response.data.map(mapDatabaseItemToToolItem);
      } else {
        // Single item format
        items.value = [mapDatabaseItemToToolItem(response.data)];
      }
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : "Failed to fetch database items";
      console.error("Error fetching database items:", e);
    } finally {
      loading.value = false;
    }
  }

  async function fetchToolById(title: string): Promise<ToolItem | null> {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(
        `${runtimeConfig.public.dbUrl}/api/tools?filters[title][$eq]=${encodeURIComponent(title)}&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${runtimeConfig.public.apiToken}`
          }
        }
      );
      
      // Handle different response formats
      if (response.data.data && response.data.data.length > 0) {
        // Standard Strapi format
        return mapDatabaseItemToToolItem(response.data.data[0]);
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        // Direct array format
        return mapDatabaseItemToToolItem(response.data[0]);
      } else if (response.data && response.data.title === title) {
        // Single item format
        return mapDatabaseItemToToolItem(response.data);
      }
      return null;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to fetch tool";
      console.error("Error fetching tool:", e);
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    items,
    loading,
    error,
    fetchDatabaseItems,
    fetchToolById,
  };
}
