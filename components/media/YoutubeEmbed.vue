<template>
  <div class="w-full">
    <iframe
      v-if="videoId"
      class="w-full aspect-video rounded-lg shadow-lg"
      :src="`https://www.youtube.com/embed/${videoId}`"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script setup>
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});

const videoId = computed(() => {
  if (!props.url) return null;
  // Standard YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
  const urlParams = new URLSearchParams(new URL(props.url).search);
  if (urlParams.has("v")) {
    return urlParams.get("v");
  }
  // Shortened YouTube URL: https://youtu.be/VIDEO_ID
  const match = props.url.match(/youtu\.be\/([^?]+)/);
  if (match) {
    return match[1];
  }
  return null;
});
</script>
