<template>
  <section
    class="flex flex-wrap gap-6 justify-center items-center py-10 min-h-screen"
  >
    <div
      v-for="(item, idx) in cards"
      :key="idx"
      class="bg-light-page-background shadow-xl rounded-lg p-6 w-full sm:w-1/2 lg:w-1/4 flex flex-col items-start h-[50vh]"
    >
      <div class="text-6xl mb-4 text-left text-light-page-text-dark">
        {{ item.icon }}
      </div>
      <h3
        class="text-4xl font-semibold mb-4 text-left text-light-page-text-dark"
      >
        {{ item.title }}
      </h3>
      <p
        class="text-left text-light-page-text-dark"
        v-html="item.description"
      ></p>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  cards: {
    type: Array,
    required: true,
  },
});
</script>
