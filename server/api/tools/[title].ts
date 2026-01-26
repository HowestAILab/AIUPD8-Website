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
    const query = `*[_type == "tool" && title == $title][0]{
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
          aiupdateWorkflows: tool.aiupdateWorkflows || []
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
