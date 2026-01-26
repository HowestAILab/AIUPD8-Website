<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    header="Review"
    class="w-full max-w-3xl"
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h2 class="font-semibold text-xl">Review</h2>
        <NuxtLink
          v-if="item"
          :to="`/tools/${item.title}`"
          class="bg-black text-white text-sm font-semibold rounded-full px-4 py-2 mr-2 hover:bg-gray-800"
        >
          Open in Full Page
        </NuxtLink>
      </div>
    </template>
    <div v-if="item" class="p-8">
      <div class="rounded-3xl bg-blue-200 p-8">
        <div class="pb-6 relative">
          <h2 class="text-5xl font-semibold text-black pb-6">
            {{ item.title }}
          </h2>

          <!-- Top Right Badges -->
          <div class="absolute top-2 right-2 flex flex-col gap-2">
            <div
              v-if="item.isFavourite"
              class="bg-accent-extra text-light-page-text-dark text-sm px-4 py-1 rounded-full"
            >
              our favourite
            </div>
            <div
              v-if="item.lastChanged && isToolOutdated(item.lastChanged)"
              class="bg-orange-500 text-white text-sm px-4 py-1 rounded-full"
            >
              ⚠️ possibly outdated
            </div>
          </div>

          <!-- Bottom Left Badge -->
          <div class="absolute bottom-2 left-2">
            <div
              v-if="item.isExperimental"
              class="bg-blue-500 text-white text-sm px-4 py-1 rounded-full font-semibold"
            >
              beta
            </div>
          </div>

          <!-- About section (plain text) -->
          <div class="description mb-6" v-if="item.about">
            <p class="text-gray-700">{{ item.about }}</p>
          </div>

          <!-- Advantages section -->
          <div
            v-if="item.advantages && item.advantages.length > 0"
            class="mb-6"
          >
            <h3 class="font-semibold text-lg mb-2 text-green-700">
              ✓ Advantages
            </h3>
            <ul class="list-disc list-inside space-y-1">
              <li
                v-for="(advantage, index) in item.advantages"
                :key="index"
                class="text-gray-700"
              >
                {{ advantage }}
              </li>
            </ul>
          </div>

          <!-- Disadvantages section -->
          <div
            v-if="item.disadvantages && item.disadvantages.length > 0"
            class="mb-6"
          >
            <h3 class="font-semibold text-lg mb-2 text-red-700">
              ✗ Disadvantages
            </h3>
            <ul class="list-disc list-inside space-y-1">
              <li
                v-for="(disadvantage, index) in item.disadvantages"
                :key="index"
                class="text-gray-700"
              >
                {{ disadvantage }}
              </li>
            </ul>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3">
            <NuxtLink
              v-if="item.link"
              :href="item.link"
              target="_blank"
              class="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
            >
              Go to Tool Website
            </NuxtLink>
            <NuxtLink
              v-if="item.privacyPolicy"
              :href="item.privacyPolicy"
              target="_blank"
              class="inline-flex items-center bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600"
            >
              Privacy Policy
            </NuxtLink>
          </div>
        </div>

        <div class="border-b border-gray-900 my-4"></div>

        <!-- Input/Output information -->
        <div class="grid grid-cols-2 pt-8">
          <div v-if="item.inputs && item.inputs.length > 0">
            <div class="mb-2 font-semibold text-black">input type</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="input in item.inputs"
                :key="input"
                class="px-7 py-1 bg-white text-gray-600 rounded-full"
              >
                {{ input }}
              </span>
            </div>
          </div>
          <div v-if="item.tasks && item.tasks.length > 0">
            <div class="mb-2 font-semibold text-black">specific task</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="task in item.tasks"
                :key="task"
                class="px-7 py-1 bg-white text-gray-600 rounded-full"
              >
                {{ task }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 pt-8">
          <div v-if="item.outputs && item.outputs.length > 0">
            <div class="mb-2 font-semibold text-black">output type</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="output in item.outputs"
                :key="output"
                class="px-7 py-1 bg-white text-gray-600 rounded-full"
              >
                {{ output }}
              </span>
            </div>
          </div>
          <div v-if="item.profiles && item.profiles.length > 0">
            <div class="mb-2 font-semibold text-black">profile</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="profile in item.profiles"
                :key="profile"
                class="px-7 py-1 bg-white text-gray-600 rounded-full"
              >
                {{ profile }}
              </span>
            </div>
          </div>
        </div>

        <div class="pt-10 flex items-center justify-end">
          <label
            class="flex items-center text-sm text-light-page-text-light space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              v-model="compareChecked"
              @change="handleCompareChange"
            />
            <span class="text-black font-semibold">add to comparison</span>
          </label>
        </div>
      </div>
      <div class="py-8" v-if="carouselItems.length > 0">
        <ToolCarousel
          v-if="item"
          :title="item.title"
          :showcase-images="item.showcaseImages"
          :youtube-link="item.youtubeLink"
          class="mt-8 mb-8"
        />
      </div>
      <div class="p-8 bg-gray-100 rounded-3xl">
        <div>
          <h2 class="text-lg font-semibold">Specifications</h2>
        </div>
        <Divider />
        <div class="flex flex-col gap-4 pt-4">
          <div v-if="item.uses && item.uses.length > 0">
            <div
              class="font-bold text-sm rounded-lg text-light-page-text-light"
            >
              use
            </div>
            <div
              class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
            >
              <span
                v-for="option in ['no-code', 'low-code', 'code']"
                :key="option"
                class="sm:flex-1 basis-1/2 text-center px-4 py-1 rounded-full transition-all"
                :class="{
                  'bg-blue-200 text-blue-500 font-semibold':
                    item.uses.includes(option),
                  'text-gray-500': !item.uses.includes(option),
                }"
                >{{ option }}</span
              >
            </div>
          </div>

          <div v-if="item.setups && item.setups.length > 0">
            <div class="font-bold text-sm text-light-page-text-light">
              setup
            </div>
            <div
              class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
            >
              <span
                v-for="option in ['no-code', 'low-code', 'code']"
                :key="option"
                class="sm:flex-1 basis-1/2 text-center px-4 py-1 rounded-full transition-all"
                :class="{
                  'bg-blue-200 text-blue-500 font-semibold':
                    item.setups.includes(option),
                  'text-gray-500': !item.setups.includes(option),
                }"
                >{{ option }}</span
              >
            </div>
          </div>

          <div v-if="item.pricings && item.pricings.length > 0">
            <div class="font-bold text-sm text-light-page-text-light">
              pricing
            </div>
            <div
              class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
            >
              <span
                v-for="option in ['free', 'subscription', 'credits']"
                :key="option"
                class="sm:flex-1 basis-1/2 text-center px-4 py-1 rounded-full transition-all"
                :class="{
                  'bg-blue-200 text-blue-500 font-semibold':
                    item.pricings.includes(option),
                  'text-gray-500': !item.pricings.includes(option),
                }"
                >{{ option }}</span
              >
            </div>
          </div>

          <div v-if="item.licenses && item.licenses.length > 0">
            <div class="font-bold text-sm text-light-page-text-light">
              license
            </div>
            <div
              class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
            >
              <span
                v-for="option in ['personal', 'commercial']"
                :key="option"
                class="sm:flex-1 basis-1/2 text-center px-4 py-1 rounded-full transition-all"
                :class="{
                  'bg-blue-200 text-blue-500 font-semibold':
                    item.licenses.includes(option),
                  'text-gray-500': !item.licenses.includes(option),
                }"
                >{{ option }}</span
              >
            </div>
          </div>

          <div v-if="item.generationTimes && item.generationTimes.length > 0">
            <div class="font-bold text-sm text-light-page-text-light">
              average time
            </div>
            <div
              class="flex sm:flex-nowrap flex-wrap bg-gray-100 rounded-full w-full mt-1 border border-gray-200"
            >
              <span
                v-for="option in ['seconds', 'minutes', 'hours', 'days']"
                :key="option"
                class="sm:flex-1 basis-1/2 text-center px-4 py-1 rounded-full transition-all"
                :class="{
                  'bg-blue-200 text-blue-500 font-semibold':
                    item.generationTimes.includes(option),
                  'text-gray-500': !item.generationTimes.includes(option),
                }"
                >{{ option }}</span
              >
            </div>
          </div>

          <!-- Data Storage Locations -->
          <div
            v-if="
              item.dataStorageLocations && item.dataStorageLocations.length > 0
            "
            class="mt-4"
          >
            <div class="font-bold text-sm text-light-page-text-light mb-1">
              Data Storage Locations
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="location in item.dataStorageLocations"
                :key="location"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {{ location }}
              </span>
            </div>
          </div>

          <!-- Date Added -->
          <div v-if="item.dateAdded" class="mt-4">
            <div class="font-bold text-sm text-light-page-text-light mb-1">
              Date Added
            </div>
            <span class="text-sm text-gray-700">{{
              formatDate(item.dateAdded)
            }}</span>
          </div>

          <!-- Last Updated -->
          <div v-if="item.lastChanged" class="mt-4">
            <div class="font-bold text-sm text-light-page-text-light mb-1">
              Last Updated
            </div>
            <span class="text-sm text-gray-700">{{
              formatDate(item.lastChanged)
            }}</span>
          </div>
        </div>
      </div>

      <!-- Workflows Section with Project Selector -->
      <div class="py-8" v-if="hasAnyWorkflows">
        <div class="bg-gray-50 rounded-2xl p-6">
          <!-- Header with Project Selector -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-semibold text-gray-900">Workflows</h3>
            <div
              v-if="availableWorkflowProjects.length > 0"
              class="flex items-center gap-2"
            >
              <span class="text-sm text-gray-500">View for:</span>
              <select
                v-model="selectedWorkflowProjectId"
                class="px-3 py-1.5 border border-gray-300 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                :style="{
                  borderColor: `${getCurrentWorkflowProjectColor()}40`,
                  color: getCurrentWorkflowProjectColor(),
                }"
              >
                <option value="all">All Profiles</option>
                <option
                  v-for="project in availableWorkflowProjects"
                  :key="project.id"
                  :value="project.id"
                >
                  {{ project.profileName }}
                </option>
              </select>
            </div>
          </div>

          <!-- Show all workflows grouped by project -->
          <div v-if="selectedWorkflowProjectId === 'all'">
            <!-- No workflows message -->
            <div
              v-if="!hasAnyWorkflows"
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
                No workflows available for this tool yet.
              </p>
            </div>

            <!-- Workflows List Grouped by Project (Collapsible) -->
            <div v-else class="space-y-4">
              <div
                v-for="projectGroup in availableWorkflowProjects"
                :key="projectGroup.id"
                class="project-workflow-group"
              >
                <!-- Project Section Header (Clickable) -->
                <div
                  class="flex items-center gap-3 p-4 bg-white rounded-xl border-2 cursor-pointer hover:shadow-md transition-all"
                  :style="{ borderColor: `${projectGroup.color}40` }"
                  @click="toggleProjectSection(projectGroup.id)"
                >
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    :style="{ backgroundColor: `${projectGroup.color}20` }"
                  >
                    <svg
                      class="w-5 h-5"
                      :style="{ color: projectGroup.color }"
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
                      :style="{ color: projectGroup.color }"
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
                      :style="{ borderColor: `${projectGroup.color}40` }"
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
                              ? `${projectGroup.color}40`
                              : '',
                        }"
                        @click="toggleWorkflow(workflow._key)"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-10 h-10 rounded-full flex items-center justify-center"
                            :style="{
                              backgroundColor: `${projectGroup.color}20`,
                            }"
                          >
                            <svg
                              class="w-5 h-5"
                              :style="{ color: projectGroup.color }"
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
                          :class="{
                            'rotate-180': expandedWorkflow === workflow._key,
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
                                  backgroundColor: projectGroup.color,
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

          <!-- Show single project workflows -->
          <div v-else>
            <ProjectWorkflows
              :toolId="item.id"
              :aiupdateWorkflows="item.aiupdateWorkflows"
              :psyaidWorkflows="item.psyaidWorkflows"
              :forceProjectId="selectedWorkflowProjectId"
              :hideHeader="true"
            />
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import Galleria from "primevue/galleria";
import { ref, computed, watch } from "vue";
import { useRuntimeConfig } from "#app";
import Divider from "primevue/divider";
import { useRichText } from "~/composables/useRichText";
import { useMedia } from "~/composables/useMedia";
import { useProjectProfile } from "~/composables/useProjectProfile";
import { getProjectColor, getProjectConfig } from "~/config/projects";
import type { ToolItem } from "~/composables/useDatabase";
import SanityPortableText from "~/components/content/SanityPortableText.vue";
import ToolCarousel from "~/components/media/ToolCarousel.vue";
import ToolWorkflows from "~/components/workflows/ToolWorkflows.vue";
import ProjectWorkflows from "~/components/workflows/ProjectWorkflows.vue";

