<template>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <div class="w-full sm:w-48">
      <h3 class="font-semibold">input</h3>
      <MultiSelect
        v-model="filters.input"
        :options="inputOptions"
        placeholder="search"
        :itemTemplate="itemTemplate"
        class="w-full"
      />
    </div>
    <div class="w-full sm:w-48">
      <h3 class="font-semibold">output</h3>
      <MultiSelect
        v-model="filters.output"
        :options="outputOptions"
        placeholder="search"
        :itemTemplate="itemTemplate"
        class="w-full"
      />
    </div>
    <div class="w-full sm:w-48">
      <h3 class="font-semibold">profile</h3>
      <MultiSelect
        v-model="filters.profile"
        :options="profileOptions"
        placeholder="search"
        :itemTemplate="itemTemplate"
        class="w-full"
      />
    </div>
    <div class="w-full sm:w-48">
      <h3 class="font-semibold opacity-0 cursor-default">&nbsp;</h3>
      <Button label="more filters" @click="toggleFilters" />
    </div>
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

const emits = defineEmits(["toggle-filters"]);

const toggleFilters = () => {
  emits("toggle-filters");
};
</script>
