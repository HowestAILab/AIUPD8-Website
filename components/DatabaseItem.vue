<template>
  <Card>
    <template #header>
      <div class="pt-5 px-5">
        <div class="relative">
          <img
            :src="getImageUrl(item.Image)"
            alt=""
            class="w-full object-cover h-48 rounded-md"
          />
          <div class="">
            <div
              v-if="item.isFavourite"
              class="absolute top-2 right-2 bg-accent-extra text-light-page-text-dark text-xs px-4 py-1 rounded-full"
            >
              our favourite
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #title>
      <div class="flex justify-between">
        <h3 class="text-xl font-semibold">{{ item.title }}</h3>
        <button
          @click="openModal"
          class="bg-black text-white text-sm font-semibold rounded-full px-4 py-1"
        >
          see more
        </button>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4 text-sm text-light-page-text-light">
        <div v-for="(options, key) in selections" :key="key">
          <span class="font-bold">{{ key }}</span>
          <div
            class="flex bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
          >
            <span
              v-for="option in options"
              :key="option"
              class="flex-1 text-center px-4 py-1 rounded-full transition-all"
              :class="{
                'bg-blue-200 text-blue-500 font-semibold':
                  selected[key] === option && selected[key] !== null,
                'text-gray-500':
                  selected[key] !== option || selected[key] === null,
              }"
            >
              {{ option }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="pt-6 flex items-center justify-between">
        <label
          class="flex items-center text-sm text-light-page-text-light space-x-2 cursor-pointer"
        >
          <input type="checkbox" v-model="compareChecked" />
          <span>Add to comparison</span>
        </label>
      </div>
    </template>
  </Card>
  <ToolModal ref="modalRef" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Card from "primevue/card";
import ToolModal from "./ToolModal.vue";
import { useRuntimeConfig } from "#app";

const selections = ref({
  use: ["no-code", "low-code", "code"],
  setup: ["no-code", "low-code", "code"],
  pricing: ["free", "freemium", "subscription", "credits"],
});

const selected = ref({
  use: null,
  setup: null,
  pricing: null,
});

// Props
interface DBItem {
  id: number;
  documentId: string;
  title: string;
  description: string;
  Image: {
    formats: {
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
    url: string;
  };
  isFavorite?: boolean;
  use?: string;
  setup?: string;
  pricing?: string;
  license?: string;
  averageTimeToGenerate?: string;
}

const props = defineProps<{
  item: DBItem;
}>();

const compareChecked = ref(false);

const modalRef = ref();

function openModal() {
  modalRef.value.open(props.item);
}

const config = useRuntimeConfig();

const getImageUrl = (image: any) => {
  if (!image) {
    return "";
  }

  const imageUrl =
    image.formats?.medium?.url || image.formats?.small?.url || image.url;

  return `${config.public.dbUrl}${imageUrl}`;
};

// Remove or comment out the old seeMore function
// function seeMore(item: DBItem) {
//   alert(`See more about ${item.title}`);
// }

// Initialize selected values based on item prop
onMounted(() => {
  selected.value = {
    use: props.item.use || "no-code",
    setup: props.item.setup || "no-code",
    pricing: props.item.pricing || "subscription",
  };
});

// Watch for changes in item prop and update selected values
watch(
  () => props.item,
  (newItem) => {
    selected.value = {
      use: newItem.use || "no-code",
      setup: newItem.setup || "no-code",
      pricing: newItem.pricing || "subscription",
    };
  },
  { deep: true }
);
</script>
