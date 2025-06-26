<template>
  <div v-if="tool" class="my-8 border rounded-lg overflow-hidden shadow-lg">
    <nuxt-link :to="`/tools/${tool.title}`" class="block hover:bg-gray-50 transition-colors duration-200">
      <div class="p-5">
        <h4 class="text-lg font-bold">Check out this tool:</h4>
        <div class="flex items-center mt-4">
          <div>
            <h5 class="text-xl font-semibold text-primary">{{ tool.title }}</h5>
            <p class="text-gray-600 mt-2">Click here to learn more about this tool and how to use it.</p>
          </div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  tool: {
    title: string;
    slug: string;
  };
}>();
</script> 