<template>
  <div>
    <!-- Image with hover and click effects -->
    <div
      class="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group transition-shadow duration-300 hover:shadow-xl"
      @click="openModal"
      @keydown.enter="openModal"
      @keydown.space.prevent="openModal"
      tabindex="0"
      role="button"
      aria-label="Click to view image in full screen"
    >
      <img
        :src="imageUrl"
        :alt="alt"
        class="w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
        loading="lazy"
      />
      <!-- Overlay with zoom icon on hover -->
      <div
        class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
      >
        <div
          class="bg-white bg-opacity-20 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100"
        >
          <svg
            class="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Full-screen modal -->
    <Teleport to="body">
      <Transition name="modal" appear>
        <div
          v-if="isModalOpen"
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-white backdrop-blur-sm p-4"
          @click.stop="closeModal"
          @keydown.esc="closeModal"
          tabindex="0"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <!-- Modal content -->
          <div
            class="relative flex items-center justify-center w-full h-full"
          >
            <!-- Close button -->
            <button
              @click.stop="closeModal"
              class="absolute top-4 right-4 z-10 p-3 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label="Close image viewer"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <!-- Image container with proper scaling -->
            <div class="relative flex items-center justify-center">
              <!-- White background for PNG transparency -->
              <div
                v-if="showWhiteBackground && imageWidth && imageHeight"
                class="absolute bg-white rounded-lg shadow-2xl"
                :style="imageStyles"
              ></div>

              <!-- Image -->
              <img
                ref="modalImage"
                :src="imageUrl"
                :alt="alt"
                class="relative z-10 rounded-lg shadow-2xl"
                :style="imageStyles"
                @click.stop
                @load="onImageLoad"
                @error="onImageError"
              />
            </div>

            <!-- Loading indicator -->
            <div
              v-if="imageLoading"
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
            >
              <div
                class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"
              ></div>
            </div>

            <!-- Error message -->
            <div
              v-if="imageError"
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
            >
              <div class="text-white text-center p-4">
                <svg
                  class="w-12 h-12 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <p class="text-lg">Failed to load image</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "Content image",
  },
});

const isModalOpen = ref(false);
const imageLoading = ref(false);
const imageError = ref(false);
const modalImage = ref(null);
const imageWidth = ref(0);
const imageHeight = ref(0);
const showWhiteBackground = ref(false);

// Computed style for proper image scaling
const imageStyles = computed(() => {
  if (!imageWidth.value || !imageHeight.value) {
    return {
      maxWidth: "calc(100vw - 80px)",
      maxHeight: "calc(100vh - 80px)",
      objectFit: "contain",
    };
  }

  // Get viewport dimensions with padding
  const viewportWidth = window.innerWidth - 80; // 40px padding on each side
  const viewportHeight = window.innerHeight - 80; // 40px padding on each side

  // Calculate scale to fit within viewport
  const scaleX = viewportWidth / imageWidth.value;
  const scaleY = viewportHeight / imageHeight.value;

  // For very small images, allow scaling up to a reasonable size (but not beyond viewport)
  const minScale = Math.min(2, scaleX, scaleY); // Allow up to 2x scaling for small images
  const maxScale = Math.min(scaleX, scaleY); // Don't exceed viewport

  // If image is smaller than 200px in either dimension, allow some scaling up
  const isSmallImage = imageWidth.value < 200 || imageHeight.value < 200;
  const scale = isSmallImage
    ? Math.min(minScale, maxScale)
    : Math.min(maxScale, 1);

  const finalWidth = Math.floor(imageWidth.value * scale);
  const finalHeight = Math.floor(imageHeight.value * scale);

  return {
    width: finalWidth + "px",
    height: finalHeight + "px",
    maxWidth: "calc(100vw - 80px)",
    maxHeight: "calc(100vh - 80px)",
    objectFit: "contain",
  };
});

const openModal = () => {
  isModalOpen.value = true;
  imageLoading.value = true;
  imageError.value = false;
  // Prevent body scroll when modal is open
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  isModalOpen.value = false;
  imageLoading.value = false;
  imageError.value = false;
  // Restore body scroll
  document.body.style.overflow = "";
};

const onImageLoad = (event) => {
  imageLoading.value = false;
  imageError.value = false;

  const img = event.target;
  imageWidth.value = img.naturalWidth;
  imageHeight.value = img.naturalHeight;

  // Check if image might have transparency
  const url = props.imageUrl.toLowerCase();
  const hasTransparentFormat =
    url.includes(".png") || url.includes(".gif") || url.includes(".webp");

  if (hasTransparentFormat) {
    checkImageTransparency(img);
  } else {
    showWhiteBackground.value = false;
  }
};

const onImageError = () => {
  imageLoading.value = false;
  imageError.value = true;
};

const checkImageTransparency = (img) => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = Math.min(img.naturalWidth, 100); // Sample a small area
    canvas.height = Math.min(img.naturalHeight, 100);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Check if any pixel has alpha < 255 (transparency)
    let hasTransparency = false;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) {
        hasTransparency = true;
        break;
      }
    }

    showWhiteBackground.value = hasTransparency;
  } catch (error) {
    // If canvas check fails, assume it has transparency for PNG files
    showWhiteBackground.value = true;
  }
};

// Handle window resize to recalculate image size
const handleResize = () => {
  // Trigger style recalculation
  if (isModalOpen.value) {
    nextTick(() => {
      // Force reactivity update
      const temp = imageWidth.value;
      imageWidth.value = 0;
      nextTick(() => {
        imageWidth.value = temp;
      });
    });
  }
};

// Close modal on escape key
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === "Escape" && isModalOpen.value) {
      closeModal();
    }
  };

  window.addEventListener("keydown", handleEscape);
  window.addEventListener("resize", handleResize);

  onUnmounted(() => {
    window.removeEventListener("keydown", handleEscape);
    window.removeEventListener("resize", handleResize);
    // Ensure body scroll is restored if component is unmounted while modal is open
    document.body.style.overflow = "";
  });
});

// Clean up on unmount
onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
/* Modal transition effects */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  backdrop-filter: blur(4px);
}

/* Image animation */
.modal-enter-active img,
.modal-leave-active img {
  transition: all 0.3s ease;
}

.modal-enter-from img,
.modal-leave-to img {
  opacity: 0;
  transform: scale(0.9);
}

.modal-enter-to img,
.modal-leave-from img {
  opacity: 1;
  transform: scale(1);
}

/* Focus styles */
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Ensure modal content doesn't interfere with scrolling */
.fixed {
  overscroll-behavior: contain;
}

/* Custom focus ring */
.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
    var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow, 0 0 #0000);
}

.focus\:ring-white:focus {
  --tw-ring-color: rgb(255 255 255);
}

.focus\:ring-opacity-50:focus {
  --tw-ring-opacity: 0.5;
}
</style>
