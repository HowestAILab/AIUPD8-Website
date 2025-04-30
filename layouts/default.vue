<template>
  <div class="relative flex flex-col min-h-screen font-sans">
    <!-- No Header here. Let each page decide its own Header. -->

    <!-- Main content area -->
    <main class="flex-grow pb-12">
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
/* Global thin, small, grey scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #b0b0b0;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #8a8a8a;
}

/* For Firefox */
html {
  scrollbar-width: thin;
  scrollbar-color: #b0b0b0 transparent;
}
</style>
