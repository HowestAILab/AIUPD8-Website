/**
 * Filter Labels Configuration (v3.0)
 * 
 * This file provides human-readable labels and metadata for all filter values.
 * The backend now returns filter fields as string arrays with preset values.
 * This file maps those string values to display labels and ordering.
 */

export interface FilterOption {
  value: string;
  label: string;
}

/**
 * General filter labels shared across all projects
 */
export const filterLabels = {
  // Use Types
  uses: {
    'no-code': 'No Code',
    'low-code': 'Low Code',
    'code': 'Code',
    // 'api': 'API',
    // 'plugin': 'Plugin'
  } as Record<string, string>,

  // Setup Types
  setups: {
    'no-code': 'No Code',
    'low-code': 'Low Code',
    'code': 'Code',
    // 'local': 'Local',
    // 'cloud': 'Cloud'
  } as Record<string, string>,

  // Pricing Types
  pricings: {
    'free': 'Free',
    // 'freemium': 'Freemium',
    'subscription': 'Subscription',
    'credits': 'Credits',
    // 'one-time': 'One-Time',
    // 'enterprise': 'Enterprise'
  } as Record<string, string>,

  // License Types
  licenses: {
    'personal': 'Personal',
    'commercial': 'Commercial',
    'open-source': 'Open Source',
    // 'proprietary': 'Proprietary',
    // 'creative-commons': 'Creative Commons',
    // 'educational': 'Educational'
  } as Record<string, string>,

  // Input Types
  inputs: {
    'text': 'Text',
    'image': 'Image',
    'video': 'Video',
    'audio': 'Audio',
    'code': 'Code',
    'file': 'File',
    'url': 'URL',
    'json': 'JSON',
    'csv': 'CSV',
    // 'webhook': 'Webhook',
    'http': 'HTTP'
  } as Record<string, string>,

  // Output Types
  outputs: {
    'text': 'Text',
    'image': 'Image',
    'video': 'Video',
    'audio': 'Audio',
    'code': 'Code',
    'file': 'File',
    'json': 'JSON',
    'csv': 'CSV',
    'html': 'HTML',
    'pdf': 'PDF',
    'workflow': 'Workflow'
  } as Record<string, string>,

  // Data Storage Locations
  dataStorageLocations: {
    'eu': 'EU',
    'us': 'US',
    'global': 'Global',
    'local': 'Local',
    'unknown': 'Unknown'
  } as Record<string, string>,

  // Aiupdate Filters

  // Generation Times
  generationTimes: {
    'seconds': 'Seconds',
    'minutes': 'Minutes',
    'hours': 'Hours',
    'real-time': 'Real-Time'
  } as Record<string, string>,

  // Task Types
  tasks: {
    'text-generation': 'Text Generation',
    'text-editing': 'Text Editing',
    'text-to-speech': 'Text-to-Speech',
    'speech-to-text': 'Speech-to-Text',
    'image-generation': 'Image Generation',
    'image-editing': 'Image Editing',
    'image-to-video': 'Image-to-Video',
    'image-upscaling': 'Image Upscaling',
    'video-generation': 'Video Generation',
    'video-editing': 'Video Editing',
    'text-to-video': 'Text-to-Video',
    'video-to-video': 'Video-to-Video',
    'audio-generation': 'Audio Generation',
    'audio-editing': 'Audio Editing',
    'code-generation': 'Code Generation',
    'code-analysis': 'Code Analysis',
    '3d-generation': '3D Generation',
    '3d-editing': '3D Editing',
    'workflow-automation': 'Workflow Automation',
    'data-analysis': 'Data Analysis'
  } as Record<string, string>,

  // Profile Types
  profiles: {
    'content-writer': 'Content Writer',
    'copywriter': 'Copywriter',
    'creative-director': 'Creative Director',
    'developer': 'Developer',
    'designer': 'Designer',
    'marketer': 'Marketer',
    'video-editor': 'Video Editor',
    'audio-producer': 'Audio Producer',
    'data-analyst': 'Data Analyst',
    'project-manager': 'Project Manager',
    '3d-artist': '3D Artist',
    'business-owner': 'Business Owner',
    'student': 'Student',
    'researcher': 'Researcher',
    'educator': 'Educator'
  } as Record<string, string>,

  // PsyAid Filters (Dutch labels)

  // Platforms
  platforms: {
    'web': 'Web',
    'ios': 'iOS',
    'android': 'Android',
    'offline': 'Offline'
  } as Record<string, string>,

  // Data Deletion Capabilities
  dataDeletionCapabilities: {
    'ja': 'Ja',
    'deels': 'Deels',
    'nee': 'Nee'
  } as Record<string, string>,

  // EU Accessibility Acts
  euAccessibilityActs: {
    'ja': 'Ja',
    'niet-van-toepassing': 'Niet van toepassing'
  } as Record<string, string>,

  // AI Transparency
  aiTransparencies: {
    'volledig-uitgelegd': 'Volledig uitgelegd',
    'versimpeld': 'Versimpeld',
    'niet-transparant': 'Niet transparant'
  } as Record<string, string>,

  // WCAG Compliance
  wcagCompliances: {
    'wcag-2.1-aa': 'WCAG 2.1 AA',
    'wcag-2.1-a': 'WCAG 2.1 A',
    'geen': 'Geen'
  } as Record<string, string>,

  // Design Quality
  designQualities: {
    'ja': 'Ja',
    'deels': 'Deels',
    'nee': 'Nee'
  } as Record<string, string>,

  // Onboarding Ease
  onboardingEases: {
    'ja': 'Ja',
    'deels': 'Deels',
    'nee': 'Nee'
  } as Record<string, string>,

  // Offline Functionality
  offlineFunctionalities: {
    'volledig': 'Volledig',
    'beperkt': 'Beperkt',
    'niet': 'Niet'
  } as Record<string, string>,

  // Reading Levels
  readingLevels: {
    'a1': 'A1',
    'a2': 'A2',
    'b1': 'B1',
    'b2': 'B2',
    'c1': 'C1',
    'c2': 'C2'
  } as Record<string, string>,

  // Language Support
  languageSupports: {
    'nederlands': 'Nederlands',
    'engels': 'Engels',
    'meerdere-talen': 'Meerdere talen'
  } as Record<string, string>,

  // Cultural Adaptability
  culturalAdaptabilities: {
    'ja': 'Ja',
    'beperkt': 'Beperkt',
    'nee': 'Nee'
  } as Record<string, string>,

  // Psycho-Educational Profiles
  psychoEducationalProfiles: {
    'anxiety': 'Anxiety',
    'depression': 'Depression',
    'stress': 'Stress',
    'ptsd': 'PTSD',
    'adhd': 'ADHD',
    'autism': 'Autism',
    'bipolar': 'Bipolar',
    'eating-disorders': 'Eating Disorders',
    'addiction': 'Addiction',
    'sleep-disorders': 'Sleep Disorders',
    'general-mental-health': 'General Mental Health',
    'wellbeing': 'Wellbeing',
    'mindfulness': 'Mindfulness',
    'cognitive-behavioral': 'Cognitive Behavioral'
  } as Record<string, string>,

  // Therapy Types
  therapyTypes: {
    'cbt': 'CBT',
    'act': 'ACT',
    'dbt': 'DBT',
    'psychodynamic': 'Psychodynamic',
    'mindfulness': 'Mindfulness',
    'emdr': 'EMDR',
    'solution-focused': 'Solution-Focused',
    'art-therapy': 'Art Therapy',
    'music-therapy': 'Music Therapy',
    'group-therapy': 'Group Therapy',
    'self-help': 'Self-Help',
    'psychoeducation': 'Psychoeducation'
  } as Record<string, string>
};

