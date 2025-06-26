<template>
  <div class="my-8 flex justify-center">
    <div class="w-full max-w-2xl">
      <DatabaseItem :item="tool" :show-comparison="false" @update:itemsInComparison="() => {}" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import DatabaseItem from '~/components/DatabaseItem.vue';
import type { ToolItem } from '~/composables/useDatabase';

defineProps<{
  tool: ToolItem;
}>();
</script> 