const { parseRichText } = useRichText();
const { getMediaUrl, getCarouselImageUrl, getYoutubeEmbedUrl } = useMedia();
const { activeProjectId } = useProjectProfile();

const visible = ref(false);
const item = ref<ToolItem | null>(null);
const compareChecked = ref(false);

// Workflow project selector (independent from database selection)
const selectedWorkflowProjectId = ref<string>("all");
const expandedWorkflow = ref<string | null>(null);
const expandedProjectSection = ref<string | null>(null);

// Check if we're in the general database context
const isGeneralDatabase = computed(() => activeProjectId.value === "general");

// Get available projects that have workflows for this tool
interface WorkflowProject {
  id: string;
  name: string;
  profileName: string; // Add profile name for display
  color: string;
  workflows: any[];
}

const availableWorkflowProjects = computed<WorkflowProject[]>(() => {
  if (!item.value) return [];

  const projects: WorkflowProject[] = [];

  if (item.value.aiupdateWorkflows && item.value.aiupdateWorkflows.length > 0) {
    const config = getProjectConfig("aiupd8");
    projects.push({
      id: "aiupd8",
      name: "AI-UPD8",
      profileName: config?.profile.name || "Creative Professional",
      color: getProjectColor("aiupd8"),
      workflows: item.value.aiupdateWorkflows,
    });
  }

  if (item.value.psyaidWorkflows && item.value.psyaidWorkflows.length > 0) {
    const config = getProjectConfig("psyaid");
    projects.push({
      id: "psyaid",
      name: "PSYaid",
      profileName: config?.profile.name || "Psychoeducational Professional",
      color: getProjectColor("psyaid"),
      workflows: item.value.psyaidWorkflows,
    });
  }

  // Add more projects here as needed

  return projects;
});

