<!-- components/HeroSection.vue -->
<template>
  <section
    class="w-full min-h-screen flex flex-col items-center justify-center text-center p-10"
  >
    <div
      class="flex flex-row justify-center items-center gap-4 mb-8 w-4/6 h-4 mt-10"
    >
      <img src="/images/DAE.png" alt="DAE" class="h-full object-contain" />
      <img src="/images/VLAIO.png" alt="VLAIO" class="h-full object-contain" />
      <img
        src="/images/bm_cluster.png"
        alt="BM Cluster"
        class="h-full object-contain"
      />
      <img
        src="/images/AI-Lab.png"
        alt="AI Lab"
        class="h-full object-contain"
      />
    </div>
    <h1
      class="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 text-light-page-text-dark"
      v-html="heading"
    ></h1>
    <p class="max-w-3xl text-l mb-6 text-light-page-text-light">
      {{ subheading }}
    </p>
    <NuxtLink to="/database" class="hover:underline">
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
