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

      <!-- Right side: Nav links (desktop) -->
      <div class="hidden md:flex items-center space-x-4">
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
        <NuxtLink
          to="/offer"
          class="font-bold hover:underline text-light-page-text-dark bg"
        >
          our offer
        </NuxtLink>

        <a
          href="#"
          @click.prevent="scrollToBottom"
          class="font-bold hover:underline text-light-page-text-dark"
        >
          contact
        </a>
      </div>

      <!-- Right side: Mobile menu button and dropdown -->
      <div class="relative md:hidden">
        <button
          class="p-2 rounded focus:outline-none focus:ring-2 focus:ring-main/50"
          :aria-expanded="isMenuOpen ? 'true' : 'false'"
          aria-haspopup="menu"
          aria-label="Toggle menu"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-light-page-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div
          v-if="isMenuOpen"
          class="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg py-2 z-50"
          role="menu"
        >
          <NuxtLink
            to="/database"
            class="block px-4 py-2 font-bold text-light-page-text-dark hover:bg-gray-50"
            role="menuitem"
            @click="isMenuOpen = false"
          >
            database
          </NuxtLink>
          <NuxtLink
            to="/blog"
            class="block px-4 py-2 font-bold text-light-page-text-dark hover:bg-gray-50"
            role="menuitem"
            @click="isMenuOpen = false"
          >
            blog
          </NuxtLink>
          <NuxtLink
            to="/offer"
            class="block px-4 py-2 font-bold text-light-page-text-dark hover:bg-gray-50"
            role="menuitem"
            @click="isMenuOpen = false"
          >
            our offer
          </NuxtLink>
          <a
            href="#"
            class="block px-4 py-2 font-bold text-light-page-text-dark hover:bg-gray-50"
            role="menuitem"
            @click.prevent="handleContactClick"
          >
            contact
          </a>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { defineProps, computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isHomePage = computed(() => route.path === "/");
const isMenuOpen = ref(false);

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

const handleContactClick = () => {
  isMenuOpen.value = false;
  scrollToBottom();
};

watch(
  () => route.path,
  () => {
    isMenuOpen.value = false;
  }
);
</script>
