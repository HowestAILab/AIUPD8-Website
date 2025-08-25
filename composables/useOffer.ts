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
  const { client } = useSanity();
  const config = useRuntimeConfig();

  const items = ref<OfferItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchOfferItems() {
    try {
      const query = `*[_type == "offerItem"] | order(coalesce(order, 9999) asc, _createdAt asc){
        "id": _id,
        heading,
        subtitle,
        body,
        image,
        imageAlt,
        variants[]{ name, description }
      }`;
      const data = await client.fetch(query);
      items.value = Array.isArray(data) ? data : [];
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