// Check if there are any workflows at all
const hasAnyWorkflows = computed(
  () => availableWorkflowProjects.value.length > 0
);

// Get current workflow project color
const getCurrentWorkflowProjectColor = () => {
  if (selectedWorkflowProjectId.value === "all") {
    return "#3B82F6"; // default blue
  }
  const project = availableWorkflowProjects.value.find(
    (p: WorkflowProject) => p.id === selectedWorkflowProjectId.value
  );
  return project?.color || "#3B82F6";
};

// Toggle workflow expansion
const toggleWorkflow = (workflowId: string) => {
  if (expandedWorkflow.value === workflowId) {
    expandedWorkflow.value = null;
  } else {
    expandedWorkflow.value = workflowId;
  }
};

// Toggle project section expansion
const toggleProjectSection = (projectId: string) => {
  if (expandedProjectSection.value === projectId) {
    expandedProjectSection.value = null;
  } else {
    expandedProjectSection.value = projectId;
  }
};

// Sort workflow steps by stepNumber
const getSortedSteps = (workflow: any) => {
  if (!workflow.steps) return [];
  return [...workflow.steps].sort(
    (a: any, b: any) => a.stepNumber - b.stepNumber
  );
};

// Format date helper
function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Check if tool is outdated (> 5 months)
function isToolOutdated(lastChangedDate: string): boolean {
  if (!lastChangedDate) return false;
  const lastChanged = new Date(lastChangedDate);
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
  return lastChanged < fiveMonthsAgo;
}

