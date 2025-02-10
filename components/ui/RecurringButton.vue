<!-- components/RecurringButton.vue -->
<template>
  <div :class="customClasses" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  variant: {
    type: String,
    default: "primary",
  },
});

const customClasses = computed(() => {
  if (props.variant === "primary") {
    return "bg-main text-light-page-text-dark px-4 py-2 rounded-full hover:bg-light-page-accent";
  } else if (props.variant === "secondary") {
    return "bg-light-page-text-dark text-light-page-background border border-light-page-text-dark px-4 py-2 rounded-full hover:bg-main";
  } else if (props.variant === "neutral") {
    return "bg-light-page-text-dark text-light-page-background border border-light-page-text-dark px-4 py-2 rounded-full hover:bg-main";
  }
  return "";
});
</script>
