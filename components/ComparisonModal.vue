<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    header="Comparison"
    class="w-full md:w-3/4"
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h2 class="font-semibold text-xl">Comparison</h2>
      </div>
    </template>
    <div>
      <div v-if="comparisonItems.length === 0" class="text-center py-8">
        <p>No tools selected for comparison.</p>
        <p class="text-sm text-gray-500 mt-2">
          Add tools to compare by checking "add to comparison" in the tool
          details.
        </p>
      </div>

      <div class="comparison-container px-8 pb-8 bg-gray-100 relative">
        <!-- Mobile scroll indicators -->
        <div class="md:hidden">
          <div class="scroll-indicator scroll-indicator-left">
            <i class="pi pi-chevron-left"></i>
          </div>
          <div class="scroll-indicator scroll-indicator-right">
            <i class="pi pi-chevron-right"></i>
          </div>
        </div>

        <!-- Tools grid for comparison -->
        <div class="flex overflow-x-auto gap-8 snap-x pt-6">
          <div
            v-for="(item, index) in comparisonItems"
            :key="index"
            class="flex-shrink-0 snap-start w-[95%] md:w-[31%]"
          >
            <!-- Top section -->
            <div class="rounded-3xl bg-blue-100 overflow-hidden mb-4">
              <!-- Header section -->
              <div class="p-6 pb-4 relative">
                <div
                  v-if="item.isFavourite"
                  class="absolute top-4 right-4 bg-red-200 text-black text-xs px-4 py-1 rounded-full"
                >
                  our favourite
                </div>
                <h2 class="text-3xl font-semibold text-black mb-4">
                  {{ item.title }}
                </h2>
                <div
                  class="w-full break-words rich-text-content line-clamp-3 text-sm"
                  v-html="parseRichText(item.description)"
                ></div>
              </div>

              <!-- Input/Output section -->
              <div class="px-6 pb-4 grid grid-cols-2 gap-4">
                <div v-if="item.inputs && item.inputs.length > 0">
                  <div class="mb-2 font-medium text-sm">input type</div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="input in item.inputs"
                      :key="input"
                      class="px-4 py-1 bg-white text-gray-600 rounded-full text-sm"
                    >
                      {{ input }}
                    </span>
                  </div>
                </div>
                <div v-if="item.tasks && item.tasks.length > 0">
                  <div class="mb-2 font-medium text-sm">specific task</div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="task in item.tasks"
                      :key="task"
                      class="px-4 py-1 bg-white text-gray-600 rounded-full text-sm"
                    >
                      {{ task }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="px-6 pb-6 grid grid-cols-2 gap-4">
                <div v-if="item.outputs && item.outputs.length > 0">
                  <div class="mb-2 font-medium text-sm">output type</div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="output in item.outputs"
                      :key="output"
                      class="px-4 py-1 bg-white text-gray-600 rounded-full text-sm"
                    >
                      {{ output }}
                    </span>
                  </div>
                </div>
                <div v-if="item.profiles && item.profiles.length > 0">
                  <div class="mb-2 font-medium text-sm">profile</div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="profile in item.profiles"
                      :key="profile"
                      class="px-4 py-1 bg-white text-gray-600 rounded-full text-sm"
                    >
                      {{ profile }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Specifications section -->
            <div class="rounded-3xl bg-white p-6">
              <h3 class="text-lg font-medium mb-4">Specifications</h3>

              <!-- Use section remains the same -->
              <div v-if="item.uses && item.uses.length > 0" class="mb-4">
                <div class="font-medium text-sm mb-2">use</div>
                <div
                  class="flex bg-gray-100 rounded-full w-full border border-gray-200"
                >
                  <span
                    v-for="option in ['no-code', 'low-code', 'code']"
                    :key="option"
                    class="flex-1 text-center px-4 py-1 rounded-full text-sm"
                    :class="{
                      'bg-blue-200 text-blue-700': item.uses.includes(option),
                      'text-gray-500': !item.uses.includes(option),
                    }"
                    >{{ option }}</span
                  >
                </div>
              </div>

              <!-- Setup -->
              <div v-if="item.setups && item.setups.length > 0" class="mb-4">
                <div class="font-medium text-sm mb-2">setup</div>
                <div
                  class="flex bg-gray-100 rounded-full w-full border border-gray-200"
                >
                  <span
                    v-for="option in ['no-code', 'low-code', 'code']"
                    :key="option"
                    class="flex-1 text-center px-4 py-1 rounded-full text-sm"
                    :class="{
                      'bg-blue-200 text-blue-700': item.setups.includes(option),
                      'text-gray-500': !item.setups.includes(option),
                    }"
                    >{{ option }}</span
                  >
                </div>
              </div>

              <!-- Pricing -->
              <div
                v-if="item.pricings && item.pricings.length > 0"
                class="mb-4"
              >
                <div class="font-medium text-sm mb-2">pricing</div>
                <div
                  class="flex flex-wrap bg-gray-100 rounded-full w-full border border-gray-200"
                >
                  <span
                    v-for="option in [
                      'free',
                      'freemium',
                      'subscription',
                      'credits',
                    ]"
                    :key="option"
                    class="flex-1 text-center px-2 py-1 rounded-full text-sm"
                    :class="{
                      'bg-blue-200 text-blue-700':
                        item.pricings.includes(option),
                      'text-gray-500': !item.pricings.includes(option),
                    }"
                    >{{ option }}</span
                  >
                </div>
              </div>

              <!-- License -->
              <div
                v-if="item.licenses && item.licenses.length > 0"
                class="mb-4"
              >
                <div class="font-medium text-sm mb-2">license</div>
                <div
                  class="flex bg-gray-100 rounded-full w-full border border-gray-200"
                >
                  <span
                    v-for="option in ['personal', 'commercial']"
                    :key="option"
                    class="flex-1 text-center px-4 py-1 rounded-full text-sm"
                    :class="{
                      'bg-blue-200 text-blue-700':
                        item.licenses.includes(option),
                      'text-gray-500': !item.licenses.includes(option),
                    }"
                    >{{ option }}</span
                  >
                </div>
              </div>

              <!-- Generation Time -->
              <div
                v-if="item.generationTimes && item.generationTimes.length > 0"
                class="mb-4"
              >
                <div class="font-medium text-sm mb-2">
                  average time to generate
                </div>
                <div
                  class="flex bg-gray-100 rounded-full w-full border border-gray-200"
                >
                  <span
                    v-for="option in ['seconds', 'minutes', 'hours', 'days']"
                    :key="option"
                    class="flex-1 text-center px-2 py-1 rounded-full text-sm"
                    :class="{
                      'bg-blue-200 text-blue-700':
                        item.generationTimes.includes(option),
                      'text-gray-500': !item.generationTimes.includes(option),
                    }"
                    >{{ option }}</span
                  >
                </div>
              </div>

              <!-- Action buttons -->
              <div class="mt-6 flex justify-between items-center">
                <button
                  @click="navigateToTool(item.title)"
                  class="bg-black text-white text-sm font-semibold rounded-full px-4 py-1"
                >
                  View Details
                </button>
                <button
                  @click="removeItem(index)"
                  class="px-4 py-2 bg-red-100 text-red-500 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import "primeicons/primeicons.css";
