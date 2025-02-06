<template>
  <header :class="computedClasses">
    <nav class="flex items-center justify-between w-full max-w-6xl mx-auto">
      <!-- Left side: Logo or brand -->
      <NuxtLink to="/" class="font-bold text-xl px-2 py-1 hover:underline">
        AIUPD8
      </NuxtLink>

      <!-- Right side: Nav links -->
      <div class="flex items-center space-x-4">
        <NuxtLink to="/database" class="font-bold hover:underline">
          Database
        </NuxtLink>

        <NuxtLink to="/contact" class="hover:underline">
          <RecurringButton variant="neutral">Contact</RecurringButton>
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import RecurringButton from "~/components/ui/RecurringButton.vue";

const props = defineProps({
  variant: {
    type: String,
    default: "transparent", // or 'white', etc.
  },
});

// Build CSS classes depending on the variant
const computedClasses = computed(() => {
  if (props.variant === "transparent") {
    return "fixed top-0 left-0 right-0 z-50 bg-transparent p-4 shadow-none ";
  } else if (props.variant === "white") {
    return "fixed top-0 left-0 right-0 z-50 bg-white p-4 shadow text-black";
  } else if (props.variant === "dark") {
    return "fixed top-0 left-0 right-0 z-50 bg-black p-4 text-white";
  }
  // Add more variants as needed
  return "fixed top-0 left-0 right-0 z-50 p-4";
});
</script>
