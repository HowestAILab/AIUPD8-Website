import { createClient } from '@sanity/client'

export default defineEventHandler(async (event) => {
  try {
    // Get and decode the title parameter
    const title = decodeURIComponent(getRouterParam(event, 'title') || '')
    
    // Initialize Sanity client server-side
    const config = useRuntimeConfig()
    const client = createClient({
      projectId: config.public.sanity.projectId,
      dataset: config.public.sanity.dataset,
      apiVersion: config.public.sanity.apiVersion,
      token: config.sanityToken,
      useCdn: config.public.sanity.useCdn,
    })

    // Query to get a specific tool
    const query = `*[_type == "tool" && (title[_key == "nl"][0].value == $title || title[_key == "en"][0].value == $title || title == $title)][0]{
      _id,
      _createdAt,
      _updatedAt,
      // i18n text fields
      "title": coalesce(title[_key == "nl"][0].value, title[_key == "en"][0].value, title),
      "toolsentence": coalesce(toolsentence[_key == "nl"][0].value, toolsentence[_key == "en"][0].value, toolsentence),
      "advantages": coalesce(advantages[_key == "nl"][0].value, advantages[_key == "en"][0].value, advantages),
      "disadvantages": coalesce(disadvantages[_key == "nl"][0].value, disadvantages[_key == "en"][0].value, disadvantages),
      "limitations": coalesce(limitations[_key == "nl"][0].value, limitations[_key == "en"][0].value, limitations),
      "description": coalesce(description[_key == "nl"][0].value, description[_key == "en"][0].value, description),
      "i18n": {
        "title": title[]{ _key, value },
        "toolsentence": toolsentence[]{ _key, value },
        "description": description[]{ _key, value },
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
      dataDeletionCapabilities,
      suitabilityRobustnesses,
      onboardingEases,
      offlineFunctionalities,
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
    
    const tool = await client.fetch(query, { title })
    
    if (!tool) {
      throw createError({
        statusCode: 404,
        message: `Tool with title "${title}" not found`
      })
    }
    
    return {
      data: {
        id: tool._id,
        attributes: {
          title: tool.title || "Untitled",
          about: tool.about || "",
          description: tool.description || "",
          advantages: tool.advantages || [],
          disadvantages: tool.disadvantages || [],
          limitations: tool.limitations || [],
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
          isAiupdateFavourite: !!tool.isAiupdateFavourite,
          aiupdateWorkflows: tool.aiupdateWorkflows || [],
          isPsyaidFavourite: !!tool.isPsyaidFavourite,
          dataDeletionCapabilities: (tool.dataDeletionCapabilities || []).filter((v: any) => v !== null),
          suitabilityRobustnesses: (tool.suitabilityRobustnesses || []).filter((v: any) => v !== null),
          onboardingEases: (tool.onboardingEases || []).filter((v: any) => v !== null),
          offlineFunctionalities: (tool.offlineFunctionalities || []).filter((v: any) => v !== null),
          psyaidWorkflows: tool.psyaidWorkflows || [],
        }
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const statusCode = (error as any)?.statusCode || 500
    console.error(`Error fetching tool: ${errorMessage}`)
    throw createError({
      statusCode,
      message: errorMessage || 'Failed to fetch tool'
    })
  }
})
