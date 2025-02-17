<template>
  <div>
    <HeaderBar variant="white" />

    <div class="pt-16 min-h-screen bg-light-page-background">
      <div class="max-w-6xl mx-auto px-4">
        <div class="py-4">
          <NuxtLink
            to="/database"
            class="inline-flex items-center text-light-page-text-dark hover:underline"
          >
            <i class="pi pi-arrow-left"></i>
            ← Back to List
          </NuxtLink>
        </div>

        <div v-if="item" class="py-2">
          <div class="rounded-3xl bg-blue-200 p-8">
            <div class="pb-6 relative">
              <img
                :src="getImageUrl(item.Image)"
                alt=""
                class="mb-4 w-full object-cover h-80 rounded-xl"
              />
              <div class="flex items-center pb-4">
                <h2 class="text-5xl font-semibold text-black mr-5">
                  {{ item.title }}
                </h2>
                <div
                  v-if="item.isFavourite"
                  class="bg-accent-extra text-light-page-text-dark text-md px-6 py-1 rounded-full cursor-default"
                >
                  our favourite
                </div>
              </div>
              <p class="w-full break-words">
                <!-- Placeholder text -->
                sfgusfsfhieo unfeyfhfyifh8y3ufhb jhgfh feyifehfysufhbjshfs
                sfgusfsfhieo unfeyfhfyifh8y3ufhb jhgfh feyifehfysufhbjshfs
                sfgusfsfhieo unfeyfhfyifh8y3ufhb jhgfh feyifehfysufhbjshfs
                sfgusfsfhieo unfeyfhfyifh8y3ufhb jhgfh feyifehfysufhbjshfs
                sfgusfsfhieo unfeyfhfyifh8y3ufhb jhgfh feyifehfysufhbjshfs
                sfgusfsfhieo unfeyfhfyifh8y3ufhb jhgfh feyifehfysufhbjshfs
                sfgusfsfhieo unfeyfhfyifh8y3ufhb jhgfh feyifehfysufhbjshfs
              </p>
            </div>
          </div>

          <!-- Gallery -->
          <div class="py-8">
            <Galleria
              :value="item.images"
              :showThumbnails="false"
              :showIndicators="true"
              class="w-full rounded-3xl overflow-hidden"
            >
              <template #item="slotProps">
                <img
                  :src="slotProps.item"
                  :alt="item.title"
                  class="w-full h-[416px] object-cover"
                />
              </template>
            </Galleria>
          </div>

          <!-- Specifications -->
          <div class="p-8 mb-8 bg-gray-100 rounded-3xl">
            <div>
              <h2 class="text-lg font-semibold">Specifications</h2>
            </div>
            <Divider />
            <div class="flex flex-col gap-4 pt-4">
              <div v-for="(spec, key) in specifications" :key="key">
                <div class="font-bold text-sm text-light-page-text-light">
                  {{ key }}
                </div>
                <div
                  class="flex bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
                >
                  <span
                    v-for="option in spec.options"
                    :key="option"
                    class="flex-1 text-center px-4 py-1 rounded-full transition-all"
                    :class="{
                      'bg-blue-200 text-blue-500 font-semibold':
                        item[spec.field] === option,
                      'text-gray-500': item[spec.field] !== option,
                    }"
                    >{{ option }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import HeaderBar from "~/components/layout/HeaderBar.vue";
import Galleria from "primevue/galleria";
import Divider from "primevue/divider";

const route = useRoute();
const item = ref(null);

const getImageUrl = (image: any) => {
  if (!image) {
    return "";
  }

  // Try to get medium format first, then small, then original
  const imageUrl =
    image.formats?.medium?.url || image.formats?.small?.url || image.url;

  return `https://aiupd8-backend-production.up.railway.app${imageUrl}`;
};

const specifications = {
  use: { field: "use", options: ["no-code", "low-code", "code"] },
  setup: { field: "setup", options: ["no-code", "low-code", "code"] },
  pricing: {
    field: "pricing",
    options: ["free", "freemium", "subscription", "credits"],
  },
  license: { field: "license", options: ["personal", "commercial"] },
  "average time": {
    field: "averageTimeToGenerate",
    options: ["seconds", "minutes", "hours", "days"],
  },
};

onMounted(async () => {
  const { fetchToolById } = useDatabase();
  item.value = await fetchToolById(route.params.id);

  // Placeholder images
  if (item.value) {
    item.value.images = [
      "/images/midjourney.jpeg",
      "/images/midi.jpeg",
      "/images/midjourney2.jpeg",
    ];
  }
});
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
</style>
