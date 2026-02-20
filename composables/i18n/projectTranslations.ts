/**
 * projectTranslations.ts
 *
 * Localized text for each project config entry.
 * Fields: profileName, profileDescription, description, shortDescription, targetAudience.
 * localizeProject() merges these into a ProjectConfig object at runtime.
 */

import type { ProjectConfig } from '~/config/projects';

export interface LocalizedProjectData {
  profileName: string;
  profileDescription: string;
  description: string;
  shortDescription: string;
  targetAudience: string[];
}

const projectTranslations: Record<string, Record<string, LocalizedProjectData>> = {
  nl: {
    general: {
      profileName: 'Algemene gebruiker',
      profileDescription: 'Alle AI-tools met standaardfilters',
      description:
        'Bekijk alle AI-tools in onze gecureerde database zonder specifieke projectcontext. Deze weergave toont alle tools met standaardfilters.',
      shortDescription: 'Alle AI-tools met standaardfilters',
      targetAudience: ['Iedereen'],
    },
    aiupd8: {
      profileName: 'Creatieve professional',
      profileDescription:
        'Voor game-ontwikkelaars, filmproducenten, mediaprofessionals en marketingteams',
      description:
        'AI-UPD8 is een COOCK+ project geleid door de HOWEST-onderzoeksgroepen Digital Arts & Entertainment en Business & Media. Onze missie is creatieve bedrijven in de game-, film-, media-, communicatie- en marketingsector wegwijs te maken in het uitgebreide aanbod aan genAI-mogelijkheden.',
      shortDescription: 'GenAI-tools voor creatieve industrieën',
      targetAudience: [
        'Game-ontwikkelaars',
        'Filmproducenten',
        'Mediaprofessionals',
        'Marketingteams',
        'Communicatiespecialisten',
      ],
    },
    psyaid: {
      profileName: 'Psycho-educatieve professional',
      profileDescription:
        'Voor psychologen, opvoeders en professionals in de geestelijke gezondheidszorg',
      description:
        'PSY-AID is een gespecialiseerd project gericht op psycho-educatieve tools en therapeutische middelen. Het biedt een gecureerde selectie van AI-tools specifiek ontworpen voor professionals in de geestelijke gezondheidszorg, psychologen en opvoeders.',
      shortDescription: 'Psycho-educatieve tools en therapeutische middelen',
      targetAudience: [
        'Psychologen',
        'Onderwijspsychologen',
        'Professionals geestelijke gezondheidszorg',
        'Opvoeders',
        'Therapeuten',
      ],
    },
  },

  en: {
    general: {
      profileName: 'General User',
      profileDescription: 'All AI tools with standard filters',
      description:
        'Access all AI tools in our curated database without any specific project context. This view shows all tools with standard filters.',
      shortDescription: 'All AI tools with standard filters',
      targetAudience: ['Everyone'],
    },
    aiupd8: {
      profileName: 'Creative Professional',
      profileDescription:
        'For game developers, film producers, media professionals, and marketing teams',
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
    },
    psyaid: {
      profileName: 'Psychoeducational Professional',
      profileDescription: 'For psychologists, educators, and mental health professionals',
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
    },
  },
};

/**
 * Returns a copy of `project` with all user-facing text fields replaced
 * by the translation for the given locale (falls back to 'nl').
 */
export function localizeProject(project: ProjectConfig, locale: string): ProjectConfig {
  const dict = projectTranslations[locale] ?? projectTranslations['nl'];
  const pt = dict?.[project.id];
  if (!pt) return project;
  return {
    ...project,
    description: pt.description,
    shortDescription: pt.shortDescription,
    targetAudience: pt.targetAudience,
    profile: {
      ...project.profile,
      name: pt.profileName,
      description: pt.profileDescription,
    },
  };
}
