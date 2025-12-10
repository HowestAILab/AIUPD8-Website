<template>
  <div>
    <HeaderBar variant="transparent" />

    <div class="relative overflow-hidden">
      <!-- Big circle background, etc. -->
      <div
        class="absolute top-1/2 -right-1/4 transform -translate-y-1/2 flex items-center justify-center -z-10"
      >
        <div
          class="w-[80rem] h-[80rem] bg-main rounded-full blur-3xl opacity-75"
        ></div>
      </div>

      <!-- Hero Section (no pt-16, we want overlap) -->
      <HeroSection
        :heading="heroContent.title"
        :subheading="heroContent.subtitle"
        class="min-h-screen"
      />

      <!-- Research Projects Section -->
      <ResearchProjects />

      <!-- Cards Section -->
      <CardSection :cards="cards" class="min-h-screen" />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from "~/components/layout/HeaderBar.vue";
import HeroSection from "~/components/sections/HeroSection.vue";
import CardSection from "~/components/sections/CardSection.vue";
import ResearchProjects from "~/components/sections/ResearchProjects.vue";

/**
 * For now, we're hardcoding or using placeholders.
 * In a future step, you can fetch from Strapi with useStrapiClient()
 */
const heroContent = ref({
  title: "Curated database <br> for genAI tools.",
  subtitle:
    "AIUPD8 is a Howest initiative dedicated to keeping you up-to-date with the latest AI tools. Through our courses, expert teachers, and collaborative research projects, we empower creative professionals to harness the power of generative AI.",
});

const cards = ref([
  {
    iconSrc: "/images/curation.svg",
    title: "Curation",
    description:
      "The AI-UPD8 database goes beyond a simple listing of AI tools. Every tool in our database has been thoroughly tested and evaluated by our team of experts, ensuring you get reliable, hands-on insights. <br><br> Think of it as your trusted guide, where each entry represents not just information, but validated knowledge from professionals who understand the creative industry's needs.",
  },
  {
    iconSrc: "/images/inspiration.svg",
    title: "Inspiration",
    description:
      "Get inspired by real-world AI proven workflows that match your needs. Our database lets you filter examples by professional profile, industry, project scale, or specific creative tasks. <br> <br> Whether you're a game developer looking for character animation solutions, a marketer seeking content creation tools, or a video editor exploring post-production automation you'll quickly find relevant examples that spark ideas for your own workflow.",
  },
]);
</script>
