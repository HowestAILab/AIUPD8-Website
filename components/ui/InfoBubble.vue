<template>
  <div
    class="relative inline-flex items-center"
    @mouseenter="open"
    @mouseleave="scheduleClose"
    @focusin="open"
    @focusout="scheduleClose"
  >
    <!-- Trigger button: info circle SVG, matches ProjectSelector style -->
    <button
      ref="triggerRef"
      type="button"
      :aria-label="ariaLabel || text"
      aria-haspopup="true"
      :aria-expanded="visible"
      class="flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
      @click.stop="toggle"
    >
      <svg :class="sizeClasses" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>

    <!-- Popup: teleported to body to escape overflow/clip containers -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="visible"
          role="tooltip"
          class="fixed z-[9999] bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2.5 text-xs text-gray-700 w-64"
          :class="originClass"
          :style="popupStyle"
          @mouseenter="cancelClose"
          @mouseleave="scheduleClose"
        >
          <!-- Arrow -->
          <div
            class="absolute w-2 h-2 bg-white border-gray-200 rotate-45"
            :class="arrowClasses"
          ></div>
          <!-- Content -->
          <slot>
            <p class="leading-snug">{{ text }}</p>
          </slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';

interface Props {
  /** Plain-text description shown in the popup (slot overrides this) */
  text?: string;
  /** Accessible label for the trigger button */
  ariaLabel?: string;
  /**
   * Where the popup opens relative to the trigger.
   * 'bottom-left' (default) | 'bottom-right' | 'top-left' | 'top-right'
   */
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  /** Size variant */
  size?: 'sm' | 'md';
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom-left',
  size: 'sm',
});

const visible = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const popupStyle = ref<Record<string, string>>({});
let closeTimer: ReturnType<typeof setTimeout> | null = null;

function computePosition() {
  if (!triggerRef.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  const gap = 8;
  switch (props.placement) {
    case 'bottom-left':
      popupStyle.value = { top: `${rect.bottom + gap}px`, left: `${rect.left}px` };
      break;
    case 'bottom-right':
      popupStyle.value = { top: `${rect.bottom + gap}px`, right: `${window.innerWidth - rect.right}px` };
      break;
    case 'top-left':
      popupStyle.value = { bottom: `${window.innerHeight - rect.top + gap}px`, left: `${rect.left}px` };
      break;
    case 'top-right':
      popupStyle.value = { bottom: `${window.innerHeight - rect.top + gap}px`, right: `${window.innerWidth - rect.right}px` };
      break;
  }
}

function open() {
  cancelClose();
  computePosition();
  visible.value = true;
}

function scheduleClose() {
  closeTimer = setTimeout(() => { visible.value = false; }, 120);
}

function cancelClose() {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
}

function toggle() {
  visible.value ? scheduleClose() : open();
}

onBeforeUnmount(() => { cancelClose(); });

const sizeClasses = computed(() => ({
  'sm': 'w-3.5 h-3.5',
  'md': 'w-5 h-5',
}[props.size]));

const originClass = computed(() => ({
  'bottom-left':  'origin-top-left',
  'bottom-right': 'origin-top-right',
  'top-left':     'origin-bottom-left',
  'top-right':    'origin-bottom-right',
}[props.placement]));

const arrowClasses = computed(() => ({
  'bottom-left':  '-top-1 left-3 border-t border-l',
  'bottom-right': '-top-1 right-3 border-t border-r',
  'top-left':     '-bottom-1 left-3 border-b border-l',
  'top-right':    '-bottom-1 right-3 border-b border-r',
}[props.placement]));
</script>
