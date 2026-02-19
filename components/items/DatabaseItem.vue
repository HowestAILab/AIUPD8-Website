<template>
  <Card :class="{ 'old-tool-card': isToolOld }">
    <template #header>
      <div class="pt-5 px-5">
        <div class="relative">
          <img
            :src="getMediaUrl(item.Image)"
            alt=""
            :class="[
              'w-full object-cover h-48 rounded-md',
              { 'grayscale opacity-70': isToolOld },
            ]"
          />
          <div class="absolute top-2 right-2 flex flex-col gap-1 items-end">
            <FavouriteBadge :favorites="item.favorites" />
          </div>
          <div class="absolute top-2 left-2 flex flex-col gap-1 items-start">
            <OutdatedBadge
              v-if="item.lastChanged && isToolOutdated(item.lastChanged)"
              :last-changed="item.lastChanged"
              :is-outdated="true"
            />
          </div>
          <div class="absolute bottom-2 left-2 flex flex-col gap-1 items-start">
            <ExperimentalBadge v-if="item.isExperimental" />
          </div>
        </div>
      </div>
    </template>
    <template #title>
      <div class="flex justify-between items-start gap-4">
        <div class="w-[80%] min-w-0">
          <h3
            class="text-xl font-semibold truncate whitespace-normal break-words"
          >
            {{ item.title }}
          </h3>
          <p class="text-primary text-sm mt-1">
            <span class="font-bold">{{ item.toolsentence }} </span>
          </p>
        </div>
        <div class="w-[20%] flex items-center justify-end">
          <button
            @click="openModal"
            class="bg-black text-white text-sm font-semibold rounded-full px-4 py-1 whitespace-nowrap"
          >
            {{ t('tool.seeMore') }}
          </button>
        </div>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4 text-sm text-light-page-text-light">
        <!-- Display about text if available 
        <div v-if="item.about" class="mb-4 text-gray-700 line-clamp-3">
          {{ item.about }}
        </div>
        -->

        <div v-if="item.setups && item.setups.length > 0">
          <div class="flex items-center gap-1">
            <span class="font-bold">{{ t('tool.setup') }}</span>
            <!-- Info bubble: only on first card -->
            <div v-if="isFirst" class="relative" ref="setupRef">
              <button
                type="button"
                class="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 text-[8px] font-bold leading-none hover:bg-gray-300 transition-colors"
                @click.stop="activeInfo = activeInfo === 'setup' ? null : 'setup'"
                aria-label="Info over setup"
              >i</button>
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="activeInfo === 'setup'"
                  class="absolute left-0 top-5 w-64 bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2.5 text-xs text-gray-700 z-50 origin-top-left"
                >
                  <p class="font-semibold text-gray-900 mb-2">{{ t('info.setup.title') }}</p>
                  <ul class="space-y-1.5">
                    <li class="flex gap-2"><span class="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-blue-400 inline-block"></span><span><strong>No-code</strong> — {{ t('info.setup.noCode') }}</span></li>
                    <li class="flex gap-2"><span class="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-blue-400 inline-block"></span><span><strong>Low-code</strong> — {{ t('info.setup.lowCode') }}</span></li>
                    <li class="flex gap-2"><span class="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-blue-400 inline-block"></span><span><strong>Code</strong> — {{ t('info.setup.code') }}</span></li>
                  </ul>
                </div>
              </Transition>
            </div>
          </div>
          <div
            class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-2xl md:rounded-full w-full mt-1 border border-gray-200"
          >
            <span
              v-for="option in selections.setup"
              :key="option"
              class="sm:flex-1 basis-1/3 text-center px-4 py-1 rounded-full transition-all"
              :class="{
                'bg-blue-200 text-blue-500 font-semibold':
                  item.setups.includes(option),
                'text-gray-500': !item.setups.includes(option),
              }"
            >
              {{ option }}
            </span>
          </div>
        </div>

        <div v-if="item.uses && item.uses.length > 0">
          <div class="flex items-center gap-1">
            <span class="font-bold">{{ t('tool.use') }}</span>
            <!-- Info bubble: only on first card -->
            <div v-if="isFirst" class="relative" ref="useRef">
              <button
                type="button"
                class="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 text-[8px] font-bold leading-none hover:bg-gray-300 transition-colors"
                @click.stop="activeInfo = activeInfo === 'use' ? null : 'use'"
                aria-label="Info over gebruik"
              >i</button>
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="activeInfo === 'use'"
                  class="absolute left-0 top-5 w-64 bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2.5 text-xs text-gray-700 z-50 origin-top-left"
                >
                  <p class="font-semibold text-gray-900 mb-2">{{ t('info.use.title') }}</p>
                  <ul class="space-y-1.5">
                    <li class="flex gap-2"><span class="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-blue-400 inline-block"></span><span><strong>No-code</strong> — {{ t('info.use.noCode') }}</span></li>
                    <li class="flex gap-2"><span class="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-blue-400 inline-block"></span><span><strong>Low-code</strong> — {{ t('info.use.lowCode') }}</span></li>
                    <li class="flex gap-2"><span class="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-blue-400 inline-block"></span><span><strong>Code</strong> — {{ t('info.use.code') }}</span></li>
                  </ul>
                </div>
              </Transition>
            </div>
          </div>
          <div
            class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-2xl md:rounded-full w-full mt-1 border border-gray-200"
          >
            <span
              v-for="option in selections.use"
              :key="option"
              class="sm:flex-1 basis-1/3 text-center px-4 py-1 rounded-full transition-all"
              :class="{
                'bg-blue-200 text-blue-500 font-semibold':
                  item.uses.includes(option),
                'text-gray-500': !item.uses.includes(option),
              }"
            >
              {{ option }}
            </span>
          </div>
        </div>

        <div v-if="item.pricings && item.pricings.length > 0">
          <div class="flex items-center gap-1">
            <span class="font-bold">{{ t('tool.pricing') }}</span>
            <!-- Info bubble: only on first card -->
            <div v-if="isFirst" class="relative" ref="pricingRef">
              <button
                type="button"
                class="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 text-[8px] font-bold leading-none hover:bg-gray-300 transition-colors"
                @click.stop="activeInfo = activeInfo === 'pricing' ? null : 'pricing'"
                aria-label="Info over prijs"
              >i</button>
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="activeInfo === 'pricing'"
                  class="absolute left-0 top-5 w-64 bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2.5 text-xs text-gray-700 z-50 origin-top-left"
                >
                  <p class="font-semibold text-gray-900 mb-2">{{ t('info.pricing.title') }}</p>
                  <ul class="space-y-1.5">
                    <li class="flex gap-2"><span class="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-blue-400 inline-block"></span><span><strong>Free</strong> — {{ t('info.pricing.free') }}</span></li>
                    <li class="flex gap-2"><span class="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-blue-400 inline-block"></span><span><strong>Subscription</strong> — {{ t('info.pricing.subscription') }}</span></li>
                    <li class="flex gap-2"><span class="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-blue-400 inline-block"></span><span><strong>Credits</strong> — {{ t('info.pricing.credits') }}</span></li>
                  </ul>
                </div>
              </Transition>
            </div>
          </div>
          <div
            class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-2xl md:rounded-full w-full mt-1 border border-gray-200"
          >
            <span
              v-for="option in selections.pricing"
              :key="option"
              class="flex-1 basis-1/3 text-center py-1 rounded-full transition-all"
              :class="{
                'bg-blue-200 text-blue-500 font-semibold':
                  item.pricings.includes(option),
                'text-gray-500': !item.pricings.includes(option),
              }"
            >
              {{ option }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div
        v-if="props.showComparison"
        class="pt-6 flex items-center justify-between"
      >
        <label
          class="flex items-center text-sm text-light-page-text-light space-x-2 cursor-pointer"
        >
          <input
            type="checkbox"
            :checked="isInComparison"
            @change="handleCompareChange"
          />
          <span>{{ t('tool.addToComparison') }}</span>
        </label>
      </div>
    </template>
  </Card>
  <ToolModal
    ref="modalRef"
    :items-in-comparison="itemsInComparison"
    @add-to-comparison="handleAddToComparison"
    @remove-from-comparison="handleRemoveFromComparison"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import Card from "primevue/card";
import ToolModal from "~/components/modals/ToolModal.vue";
import FavouriteBadge from "~/components/ui/FavouriteBadge.vue";
import OutdatedBadge from "~/components/ui/OutdatedBadge.vue";
import ExperimentalBadge from "~/components/ui/ExperimentalBadge.vue";
import SanityPortableText from "~/components/content/SanityPortableText.vue";
import { useMedia } from "~/composables/useMedia";
import type { ToolItem } from "~/composables/useDatabase";
import { defaultSelectionOrder } from "~/config/selectionOrder";
import { useTranslations } from "~/composables/i18n";

const { t } = useTranslations();

const { getMediaUrl } = useMedia();
const modalRef = ref(null);

// Use config from selectionOrder to allow easy reordering
const selections = ref({
  use: defaultSelectionOrder.use,
  setup: defaultSelectionOrder.setup,
  pricing: defaultSelectionOrder.pricing,
});

interface Props {
  item: ToolItem;
  itemsInComparison?: Set<number>;
  showComparison?: boolean;
  /** When true, info bubbles are shown next to setup/use/pricing labels */
  isFirst?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showComparison: true,
  isFirst: false,
});

