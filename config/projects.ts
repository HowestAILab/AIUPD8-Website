/**
 * Project Configuration with Profile Mapping
 * 
 * This is the SINGLE SOURCE OF TRUTH for all project configuration.
 * Each project maps to a specific profile that represents the target audience/user type.
 * 
 * Configuration includes:
 * - Project ID (internal, camelCase, used in backend field names: is{Project}Favourite)
 * - Project name (internal name)
 * - Project slug (URL slug)
 * - Color (hex format, used for UI theming and favorite badges)
 * - Profile (user-facing display information)
 * - Target audience (array of audience types)
 * - Description (full project description)
 * - Short description (brief description for cards)
 * - Logos (partner/sponsor logos)
 * - Status (whether project is active)
 */

export interface ProjectConfig {
  id: string;
  name: string; // Internal name for the project
  slug: string;
  color: string; // Hex color for UI (badges, backgrounds, themes)
  profile: {
    name: string; // Display name for the profile (shown to users)
    description: string; // Profile description shown in UI
  };
  description: string; // Full project description (for detail pages)
  shortDescription: string; // Brief description (for cards, tabs)
  targetAudience: string[]; // Array of target audience types
  logos: Array<{ src: string; alt: string; url?: string }>; // Partner logos
  image: string; // Project image
  isActive: boolean;
}

/**
 * Project and Profile Configuration
 * Single source of truth for all project data - used throughout the app
 */
export const projectConfigs: ProjectConfig[] = [
  {
    id: 'general',
    name: 'General Database',
    slug: 'general',
    color: '#3B82F6', // blue-500
    profile: {
      name: 'General User',
      description: 'All AI tools with standard filters',
    },
    description:
      'Access all AI tools in our curated database without any specific project context. This view shows all tools with standard filters.',
    shortDescription: 'All AI tools with standard filters',
    targetAudience: ['Everyone'],
    logos: [],
    image: '/images/general-database.jpg',
    isActive: true,
  },
  {
    id: 'aiupd8',
    name: 'AI-UPD8',
    slug: 'aiupd8',
    color: '#8B5CF6', // purple-500
    profile: {
      name: 'Creative Professional',
      description:
        'For game developers, film producers, media professionals, and marketing teams',
    },
    description:
      'AI-UPD8 is a COOCK+ project led by the HOWEST research groups Digital Arts & Entertainment and Business & Media. Our mission is to guide creative companies in the game, film, media, communication, and marketing sectors through the maze of genAI possibilities.',
    shortDescription: 'GenAI tools for creative industries',
    targetAudience: [
      'Game Developers',
      'Film Producers',
      'Media Professionals',
      'Marketing Teams',
      'Communication Specialists',
    ],
    logos: [
      { src: '/images/DAE.png', alt: 'Digital Arts & Entertainment' },
      { src: '/images/VLAIO.png', alt: 'VLAIO' },
      { src: '/images/bm_cluster.png', alt: 'Business & Media Cluster' },
      { src: '/images/AI-Lab.png', alt: 'AI Lab' },
    ],
    image: '/images/aiupd8-project.jpg',
    isActive: true,
  },
  {
    id: 'psyaid',
    name: 'PSY-AID',
    slug: 'psyaid',
    color: '#EC4899', // pink-500
    profile: {
      name: 'Psychoeducational Professional',
      description: 'For psychologists, educators, and mental health professionals',
    },
    description:
      'PSY-AID is a specialized project focused on psychoeducational tools and therapeutic resources. It provides a curated selection of AI tools specifically designed for mental health professionals, psychologists, and educational practitioners.',
    shortDescription: 'Psychoeducational tools and therapeutic resources',
    targetAudience: [
      'Psychologists',
      'Educational Psychologists',
      'Mental Health Professionals',
      'Educators',
      'Therapists',
    ],
    logos: [
      { src: '/images/artevelde-logo.png', alt: 'Artevelde Hogeschool' },
      { src: '/images/AI-Lab.png', alt: 'AI Lab' },
    ],
    image: '/images/psyaid-project.jpg',
    isActive: true,
  },
  // Template for adding new projects:
  // {
  //   id: 'newproject',
  //   name: 'New Project',
  //   slug: 'newproject',
  //   color: '#F59E0B', // amber-500
  //   profile: {
  //     name: 'Your Profile Name',
  //     description: 'Profile description for users',
  //   },
  //   description: 'Full project description...',
  //   shortDescription: 'Brief description for cards',
  //   targetAudience: ['Audience 1', 'Audience 2'],
  //   logos: [],
  //   image: '/images/newproject.jpg',
  //   isActive: true,
  // },
];

/**
 * Get project config by ID
 */
export const getProjectConfig = (projectId: string): ProjectConfig | undefined => {
  return projectConfigs.find(p => p.id === projectId);
};

/**
 * Get all active projects
 */
export const getActiveProjects = (): ProjectConfig[] => {
  return projectConfigs.filter(p => p.isActive);
};

/**
 * Get project color by ID
 */
export const getProjectColor = (projectId: string): string => {
  return getProjectConfig(projectId)?.color || '#3B82F6';
};

/**
 * Get project profile by ID
 */
export const getProjectProfile = (projectId: string) => {
  return getProjectConfig(projectId)?.profile;
};

/**
 * Map backend favorite field names to project IDs
 * Based on schema pattern: is{Project}Favourite
 * e.g., isAiupdateFavourite -> aiupd8
 */
export const getFavouriteFieldName = (projectId: string): string => {
  const config = getProjectConfig(projectId);
  if (!config) return '';
  
  // Capitalize first letter of id and convert to camelCase
  const capitalized = config.id.charAt(0).toUpperCase() + config.id.slice(1);
  return `is${capitalized}Favourite`;
};

/**
 * Parse favorite field name back to project ID
 * e.g., isAiupdateFavourite -> aiupd8
 */
export const getProjectIdFromFavouriteField = (fieldName: string): string | undefined => {
  // Remove 'is' prefix and 'Favourite' suffix
  const middle = fieldName.replace(/^is/, '').replace(/Favourite$/, '');
  
  // Find the project with this ID (case-insensitive)
  const config = projectConfigs.find(p => 
    p.id.toLowerCase() === middle.toLowerCase()
  );
  
  return config?.id;
};

/**
 * Get all favorite field names for GROQ query
 * Returns an object with field names and their project IDs
 */
export const getAllFavouriteFields = (): Record<string, string> => {
  const fields: Record<string, string> = {};
  projectConfigs.forEach(config => {
    if (config.id !== 'general') { // Don't include general in favorites
      fields[getFavouriteFieldName(config.id)] = config.id;
    }
  });
  return fields;
};
