<!-- pages/index.vue -->
<template>
  <div class="relative overflow-hidden">
    <!-- Background Circle -->
    <div
      class="absolute top-1/2 -right-1/4 transform -translate-y-1/2 flex items-center justify-center -z-10"
    >
      <div
        class="w-[80rem] h-[80rem] bg-blue-500 rounded-full blur-3xl opacity-75"
      ></div>
    </div>

    <!-- Hero Section -->
    <HeroSection
      :heading="heroContent.title"
      :subheading="heroContent.subtitle"
      class="min-h-screen"
    />

    <!-- Cards Section (Inspiration / Curation) -->
    <CardSection :cards="cards" class="min-h-screen" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import HeroSection from "~/components/sections/HeroSection.vue";
import CardSection from "~/components/sections/CardSection.vue";

/**
 * For now, we're hardcoding or using placeholders.
 * In a future step, you can fetch from Strapi with useStrapiClient()
 */
const heroContent = ref({
  title: "Curated database <br> for genAI tools.",
  subtitle:
    "This database is the result of AI-UPD8. It  is a COOCK+ project led by the HOWEST research groups Digital Arts & Entertainment and Business & Media. Our mission is to guide creative companies in the game, film, media, communication, and marketing sectors through the maze of genAI possibilities.",
});

const cards = ref([
  {
    icon: "🌟",
    title: "Curation",
    description:
      "The AI-UPD8 database goes beyond a simple listing of AI tools. Every tool in our database has been thoroughly tested and evaluated by our team of experts, ensuring you get reliable, hands-on insights. <br><br> Think of it as your trusted guide, where each entry represents not just information, but validated knowledge from professionals who understand the creative industry's needs.",
  },
  {
    icon: "💡",
    title: "Inspiration",
    description:
      "Get inspired by real-world AI proven workflows that match your needs. Our database lets you filter examples by professional profile, industry, project scale, or specific creative tasks. <br> <br> Whether you're a game developer looking for character animation solutions, a marketer seeking content creation tools, or a video editor exploring post-production automation you'll quickly find relevant examples that spark ideas for your own workflow.",
  },
]);
</script>

<style>
/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #3178f2;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: #1e50a2;
}

/* Responsive Card Section */
@media (max-width: 768px) {
  .card-section {
    flex-direction: column;
  }
}
</style>
