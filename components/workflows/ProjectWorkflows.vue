<template>
  <div
    class="project-workflows"
    :class="{ 'bg-gray-50 rounded-2xl p-6': !hideHeader }"
  >
    <!-- Header (conditionally shown) -->
    <div v-if="!hideHeader" class="flex items-center justify-between mb-6">
      <h3 class="text-2xl font-semibold text-gray-900">
        Workflows for {{ projectName }}
      </h3>
      <div
        v-if="activeProject"
        class="px-3 py-1.5 rounded-full text-sm font-semibold"
        :style="{
          backgroundColor: `${projectColor}20`,
          color: projectColor,
        }"
      >
        {{ projectName }}
      </div>
    </div>

    <!-- No workflows message -->
    <div
      v-if="!hasWorkflows"
      class="bg-white rounded-xl p-8 text-center border border-gray-200"
    >
      <div
        class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
        :style="{ backgroundColor: `${projectColor}20` }"
      >
        <svg
          class="w-8 h-8"
          :style="{ color: projectColor }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
      <p class="text-gray-900 font-semibold mb-2">
        No workflows available for {{ projectName }}
      </p>
      <p class="text-gray-600 text-sm">
        This tool doesn't have specific workflows for {{ projectName }} yet.
        <span v-if="hasOtherProjectWorkflows" class="block mt-2">
          Try checking other profiles for workflows.
        </span>
      </p>
    </div>

    <!-- Workflows List (Expandable Accordion) -->
    <div v-else class="space-y-4">
      <div
        v-for="workflow in currentWorkflows"
        :key="workflow._key"
        class="bg-white border-2 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
        :style="{ borderColor: `${projectColor}40` }"
      >
        <!-- Workflow Header (Clickable) -->
        <div
          class="p-4 cursor-pointer flex items-center justify-between"
          :class="{
            'border-b-2': expandedWorkflow === workflow._key,
          }"
          :style="{
            borderBottomColor:
              expandedWorkflow === workflow._key ? `${projectColor}40` : '',
          }"
          @click="toggleWorkflow(workflow._key)"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :style="{ backgroundColor: `${projectColor}20` }"
            >
              <svg
                class="w-5 h-5"
                :style="{ color: projectColor }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900">{{ workflow.name }}</h4>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs text-gray-500">
                  {{ workflow.steps?.length || 0 }} steps
                </span>
              </div>
            </div>
          </div>
          <svg
            class="w-5 h-5 text-gray-400 transition-transform"
            :class="{ 'rotate-180': expandedWorkflow === workflow._key }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <!-- Workflow Content (Expanded) -->
        <transition name="expand">
          <div v-if="expandedWorkflow === workflow._key" class="p-4 bg-gray-50">
            <!-- Steps -->
            <div class="space-y-3">
              <div
                v-for="step in getSortedSteps(workflow)"
                :key="step._key"
                class="flex gap-3 bg-white rounded-lg p-4 shadow-sm"
              >
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full text-white text-sm flex items-center justify-center font-bold"
                  :style="{ backgroundColor: projectColor }"
                >
                  {{ step.stepNumber }}
                </div>
                <div class="flex-1">
                  <h6 class="font-medium text-gray-900 mb-1">
                    {{ step.title }}
                  </h6>
                  <p
                    v-if="step.shortDescription"
                    class="text-sm text-gray-600 mb-2"
                  >
                    {{ step.shortDescription }}
                  </p>
                  <img
                    v-if="step.image"
                    :src="step.image"
                    :alt="step.imageAlt || step.title"
                    class="rounded-lg max-w-full h-auto shadow-md mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { AiupdateWorkflow } from "~/composables/useDatabase";
import { useProjectProfile } from "~/composables/useProjectProfile";

const props = defineProps<{
  toolId?: string;
  aiupdateWorkflows?: AiupdateWorkflow[];
  psyaidWorkflows?: any[]; // Add other project workflows as needed
  forceProjectId?: string; // Force a specific project view (used by modal selector)
  hideHeader?: boolean; // Hide the header when used inside another container
}>();

const { activeProject, activeProjectId } = useProjectProfile();

// Use forced project ID if provided, otherwise use active project
const effectiveProjectId = computed(
  () => props.forceProjectId || activeProjectId.value
);

// Map project IDs to workflow arrays
const projectWorkflowMap = computed(() => {
  const map: Record<string, any[]> = {};
  if (props.aiupdateWorkflows && props.aiupdateWorkflows.length > 0) {
    map["aiupd8"] = props.aiupdateWorkflows;
  }
  if (props.psyaidWorkflows && props.psyaidWorkflows.length > 0) {
    map["psyaid"] = props.psyaidWorkflows;
  }
  // Add other projects here as they are added
  return map;
});

// Check if there are workflows for other projects
const hasOtherProjectWorkflows = computed(() => {
  const otherProjects = Object.keys(projectWorkflowMap.value).filter(
    (projectId) => projectId !== effectiveProjectId.value
  );
  return otherProjects.length > 0;
});

// Get workflows for the effective project (forced or active)
const currentWorkflows = computed(() => {
  if (!effectiveProjectId.value) return [];
  return projectWorkflowMap.value[effectiveProjectId.value] || [];
});

// Check if there are any workflows for current project
const hasWorkflows = computed(() => currentWorkflows.value.length > 0);

// Get the effective project's color
const projectColor = computed(() => {
  // If forced project ID, get its color from config
  if (props.forceProjectId) {
    const { projects } = useProjectProfile();
    const project = projects.value.find(
      (p: any) => p.id === props.forceProjectId
    );
    return project?.color || "#3B82F6";
  }
  return activeProject.value?.color || "#3B82F6"; // default blue
});

// Get the effective project's name (use profile name for clarity)
const projectName = computed(() => {
  // If forced project ID, get its profile name from config
  if (props.forceProjectId) {
    const { projects } = useProjectProfile();
    const project = projects.value.find(
      (p: any) => p.id === props.forceProjectId
    );
    return project?.profile?.name || project?.name || "Current Project";
  }
  return (
    activeProject.value?.profile?.name ||
    activeProject.value?.name ||
    "Current Project"
  );
});

// Expanded workflow ID
const expandedWorkflow = ref<string | null>(null);

// Toggle workflow expansion
function toggleWorkflow(workflowId: string): void {
  if (expandedWorkflow.value === workflowId) {
    expandedWorkflow.value = null;
  } else {
    expandedWorkflow.value = workflowId;
  }
}

// Sort workflow steps by stepNumber
function getSortedSteps(workflow: AiupdateWorkflow) {
  if (!workflow.steps) return [];
  return [...workflow.steps].sort((a, b) => a.stepNumber - b.stepNumber);
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 2000px;
}
</style>
