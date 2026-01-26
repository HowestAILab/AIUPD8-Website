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

  // Map of type names to their corresponding API endpoint paths
  const typeToEndpoint: Record<string, string> = {
    // General filters
    'use': 'use-types',
    'setup': 'setup-types',
    'pricing': 'pricing-types',
    'license': 'license-types',
    'input': 'input-types',
    'output': 'output-types',
    'dataStorageLocation': 'data-storage-locations',
    // Aiupdate-specific filters
    'generationTime': 'generation-times',
    'profile': 'profile-types',
    'task': 'task-types',
    // PsyAid-specific filters
    'psychoEducationalProfile': 'psycho-educational-profiles',
    'therapyType': 'therapy-types',
    'dataDeletionCapability': 'data-deletion-capabilities',
    'euAccessibilityAct': 'eu-accessibility-acts',
    'aiTransparency': 'ai-transparencies',
    'wcagCompliance': 'wcag-compliances',
    'designQuality': 'design-qualities',
    'onboardingEase': 'onboarding-eases',
    'offlineFunctionality': 'offline-functionalities',
    'readingLevel': 'reading-levels',
    'languageSupport': 'language-supports',
    'culturalAdaptability': 'cultural-adaptabilities',
  };

  /**
   * Fetches taxonomy items by their type using server-side API
   * Caches results in localStorage for 1 day (24h)
   * @param type The taxonomy type (use, setup, pricing, license, etc.)
   * @returns A promise that resolves to an array of taxonomy items
   */
  async function fetchTaxonomyByType(type: string): Promise<TaxonomyItem[]> {
    loading.value = true;
    error.value = null;

    // Caching logic: use localStorage to cache for 1 day (24h)
    const CACHE_KEY = `aiupd8_taxonomy_cache_${type}`;
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day in ms
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            console.log(`Using taxonomy data for ${type} from localStorage cache`);
            loading.value = false;
            return data;
          }
        }
      }

      const endpoint = typeToEndpoint[type];
      if (!endpoint) {
        throw new Error(`Unknown taxonomy type: ${type}`);
      }
      const response = await api.get(`/api/taxonomy/${endpoint}`);
      console.log(`Taxonomy data for ${type}:`, response.data);
      let result: TaxonomyItem[] = [];
      if (response.data && response.data.data) {
        result = response.data.data.map((item: any) => ({
          id: item.id,
          name: item.attributes?.name || '',
        }));
        // Save to cache
        if (typeof window !== 'undefined') {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: result,
            timestamp: Date.now()
          }));
          console.log(`Saved taxonomy data for ${type} to localStorage cache`);
        }
      }
      loading.value = false;
      return result;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : `Failed to fetch ${type} taxonomy`;
      error.value = errorMessage;
      console.error(errorMessage, e);
      loading.value = false;
      return [];
    }
  }

  return {
    loading,
    error,
    fetchTaxonomyByType
  };
}