const props = defineProps({
  itemsInComparison: {
    type: Set,
    default: () => new Set(),
  },
});

const emit = defineEmits(["add-to-comparison", "remove-from-comparison"]);

function handleCompareChange(event) {
  if (!item.value) return;

  if (event.target.checked) {
    emit("add-to-comparison", item.value);
  } else {
    emit("remove-from-comparison", item.value);
  }
}

watch(visible, (newValue) => {
  if (!newValue) {
    compareChecked.value = false;
  }
});

const open = (toolItem: ToolItem) => {
  item.value = toolItem;
  console.log("Opening modal with item:", toolItem);
  if (toolItem.showcaseImages) {
    console.log("Showcase images in modal:", toolItem.showcaseImages);
  }

  if (props.itemsInComparison && item.value) {
    compareChecked.value = props.itemsInComparison.has(item.value.id);
  }

  // Reset workflow selector to active project (or "all" if general database)
  // This ensures the modal always opens showing the current project's workflows first
  if (activeProjectId.value === "general") {
    selectedWorkflowProjectId.value = "all";
  } else {
    // Check if the active project has workflows for this tool
    const activeProjectHasWorkflows =
      (activeProjectId.value === "aiupd8" &&
        toolItem.aiupdateWorkflows?.length) ||
      (activeProjectId.value === "psyaid" && toolItem.psyaidWorkflows?.length);

    selectedWorkflowProjectId.value = activeProjectHasWorkflows
      ? activeProjectId.value
      : "all";
  }

  // Reset expanded workflow and project section
  expandedWorkflow.value = null;
  expandedProjectSection.value = null;

  visible.value = true;
};

