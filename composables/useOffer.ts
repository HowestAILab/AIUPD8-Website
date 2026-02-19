import { ref } from 'vue';
import { useRuntimeConfig } from '#app';
import type { I18nArray } from '~/composables/i18n';

/**
 * An offer item as returned by the server API.
 * All translatable text fields are InternationalizedArray values.
 */
export interface OfferItem {
  id: string;
  heading: I18nArray<string>;
  subtitle: I18nArray<string>;
  body: I18nArray<any[]>;
  image?: any;
  imageAlt?: string;
  variants?: Array<{
    name: I18nArray<string>;
    description: I18nArray<string>;
  }>;
}

export function useOffer() {
  const config = useRuntimeConfig();

  const items = ref<OfferItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchOfferItems() {
    try {
      const res = await $fetch<{ data: any[] }>(`${config.public.apiBaseUrl}/api/offer`)
      items.value = (res?.data ?? []).map((row: any) => ({
        id: row.id,
        heading: row.heading ?? [],
        subtitle: row.subtitle ?? [],
        body: row.body ?? [],
        image: row.image ?? null,
        imageAlt: row.imageAlt ?? '',
        variants: (row.variants ?? []).map((v: any) => ({
          name: v.name ?? [],
          description: v.description ?? [],
        })),
      }))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch offer items';
    }
  }

  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      await fetchOfferItems();
    } finally {
      loading.value = false;
    }
  }

  return { items, loading, error, fetchAll };
}