/**
 * Get human-readable label for a filter value
 * @param filterType The filter type/field name (e.g., 'uses', 'setups', 'therapyTypes')
 * @param value The filter value (e.g., 'no-code')
 * @returns The display label, or the value itself if no label found
 */
export function getFilterLabel(filterType: string, value: string): string {
  const labels = filterLabels[filterType as keyof typeof filterLabels];
  if (labels && labels[value]) {
    return labels[value];
  }
  // Fallback: convert kebab-case to Title Case
  return value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get all available options for a filter type with labels
 * @param filterType The filter type/field name
 * @returns Array of {value, label} objects
 */
export function getFilterOptions(filterType: string): FilterOption[] {
  const labels = filterLabels[filterType as keyof typeof filterLabels];
  if (labels) {
    return Object.entries(labels).map(([value, label]) => ({ value, label }));
  }
  return [];
}

/**
 * Convert a string array to filter options with labels
 * @param filterType The filter type/field name
 * @param values Array of string values
 * @returns Array of {value, label} objects
 */
export function stringArrayToOptions(filterType: string, values: string[]): FilterOption[] {
  return values.map(value => ({
    value,
    label: getFilterLabel(filterType, value)
  }));
}

/**
 * Define which filters use button groups (instead of multi-select)
 * Note: This is now dynamic based on option count, but kept for backwards compatibility
 */
export const buttonGroupFilters = ['setups', 'uses', 'pricings', 'licenses', 'generationTimes'];

/**
 * Check if a filter should use button group component
 * Filters with 3 or fewer options use button groups (circles), otherwise use dropdowns
 * @param filterId The filter ID
 * @param optionCount The number of options available for this filter
 * @returns true if should use button group, false if should use multi-select
 */
export function shouldUseButtonGroup(filterId: string, optionCount?: number): boolean {
  // If option count is provided, use it to determine the component type
  if (optionCount !== undefined) {
    return optionCount <= 3;
  }
  // Fallback to old behavior for backwards compatibility
  return buttonGroupFilters.includes(filterId);
}
