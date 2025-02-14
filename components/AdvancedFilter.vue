<template>
  <!-- Wrap filters in a ScrollAreaRoot for scrolling -->
  <ScrollAreaRoot
    class="w-full h-full relative overflow-hidden"
    style="--scrollbar-size: 8px"
  >
    <ScrollAreaViewport class="w-full h-full px-4 py-6">
      <!-- ADVANCED FILTER HEADLINE -->
      <h2 class="text-2xl font-bold mb-4">Advanced Filters</h2>

      <Divider />

      <!-- USE -->
      <div class="mt-8 mb-6">
        <h3 class="text-lg font-bold mb-2">Use</h3>
        <div class="flex w-full overflow-x-auto">
          <SelectButton
            v-model="use"
            :options="useOptions"
            multiple
            class="flex flex-wrap gap-2 w-full"
            :pt="{
              button: ({ context }) => ({
                style: 'border rounded-full px-4 py-1 text-sm transition-colors'
              })
            }"
          />
        </div>
      </div>

      <!-- SETUP -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Setup</h3>
        <div class="flex w-full overflow-x-auto">
          <SelectButton
            v-model="setup"
            :options="setupOptions"
            multiple
            class="flex flex-wrap gap-2 w-full"
            :pt="{
              button: ({ context }) => ({
                style: 'border rounded-full px-4 py-1 text-sm transition-colors'
              })
            }"
          />
        </div>
      </div>

      <!-- PRICING -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Pricing</h3>
        <div class="flex w-full overflow-x-auto">
          <SelectButton
            v-model="pricing"
            :options="pricingOptions"
            multiple
            class="flex flex-wrap gap-2 w-full"
            :pt="{
              button: ({ context }) => ({
                class: context.active ? 
                  'bg-blue-100 text-blue-700 border-blue-300' : 
                  'bg-white hover:bg-gray-50',
                style: 'border rounded-full px-4 py-1 text-sm transition-colors'
              })
            }"
          />
        </div>
      </div>

      <!-- LICENSE -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">License</h3>
        <div class="flex w-full overflow-x-auto">
          <SelectButton
            v-model="license"
            :options="licenseOptions"
            multiple
            class="flex flex-wrap gap-2 w-full"
            :pt="{
              button: ({ context }) => ({
                style: 'border rounded-full px-4 py-1 text-sm transition-colors'
              })
            }"
          />
        </div>
      </div>

      <!-- AVERAGE TIME TO GENERATE -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">Average time to generate</h3>
        <div class="flex w-full overflow-x-auto">
          <SelectButton
            v-model="generationTime"
            :options="generationTimeOptions"
            multiple
            class="flex flex-wrap gap-2 w-full"
            :pt="{
              button: ({ context }) => ({
                style: 'border rounded-full px-4 py-1 text-sm transition-colors'
              })
            }"
          />
        </div>
      </div>

      <Divider class="mb-6" />

      <!-- INPUT TYPE -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">input type</h3>
        <div class="flex w-full overflow-x-auto">
          <SelectButton
            v-model="inputType"
            :options="inputTypeOptions"
            multiple
            class="flex flex-wrap gap-2 w-full"
            :pt="{
              button: ({ context }) => ({
                style: 'border rounded-full px-4 py-1 text-sm transition-colors'
              })
            }"
          />
        </div>
      </div>

      <!-- OUTPUT TYPE -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">output</h3>
        <div class="flex w-full overflow-x-auto">
          <SelectButton
            v-model="output"
            :options="outputOptions"
            multiple
            class="flex flex-wrap gap-2 w-full"
            :pt="{
              button: ({ context }) => ({
                style: 'border rounded-full px-4 py-1 text-sm transition-colors'
              })
            }"
          />
        </div>
      </div>

      <!-- PROFILE -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">profile</h3>
        <div class="flex w-full overflow-x-auto">
          <SelectButton
            v-model="profile"
            :options="profileOptions"
            multiple
            class="flex flex-wrap gap-2 w-full"
            :pt="{
              button: ({ context }) => ({
                style: 'border rounded-full px-4 py-1 text-sm transition-colors'
              })
            }"
          />
        </div>
      </div>

      <!-- TASK -->
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-2">specific task</h3>
        <div class="flex w-full overflow-x-auto">
          <SelectButton
            v-model="task"
            :options="taskOptions"
            multiple
            class="flex flex-wrap gap-2 w-full"
            :pt="{
              button: ({ context }) => ({
                style: 'border rounded-full px-4 py-1 text-sm transition-colors'
              })
            }"
          />
        </div>
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
import SelectButton from 'primevue/selectbutton';
import RecurringButton from "~/components/ui/RecurringButton.vue";

// States
const use = ref([]);
const setup = ref([]);
const pricing = ref([]);
const license = ref([]);
const generationTime = ref([]);
const inputType = ref([]);
const output = ref([]);
const profile = ref([]);
const task = ref([]);

// Options for SelectButton
const useOptions = ["no-code", "low-code", "code"];
const setupOptions = ["no-code", "low-code", "code"];
const pricingOptions = ["free", "freemium", "subscription", "credits"];
const licenseOptions = ["personal", "commercial"];
const generationTimeOptions = ["seconds", "minutes", "hours", "days"];
const inputTypeOptions = ["text", "text", "text", "text"];
const outputOptions = ["text", "text", "text", "text"];
const profileOptions = ["text", "text", "text", "text"];
const taskOptions = ["text", "text", "text", "text"];

// Debugging: Watch state changes
watch(use, (newValue) => console.log("Updated Use:", newValue));
watch(setup, (newValue) => console.log("Updated Setup:", newValue));
watch(pricing, (newValue) => console.log("Updated Pricing:", newValue));
watch(license, (newValue) => console.log("Updated License:", newValue));
watch(generationTime, (newValue) => console.log("Updated Generation Time:", newValue));
watch(inputType, (newValue) => console.log("Updated Input Type:", newValue));
watch(output, (newValue) => console.log("Updated Input Type:", newValue));
watch(profile, (newValue) => console.log("Updated Input Type:", newValue));
watch(task, (newValue) => console.log("Updated Input Type:", newValue));

function applyFilters() {
  console.log("Applying filters…", {
    use: use.value,
    setup: setup.value,
    pricing: pricing.value,
    license: license.value,
    generationTime: generationTime.value,
    inputType: inputType.value,
    output: output.value,
    profile: profile.value,
    task: task.value,
  });
}

function clearFilters() {
  use.value = [];
  setup.value = [];
  pricing.value = [];
  license.value = [];
  generationTime.value = [];
  inputType.value = [];
  output.value = [];
  profile.value = [];
  task.value = [];
  console.log("Filters cleared");
}
</script>
