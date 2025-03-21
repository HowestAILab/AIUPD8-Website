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

    // Query to get all tools with their related data
    const query = `*[_type == "tool"]{
      _id,
      title,
      description,
      isFavourite,
      link,
      youtubeLink,
      "uses": uses[]->{ _id, title },
      "setups": setups[]->{ _id, title },
      "pricings": pricings[]->{ _id, title },
      "licenses": licenses[]->{ _id, title },
      "generationTimes": generationTimes[]->{ _id, title },
      "inputs": inputs[]->{ _id, title },
      "outputs": outputs[]->{ _id, title },
      "tasks": tasks[]->{ _id, title },
      "profiles": profiles[]->{ _id, title },
      image,
      showcaseImages
    }`
    
    const tools = await client.fetch(query)
    
    // For debugging
    console.log('Raw tools data from Sanity:', JSON.stringify(tools[0], null, 2))
    
    return {
      data: tools.map(tool => ({
        id: tool._id,
        attributes: {
          title: tool.title || "Untitled",
          description: tool.description || "",
          isFavourite: !!tool.isFavourite,
          createdAt: "",
          updatedAt: "",
          publishedAt: "",
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
      }))
    }
  } catch (error) {
    console.error('Error fetching tools from Sanity:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to fetch tools: ${error.message}`
    })
  }
})
