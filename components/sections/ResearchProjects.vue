<template>
  <section class="w-full py-16 px-4 md:px-8 bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Research Projects
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore AI tools curated for specific research initiatives and target
          audiences. Each project offers specialized workflows and examples for
          different professional profiles.
        </p>
      </div>

      <!-- Project Tabs -->
      <div class="flex flex-wrap justify-center gap-4 mb-8">
        <button
          v-for="project in availableProjects"
          :key="project.id"
          @click="selectProject(project.id)"
          class="px-6 py-3 rounded-full font-semibold transition-all duration-300"
          :class="[
            selectedProjectId === project.id
              ? 'bg-primary text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200',
          ]"
        >
          {{ project.name }}
        </button>
      </div>

      <!-- Selected Project Card -->
      <transition name="fade" mode="out-in">
        <div
          v-if="selectedProject"
          :key="selectedProject.id"
          class="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div class="flex flex-col lg:flex-row">
            <!-- Image Side -->
            <div class="lg:w-1/2 relative">
              <div
                class="h-64 lg:h-full min-h-[400px] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
                :style="{
                  background: `linear-gradient(135deg, ${selectedProject.color}40, ${selectedProject.color})`,
                }"
              >
                <!-- Project Image or Placeholder -->
                <div class="text-center text-white p-8">
                  <div
                    class="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <svg
                      class="w-12 h-12"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      />
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold">{{ selectedProject.name }}</h3>
                  <p class="mt-2 opacity-90">
                    {{ selectedProject.shortDescription }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Content Side -->
            <div class="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">
                  {{ selectedProject.name }}
                </h3>
                <p class="text-gray-600 mb-6 leading-relaxed">
                  {{ selectedProject.description }}
                </p>

                <!-- Target Audience -->
                <div
                  class="mb-6"
                  v-if="selectedProject.targetAudience.length > 0"
                >
                  <h4
                    class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3"
                  >
                    Target Audience
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="audience in selectedProject.targetAudience"
                      :key="audience"
                      class="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {{ audience }}
                    </span>
                  </div>
                </div>

                <!-- Partner Logos -->
                <div v-if="selectedProject.logos.length > 0" class="mb-8">
                  <h4
                    class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4"
                  >
                    Partners & Sponsors
                  </h4>
                  <div class="flex flex-wrap items-center gap-6">
                    <a
                      v-for="logo in selectedProject.logos"
                      :key="logo.src"
                      :href="logo.url || '#'"
                      :target="logo.url ? '_blank' : '_self'"
                      class="block h-8 grayscale hover:grayscale-0 transition-all duration-300"
                    >
                      <img
                        :src="logo.src"
                        :alt="logo.alt"
                        class="h-full object-contain"
                      />
                    </a>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 mt-6">
                <NuxtLink
                  :to="getProjectDatabaseLink(selectedProject.id)"
                  class="flex-1"
                >
                  <button
                    class="w-full px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                    :style="{
                      backgroundColor: selectedProject.color,
                      color: 'white',
                    }"
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
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                    View Project Tools
                  </button>
                </NuxtLink>
                <NuxtLink
                  to="/database"
                  class="flex-1"
                  v-if="selectedProject.id !== 'general'"
                >
                  <button
                    class="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    View All Tools
                  </button>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useProjectProfile } from "~/composables/useProjectProfile";

const { projects, setActiveProject } = useProjectProfile();

// Local state for selected project in this component
const selectedProjectId = ref<string>("aiupd8");

// Get available projects (active ones for display)
const availableProjects = computed(() => {
  return projects.value.filter((p: any) => p.isActive);
});

// Get the currently selected project
const selectedProject = computed(() => {
  return projects.value.find((p: any) => p.id === selectedProjectId.value);
});

// Select a project tab
function selectProject(projectId: string): void {
  selectedProjectId.value = projectId;
}

// Generate database link with project filter
function getProjectDatabaseLink(projectId: string): string {
  if (projectId === "general") {
    return "/database";
  }
  return `/database?project=${projectId}`;
}

// Handle "View Project Tools" click - sets the active project globally
function navigateToProject(projectId: string): void {
  setActiveProject(projectId);
}

// Set initial selection to first active non-general project
onMounted(() => {
  const nonGeneralProjects = projects.value.filter(
    (p: any) => p.id !== "general" && p.isActive
  );
  if (nonGeneralProjects.length > 0) {
    selectedProjectId.value = nonGeneralProjects[0].id;
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
