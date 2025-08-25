import { ref } from 'vue';
import { useSanity } from '#imports';
import { useRuntimeConfig } from '#app';

export interface OfferItem {
  id: string;
  heading: string;
  subtitle?: string;
  body: any[];
  image?: any;
  imageAlt?: string;
  variants?: Array<{ name: string; description?: string }>;
}

export function useOffer() {
  const config = useRuntimeConfig();

  const items = ref<OfferItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchOfferItems() {
    try {
      const res = await $fetch<{ data: any[] }>(`${config.public.apiBaseUrl}/api/offer`)
      items.value = (res?.data || []).map((row: any) => ({
        id: row.id,
        heading: row.attributes.heading,
        subtitle: row.attributes.subtitle,
        body: row.attributes.body,
        image: row.attributes.image,
        imageAlt: row.attributes.imageAlt,
        variants: row.attributes.variants,
      }))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch offer items';
    }
  }

  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      await Promise.all([fetchOfferItems()]);
    } finally {
      loading.value = false;
    }
  }

  return { items, loading, error, fetchAll };
}


