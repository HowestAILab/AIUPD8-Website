<template>
  <div class="tool-workflows bg-gray-50 rounded-2xl p-6">
    <!-- Header with Project Selector -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-2xl font-semibold text-gray-900">Tool Workflows</h3>
      <div v-if="availableProjects.length > 0" class="flex items-center gap-2">
        <span class="text-sm text-gray-500">View for:</span>
        <select
          v-model="selectedProjectId"
          class="px-3 py-1.5 border border-gray-300 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option
            v-for="project in availableProjects"
            :key="project.id"
            :value="project.id"
          >
            {{ project.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- No workflows message -->
    <div
      v-if="!hasWorkflows"
      class="bg-white rounded-xl p-6 text-center border border-gray-200"
    >
      <div
        class="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center"
      >
        <svg
          class="w-8 h-8 text-gray-400"
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
      <p class="text-gray-600">
        {{
          availableProjects.length > 0
            ? `No workflows available for this tool in the selected project.`
            : `No workflows available for this tool yet.`
        }}
      </p>
    </div>

    <!-- Workflows List (Expandable Accordion) -->
    <div v-else class="space-y-4">
      <div
        v-for="workflow in currentWorkflows"
        :key="workflow._key"
        class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Workflow Header (Clickable) -->
        <div
          class="p-4 cursor-pointer flex items-center justify-between"
          :class="{
            'border-b border-gray-200': expandedWorkflow === workflow._key,
          }"
          @click="toggleWorkflow(workflow._key)"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :style="{ backgroundColor: `${activeProjectColor}20` }"
            >
              <svg
                class="w-5 h-5"
                :style="{ color: activeProjectColor }"
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
                  :style="{ backgroundColor: activeProjectColor }"
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
import { ref, computed, watch } from "vue";
import type { AiupdateWorkflow } from "~/composables/useDatabase";
import { useProjectProfile } from "~/composables/useProjectProfile";

const props = defineProps<{
  aiupdateWorkflows?: AiupdateWorkflow[];
  // Future projects can add their workflow props here:
  // newprojectWorkflows?: NewprojectWorkflow[];
}>();

const { projects, activeProjectId, activeProject, setActiveProject } =
  useProjectProfile();

interface ProjectWithWorkflows {
  id: string;
  name: string;
  workflows: AiupdateWorkflow[];
}

// Get all projects that have workflows
const projectsWithWorkflows = computed<ProjectWithWorkflows[]>(() => {
  const projectList: ProjectWithWorkflows[] = [];

  // AIUpdate project
  if (props.aiupdateWorkflows && props.aiupdateWorkflows.length > 0) {
    projectList.push({
      id: "aiupdate",
      name: "AIUpdate",
      workflows: props.aiupdateWorkflows,
    });
  }

  // Future projects can be added here:
  // if (props.newprojectWorkflows && props.newprojectWorkflows.length > 0) {
  //   projectList.push({
  //     id: 'newproject',
  //     name: 'New Project',
  //     workflows: props.newprojectWorkflows,
  //   });
  // }

  return projectList;
});

// Get available projects (those with workflows)
const availableProjects = computed(() => {
  return projectsWithWorkflows.value.filter((p) => p.workflows.length > 0);
});

// Local state for project selection - sync with global state
const selectedProjectId = ref<string>(
  projectsWithWorkflows.value.length > 0
    ? projectsWithWorkflows.value[0].id
    : ""
);

// Initialize with current active project if it has workflows
watch(
  [activeProjectId, projectsWithWorkflows],
  () => {
    const activeProjectHasWorkflows = projectsWithWorkflows.value.some(
      (p) => p.id === activeProjectId.value
    );
    if (activeProjectHasWorkflows) {
      selectedProjectId.value = activeProjectId.value;
    } else if (projectsWithWorkflows.value.length > 0) {
      selectedProjectId.value = projectsWithWorkflows.value[0].id;
    }
  },
  { immediate: true }
);

// Currently selected project
const selectedProject = computed(() => {
  return projectsWithWorkflows.value.find(
    (p: ProjectWithWorkflows) => p.id === selectedProjectId.value
  );
});

// Workflows for the selected project
const currentWorkflows = computed(() => {
  return selectedProject.value?.workflows || [];
});

// Check if there are any workflows
const hasWorkflows = computed(() => currentWorkflows.value.length > 0);

// Get the active project's color
const activeProjectColor = computed(() => {
  if (!selectedProjectId.value) return "#3B82F6"; // default blue
  const project = projects.value.find(
    (p: any) => p.id === selectedProjectId.value
  );
  return project?.color || "#3B82F6";
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

// Sync local selection with global state when changed
watch(selectedProjectId, (newValue) => {
  if (newValue) {
    setActiveProject(newValue);
  }
});
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
