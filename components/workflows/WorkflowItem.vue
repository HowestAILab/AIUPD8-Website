<template>
  <div
    class="bg-white border-2 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    :style="{ borderColor: `${projectColor}40` }"
  >
    <!-- Workflow Header (Clickable) -->
    <div
      class="p-4 cursor-pointer flex items-center justify-between"
      :class="{ 'border-b-2': isExpanded }"
      :style="{ borderBottomColor: isExpanded ? `${projectColor}40` : '' }"
      @click="$emit('toggle', workflow._key)"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          :style="{ backgroundColor: `${projectColor}20` }"
        >
          <svg
            class="w-5 h-5"
            :style="{ color: projectColor }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div>
          <h4 class="font-semibold text-gray-900">{{ workflow.name }}</h4>
          <span class="text-xs text-gray-500 mt-1 block">
            {{ workflow.steps?.length || 0 }} steps
          </span>
        </div>
      </div>
      <svg
        class="w-5 h-5 text-gray-400 transition-transform flex-shrink-0"
        :class="{ 'rotate-180': isExpanded }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>

    <!-- Workflow Content (Expanded) -->
    <transition name="expand">
      <div v-if="isExpanded" class="p-4 bg-gray-50">
        <div class="space-y-3">
          <div
            v-for="step in sortedSteps"
            :key="step._key"
            class="flex gap-3 bg-white rounded-lg p-4 shadow-sm"
          >
            <!-- Step Number -->
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full text-white text-sm flex items-center justify-center font-bold"
              :style="{ backgroundColor: projectColor }"
            >
              {{ step.stepNumber }}
            </div>

            <!-- Step Content -->
            <div class="flex-1 min-w-0">
              <h6 class="font-semibold text-xl text-gray-900 mb-1">
                {{ step.title }}
              </h6>
              <p
                v-if="step.shortDescription"
                class="text-lg text-gray-600 mb-2"
              >
                {{ step.shortDescription }}
              </p>
              <!-- Centered, zoomable step image -->
              <div v-if="step.image" class="mt-2 flex justify-center">
                <img
                  :src="step.image"
                  :alt="step.imageAlt || step.title"
                  class="rounded-lg max-w-[50%] h-auto shadow-md cursor-zoom-in transition-opacity hover:opacity-90"
                  @click.stop="openZoom(step.image, step.imageAlt || step.title)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>

  <!-- Lightbox overlay (teleported to body to escape any overflow:hidden parents) -->
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="zoomedImage"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 cursor-zoom-out p-4"
        @click="closeZoom"
      >
        <!-- Close button -->
        <button
          class="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          aria-label="Close"
          @click.stop="closeZoom"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <!-- Zoomed image -->
        <img
          :src="zoomedImage.src"
          :alt="zoomedImage.alt"
          class="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
          @click.stop
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { AiupdateWorkflow } from "~/composables/useDatabase"; 

const props = defineProps<{
  workflow: AiupdateWorkflow;
  projectColor: string;
  isExpanded: boolean;
}>();

defineEmits<{
  toggle: [workflowKey: string];
}>();

/** Steps sorted ascending by stepNumber */
const sortedSteps = computed(() => {
  if (!props.workflow.steps) return [];
  return [...props.workflow.steps].sort((a, b) => a.stepNumber - b.stepNumber);
});

// ── Lightbox ──────────────────────────────────────────────
const zoomedImage = ref<{ src: string; alt: string } | null>(null);

function openZoom(src: string, alt: string) {
  zoomedImage.value = { src, alt };
  document.body.style.overflow = "hidden";
}

function closeZoom() {
  zoomedImage.value = null;
  document.body.style.overflow = "";
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape") closeZoom();
}

onMounted(() => window.addEventListener("keydown", onKeyDown));
onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown);
  document.body.style.overflow = "";
});
</script>

<style scoped>
/* ── Workflow accordion ─────────────────────────────────── */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

/* ── Lightbox overlay ───────────────────────────────────── */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 2000px;
}
</style>
