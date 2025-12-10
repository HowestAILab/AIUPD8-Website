<template>
  <div v-if="carouselItems.length > 0">
    <Galleria
      :value="carouselItems"
      :showThumbnails="false"
      :showIndicators="true"
      class="w-full rounded-3xl overflow-hidden"
      ref="galleriaRef"
      @swipeleft="onSwipeLeft"
      @swiperight="onSwipeRight"
    >
      <template #item="slotProps">
        <div
          v-if="slotProps.item.type === 'youtube'"
          class="video-container w-full"
        >
          <div class="relative pt-[56.25%]">
            <iframe
              :src="getYoutubeEmbedUrl(slotProps.item.url)"
              frameborder="0"
              allowfullscreen
              class="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </div>
        <div v-else>
          <img
            :src="getMediaUrl(slotProps.item)"
            :alt="title"
            class="w-full h-[40vw] max-h-[416px] min-h-[200px] object-cover"
          />
        </div>
      </template>
    </Galleria>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import Galleria from "primevue/galleria";
import { useMedia } from "~/composables/useMedia";

const props = defineProps({
  title: { type: String, required: true },
  showcaseImages: { type: Array, default: () => [] },
  youtubeLink: { type: String, default: "" },
});

const { getMediaUrl, getYoutubeEmbedUrl } = useMedia();
const galleriaRef = ref();

const carouselItems = computed(() => {
  const slides = props.showcaseImages ? [...props.showcaseImages] : [];
  if (props.youtubeLink) {
    slides.push({ type: "youtube", url: props.youtubeLink });
  }
  return slides;
});

function preloadImages(items: Array<any>) {
  if (!items || items.length === 0) return;
  items.forEach((media) => {
    if (media && media.type !== "youtube") {
      try {
        const url = getMediaUrl(media);
        const img = new Image();
        img.decoding = "async" as any;
        img.loading = "eager" as any;
        img.src = url;
        if (img.decode) {
          img.decode().catch(() => {});
        }
      } catch (_) {
        // ignore preload errors
      }
    }
  });
}

onMounted(() => {
  preloadImages(carouselItems.value);
});

watch(
  () => carouselItems.value,
  (newItems) => {
    preloadImages(newItems);
  },
  { immediate: false }
);

function onSwipeLeft() {
  if (galleriaRef.value) galleriaRef.value.next();
}
function onSwipeRight() {
  if (galleriaRef.value) galleriaRef.value.prev();
}
</script>

<style scoped>
.p-galleria {
  border: none !important;
  border-radius: 1.5rem !important;
  overflow: hidden;
}
.p-galleria .p-galleria-content,
.p-galleria .p-galleria-item-wrapper,
.p-galleria .p-galleria-item,
.p-galleria-item-container {
  border-radius: 1.5rem !important;
  overflow: hidden;
}
.p-galleria-item img {
  border-radius: 1.5rem !important;
}
.video-container {
  max-width: 100%;
  margin: 0 auto;
}
.video-container .relative {
  background-color: #000;
}
</style>
