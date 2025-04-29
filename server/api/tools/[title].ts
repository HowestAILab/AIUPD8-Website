import { createClient } from '@sanity/client'

export default defineEventHandler(async (event) => {
  try {
    // Get and decode the title parameter
    const title = decodeURIComponent(getRouterParam(event, 'title'))
    
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
      title,
      description,
      toolsentence,
      isFavourite,
      isExperimental,
      link,
      youtubeLink,
      uses[]->{ _id, title },
      setups[]->{ _id, title },
      pricings[]->{ _id, title },
      licenses[]->{ _id, title },
      generationTimes[]->{ _id, title },
      inputs[]->{ _id, title },
      outputs[]->{ _id, title },
      tasks[]->{ _id, title },
      profiles[]->{ _id, title },
      image,
      showcaseImages
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
          description: tool.description || "",
          isFavourite: !!tool.isFavourite,
          isExperimental: !!tool.isExperimental,
          createdAt: "",
          updatedAt: "",
          publishedAt: "",
          toolsentence: tool.toolsentence,
          // Map relations to match Strapi format with correct name field
          uses: { 
            data: tool.uses?.map(use => ({ 
              id: use._id || 0, 
              attributes: { name: use.title || "" } 
            })) || [] 
          },
          setups: { 
            data: tool.setups?.map(setup => ({ 
              id: setup._id || 0, 
              attributes: { name: setup.title || "" } 
            })) || [] 
          },
          pricings: { 
            data: tool.pricings?.map(pricing => ({ 
              id: pricing._id || 0, 
              attributes: { name: pricing.title || "" } 
            })) || [] 
          },
          licenses: { 
            data: tool.licenses?.map(license => ({ 
              id: license._id || 0, 
              attributes: { name: license.title || "" } 
            })) || [] 
          },
          generationTimes: { 
            data: tool.generationTimes?.map(time => ({ 
              id: time._id || 0, 
              attributes: { name: time.title || "" } 
            })) || [] 
          },
          inputs: { 
            data: tool.inputs?.map(input => ({ 
              id: input._id || 0, 
              attributes: { name: input.title || "" } 
            })) || [] 
          },
          outputs: { 
            data: tool.outputs?.map(output => ({ 
              id: output._id || 0, 
              attributes: { name: output.title || "" } 
            })) || [] 
          },
          tasks: { 
            data: tool.tasks?.map(task => ({ 
              id: task._id || 0, 
              attributes: { name: task.title || "" } 
            })) || [] 
          },
          profiles: { 
            data: tool.profiles?.map(profile => ({ 
              id: profile._id || 0, 
              attributes: { name: profile.title || "" } 
            })) || [] 
          },
          // Map image to match Strapi format
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
            data: tool.showcaseImages?.map(img => ({
              id: 0,
              attributes: {
                url: '',
                _sanityAsset: img
              }
            })) || []
          },
          link: tool.link || "",
          youtubeLink: tool.youtubeLink || ""
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching tool: ${error.message}`)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch tool'
    })
  }
})
