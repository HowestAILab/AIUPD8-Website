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
          <!-- <h2 class="text-2xl font-semibold mb-4">Find us here on LinkedIn</h2> -->
          <!-- Replaced LinkedIn icon with correct footer image -->

          <p class="leading-relaxed">
            Howest<br />
            Marksesteenweg 58<br />
            8500 Kortrijk
          </p>
        </div>
        <!-- Right side -->
        <div
          class="flex flex-row items-center justify-center md:justify-end gap-4"
        >
          <a
            href="https://www.linkedin.com/groups/13097690/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/footer/linkedin.png"
              alt="LinkedIn Logo"
              class="w-10 h-10"
            />
          </a>
          <a href="mailto:laura.willems@howest.be" class="inline-block">
            <img
              src="/images/footer/mail.png"
              alt="Email Logo"
              class="w-10 h-10"
            />
          </a>
        </div>
      </div>

      <!-- Bottom row: partner logos -->

      <div
        class="flex flex-row justify-center items-center gap-4 w-[10%] mx-auto"
      >
        <img
          src="/images/footer/DAE.png"
          alt="DAE"
          class="h-full object-contain"
        />
        <img
          src="/images/footer/VLAIO.png"
          alt="VLAIO"
          class="h-full object-contain"
        />
        <img
          src="/images/footer/bm_cluster_white.png"
          alt="BM Cluster"
          class="h-full object-contain"
        />
        <img
          src="/images/footer/AI-Lab.png"
          alt="AI Lab"
          class="h-full object-contain"
        />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import RecurringButton from "~/components/ui/RecurringButton.vue";
</script>
