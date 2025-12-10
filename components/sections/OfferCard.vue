<template>
  <div class="w-full flex flex-col h-full">
    <div class="mb-3">
      <h3 class="text-4xl font-semibold text-primary">{{ heading }}</h3>
      <p v-if="subtitle" class="text-md font-medium text-gray-500 mt-1">
        {{ subtitle }}
      </p>
    </div>

    <div class="text-gray-700">
      <SanityPortableText v-if="blocks && blocks.length" :blocks="blocks" />
      <p v-else-if="text">{{ text }}</p>
    </div>

    <div v-if="hasVariants" class="mt-6">
      <!-- <h4 class="text-sm font-medium text-gray-600 mb-2">Available options</h4> -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="(v, i) in variants"
          :key="i"
          class="p-4 bg-white rounded-xl border shadow-sm"
        >
          <p class="font-semibold">{{ v.name }}</p>
          <p v-if="v.description" class="text-sm text-gray-600 mt-1">
            {{ v.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- <div class="mt-6">
      <a :href="mailtoHref" class="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors">
        Contact us
      </a>
    </div> -->

    <!-- <div v-if="imageUrl" class="mt-6">
      <img :src="imageUrl" :alt="imageAlt || heading" class="w-full h-auto rounded-xl object-cover" />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import SanityPortableText from "~/components/content/SanityPortableText.vue";
import { useMedia } from "~/composables/useMedia";
import { useRuntimeConfig } from "#app";

const props = defineProps<{
  heading: string;
  subtitle?: string;
  blocks?: any[];
  text?: string;
  variants?: Array<{ name: string; description?: string }>;
  image?: any; // Sanity image or URL
  imageAlt?: string;
  contactEmail?: string;
  contactSubject?: string;
  serviceType?: string;
}>();

const expanded = ref(false);
const hasVariants = computed(
  () => Array.isArray(props.variants) && props.variants.length > 0
);

const { getSanityImageUrl, getMediaUrl } = useMedia();
const imageUrl = computed(() => {
  if (!props.image) return "";
  if (typeof props.image === "string") return props.image;
  return getSanityImageUrl(props.image) || getMediaUrl(props.image);
});

const config = useRuntimeConfig();
const mailtoHref = computed(() => {
  const email =
    props.contactEmail ||
    (config.public as any).contactEmail ||
    "contact@example.com";
  const subjectBase =
    props.contactSubject ||
    `Inquiry: ${props.serviceType ? props.serviceType + " - " : ""}${
      props.heading
    }`;
  const subject = encodeURIComponent(subjectBase);
  return `mailto:${email}?subject=${subject}`;
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
