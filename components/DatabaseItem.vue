<template>
  <Card>
    <template #header>
      <div class="pt-5 px-5">
        <div class="relative">
          <img
            :src="item.image || placeholder"
            alt=""
            class="w-full object-cover h-48 rounded-md"
          />
          <div class="">
            <div
              v-if="item.isFavorite"
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
          @click="seeMore(item)"
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
          <div class="flex bg-gray-100 rounded-full w-fit mt-1 border border-gray-200">
            <span
              v-for="option in options"
              :key="option"
              class="px-4 py-1 rounded-full transition-all"
              :class="{
                'bg-blue-200 text-blue-500 font-semibold':
                  selected[key] === option && selected[key] !== null,
                'text-gray-500': selected[key] !== option || selected[key] === null,
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
</template>

<script setup lang="ts">
import { ref, PropType, onMounted, watch } from "vue";
import Card from "primevue/card";

// Just a placeholder image if item.image is not given:
const placeholder = "https://via.placeholder.com/600x400?text=No+Image";

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
  title: string;
  image?: string;
  isFavorite?: boolean;
  use?: string;
  setup?: string;
  pricing?: string;
}

const props = defineProps<{
  item: DBItem;
}>();

const compareChecked = ref(false);

function seeMore(item: DBItem) {
  // Simple stub
  alert(`See more about ${item.title}`);
}

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
