<template>
  <div class="tool-workflows bg-gray-50 rounded-2xl p-6">
    <!-- Header (hidden when used inside a parent that already has one) -->
    <div v-if="!hideHeader" class="flex items-center justify-between mb-6">
      <h3 class="text-2xl font-semibold text-gray-900">All Workflows</h3>
      <span v-if="hasWorkflows" class="text-sm text-gray-500">
        {{ totalWorkflowCount }} workflow{{
          totalWorkflowCount !== 1 ? "s" : ""
        }}
        from {{ availableProjects.length }} profile{{
          availableProjects.length !== 1 ? "s" : ""
        }}
      </span>
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
      <p class="text-gray-600">No workflows available for this tool yet.</p>
    </div>

    <!-- Workflows List Grouped by Project (Collapsible) -->
    <div v-else class="space-y-4">
      <div
        v-for="projectGroup in availableProjects"
        :key="projectGroup.id"
        class="project-workflow-group"
      >
        <!-- Project Section Header (Clickable) -->
        <div
          class="flex items-center gap-3 p-4 bg-white rounded-xl border-2 cursor-pointer hover:shadow-md transition-all"
          :style="{ borderColor: `${getProjectColor(projectGroup.id)}40` }"
          @click="toggleProjectSection(projectGroup.id)"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            :style="{
              backgroundColor: `${getProjectColor(projectGroup.id)}20`,
            }"
          >
            <svg
              class="w-5 h-5"
              :style="{ color: getProjectColor(projectGroup.id) }"
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
          <div class="flex-1">
            <div
              class="font-semibold text-lg"
              :style="{ color: getProjectColor(projectGroup.id) }"
            >
              {{ projectGroup.profileName }}
            </div>
            <div class="text-sm text-gray-500">
              {{ projectGroup.workflows.length }} workflow{{
                projectGroup.workflows.length !== 1 ? "s" : ""
              }}
            </div>
          </div>
          <svg
            class="w-5 h-5 text-gray-400 transition-transform flex-shrink-0"
            :class="{
              'rotate-180': expandedProjectSection === projectGroup.id,
            }"
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

        <!-- Workflows for this Project (Expandable) -->
        <transition name="expand">
          <div
            v-if="expandedProjectSection === projectGroup.id"
            class="mt-3 space-y-3 ml-2"
          >
            <WorkflowItem
              v-for="workflow in projectGroup.workflows"
              :key="workflow._key"
              :workflow="workflow"
              :project-color="getProjectColor(projectGroup.id)"
              :is-expanded="expandedWorkflow === workflow._key"
              @toggle="toggleWorkflow"
            />
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
import { getProjectColor, getProjectConfig } from "~/config/projects";
import WorkflowItem from "~/components/workflows/WorkflowItem.vue";

const props = defineProps<{
  aiupdateWorkflows?: AiupdateWorkflow[];
  psyaidWorkflows?: any[]; // Add other project workflows as needed
  defaultExpandedProjectId?: string; // Pre-expand this project section on load
  hideHeader?: boolean; // Suppress the built-in header when used inside another container
}>();

const { projects } = useProjectProfile();

interface ProjectWithWorkflows {
  id: string;
  name: string;
  profileName: string; // Add profile name for display
  color: string;
  workflows: AiupdateWorkflow[];
}

// Get all projects that have workflows
const projectsWithWorkflows = computed<ProjectWithWorkflows[]>(() => {
  const projectList: ProjectWithWorkflows[] = [];

  // AIUpdate project
  if (props.aiupdateWorkflows && props.aiupdateWorkflows.length > 0) {
    const config = getProjectConfig("aiupd8");
    projectList.push({
      id: "aiupd8",
      name: "AI-UPD8",
      profileName: config?.profile.name || "Creative Professional",
      color: getProjectColor("aiupd8"),
      workflows: props.aiupdateWorkflows,
    });
  }

  // PSY-AID project
  if (props.psyaidWorkflows && props.psyaidWorkflows.length > 0) {
    const config = getProjectConfig("psyaid");
    projectList.push({
      id: "psyaid",
      name: "PSY-AID",
      profileName: config?.profile.name || "Psychoeducational Professional",
      color: getProjectColor("psyaid"),
      workflows: props.psyaidWorkflows,
    });
  }

  // Future projects can be added here following the same pattern

  return projectList;
});

// Get available projects (those with workflows)
const availableProjects = computed(() => {
  return projectsWithWorkflows.value.filter((p) => p.workflows.length > 0);
});

// Check if there are any workflows
const hasWorkflows = computed(() => availableProjects.value.length > 0);

// Total workflow count
const totalWorkflowCount = computed(() => {
  return availableProjects.value.reduce(
    (total, project) => total + project.workflows.length,
    0
  );
});

// Expanded workflow ID
const expandedWorkflow = ref<string | null>(null);
const expandedProjectSection = ref<string | null>(props.defaultExpandedProjectId || null);

// Toggle workflow expansion
function toggleWorkflow(workflowId: string): void {
  if (expandedWorkflow.value === workflowId) {
    expandedWorkflow.value = null;
  } else {
    expandedWorkflow.value = workflowId;
  }
}

// Toggle project section expansion
function toggleProjectSection(projectId: string): void {
  if (expandedProjectSection.value === projectId) {
    expandedProjectSection.value = null;
  } else {
    expandedProjectSection.value = projectId;
  }
}

</script>
