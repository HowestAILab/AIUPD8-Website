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
            class="w-10 h-10 bg-[#087ccc] rounded-full mb-4 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="w-5 h-5 fill-white"
            >
              <path
                d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"
              />
            </svg>
          </div>
          <p class="leading-relaxed">
            Howest<br />
            Marksesteenweg 58<br />
            8500 Kortrijk
          </p>
        </div>
        <!-- Right side -->
        <div class="text-left md:text-right">
          <h2 class="text-2xl font-semibold mb-4">Or send us a mail</h2>
          <a href="mailto:laura.willems@howest.be" class="hover:underline">
            <RecurringButton variant="primary"> contact us </RecurringButton>
          </a>
        </div>
      </div>

      <!-- Bottom row: partner logos -->
      <div class="flex flex-wrap items-center justify-center gap-8">
        <img
          src="/images/DAE_dark.png"
          alt="DAE"
          class="max-h-[10vh] object-contain"
        />
        <img
          src="/images/VLAIO.png"
          alt="VLAIO"
          class="max-h-[10vh] object-contain"
        />
        <img
          src="/images/bm_cluster_white.png"
          alt="BM Cluster"
          class="max-h-[10vh] object-contain"
        />
        <img
          src="/images/AI-Lab.png"
          alt="AI Lab"
          class="max-h-[10vh] object-contain"
        />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import RecurringButton from "~/components/ui/RecurringButton.vue";
</script>
