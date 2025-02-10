<template>
  <!-- Wrap filters in a ScrollAreaRoot for scrolling -->
  <ScrollAreaRoot
    class="w-full h-full relative overflow-hidden"
    style="--scrollbar-size: 8px"
  >
    <ScrollAreaViewport class="w-full h-full px-4 py-6">
      <!-- ADVANCED FILTER HEADLINE -->
      <h2 class="text-2xl font-bold mb-4">Advanced Filters</h2>

      <!-- USE -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Use</h3>
        <SelectButton
          v-model="use"
          :options="useOptions"
          multiple
          class="flex space-x-4"
        />
      </div>

      <!-- SETUP -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Setup</h3>
        <SelectButton
          v-model="setup"
          :options="setupOptions"
          multiple
          class="flex space-x-4"
        />
      </div>

      <!-- PRICING -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Pricing</h3>
        <SelectButton
          v-model="pricing"
          :options="pricingOptions"
          multiple
          class="flex space-x-4"
        />
      </div>

      <!-- LICENSE -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">License</h3>
        <SelectButton
          v-model="license"
          :options="licenseOptions"
          multiple
          class="flex space-x-4"
        />
      </div>

      <!-- APPLY FILTERS BUTTON -->
      <RecurringButton variant="neutral" class="mt-4" @click="applyFilters">
        Apply Filters
      </RecurringButton>
      <!-- CLEAR FILTERS BUTTON -->
      <RecurringButton
        variant="neutral"
        class="mt-4 maw-w-[50%] mx-auto"
        @click="clearFilters"
      >
        Clear Filters
      </RecurringButton>
    </ScrollAreaViewport>

    <!-- Optional Reka scrollbars -->
    <ScrollAreaScrollbar
      orientation="vertical"
      class="bg-blackA2 hover:bg-blackA3"
    >
      <ScrollAreaThumb class="bg-mauve10 rounded" />
    </ScrollAreaScrollbar>
  </ScrollAreaRoot>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import SelectButton from "primevue/selectbutton";
import RecurringButton from "~/components/ui/RecurringButton.vue";

// States
const use = ref([]);
const setup = ref([]);
const pricing = ref([]);
const license = ref([]);

// Options for SelectButton
const useOptions = ["no-code", "low-code", "code"];
const setupOptions = ["no-code", "low-code", "code"];
const pricingOptions = ["free", "freemium", "subscription", "credits"];
const licenseOptions = ["personal", "commercial"];

// Debugging: Watch state changes
watch(use, (newValue) => console.log("Updated Use:", newValue));
watch(setup, (newValue) => console.log("Updated Setup:", newValue));
watch(pricing, (newValue) => console.log("Updated Pricing:", newValue));
watch(license, (newValue) => console.log("Updated License:", newValue));

function applyFilters() {
  console.log("Applying filters…", {
    use: use.value,
    setup: setup.value,
    pricing: pricing.value,
    license: license.value,
  });
}

function clearFilters() {
  use.value = [];
  setup.value = [];
  pricing.value = [];
  license.value = [];
  console.log("Filters cleared");
}
</script>
