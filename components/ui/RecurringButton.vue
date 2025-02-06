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
    return "bg-blueBrand text-white px-4 py-2 rounded-full hover:bg-darkBlueBrand";
  } else if (props.variant === "secondary") {
    return "bg-white text-black border border-black px-4 py-2 rounded-full hover:bg-gray-100";
  } else if (props.variant === "neutral") {
    return "bg-black text-white border border-black px-4 py-2 rounded-full hover:bg-blueBrand";
  }
  return "";
});
</script>
