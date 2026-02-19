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
      // i18n text fields: resolve to nl with en fallback; also return raw arrays for frontend
      "title": coalesce(title[_key == "nl"][0].value, title[_key == "en"][0].value, title),
      "toolsentence": coalesce(toolsentence[_key == "nl"][0].value, toolsentence[_key == "en"][0].value, toolsentence),
      "advantages": coalesce(advantages[_key == "nl"][0].value, advantages[_key == "en"][0].value, advantages),
      "disadvantages": coalesce(disadvantages[_key == "nl"][0].value, disadvantages[_key == "en"][0].value, disadvantages),
      "limitations": coalesce(limitations[_key == "nl"][0].value, limitations[_key == "en"][0].value, limitations),
      // Full i18n arrays so the frontend can resolve per active locale or show all
      "i18n": {
        "title": title[]{ _key, value },
        "toolsentence": toolsentence[]{ _key, value },
        "advantages": advantages[]{ _key, value },
        "disadvantages": disadvantages[]{ _key, value },
        "limitations": limitations[]{ _key, value },
      },
      about,
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
        "name": coalesce(name[_key == "nl"][0].value, name[_key == "en"][0].value, name),
        "nameI18n": name[]{ _key, value },
        "steps": steps[] {
          _key,
          stepNumber,
          "title": coalesce(title[_key == "nl"][0].value, title[_key == "en"][0].value, title),
          "titleI18n": title[]{ _key, value },
          "shortDescription": coalesce(shortDescription[_key == "nl"][0].value, shortDescription[_key == "en"][0].value, shortDescription),
          "shortDescriptionI18n": shortDescription[]{ _key, value },
          "image": image.asset->url,
          "imageAlt": coalesce(imageAlt[_key == "nl"][0].value, imageAlt[_key == "en"][0].value, imageAlt)
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
        "name": coalesce(name[_key == "nl"][0].value, name[_key == "en"][0].value, name),
        "nameI18n": name[]{ _key, value },
        "steps": steps[] {
          _key,
          stepNumber,
          "title": coalesce(title[_key == "nl"][0].value, title[_key == "en"][0].value, title),
          "titleI18n": title[]{ _key, value },
          "shortDescription": coalesce(shortDescription[_key == "nl"][0].value, shortDescription[_key == "en"][0].value, shortDescription),
          "shortDescriptionI18n": shortDescription[]{ _key, value },
          "image": image.asset->url,
          "imageAlt": coalesce(imageAlt[_key == "nl"][0].value, imageAlt[_key == "en"][0].value, imageAlt)
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
          limitations: tool.limitations || [],
          // i18n raw arrays for locale-aware resolution on the frontend
          i18n: tool.i18n || null,
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
