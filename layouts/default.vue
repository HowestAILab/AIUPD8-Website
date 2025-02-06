<template>
  <div class="relative flex flex-col min-h-screen font-sans">
    <!-- No Header here. Let each page decide its own Header. -->

    <!-- Main content area -->
    <main class="flex-grow">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from "~/components/layout/Footer.vue";
</script>

<style>
/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #3178f2;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: #1e50a2;
}
</style>
