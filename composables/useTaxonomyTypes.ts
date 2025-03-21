import axios from "axios";
import { ref } from "vue";
import { useRuntimeConfig } from '#app';

export interface TaxonomyItem {
  id: string | number;
  name: string;
}

export function useTaxonomyTypes() {
  const config = useRuntimeConfig();
  
  // Create an axios instance with the baseURL
  const api = axios.create({
    baseURL: config.public.apiBaseUrl
  });
  
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Map of type names to their corresponding API endpoint paths (same as before)
  const typeToEndpoint: Record<string, string> = {
    'use': 'use-types',
    'setup': 'setup-types',
    'pricing': 'pricing-types',
    'license': 'license-types',
    'generationTime': 'generation-times',
    'input': 'input-types',
    'output': 'output-types',
    'profile': 'profile-types',
    'task': 'task-types',
  };

  /**
   * Fetches taxonomy items by their type using server-side API
   * @param type The taxonomy type (use, setup, pricing, license, etc.)
   * @returns A promise that resolves to an array of taxonomy items
   */
  async function fetchTaxonomyByType(type: string): Promise<TaxonomyItem[]> {
    loading.value = true;
    error.value = null;
    
    try {
      const endpoint = typeToEndpoint[type];
      
      if (!endpoint) {
        throw new Error(`Unknown taxonomy type: ${type}`);
      }
      
      const response = await api.get(`/api/taxonomy/${endpoint}`);
      
      console.log(`Taxonomy data for ${type}:`, response.data);
      
      if (response.data && response.data.data) {
        return response.data.data.map((item: any) => ({
          id: item.id,
          name: item.attributes?.name || '',
        }));
      }
      
      return [];
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : `Failed to fetch ${type} taxonomy`;
      error.value = errorMessage;
      console.error(errorMessage, e);
      return [];
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    fetchTaxonomyByType
  };
}
