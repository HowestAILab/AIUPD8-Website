<template>
  <div class="w-full">
    <DatabaseItem
      :item="tool"
      :show-comparison="false"
      @update:itemsInComparison="() => {}"
    />
  </div>
</template>

<script setup>
import DatabaseItem from "~/components/DatabaseItem.vue";

defineProps({
  tool: {
    type: Object,
    required: true,
  },
});
</script>
