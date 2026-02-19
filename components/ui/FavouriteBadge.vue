<template>
  <div
    v-if="hasFavourites"
    class="text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm"
    :style="{ background: generateGradient() }"
    :title="tooltipText"
  >
    {{ t('tool.favourite') }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { projectConfigs, getProjectColor } from "~/config/projects";
import { useProjectProfile } from "~/composables/useProjectProfile";
import { useTranslations } from "~/composables/i18n";

const { t } = useTranslations();

interface Props {
  favorites?: Record<string, boolean>;
}

interface ProjectWithConfig {
  id: string;
  name?: string;
  color?: string;
  profile?: {
    name: string;
    description: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  favorites: () => ({}),
});

const { activeProjectId } = useProjectProfile();

// Get projects that marked this tool as favorite
// Filter by active project when a specific project is selected
const favouriteProjects = computed(() => {
  if (!props.favorites) return [];

  let projectEntries = Object.entries(props.favorites).filter(
    ([_, isFav]) => isFav
  );

  // If a specific project is selected (not general), only show that project's favorite
  if (activeProjectId.value && activeProjectId.value !== "general") {
    projectEntries = projectEntries.filter(
      ([projectId, _]) => projectId === activeProjectId.value
    );
  }

  return projectEntries
    .map(([projectId, _]) => {
      const config = projectConfigs.find((p) => p.id === projectId);
      return { id: projectId, ...config };
    })
    .filter((p): p is ProjectWithConfig => p && p.id !== "general") // Exclude general project
    .sort((a, b) => a.id.localeCompare(b.id));
});

// Check if tool has any favorites
const hasFavourites = computed(() => favouriteProjects.value.length > 0);

// Count of favorite projects
const favoriteCount = computed(() => favouriteProjects.value.length);

// Tooltip text showing which projects favorited this tool
const tooltipText = computed(() => {
  return (
    favouriteProjects.value
      .map((p: ProjectWithConfig) => `${p.profile?.name}`)
      .join(", ") + " marked as favourite"
  );
});

/**
 * Generate CSS gradient for the badge based on favorite projects
 * Shows a linear gradient divided among favorite projects by color
 */
function generateGradient(): string {
  const projects = favouriteProjects.value;

  if (projects.length === 0) {
    return "#e5e7eb"; // gray-200 if no favorites
  }

  if (projects.length === 1) {
    // Single project: solid color
    return getProjectColor(projects[0].id);
  }

  // Multiple projects: create linear gradient
  const colors = projects.map((project: ProjectWithConfig) =>
    getProjectColor(project.id)
  );

  // Create smooth gradient transitions
  return `linear-gradient(135deg, ${colors.join(", ")})`;
}
</script>
