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

    // Query to get all published tools with their related data
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
      "uses": uses[]->{ _id, title },
      "setups": setups[]->{ _id, title },
      "pricings": pricings[]->{ _id, title },
      "licenses": licenses[]->{ _id, title },
      "generationTimes": generationTimes[]->{ _id, title },
      "inputs": inputs[]->{ _id, title },
      "outputs": outputs[]->{ _id, title },
      "dataStorageLocations": dataStorageLocations[]->{ _id, title },
      "tasks": tasks[]->{ _id, title },
      "profiles": profiles[]->{ _id, title },
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
      "psychoEducationalProfiles": psychoEducationalProfiles[]->{ _id, title },
      "therapyTypes": therapyTypes[]->{ _id, title },
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
          // PsyAid project-specific fields
          psychoEducationalProfiles: {
            data: tool.psychoEducationalProfiles?.map((profile: any) => ({
              id: profile._id || 0,
              attributes: { name: profile.title || "" }
            })) || []
          },
          therapyTypes: {
            data: tool.therapyTypes?.map((type: any) => ({
              id: type._id || 0,
              attributes: { name: type.title || "" }
            })) || []
          },
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