import Dialog from "primevue/dialog";
import { ref } from "vue";
import { useRichText } from "~/composables/useRichText";
import type { ToolItem } from "~/composables/useDatabase";
import { useRouter } from "vue-router";

const visible = ref(false);
const comparisonItems = ref<ToolItem[]>([]);
const { parseRichText } = useRichText();
const router = useRouter();

const open = () => {
  console.log("Opening comparison modal");
  visible.value = true;
};

const addItem = (item: ToolItem) => {
  const exists = comparisonItems.value.some((i) => i.id === item.id);
  if (!exists) {
    comparisonItems.value.push(item);
    console.log(`Added ${item.title} to comparison`);
  }
};

const emit = defineEmits(["item-removed"]);

// Updated removeItem to accept an item or index.
const removeItem = (itemOrIndex: ToolItem | number) => {
  let index: number;
  if (typeof itemOrIndex === "number") {
    index = itemOrIndex;
  } else {
    index = comparisonItems.value.findIndex((i) => i.id === itemOrIndex.id);
  }
  if (index > -1) {
    const removedItem = comparisonItems.value[index];
    comparisonItems.value.splice(index, 1);
    emit("item-removed", removedItem);
  }
};

const clearItems = () => {
  comparisonItems.value = [];
};

const navigateToTool = (id: string) => {
  router.push(`/tools/${id}`);
  visible.value = false;
};

defineExpose({ open, addItem, removeItem, clearItems });
</script>

<style>
.p-dialog-mask {
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, 0.4) !important;
}

.rich-text-content :deep(p) {
  margin-bottom: 0.5rem;
}

.rich-text-content.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.p-dialog {
  border-radius: 1.5rem;
  overflow: hidden;
}

.p-dialog-content {
  padding: 0 !important;
}

.p-dialog-header {
  border-bottom: none !important;
  padding-left: 2rem !important;
  padding-right: 2rem !important;
}

.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}

.scroll-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.scroll-indicator-left {
  left: 10px;
}

.scroll-indicator-right {
  right: 10px;
}

@media (hover: none) {
  .scroll-indicator {
    display: none;
  }
}
</style>
