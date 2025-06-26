<template>
  <div class="portable-text">
    <template v-for="(block, index) in blocks" :key="index">
      <!-- Handle standard text blocks -->
      <component
        :is="getBlockComponent(block)"
        :class="getBlockClass(block)"
        v-if="block._type === 'block'"
      >
        <template v-for="(span, i) in block.children" :key="i">
          <!-- Handle spans with marks (formatting) -->
          <span v-if="span._type === 'span'" :class="getSpanClasses(span)">
            {{ span.text }}
          </span>
        </template>
      </component>

      <!-- Handle custom: Tool Embed -->
      <ToolEmbed
        v-else-if="block._type === 'toolEmbed' && block.tool"
        :tool="block.tool"
      />

      <!-- Handle custom: YouTube Embed -->
      <YoutubeEmbed
        v-else-if="block._type === 'youtube' && block.url"
        :url="block.url"
      />

      <!-- Handle image blocks -->
      <div v-else-if="block._type === 'image'" class="my-4">
        <img
          :src="getSanityImageUrl(block)"
          alt="Content image"
          class="max-w-full rounded"
        />
      </div>

      <!-- Fallback for other block types to avoid showing raw JSON -->
      <div v-else-if="isDevelopment" class="my-2 p-2 bg-red-100 text-red-700 rounded">
        <p class="font-bold">Unknown block type: {{ block._type }}</p>
        <pre class="text-xs">{{ JSON.stringify(block, null, 2) }}</pre>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useMedia } from "~/composables/useMedia";
import ToolEmbed from '~/components/ToolEmbed.vue';
import YoutubeEmbed from '~/components/YoutubeEmbed.vue';

const { getSanityImageUrl } = useMedia();

const isDevelopment = process.env.NODE_ENV === 'development';

const props = defineProps({
  blocks: {
    type: Array,
    default: () => [],
  },
});

// Map Sanity block styles to HTML elements
function getBlockComponent(block) {
  if (!block.style) return "p";

  switch (block.style) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "blockquote":
      return "blockquote";
    case "normal":
      return "p";
    default:
      return "p";
  }
}

// Map Sanity block styles to CSS classes
function getBlockClass(block) {
  if (!block.style) return "mb-4";

  switch (block.style) {
    case "h1":
      return "text-3xl font-bold mb-4";
    case "h2":
      return "text-2xl font-bold mb-3";
    case "h3":
      return "text-xl font-bold mb-2";
    case "h4":
      return "text-lg font-bold mb-2";
    case "blockquote":
      return "border-l-4 pl-4 italic my-4";
    case "normal":
      return "mb-4";
    default:
      return "mb-4";
  }
}

// Handle text styling from marks
function getSpanClasses(span) {
  if (!span.marks || span.marks.length === 0) return "";

  const classes = [];

  if (span.marks.includes("strong")) classes.push("font-bold");
  if (span.marks.includes("em")) classes.push("italic");
  if (span.marks.includes("underline")) classes.push("underline");
  if (span.marks.includes("code"))
    classes.push("font-mono bg-gray-100 px-1 rounded");

  return classes.join(" ");
}
</script>

<style scoped>
.portable-text :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

.portable-text :deep(ul) {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.portable-text :deep(ol) {
  list-style-type: decimal;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}
</style>
