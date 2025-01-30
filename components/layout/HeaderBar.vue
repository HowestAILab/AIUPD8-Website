<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between h-16"
  >
    <NuxtLink to="/" class="font-bold text-xl hover:underline">AIUPD8</NuxtLink>
    <nav class="flex items-center space-x-4">
      <NuxtLink to="/database" class="font-bold hover:underline"
        >Database</NuxtLink
      >
      <NuxtLink to="/contact" class="hover:underline">
        <RecurringButton variant="neutral">Contact</RecurringButton>
      </NuxtLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import RecurringButton from "~/components/ui/RecurringButton.vue";
</script>
