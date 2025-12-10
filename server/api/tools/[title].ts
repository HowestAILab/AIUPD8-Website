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
      uses[]->{ _id, title },
      setups[]->{ _id, title },
      pricings[]->{ _id, title },
      licenses[]->{ _id, title },
      generationTimes[]->{ _id, title },
      inputs[]->{ _id, title },
      outputs[]->{ _id, title },
      dataStorageLocations[]->{ _id, title },
      tasks[]->{ _id, title },
      profiles[]->{ _id, title },
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
          // Map relations to match Strapi format with correct name field
          uses: { 
            data: tool.uses?.map((use: any) => ({ 
              id: use._id || 0, 
              attributes: { name: use.title || "" } 
            })) || [] 
          },
          setups: { 
            data: tool.setups?.map((setup: any) => ({ 
              id: setup._id || 0, 
              attributes: { name: setup.title || "" } 
            })) || [] 
          },
          pricings: { 
            data: tool.pricings?.map((pricing: any) => ({ 
              id: pricing._id || 0, 
              attributes: { name: pricing.title || "" } 
            })) || [] 
          },
          licenses: { 
            data: tool.licenses?.map((license: any) => ({ 
              id: license._id || 0, 
              attributes: { name: license.title || "" } 
            })) || [] 
          },
          generationTimes: { 
            data: tool.generationTimes?.map((time: any) => ({ 
              id: time._id || 0, 
              attributes: { name: time.title || "" } 
            })) || [] 
          },
          inputs: { 
            data: tool.inputs?.map((input: any) => ({ 
              id: input._id || 0, 
              attributes: { name: input.title || "" } 
            })) || [] 
          },
          outputs: { 
            data: tool.outputs?.map((output: any) => ({ 
              id: output._id || 0, 
              attributes: { name: output.title || "" } 
            })) || [] 
          },
          dataStorageLocations: { 
            data: tool.dataStorageLocations?.map((location: any) => ({ 
              id: location._id || 0, 
              attributes: { name: location.title || "" } 
            })) || [] 
          },
          tasks: { 
            data: tool.tasks?.map((task: any) => ({ 
              id: task._id || 0, 
              attributes: { name: task.title || "" } 
            })) || [] 
          },
          profiles: { 
            data: tool.profiles?.map((profile: any) => ({ 
              id: profile._id || 0, 
              attributes: { name: profile.title || "" } 
            })) || [] 
          },
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
