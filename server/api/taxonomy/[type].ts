import { createClient } from '@sanity/client'

export default defineEventHandler(async (event) => {
  try {
    const taxonomyType = getRouterParam(event, 'type')
    
    // Map of type names to their corresponding Sanity document types
    const typeToSanityType: Record<string, string> = {
      'use-types': 'useType',
      'setup-types': 'setupType',
      'pricing-types': 'pricingType',
      'license-types': 'licenseType',
      'generation-times': 'generationTime',
      'input-types': 'inputType',
      'output-types': 'outputType',
      'profile-types': 'profileType',
      'task-types': 'taskType',
    }
    
    const sanityType = typeToSanityType[taxonomyType]
    
    if (!sanityType) {
      throw createError({
        statusCode: 400,
        message: `Unknown taxonomy type: ${taxonomyType}`
      })
    }
    
    // Initialize Sanity client server-side
    const config = useRuntimeConfig()
    const client = createClient({
      projectId: config.public.sanity.projectId,
      dataset: config.public.sanity.dataset,
      apiVersion: config.public.sanity.apiVersion,
      token: config.sanityToken,
      useCdn: config.public.sanity.useCdn,
    })
    
    // Query to get published taxonomy items - get the title field as that's what's being used
    const query = `*[_type == $type && !(_id in path("drafts.**"))] | order(title asc) {
      _id,
      title
    }`
    
    const items = await client.fetch(query, { type: sanityType })
    
    console.log(`Fetched ${items.length} items for ${taxonomyType}:`, items)
    
    // Transform to match expected format with name field
    return {
      data: items.map(item => ({
        id: item._id,
        attributes: {
          name: item.title || ''
        }
      }))
    }
  } catch (error) {
    console.error(`Error fetching taxonomy: ${error.message}`)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch taxonomy'
    })
  }
})
