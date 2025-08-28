<template>
  <div>
    <HeaderBar variant="white" />

    <div class="pt-10 md:pt-7 bg-light-page-background min-h-screen">
      <!-- Hero section with title and background image -->
      <section class="max-w-6xl mx-auto px-4 py-8">
        <div
          class="relative overflow-hidden bg-center bg-no-repeat rounded-lg"
          style="
            background-image: url('/images/Cover-website.png');
            background-size: 100% 100%;
            aspect-ratio: 1500 / 387;
            width: 100%;
          "
        >
          <!-- Dark overlay for better text readability -->
          <div class="absolute inset-0 bg-black/10 rounded-lg"></div>

          <div
            class="relative z-10 flex items-center justify-center h-full text-center"
          >
            <h1 class="text-5xl md:text-6xl font-bold text-white">
              ONS AANBOD
            </h1>
          </div>
        </div>
      </section>

      <!-- Info and button section -->
      <section class="max-w-6xl mx-auto px-4 py-8 text-center">
        <p class="text-base font-bold text-black-700 max-w-3xl mx-auto mb-6">
          Aiupdate helpt creatieve professionals AI praktisch en duidelijk te
          gebruiken. We kiezen <br />
          samen de juiste tools, zetten slimme workflows op en geven training
          zodat je vlot aan de <br />
          slag kan. Alles stemmen we af op jouw doelen en mogelijkheden, zodat
          je stap voor stap <br />
          AI kan invoeren en uitbreiden zonder verrassingen.
        </p>
        <a
          :href="contactEmail"
          class="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
        >
          Contacteer ons
        </a>
      </section>

      <!-- Single grid of hybrid service blocks from Sanity -->
      <section
        v-if="items.length"
        class="max-w-6xl mx-auto px-4 pb-16 space-y-10"
      >
        <div v-for="sec in items" :key="sec.id" class="bg-transparent">
          <OfferCard
            :heading="sec.heading"
            :subtitle="sec.subtitle"
            :blocks="sec.body"
            :image="sec.image"
            :imageAlt="sec.imageAlt"
            :variants="sec.variants"
            :contactEmail="contactEmail"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from "~/components/layout/HeaderBar.vue";
import { onMounted } from "vue";
import { useOffer } from "~/composables/useOffer";
import OfferCard from "~/components/sections/OfferCard.vue";

const { items, loading, fetchAll } = useOffer();

const contactEmail = "mailto:laura.willems@howest.be";

// No grouping, we render all items as hybrid services in a single grid

onMounted(async () => {
  await fetchAll();
});
</script>
