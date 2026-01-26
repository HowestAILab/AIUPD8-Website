import { createClient } from '@sanity/client'

export default defineEventHandler(async (event) => {
  try {
    // Initialize Sanity client server-side
    const config = useRuntimeConfig()
    const client = createClient({
      projectId: config.public.sanity.projectId,
      dataset: config.public.sanity.dataset,
      apiVersion: config.public.sanity.apiVersion,
      token: config.sanityToken,
      useCdn: config.public.sanity.useCdn,
    })

    // Query to get all published tools with their related data (v3.0 - string arrays)
    const query = `*[_type == "tool" && !(_id in path("drafts.**"))]{
      _id,
      _createdAt,
      _updatedAt,
      title,
      toolsentence,
      about,
      advantages,
      disadvantages,
      isFavourite,
      isExperimental,
      link,
      privacyPolicy,
      youtubeLink,
      uses,
      setups,
      pricings,
      licenses,
      generationTimes,
      inputs,
      outputs,
      dataStorageLocations,
      tasks,
      profiles,
      image,
      showcaseImages,
      isAiupdateFavourite,
      "aiupdateWorkflows": aiupdateWorkflows[] {
        _key,
        name,
        "steps": steps[] {
          _key,
          stepNumber,
          title,
          shortDescription,
          "image": image.asset->url,
          imageAlt
        }
      },
      isPsyaidFavourite,
      psychoEducationalProfiles,
      therapyTypes,
      dataDeletionCapabilities,
      euAccessibilityActs,
      aiTransparencies,
      wcagCompliances,
      designQualities,
      onboardingEases,
      offlineFunctionalities,
      readingLevels,
      languageSupports,
      culturalAdaptabilities,
      "psyaidWorkflows": psyaidWorkflows[] {
        _key,
        name,
        "steps": steps[] {
          _key,
          stepNumber,
          title,
          shortDescription,
          "image": image.asset->url,
          imageAlt
        }
      }
    }`
    
    const tools = await client.fetch(query)
    
    // For debugging
    console.log('Raw tools data from Sanity:', JSON.stringify(tools[0], null, 2))
    
    return {
      data: tools.map((tool: any) => ({
        id: tool._id,
        attributes: {
          title: tool.title || "Untitled",
          about: tool.about || "",
          advantages: tool.advantages || [],
          disadvantages: tool.disadvantages || [],
          isFavourite: !!tool.isFavourite,
          isExperimental: !!tool.isExperimental,
          createdAt: tool._createdAt || "",
          updatedAt: tool._updatedAt || "",
          publishedAt: tool._createdAt || "",
          toolsentence: tool.toolsentence,
          privacyPolicy: tool.privacyPolicy || "",
          // v3.0: Filters are now string arrays - pass through and filter nulls
          uses: (tool.uses || []).filter((v: any) => v !== null),
          setups: (tool.setups || []).filter((v: any) => v !== null),
          pricings: (tool.pricings || []).filter((v: any) => v !== null),
          licenses: (tool.licenses || []).filter((v: any) => v !== null),
          generationTimes: (tool.generationTimes || []).filter((v: any) => v !== null),
          inputs: (tool.inputs || []).filter((v: any) => v !== null),
          outputs: (tool.outputs || []).filter((v: any) => v !== null),
          dataStorageLocations: (tool.dataStorageLocations || []).filter((v: any) => v !== null),
          tasks: (tool.tasks || []).filter((v: any) => v !== null),
          profiles: (tool.profiles || []).filter((v: any) => v !== null),
          // Project-specific favorite fields
          isAiupdateFavourite: !!tool.isAiupdateFavourite,
          isPsyaidFavourite: !!tool.isPsyaidFavourite,
          // Map image to match Strapi format
          image: {
            data: tool.image ? {
              id: 0,
              attributes: {
                url: '',
                _sanityAsset: tool.image
              }
            } : null
          },
          Image: {
            data: tool.image ? {
              id: 0,
              attributes: {
                url: '',
                _sanityAsset: tool.image
              }
            } : null
          },
          // Map showcase images to match Strapi format
          showcaseImages: {
            data: tool.showcaseImages?.map((img: any) => ({
              id: 0,
              attributes: {
                url: '',
                _sanityAsset: img
              }
            })) || []
          },
          link: tool.link || "",
          youtubeLink: tool.youtubeLink || "",
          aiupdateWorkflows: tool.aiupdateWorkflows || [],
          // v3.0: PsyAid filters are now string arrays - pass through and filter nulls
          psychoEducationalProfiles: (tool.psychoEducationalProfiles || []).filter((v: any) => v !== null),
          therapyTypes: (tool.therapyTypes || []).filter((v: any) => v !== null),
          dataDeletionCapabilities: (tool.dataDeletionCapabilities || []).filter((v: any) => v !== null),
          euAccessibilityActs: (tool.euAccessibilityActs || []).filter((v: any) => v !== null),
          aiTransparencies: (tool.aiTransparencies || []).filter((v: any) => v !== null),
          wcagCompliances: (tool.wcagCompliances || []).filter((v: any) => v !== null),
          designQualities: (tool.designQualities || []).filter((v: any) => v !== null),
          onboardingEases: (tool.onboardingEases || []).filter((v: any) => v !== null),
          offlineFunctionalities: (tool.offlineFunctionalities || []).filter((v: any) => v !== null),
          readingLevels: (tool.readingLevels || []).filter((v: any) => v !== null),
          languageSupports: (tool.languageSupports || []).filter((v: any) => v !== null),
          culturalAdaptabilities: (tool.culturalAdaptabilities || []).filter((v: any) => v !== null),
          psyaidWorkflows: tool.psyaidWorkflows || []
        }
      }))
    }
  } catch (error) {
    console.error('Error fetching tools from Sanity:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: 500,
      message: `Failed to fetch tools: ${errorMessage}`
    })
  }
})
