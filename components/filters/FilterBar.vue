<template>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <!-- Modified filter for tool name as dropdown -->
    <div class="w-full sm:w-48 flex flex-col">
      <h3 class="font-semibold">{{ t('filter.toolName') }}</h3>
      <Dropdown
        v-model="filterState.name"
        :options="filterOptions.toolOptions"
        optionLabel="name"
        :placeholder="t('filter.selectTool')"
        class="w-full"
        filter
        showClear
        @change="emitInstantFilters"
      />
    </div>
    <div class="w-full sm:w-48 flex flex-col">
      <h3 class="font-semibold">{{ t('filter.input') }}</h3>
      <MultiSelect
        v-model="filterState.inputs"
        :options="filterOptions.inputOptions"
        optionLabel="label"
        optionValue="value"
        :placeholder="t('filter.search')"
        :loading="loading"
        filter
        class="w-full"
        showClear
        @change="emitInstantFilters"
      />
    </div>
    <div class="w-full sm:w-48 flex flex-col">
      <h3 class="font-semibold">{{ t('filter.output') }}</h3>
      <MultiSelect
        v-model="filterState.outputs"
        :options="filterOptions.outputOptions"
        optionLabel="label"
        optionValue="value"
        :placeholder="t('filter.search')"
        :loading="loading"
        filter
        class="w-full"
        showClear
        @change="emitInstantFilters"
      />
    </div>
    <!-- Project/Profile Selector -->
    <div class="w-full sm:w-48 flex flex-col">
      <h3 class="font-semibold">{{ t('filter.profile') }}</h3>
      <Dropdown
        v-model="localSelectedProject"
        :options="projectOptions"
        optionLabel="label"
        optionValue="value"
        :placeholder="t('filter.selectProfile')"
        class="w-full"
        @change="handleProjectChange"
      />
    </div>
    <div class="w-full sm:w-48 flex flex-col justify-end mt-[24px]">
      <div class="flex flex-col sm:flex-row gap-2 w-full">
        <!-- Filter button + locale toggle -->
        <div class="flex gap-2 w-full justify-center sm:justify-start items-center">
          <Button
            :label="t('filter.moreFilters')"
            icon="pi pi-filter"
            @click="toggleFilters"
            class="p-button more-filters-button flex-grow"
          />

          <!-- Locale toggle: globe = localized only, globe-strikethrough = all languages -->
          <div class="relative">
            <button
              type="button"
              :aria-label="toolLangFilter === 'localized' ? t('database.localizedOnly') : t('database.allLanguages')"
              class="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-primary transition-colors"
              @click="toolLangFilter = toolLangFilter === 'localized' ? 'all' : 'localized'"
            >
              <!-- Globe (localized) -->
              <svg v-if="toolLangFilter === 'localized'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <!-- Globe with strikethrough (all languages) -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                <!-- diagonal strikethrough -->
                <line x1="4" y1="4" x2="20" y2="20" stroke-width="1.75"/>
              </svg>
            </button>

            <!-- Info bubble positioned at top-right of globe icon -->
            <div class="absolute -top-1 -right-1">
              <InfoBubble :text="t('database.langFilterHint')" placement="top-right" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import MultiSelect from "primevue/multiselect";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InfoBubble from "~/components/ui/InfoBubble.vue";
import { useProjectProfile } from "~/composables/useProjectProfile";
import { useTranslations } from "~/composables/i18n";
import { useDatabase } from "~/composables/useDatabase";
import {
  filterState,
  filterOptions,
  loading,
  getFilterParams,
  setProjectFilter,
  initializeFilterOptions,
} from "~/config/filterHandler";

const { t } = useTranslations();
const { toolLangFilter } = useDatabase();

const router = useRouter();
const route = useRoute();

const { projects, activeProjects, activeProjectId, setActiveProject } =
  useProjectProfile();

// Local state for project selection
const localSelectedProject = ref<string>(activeProjectId.value);

// Create options for dropdown with profile names
const projectOptions = computed(() => {
  return [
    { label: t('filter.generalUser'), value: "general" },
    ...activeProjects.value.map((project: any) => ({
      label: project.profile?.name || project.name,
      value: project.id,
    })),
  ];
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

  // Emit filters to refresh results
  emitInstantFilters();
}

// Sync with global state
watch(activeProjectId, (newValue: string) => {
  localSelectedProject.value = newValue;
});

// Accept toolOptions from parent and rename input props
const props = defineProps<{
  toolOptions: any[];
}>();

// Update toolOptions in the shared filter state
onMounted(() => {
  filterOptions.toolOptions = props.toolOptions;
});

const emits = defineEmits(["toggle-filters", "apply-filters"]);

const toggleFilters = () => {
  emits("toggle-filters");
};

// Emit filters instantly on any change
const emitInstantFilters = () => {
  emits("apply-filters", getFilterParams());
};

onMounted(() => {
  // Initialize filter options from hardcoded labels (v3.0)
  initializeFilterOptions();

  // Initialize project from URL parameter
  const projectParam = route.query.project as string;
  if (projectParam && projects.value.some((p: any) => p.id === projectParam)) {
    localSelectedProject.value = projectParam;
  }
});
</script>

<style scoped>
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.w-full {
  width: 100%;
}

.sm\:w-48 {
  width: 12rem;
}

.flex-grow {
  flex-grow: 1;
}

.search-button {
  min-width: 100px;
  text-align: center;
}

.more-filters-button {
  min-width: 120px;
  text-align: center;
  white-space: nowrap;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .more-filters-button {
    width: 100%;
  }
}

/* Remove compare button related styles */
.compare-button-container,
.compare-button,
.comparison-badge {
  display: none;
}

/* Add styles to ensure filter input is visible */
:deep(.p-multiselect-filter-container) {
  width: 100%;
  padding: 0.5rem;
}

:deep(.p-multiselect-filter) {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--surface-200);
  border-radius: 4px;
}

:deep(.p-multiselect-panel) {
  min-width: 100%;
}
</style>
