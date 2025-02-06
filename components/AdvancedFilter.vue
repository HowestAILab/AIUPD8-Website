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
        <ToggleGroupRoot v-model="use" type="multiple" class="flex space-x-4">
          <ToggleGroupItem
            value="noCode"
            :class="toggleGroupItemClasses"
            :data-state="use.includes('noCode') ? 'on' : 'off'"
          >
            no-code
          </ToggleGroupItem>
          <ToggleGroupItem
            value="lowCode"
            :class="toggleGroupItemClasses"
            :data-state="use.includes('lowCode') ? 'on' : 'off'"
          >
            low-code
          </ToggleGroupItem>
          <ToggleGroupItem
            value="code"
            :class="toggleGroupItemClasses"
            :data-state="use.includes('code') ? 'on' : 'off'"
          >
            code
          </ToggleGroupItem>
        </ToggleGroupRoot>
      </div>

      <!-- SETUP -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Setup</h3>
        <ToggleGroupRoot v-model="setup" type="multiple" class="flex space-x-4">
          <ToggleGroupItem
            value="noCode"
            :class="toggleGroupItemClasses"
            :data-state="setup.includes('noCode') ? 'on' : 'off'"
          >
            no-code
          </ToggleGroupItem>
          <ToggleGroupItem
            value="lowCode"
            :class="toggleGroupItemClasses"
            :data-state="setup.includes('lowCode') ? 'on' : 'off'"
          >
            low-code
          </ToggleGroupItem>
          <ToggleGroupItem
            value="code"
            :class="toggleGroupItemClasses"
            :data-state="setup.includes('code') ? 'on' : 'off'"
          >
            code
          </ToggleGroupItem>
        </ToggleGroupRoot>
      </div>

      <!-- PRICING -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Pricing</h3>
        <ToggleGroupRoot
          v-model="pricing"
          type="multiple"
          class="flex space-x-4"
        >
          <ToggleGroupItem
            value="free"
            :class="toggleGroupItemClasses"
            :data-state="pricing.includes('free') ? 'on' : 'off'"
          >
            free
          </ToggleGroupItem>
          <ToggleGroupItem
            value="freemium"
            :class="toggleGroupItemClasses"
            :data-state="pricing.includes('freemium') ? 'on' : 'off'"
          >
            freemium
          </ToggleGroupItem>
          <ToggleGroupItem
            value="subscription"
            :class="toggleGroupItemClasses"
            :data-state="pricing.includes('subscription') ? 'on' : 'off'"
          >
            subscription
          </ToggleGroupItem>
          <ToggleGroupItem
            value="credits"
            :class="toggleGroupItemClasses"
            :data-state="pricing.includes('credits') ? 'on' : 'off'"
          >
            credits
          </ToggleGroupItem>
        </ToggleGroupRoot>
      </div>

      <!-- LICENSE -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">License</h3>
        <ToggleGroupRoot
          v-model="license"
          type="multiple"
          class="flex space-x-4"
        >
          <ToggleGroupItem
            value="personal"
            :class="toggleGroupItemClasses"
            :data-state="license.includes('personal') ? 'on' : 'off'"
          >
            personal
          </ToggleGroupItem>
          <ToggleGroupItem
            value="commercial"
            :class="toggleGroupItemClasses"
            :data-state="license.includes('commercial') ? 'on' : 'off'"
          >
            commercial
          </ToggleGroupItem>
        </ToggleGroupRoot>
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
import { ToggleGroupItem, ToggleGroupRoot } from "reka-ui";
import RecurringButton from "~/components/ui/RecurringButton.vue";

// States
const use = ref([]);
const setup = ref([]);
const pricing = ref([]);
const license = ref([]);

// Toggle Group Styling
const toggleGroupItemClasses =
  "hover:bg-stone-50 text-mauve11 data-[state=on]:bg-blue-500 data-[state=on]:text-white flex h-[35px] items-center justify-center bg-white text-base leading-4 rounded-[7px] focus:z-10 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none px-4 py-2";

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
