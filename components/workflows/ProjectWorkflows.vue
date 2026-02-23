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
      <WorkflowItem
        v-for="workflow in currentWorkflows"
        :key="workflow._key"
        :workflow="workflow"
        :project-color="projectColor"
        :is-expanded="expandedWorkflow === workflow._key"
        @toggle="toggleWorkflow"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { AiupdateWorkflow } from "~/composables/useDatabase";
import { useProjectProfile } from "~/composables/useProjectProfile";
import WorkflowItem from "~/components/workflows/WorkflowItem.vue";

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

</script>
