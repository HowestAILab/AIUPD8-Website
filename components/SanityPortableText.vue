<template>
  <div class="portable-text">
    <template v-for="(block, index) in processedBlocks" :key="index">
      <!-- Handle lists -->
      <component
        :is="block.listItem === 'bullet' ? 'ul' : 'ol'"
        v-if="block._type === 'list'"
        :class="{
          'list-disc': block.listItem === 'bullet',
          'list-decimal': block.listItem === 'number',
          'ml-5': block.level > 1,
        }"
        class="pl-5 mb-4"
      >
        <li v-for="(item, i) in block.children" :key="i" class="mb-2">
          <template v-for="(span, j) in item.children" :key="j">
            <span v-if="span._type === 'span'" :class="getSpanClasses(span)">
              {{ span.text }}
            </span>
          </template>
        </li>
      </component>

      <!-- Handle standard text blocks (but not list items) -->
      <component
        :is="getBlockComponent(block)"
        :class="getBlockClass(block)"
        v-else-if="block._type === 'block' && !block.listItem"
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
      <div v-else-if="isDevelopment && block._type !== 'block'" class="my-2 p-2 bg-red-100 text-red-700 rounded">
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
import { computed } from "vue";

const { getSanityImageUrl } = useMedia();

const isDevelopment = process.env.NODE_ENV === 'development';

const props = defineProps({
  blocks: {
    type: Array,
    default: () => [],
  },
});

const processedBlocks = computed(() => {
  if (!props.blocks) return [];

  const groups = [];
  let currentList = null;

  for (const block of props.blocks) {
    if (block._type === 'block' && block.listItem) {
      const level = block.level || 1;
      if (!currentList) {
        // Start a new list
        currentList = {
          _type: 'list',
          listItem: block.listItem, // 'bullet' or 'number'
          level: level,
          children: [block],
        };
      } else if (block.listItem === currentList.listItem && level === currentList.level) {
        // Add to current list
        currentList.children.push(block);
      } else {
        // Different list type or level, push the old list and start a new one
        groups.push(currentList);
        currentList = {
          _type: 'list',
          listItem: block.listItem,
          level: level,
          children: [block],
        };
      }
    } else {
      // Not a list item, push any existing list and then the current block
      if (currentList) {
        groups.push(currentList);
        currentList = null;
      }
      groups.push(block);
    }
  }

  // Push the last list if it exists
  if (currentList) {
    groups.push(currentList);
  }

  return groups;
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
