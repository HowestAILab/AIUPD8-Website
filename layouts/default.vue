<!-- layouts/default.vue -->
<template>
  <div class="relative flex flex-col min-h-screen font-sans overflow-hidden">
    <!-- Header / Navbar -->
    <HeaderBar />

    <!-- Main content area -->
    <main class="relative z-10 flex-grow">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import HeaderBar from "~/components/layout/HeaderBar.vue";
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