// Which info tooltip is open: 'setup' | 'use' | 'pricing' | null
const activeInfo = ref<'setup' | 'use' | 'pricing' | null>(null);
const setupRef = ref<HTMLElement | null>(null);
const useRef = ref<HTMLElement | null>(null);
const pricingRef = ref<HTMLElement | null>(null);

function handleOutsideClick(e: MouseEvent) {
  const target = e.target as Node;
  const inSetup = setupRef.value?.contains(target);
  const inUse = useRef.value?.contains(target);
  const inPricing = pricingRef.value?.contains(target);
  if (!inSetup && !inUse && !inPricing) {
    activeInfo.value = null;
  }
}
onMounted(() => document.addEventListener('click', handleOutsideClick));
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick));

const isInComparison = computed(() => {
  return props.itemsInComparison?.has(props.item.id) || false;
});

const emit = defineEmits(["add-to-comparison", "remove-from-comparison"]);

function handleCompareChange(event) {
  if (event.target.checked) {
    emit("add-to-comparison", props.item);
  } else {
    emit("remove-from-comparison", props.item);
  }
}

function handleAddToComparison(item) {
  emit("add-to-comparison", item);
}

function handleRemoveFromComparison(item) {
  emit("remove-from-comparison", item);
}

function openModal() {
  modalRef.value.open(props.item);
}

// Control whether to show description in card (optional)
const showDescription = ref(false);

// Check if tool is outdated (> 5 months)
function isToolOutdated(lastChangedDate: string): boolean {
  if (!lastChangedDate) return false;
  const lastChanged = new Date(lastChangedDate);
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
  return lastChanged < fiveMonthsAgo;
}

// Check if tool is older than 1 year
function isToolOlderThanOneYear(dateAdded: string): boolean {
  if (!dateAdded) return false;
  const added = new Date(dateAdded);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return added < oneYearAgo;
}

// Computed to check if this tool is old
const isToolOld = computed(() =>
  isToolOlderThanOneYear(props.item.dateAdded || "")
);
</script>

<style scoped>
.old-tool-card {
  opacity: 0.85;
  border: 1px solid #e0e0e0 !important;
  background-color: #fafafa;
}

.old-tool-card:hover {
  opacity: 1;
}
</style>
