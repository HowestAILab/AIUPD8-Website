<template>
  <header :class="computedClasses">
    <nav class="flex items-center justify-between w-full max-w-6xl mx-auto">
      <!-- Left side: Logo or brand -->
      <div class="relative">
        <NuxtLink
          to="/"
          class="font-bold text-xl px-2 py-1 hover:underline text-light-page-text-dark relative z-10"
        >
          AIUPD8
        </NuxtLink>
        <div
          v-if="!isHomePage"
          class="absolute -bottom-1 -left-2 w-[2.5rem] h-[2.5rem] bg-main rounded-full blur-sm opacity-75 -z-10"
        ></div>
      </div>

      <!-- Right side: Nav links -->
      <div class="flex items-center space-x-4">
        <NuxtLink
          to="/database"
          class="font-bold hover:underline text-light-page-text-dark"
        >
          database
        </NuxtLink>
        <NuxtLink
          to="/blog"
          class="font-bold hover:underline text-light-page-text-dark"
        >
          blog
        </NuxtLink>

        <a
          href="#"
          @click.prevent="scrollToBottom"
          class="font-bold hover:underline text-light-page-text-dark"
        >
          contact
        </a>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isHomePage = computed(() => route.path === "/");

const props = defineProps({
  variant: {
    type: String,
    default: "transparent", // or 'white', etc.
  },
});

// Build CSS classes depending on the variant
const computedClasses = computed(() => {
  if (props.variant === "transparent") {
    return "fixed top-0 left-0 right-0 z-50 bg-white p-4 shadow-none";
  } else if (props.variant === "white") {
    return "fixed top-0 left-0 right-0 z-50 bg-white p-4 shadow";
  }
  return "fixed top-0 left-0 right-0 z-50 p-4";
});

const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth",
  });
};
</script>
