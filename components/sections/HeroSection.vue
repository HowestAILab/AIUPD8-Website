<!-- components/HeroSection.vue -->
<template>
  <section
    class="w-full min-h-screen flex flex-col items-center justify-center text-center p-10"
  >
    <h1 class="text-8xl font-bold mb-4" v-html="heading"></h1>
    <p class="max-w-3xl text-l mb-6">{{ subheading }}</p>
    <NuxtLink to="/contact" class="hover:underline">
      <RecurringButton variant="neutral" class="mt-4">
        Go to the database
      </RecurringButton>
    </NuxtLink>
  </section>
</template>

<script setup lang="ts">
import RecurringButton from "~/components/ui/RecurringButton.vue";

const props = defineProps({
  heading: {
    type: String,
    default: "Curated database for genAI tools.",
  },
  subheading: {
    type: String,
    default: "Short subtext about your main message.",
  },
});
</script>
