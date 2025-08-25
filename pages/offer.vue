<template>
  <div>
    <HeaderBar variant="white" />

    <div class="pt-16 bg-light-page-background min-h-screen">
      <section class="relative overflow-hidden">
        <div class="absolute top-1/2 -right-1/4 transform -translate-y-1/2 flex items-center justify-center -z-10">
          <div class="w-[60rem] h-[60rem] bg-main rounded-full blur-3xl opacity-50"></div>
        </div>

        <div class="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 class="text-5xl md:text-6xl font-bold mb-6">What we offer</h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Practical, industry-focused guidance to adopt and scale GenAI confidently.
          </p>
          <p class="text-base text-gray-700 max-w-3xl mx-auto mt-4">
            We help creative teams evaluate, adopt, and scale AI-powered workflows with clarity and control. From tool selection to workflow design and training, we align changes to your objectives and constraints.
          </p>
          <a :href="contactEmail" class="mt-6 inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors">
            Contact us
          </a>
        </div>

      </section>


      <!-- Single grid of hybrid service blocks from Sanity -->
      <section v-if="items.length" class="max-w-6xl mx-auto px-4 pb-16 space-y-10">
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
import { onMounted } from 'vue';
import { useOffer } from '~/composables/useOffer';
import OfferCard from "~/components/sections/OfferCard.vue";

const { items, loading, fetchAll } = useOffer();

const contactEmail = "mailto:laura.willems@howest.be";

// No grouping, we render all items as hybrid services in a single grid

onMounted(async () => {
  await fetchAll();
});
</script>


