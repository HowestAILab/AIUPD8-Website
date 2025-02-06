<template>
  <div class="flex flex-wrap items-center gap-4">
    <MultiSelect
      v-model="filters.input"
      :options="inputOptions"
      placeholder="Input..."
      :itemTemplate="itemTemplate"
    />
    <MultiSelect
      v-model="filters.output"
      :options="outputOptions"
      placeholder="Output..."
      :itemTemplate="itemTemplate"
    />
    <MultiSelect
      v-model="filters.profile"
      :options="profileOptions"
      placeholder="Profile..."
      :itemTemplate="itemTemplate"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import MultiSelect from "primevue/multiselect";

interface FilterState {
  input: string[];
  output: string[];
  profile: string[];
}

const filters = reactive<FilterState>({
  input: [],
  output: [],
  profile: [],
});

const inputOptions = ["text", "image", "audio"];
const outputOptions = ["text", "image", "audio"];
const profileOptions = ["basic", "advanced"];

function itemTemplate(option: string) {
  const color =
    option === "text"
      ? "blue"
      : option === "image"
      ? "green"
      : option === "audio"
      ? "purple"
      : option === "basic"
      ? "orange"
      : "red";
  return `<span style="color: ${color};">${option}</span>`;
}
</script>
