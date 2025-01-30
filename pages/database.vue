<!-- pages/database.vue -->
<template>
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-4">Database of Tools</h1>
      <p class="mb-4">
        Below is a static placeholder. Later, we'll fetch data from Strapi
        and display it here.
      </p>
      <ul>
        <li
          v-for="(tool, index) in tools"
          :key="index"
          class="mb-2 p-2 border rounded"
        >
          <strong>{{ tool.title }}</strong> - {{ tool.description }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  
  // Placeholder data until we connect Strapi
  const tools = ref([
    { title: "Tool #1", description: "Description for tool #1." },
    { title: "Tool #2", description: "Description for tool #2." },
  ]);
  </script>
  