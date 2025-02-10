<!-- components/Footer.vue -->
<template>
  <footer class="w-full bg-dark-page-background text-dark-page-text-dark">
    <!-- Outer container -->
    <div class="max-w-7xl mx-auto px-4 py-10">
      <!-- Top row: “Find us here on LinkedIn” + Address | “Or send us a mail” + Button -->
      <div
        class="flex flex-col md:flex-row justify-between md:items-center mb-10"
      >
        <!-- Left side -->
        <div class="mb-8 md:mb-0">
          <h2 class="text-2xl font-semibold mb-4">Find us here on LinkedIn</h2>
          <!-- Placeholder LinkedIn icon -->
          <div
            class="w-10 h-10 bg-light-page-background rounded-full mb-4"
          ></div>
          <p class="leading-relaxed">
            Howest<br />
            Marksesteenweg 58<br />
            8500 Kortrijk
          </p>
        </div>
        <!-- Right side -->
        <div class="text-left md:text-right">
          <h2 class="text-2xl font-semibold mb-4">Or send us a mail</h2>
          <NuxtLink to="/contact" class="inline-block hover:underline">
            <RecurringButton variant="primary"> contact us </RecurringButton>
          </NuxtLink>
        </div>
      </div>

      <!-- Bottom row: partner logos -->
      <div class="flex flex-wrap items-center justify-center gap-8">
        <!-- Replace with actual images/logos or keep as placeholders -->
        <div class="w-24 h-10 bg-light-page-background"></div>
        <div class="w-24 h-10 bg-light-page-background"></div>
        <div class="w-24 h-10 bg-light-page-background"></div>
        <div class="w-24 h-10 bg-light-page-background"></div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import RecurringButton from "~/components/ui/RecurringButton.vue";
</script>
