<template>
  <div class="project-selector">
    <!-- Compact View -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :style="{ backgroundColor: `${currentProjectColor}20` }"
          >
            <svg
              class="w-5 h-5"
              :style="{ color: currentProjectColor }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider">
              Viewing
            </p>
            <h3 class="font-semibold text-gray-900">
              {{ currentProjectDisplayName }}
            </h3>
          </div>
        </div>

        <!-- Project Switch Dropdown -->
        <div class="flex items-center gap-3">
          <Dropdown
            v-model="localSelectedProject"
            :options="projectOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Project"
            class="w-48"
            @change="handleProjectChange"
          />

          <!-- Info Button -->
          <button
            @click="showProjectInfo = !showProjectInfo"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Project Information"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Expanded Project Info -->
      <transition name="slide">
        <div
          v-if="showProjectInfo && currentProject"
          class="mt-4 pt-4 border-t border-gray-100"
        >
          <p class="text-sm text-gray-600 mb-3">
            {{ currentProject.description }}
          </p>

          <!-- Target Audience Tags -->
          <div
            v-if="
              currentProject.targetAudience.length > 0 &&
              currentProject.id !== 'general'
            "
            class="mb-3"
          >
            <span class="text-xs text-gray-500 uppercase tracking-wider mr-2"
              >For:</span
            >
            <span
              v-for="audience in currentProject.targetAudience.slice(0, 3)"
              :key="audience"
              class="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full mr-1 mb-1"
            >
              {{ audience }}
            </span>
            <span
              v-if="currentProject.targetAudience.length > 3"
              class="text-xs text-gray-500"
            >
              +{{ currentProject.targetAudience.length - 3 }} more
            </span>
          </div>

          <!-- Partner Logos -->
          <div
            v-if="currentProject.logos.length > 0"
            class="flex items-center gap-4"
          >
            <span class="text-xs text-gray-500 uppercase tracking-wider"
              >Partners:</span
            >
            <div class="flex items-center gap-3">
              <img
                v-for="logo in currentProject.logos.slice(0, 4)"
                :key="logo.src"
                :src="logo.src"
                :alt="logo.alt"
                class="h-5 grayscale hover:grayscale-0 transition-all"
              />
            </div>
          </div>

          <!-- Custom Filters Notice -->
          <div
            v-if="hasCustomFilters"
            class="mt-3 p-2 bg-blue-50 rounded-lg text-sm text-blue-700 flex items-center gap-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span
              >This project has {{ customFiltersCount }} additional filters
              available</span
            >
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Dropdown from "primevue/dropdown";
import { useProjectProfile } from "~/composables/useProjectProfile";
import { setProjectFilter } from "~/config/filterHandler";

const route = useRoute();
const router = useRouter();

const {
  projects,
  activeProjects,
  activeProject,
  activeProjectId,
  activeFilterConfig,
  setActiveProject,
} = useProjectProfile();

// Local state
const localSelectedProject = ref<string>(activeProjectId.value);
const showProjectInfo = ref(false);

// Create options for dropdown with profile names
const projectOptions = computed(() => {
  return [
    { label: "General User", value: "general" },
    ...activeProjects.value.map((project: any) => ({
      label: project.profile?.name || project.name,
      value: project.id,
    })),
  ];
});

// Get current project display name (Project Name - Profile Name)
const currentProjectDisplayName = computed(() => {
  if (!activeProject.value || activeProject.value.id === "general") {
    return "General User";
  }
  const projectName = activeProject.value.name;
  const profileName = activeProject.value.profile?.name;
  return profileName ? `${projectName} - ${profileName}` : projectName;
});

// Get current project name (kept for backward compatibility)
const currentProjectName = computed(() => {
  return activeProject.value?.name || "All Tools";
});

// Get current project color
const currentProjectColor = computed(() => {
  return activeProject.value?.color || "#3B82F6";
});

// Get current project details
const currentProject = computed(() => {
  return activeProject.value;
});

// Check if current project has custom filters
const hasCustomFilters = computed(() => {
  return (activeFilterConfig.value?.customFilters?.length || 0) > 0;
});

// Get count of custom filters
const customFiltersCount = computed(() => {
  return activeFilterConfig.value?.customFilters?.length || 0;
});

// Handle project change
function handleProjectChange(): void {
  const newProject = localSelectedProject.value;
  setActiveProject(newProject);
  setProjectFilter(newProject);

  // Update URL with project parameter
  if (newProject === "general") {
    router.push({ path: "/database", query: {} });
  } else {
    router.push({ path: "/database", query: { project: newProject } });
  }
}

// Initialize from URL parameter
onMounted(() => {
  const projectParam = route.query.project as string;
  if (projectParam && projects.value.some((p: any) => p.id === projectParam)) {
    localSelectedProject.value = projectParam;
    setActiveProject(projectParam);
    setProjectFilter(projectParam);
  }
});

// Sync with global state
watch(activeProjectId, (newValue: string) => {
  localSelectedProject.value = newValue;
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  padding-top: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 200px;
}
</style>
