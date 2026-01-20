import { ref, reactive, computed } from 'vue';
import { projectConfigs } from '~/config/projects';
import type { ProjectConfig } from '~/config/projects';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Represents a research project - uses ProjectConfig as base
 * This type extends ProjectConfig with Vue component-specific properties
 */
export type ResearchProject = ProjectConfig;

/**
 * Logo associated with a project (partners, sponsors, etc.)
 */
export interface ProjectLogo {
  src: string;
  alt: string;
  url?: string;
}

/**
 * Filter configuration for a project
 * Defines which filters are available and any custom filters
 */
export interface ProjectFilterConfig {
  projectId: string;
  // General filters that are always visible
  generalFilters: string[];
  // Custom filters specific to this project
  customFilters: CustomFilter[];
  // Filters to hide for this project
  hiddenFilters: string[];
}

/**
 * Custom filter definition for project-specific filtering
 */
export interface CustomFilter {
  id: string;
  name: string;
  type: 'select' | 'multiselect' | 'toggle' | 'range';
  options?: FilterOption[];
  defaultValue?: any;
}

export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Workflow configuration for tools within a project context
 */
export interface ProjectWorkflow {
  id: string;
  projectId: string;
  toolId: string;
  title: string;
  description: string;
  steps: WorkflowStep[];
  examples: WorkflowExample[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface WorkflowStep {
  order: number;
  title: string;
  description: string;
  image?: string;
}

export interface WorkflowExample {
  id: string;
  title: string;
  description: string;
  image?: string;
  videoUrl?: string;
}

/**
 * Component customization for a project
 * Allows adding/removing/modifying component sections based on project
 */
export interface ProjectComponentConfig {
  projectId: string;
  // Components to show in tool modal
  toolModalSections: ComponentSection[];
  // Components to show in tool detail page
  toolPageSections: ComponentSection[];
  // Components to show in database view
  databaseSections: ComponentSection[];
}

export interface ComponentSection {
  id: string;
  component: string;
  position: 'before' | 'after' | 'replace';
  targetSection?: string; // Which section to position relative to
  props?: Record<string, any>;
  visible: boolean;
}

// ============================================================================
// MOCK DATA - Uses config from projects.ts as single source of truth
// ============================================================================

/**
 * Projects data - automatically populated from config/projects.ts
 * The config is the single source of truth, no duplication here
 */
const mockProjects: ResearchProject[] = projectConfigs;

const mockFilterConfigs: ProjectFilterConfig[] = [
  {
    projectId: 'general',
    generalFilters: ['uses', 'setups', 'pricings', 'licenses', 'generationTimes', 'inputs', 'outputs', 'profiles', 'tasks'],
    customFilters: [],
    hiddenFilters: [],
  },
  {
    projectId: 'aiupd8',
    generalFilters: ['uses', 'setups', 'pricings', 'licenses', 'generationTimes', 'inputs', 'outputs', 'tasks'],
    customFilters: [
      {
        id: 'creative-sector',
        name: 'Creative Sector',
        type: 'multiselect',
        options: [
          { value: 'game', label: 'Game Development' },
          { value: 'film', label: 'Film Production' },
          { value: 'media', label: 'Media' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'communication', label: 'Communication' },
        ],
      },
      {
        id: 'workflow-type',
        name: 'Workflow Type',
        type: 'multiselect',
        options: [
          { value: 'content-creation', label: 'Content Creation' },
          { value: 'asset-generation', label: 'Asset Generation' },
          { value: 'automation', label: 'Automation' },
          { value: 'enhancement', label: 'Enhancement' },
        ],
      },
    ],
    hiddenFilters: ['profiles'], // AI-UPD8 has its own profile system
  },
];

const mockWorkflows: ProjectWorkflow[] = [
  {
    id: 'workflow-1',
    projectId: 'aiupd8',
    toolId: 'example-tool', // Will be linked to actual tools
    title: 'Character Concept Art Generation',
    description: 'Learn how to generate character concept art for your game or film project using AI tools.',
    steps: [
      { order: 1, title: 'Define your character', description: 'Start by writing a detailed character description including personality, appearance, and role.' },
      { order: 2, title: 'Generate initial concepts', description: 'Use the AI tool to generate multiple concept variations.' },
      { order: 3, title: 'Refine and iterate', description: 'Select the best concepts and use inpainting to refine details.' },
    ],
    examples: [
      { id: 'ex-1', title: 'Fantasy Knight', description: 'A detailed knight character for a fantasy RPG', image: '/images/examples/knight.jpg' },
      { id: 'ex-2', title: 'Sci-fi Pilot', description: 'A futuristic pilot character for a space game', image: '/images/examples/pilot.jpg' },
    ],
    difficulty: 'beginner',
  },
];

const mockComponentConfigs: ProjectComponentConfig[] = [
  {
    projectId: 'general',
    toolModalSections: [],
    toolPageSections: [],
    databaseSections: [],
  },
  {
    projectId: 'aiupd8',
    toolModalSections: [
      {
        id: 'workflow-section',
        component: 'ProjectWorkflows',
        position: 'after',
        targetSection: 'specifications',
        props: {},
        visible: true,
      },
    ],
    toolPageSections: [
      {
        id: 'workflow-section',
        component: 'ProjectWorkflows',
        position: 'after',
        targetSection: 'additional-info',
        props: {},
        visible: true,
      },
    ],
    databaseSections: [
      {
        id: 'project-banner',
        component: 'ProjectBanner',
        position: 'before',
        targetSection: 'tools-grid',
        props: {},
        visible: true,
      },
    ],
  },
];

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

// Current active project profile
const activeProjectId = ref<string>('general');

// All available projects
const projects = ref<ResearchProject[]>(mockProjects);

// Filter configurations per project
const filterConfigs = ref<ProjectFilterConfig[]>(mockFilterConfigs);

// Workflow data
const workflows = ref<ProjectWorkflow[]>(mockWorkflows);

// Component configurations
const componentConfigs = ref<ProjectComponentConfig[]>(mockComponentConfigs);

// Loading states
const isLoading = ref(false);
const error = ref<string | null>(null);

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

/**
 * Get the currently active project
 */
const activeProject = computed<ResearchProject | undefined>(() => {
  return projects.value.find(p => p.id === activeProjectId.value);
});

/**
 * Get filter configuration for active project
 */
const activeFilterConfig = computed<ProjectFilterConfig | undefined>(() => {
  return filterConfigs.value.find(c => c.projectId === activeProjectId.value);
});

/**
 * Get component configuration for active project
 */
const activeComponentConfig = computed<ProjectComponentConfig | undefined>(() => {
  return componentConfigs.value.find(c => c.projectId === activeProjectId.value);
});

/**
 * Get workflows for active project
 */
const activeWorkflows = computed<ProjectWorkflow[]>(() => {
  return workflows.value.filter(w => w.projectId === activeProjectId.value);
});

/**
 * Check if we're in a project-specific context (not general)
 */
const isProjectContext = computed<boolean>(() => {
  return activeProjectId.value !== 'general';
});

/**
 * Get list of active projects (excluding general)
 */
const activeProjects = computed<ResearchProject[]>(() => {
  return projects.value.filter(p => p.id !== 'general' && p.isActive);
});

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Set the active project profile
 */
function setActiveProject(projectId: string): void {
  const project = projects.value.find(p => p.id === projectId);
  if (project) {
    activeProjectId.value = projectId;
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('aiupd8-active-project', projectId);
    }
  }
}

/**
 * Initialize project from localStorage or default
 */
function initializeProject(): void {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('aiupd8-active-project');
    if (stored && projects.value.some(p => p.id === stored)) {
      activeProjectId.value = stored;
    }
  }
}

