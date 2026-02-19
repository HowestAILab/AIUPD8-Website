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
import { computed } from "vue";
import HeaderBar from "~/components/layout/HeaderBar.vue";
import HeroSection from "~/components/sections/HeroSection.vue";
import CardSection from "~/components/sections/CardSection.vue";
import ResearchProjects from "~/components/sections/ResearchProjects.vue";
import { useTranslations } from "~/composables/i18n";

const { t } = useTranslations();

const heroContent = computed(() => ({
  title: t('home.heroTitle'),
  subtitle: t('home.heroSubtitle'),
}));

const cards = computed(() => [
  {
    iconSrc: "/images/curation.svg",
    title: t('home.curationTitle'),
    description: t('home.curationDesc'),
  },
  {
    iconSrc: "/images/inspiration.svg",
    title: t('home.inspirationTitle'),
    description: t('home.inspirationDesc'),
  },
]);
</script>
