<template>
  <div
    v-if="isOutdated"
    class="relative inline-block"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <!-- Badge with ! icon -->
    <div
      class="bg-orange-500 text-white text-sm px-2.5 py-1 rounded-full shadow-sm cursor-pointer flex items-center justify-center relative group"
    >
      ❕
      <!-- Small info icon on top right -->
      <div
        class="absolute -top-1 -right-1 w-3 h-3 bg-white text-orange-500 rounded-full flex items-center justify-center text-[8px] font-bold group-hover:animate-pulse"
      >
        i
      </div>
    </div>

    <!-- Tooltip/Modal on hover -->
    <transition name="fade">
      <div
        v-if="showTooltip"
        class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
      >
        <!-- Arrow pointing up -->
        <div
          class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"
        ></div>
        <!-- Tooltip content -->
        <div
          class="bg-gray-100 text-black text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap relative"
        >
          <div class="font-semibold mb-1">{{ t('badge.outdatedTitle') }}</div>
          <div class="text-gray-800">
            {{ t('badge.outdatedDesc') }}
          </div>
          <div v-if="lastChanged" class="text-gray-700 text-[10px] mt-1">
            {{ t('badge.lastUpdated') }} {{ formatDate(lastChanged) }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useLocale, useTranslations } from "~/composables/i18n";

const { locale } = useLocale();
const { t } = useTranslations();

interface Props {
  lastChanged?: string;
  isOutdated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  lastChanged: "",
  isOutdated: false,
});

const showTooltip = ref(false);

// Format date to readable format
function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale.value === 'nl' ? 'nl-BE' : 'en-GB', {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}
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