/**
 * Get workflows for a specific tool in current project context
 */
function getToolWorkflows(toolId: string): ProjectWorkflow[] {
  return workflows.value.filter(
    w => w.projectId === activeProjectId.value && w.toolId === toolId
  );
}

/**
 * Check if a filter should be visible for current project
 */
function isFilterVisible(filterId: string): boolean {
  const config = activeFilterConfig.value;
  if (!config) return true;
  return !config.hiddenFilters.includes(filterId);
}

/**
 * Get custom filters for current project
 */
function getCustomFilters(): CustomFilter[] {
  return activeFilterConfig.value?.customFilters || [];
}

/**
 * Get component sections for a specific area
 */
function getComponentSections(area: 'toolModal' | 'toolPage' | 'database'): ComponentSection[] {
  const config = activeComponentConfig.value;
  if (!config) return [];
  
  switch (area) {
    case 'toolModal':
      return config.toolModalSections;
    case 'toolPage':
      return config.toolPageSections;
    case 'database':
      return config.databaseSections;
    default:
      return [];
  }
}

/**
 * Register a new project (plugin pattern)
 */
function registerProject(project: ResearchProject): void {
  if (!projects.value.some(p => p.id === project.id)) {
    projects.value.push(project);
  }
}

/**
 * Register filter configuration for a project
 */
function registerFilterConfig(config: ProjectFilterConfig): void {
  const index = filterConfigs.value.findIndex(c => c.projectId === config.projectId);
  if (index >= 0) {
    filterConfigs.value[index] = config;
  } else {
    filterConfigs.value.push(config);
  }
}

/**
 * Register component configuration for a project
 */
function registerComponentConfig(config: ProjectComponentConfig): void {
  const index = componentConfigs.value.findIndex(c => c.projectId === config.projectId);
  if (index >= 0) {
    componentConfigs.value[index] = config;
  } else {
    componentConfigs.value.push(config);
  }
}

/**
 * Register workflows for a project
 */
function registerWorkflows(newWorkflows: ProjectWorkflow[]): void {
  newWorkflows.forEach(workflow => {
    if (!workflows.value.some(w => w.id === workflow.id)) {
      workflows.value.push(workflow);
    }
  });
}

// ============================================================================
// COMPOSABLE EXPORT
// ============================================================================

export function useProjectProfile() {
  // Initialize on first use
  initializeProject();
  
  return {
    // State (use regular refs for component compatibility)
    activeProjectId,
    projects,
    isLoading,
    error,
    
    // Computed
    activeProject,
    activeFilterConfig,
    activeComponentConfig,
    activeWorkflows,
    isProjectContext,
    activeProjects,
    
    // Actions
    setActiveProject,
    getToolWorkflows,
    isFilterVisible,
    getCustomFilters,
    getComponentSections,
    
    // Plugin registration methods
    registerProject,
    registerFilterConfig,
    registerComponentConfig,
    registerWorkflows,
  };
}
