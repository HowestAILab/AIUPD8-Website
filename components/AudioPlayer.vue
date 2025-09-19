<template>
  <div class="w-full">
    <div class="p-6 bg-gray-50 rounded-lg border shadow-sm">
      <!-- Audio Info Header -->
      <div class="mb-4">
        <h3 v-if="title" class="text-lg font-semibold text-gray-900 mb-1">
          {{ title }}
        </h3>
        <p v-if="description" class="text-sm text-gray-600">
          {{ description }}
        </p>
      </div>

      <!-- Audio Player Controls -->
      <div class="flex items-center space-x-4">
        <!-- Play/Pause Button -->
        <button
          @click="togglePlay"
          :disabled="!audioUrl || isLoading"
          class="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full text-white transition-colors duration-200"
          :class="{ 'animate-pulse': isLoading }"
        >
          <svg
            v-if="isLoading"
            class="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <svg
            v-else-if="!isPlaying"
            class="w-5 h-5 ml-0.5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>

        <!-- Progress Bar and Time -->
        <div class="flex-1">
          <!-- Progress Bar -->
          <div class="relative">
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-blue-600 transition-all duration-100"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
            <!-- Seek Input (invisible overlay) -->
            <input
              v-if="audioElement && duration > 0"
              type="range"
              min="0"
              :max="duration"
              :value="currentTime"
              @input="seek"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <!-- Time Display -->
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- Volume Control -->
        <div class="flex items-center space-x-2">
          <button @click="toggleMute" class="text-gray-600 hover:text-gray-800">
            <svg
              v-if="isMuted || volume === 0"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
              />
            </svg>
            <svg
              v-else-if="volume < 0.5"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"
              />
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
              />
            </svg>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            :value="isMuted ? 0 : volume"
            @input="setVolume"
            class="w-16 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
          />
        </div>
      </div>

      <!-- Hidden Audio Element -->
      <audio
        ref="audioElement"
        :src="audioUrl"
        @loadedmetadata="onLoadedMetadata"
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
        @loadstart="isLoading = true"
        @canplay="isLoading = false"
        @error="onError"
        preload="metadata"
      ></audio>

      <!-- Error Display -->
      <div
        v-if="error"
        class="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMedia } from "~/composables/useMedia";

const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});

const { getSanityFileUrl } = useMedia();

// Audio element and state
const audioElement = ref(null);
const isPlaying = ref(false);
const isLoading = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const isMuted = ref(false);
const error = ref("");

// Computed properties
const audioUrl = computed(() => {
  if (!props.file) return "";
  return getSanityFileUrl(props.file);
});

const progress = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0;
});

// Audio control methods
const togglePlay = async () => {
  if (!audioElement.value || !audioUrl.value) return;

  try {
    if (isPlaying.value) {
      audioElement.value.pause();
    } else {
      await audioElement.value.play();
    }
  } catch (err) {
    error.value = "Failed to play audio file";
    console.error("Audio play error:", err);
  }
};

const seek = (event) => {
  const target = event.target;
  const seekTime = parseFloat(target.value);
  if (audioElement.value) {
    audioElement.value.currentTime = seekTime;
  }
};

const setVolume = (event) => {
  const target = event.target;
  const newVolume = parseFloat(target.value);
  volume.value = newVolume;
  if (audioElement.value) {
    audioElement.value.volume = newVolume;
  }
  if (newVolume > 0) {
    isMuted.value = false;
  }
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  if (audioElement.value) {
    audioElement.value.muted = isMuted.value;
  }
};

// Audio event handlers
const onLoadedMetadata = () => {
  if (audioElement.value) {
    duration.value = audioElement.value.duration;
    isLoading.value = false;
  }
};

const onTimeUpdate = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime;
  }
};

const onEnded = () => {
  isPlaying.value = false;
  currentTime.value = 0;
};

const onError = () => {
  error.value = "Failed to load audio file";
  isLoading.value = false;
};

// Utility functions
const formatTime = (seconds) => {
  if (!seconds || !isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Watch for play/pause state changes
watch(
  () => audioElement.value,
  (newElement) => {
    if (newElement) {
      const updatePlayState = () => {
        isPlaying.value = !newElement.paused;
      };

      newElement.addEventListener("play", updatePlayState);
      newElement.addEventListener("pause", updatePlayState);

      onUnmounted(() => {
        newElement.removeEventListener("play", updatePlayState);
        newElement.removeEventListener("pause", updatePlayState);
      });
    }
  }
);

// Initialize volume
onMounted(() => {
  if (audioElement.value) {
    audioElement.value.volume = volume.value;
  }
});
</script>

<style scoped>
/* Custom range input styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-webkit-slider-track {
  height: 8px;
  border-radius: 4px;
  background: #e5e7eb;
}

input[type="range"]::-moz-range-track {
  height: 8px;
  border-radius: 4px;
  background: #e5e7eb;
  border: none;
}
</style>