// New computed property for modal carousel items
const carouselItems = computed(() => {
  if (!item.value) return [];
  const slides = item.value.showcaseImages
    ? [...item.value.showcaseImages]
    : [];
  if (item.value.youtubeLink) {
    slides.push({ type: "youtube", url: item.value.youtubeLink });
  }
  return slides;
});

defineExpose({ open });
</script>

<style>
.p-dialog-mask {
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, 0.4) !important;
}

/* Update Galleria styles */
.p-galleria {
  border: none !important;
  border-radius: 1.5rem !important;
  overflow: hidden;
}

.p-galleria .p-galleria-content,
.p-galleria .p-galleria-item-wrapper,
.p-galleria .p-galleria-item,
.p-galleria-item-container {
  border-radius: 1.5rem !important;
  overflow: hidden;
}

.p-galleria-item img {
  border-radius: 1.5rem !important;
}

.rich-text-content :deep(p) {
  margin-bottom: 1rem;
}

.rich-text-content :deep(h1),
.rich-text-content :deep(h2),
.rich-text-content :deep(h3),
.rich-text-content :deep(h4),
.rich-text-content :deep(h5),
.rich-text-content :deep(h6) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.rich-text-content :deep(h1) {
  font-size: 1.8rem;
}

.rich-text-content :deep(h2) {
  font-size: 1.5rem;
}

.rich-text-content :deep(h3) {
  font-size: 1.25rem;
}

.rich-text-content :deep(a) {
  color: #3178f2;
  text-decoration: underline;
}

.rich-text-content :deep(ul),
.rich-text-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.rich-text-content :deep(li) {
  margin-bottom: 0.25rem;
}

.rich-text-content :deep(blockquote) {
  border-left: 4px solid #e2e8f0;
  padding-left: 1rem;
  margin-left: 0;
  margin-right: 0;
  font-style: italic;
}

.rich-text-content :deep(code) {
  background: #f1f5f9;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.rich-text-content :deep(pre) {
  background: #1e293b;
  color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.rich-text-content :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
}

.video-container {
  max-width: 100%;
  margin: 0 auto;
}

/* pt-[56.25%] gives us a 16:9 aspect ratio (9/16 = 0.5625 or 56.25%) */
.video-container .relative {
  background-color: #000;
}

/* Workflow expand animation */
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
