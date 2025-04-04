<template>
  <div class="flex flex-wrap gap-2 w-full">
    <button
      v-for="option in options"
      :key="option[optionLabel]"
      @click="toggleSelection(option)"
      class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors border"
      :class="[
        isSelected(option)
          ? 'bg-main text-white border-main'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200',
      ]"
    >
      {{ option[optionLabel] }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Array,
    default: () => [],
  },
  optionLabel: {
    type: String,
    default: "name",
  },
  optionValue: {
    type: String,
    default: null,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isSelected = (option: any): boolean => {
  return props.modelValue.some(
    (item) => item[props.optionLabel] === option[props.optionLabel]
  );
};

const toggleSelection = (option: any): void => {
  let newValue;

  if (props.multiple) {
    newValue = [...props.modelValue];
    const index = newValue.findIndex(
      (item) => item[props.optionLabel] === option[props.optionLabel]
    );

    if (index !== -1) {
      newValue.splice(index, 1);
    } else {
      newValue.push(option);
    }
  } else {
    // Single selection mode
    newValue = isSelected(option) ? [] : [option];
  }

  emit("update:modelValue", newValue);
};
</script>
