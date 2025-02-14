<template>
  <div>
    <HeaderBar variant="white" />

    <!-- main content area -->
    <div class="pt-16 min-h-screen bg-light-page-background flex">
      <!-- Left column: advanced filter -->
      <aside
        class="w-full md:w-1/4 p-4"
        :class="{ hidden: !showFilters }"
        ref="filterSidebar"
      >
        <AdvancedFilter />
      </aside>

      <!-- 
          Right column: 
            - Filter bar (some top filters or search bar)
            - Cards grid
        -->
      <main class="w-full md:w-3/4 p-4">
        <div class="mb-6">
          <FilterBar @toggle-filters="toggleFilters" />
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          <DatabaseItem v-for="item in items" :key="item.id" :item="item" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import HeaderBar from "~/components/layout/HeaderBar.vue";
import AdvancedFilter from "~/components/AdvancedFilter.vue";
import FilterBar from "~/components/FilterBar.vue";
import DatabaseItem from "~/components/DatabaseItem.vue";

const { items, loading, error, fetchDatabaseItems } = useDatabase()

onMounted(() => {
  fetchDatabaseItems()
})
</script>
