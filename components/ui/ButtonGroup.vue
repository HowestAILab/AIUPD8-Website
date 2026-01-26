<template>
  <div class="flex flex-wrap gap-2 w-full">
    <button
      v-for="option in options"
      :key="getOptionValue(option)"
      @click="toggleSelection(option)"
      class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors border"
      :class="[
        isSelected(option)
          ? 'bg-main text-white border-main'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200',
      ]"
    >
      {{ getOptionLabel(option) }}
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
    default: "label",
  },
  optionValue: {
    type: String,
    default: "value",
  },
  multiple: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

// Get the value from an option (handle both object and string formats)
const getOptionValue = (option: any): string => {
  if (typeof option === 'string') return option;
  return props.optionValue ? option[props.optionValue] : option[props.optionLabel];
};

// Get the label from an option (handle both object and string formats)
const getOptionLabel = (option: any): string => {
  if (typeof option === 'string') return option;
  return option[props.optionLabel];
};

// Check if an option is selected (v3.0 - now works with string arrays)
const isSelected = (option: any): boolean => {
  const optionValue = getOptionValue(option);
  return props.modelValue.includes(optionValue);
};

// Toggle selection (v3.0 - now emits string values)
const toggleSelection = (option: any): void => {
  const optionValue = getOptionValue(option);
  let newValue;

  if (props.multiple) {
    newValue = [...props.modelValue];
    const index = newValue.indexOf(optionValue);

    if (index !== -1) {
      newValue.splice(index, 1);
    } else {
      newValue.push(optionValue);
    }
  } else {
    // Single selection mode
    newValue = isSelected(option) ? [] : [optionValue];
  }

  emit("update:modelValue", newValue);
};
</script>
