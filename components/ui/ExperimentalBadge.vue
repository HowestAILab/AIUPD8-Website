<template>
  <div
    class="relative inline-block"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <!-- Badge with experimental icon -->
    <div
      class="bg-yellow-500 text-white text-sm px-2.5 py-1 rounded-full shadow-sm cursor-pointer flex items-center justify-center relative"
    >
      experiment
    </div>

    <!-- Tooltip/Modal on hover -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const showTooltip = ref(false);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
