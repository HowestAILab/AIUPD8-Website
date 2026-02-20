<template>
  <div class="tool-workflows bg-gray-50 rounded-2xl p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
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
            <div
              v-for="workflow in projectGroup.workflows"
              :key="workflow._key"
              class="bg-white border-2 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              :style="{ borderColor: `${getProjectColor(projectGroup.id)}40` }"
            >
              <!-- Workflow Header (Clickable) -->
              <div
                class="p-4 cursor-pointer flex items-center justify-between"
                :class="{
                  'border-b-2': expandedWorkflow === workflow._key,
                }"
                :style="{
                  borderBottomColor:
                    expandedWorkflow === workflow._key
                      ? `${getProjectColor(projectGroup.id)}40`
                      : '',
                }"
                @click="toggleWorkflow(workflow._key)"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center"
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
                  <div>
                    <h4 class="font-semibold text-gray-900">
                      {{ workflow.name }}
                    </h4>
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
                <div
                  v-if="expandedWorkflow === workflow._key"
                  class="p-4 bg-gray-50"
                >
                  <!-- Steps -->
                  <div class="space-y-3">
                    <div
                      v-for="step in getSortedSteps(workflow)"
                      :key="step._key"
                      class="flex gap-3 bg-white rounded-lg p-4 shadow-sm"
                    >
                      <div
                        class="flex-shrink-0 w-8 h-8 rounded-full text-white text-sm flex items-center justify-center font-bold"
                        :style="{
                          backgroundColor: getProjectColor(projectGroup.id),
                        }"
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

const props = defineProps<{
  aiupdateWorkflows?: AiupdateWorkflow[];
  psyaidWorkflows?: any[]; // Add other project workflows as needed
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
const expandedProjectSection = ref<string | null>(null);

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
