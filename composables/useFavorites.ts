import { ref, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import type { ToolItem } from './useDatabase';

export function useFavorites() {
  // Store favorites in localStorage so they persist between sessions
  const favorites = useLocalStorage<string[]>('aiupd8-favorites', []);
  const favoriteCount = ref(favorites.value.length);

  // Watch for changes to update the count
  watch(favorites, (newVal) => {
    favoriteCount.value = newVal.length;
  }, { deep: true });

  // Toggle favorite status
  function toggleFavorite(id: string) {
    const index = favorites.value.indexOf(id);
    if (index === -1) {
      favorites.value.push(id);
    } else {
      favorites.value.splice(index, 1);
    }
  }

  // Check if an item is favorited
  function isFavorite(id: string) {
    return favorites.value.includes(id);
  }

  // Filter tools by favorites - ensuring IDs match as strings
  function filterByFavorites(tools: ToolItem[], showOnlyFavorites: boolean): ToolItem[] {
    if (!showOnlyFavorites) return tools;
    const favIds = favorites.value.map(id => String(id));
    console.log(`Filtering ${tools.length} tools, found ${favIds.length} favorites`);
    const filtered = tools.filter(tool => favIds.includes(String(tool.id)));
    console.log(`After filtering: ${filtered.length} tools remain`);
    return filtered;
  }

  return {
    favorites,
    favoriteCount,
    toggleFavorite,
    isFavorite,
    filterByFavorites
  };
}
