import { createClient } from '@sanity/client'

export default defineEventHandler(async () => {
  try {
    const config = useRuntimeConfig()
    const client = createClient({
      projectId: config.public.sanity.projectId,
      dataset: config.public.sanity.dataset,
      apiVersion: config.public.sanity.apiVersion,
      token: config.sanityToken,
      useCdn: config.public.sanity.useCdn,
    })

    const query = `*[_type == "offerItem" && !(_id in path("drafts.**"))] | order(coalesce(order, 9999) asc, _createdAt asc){
      _id,
      heading,
      subtitle,
      body,
      image,
      imageAlt,
      variants[]{ name, description }
    }`

    const items = await client.fetch(query)

    return {
      data: items.map((it: any) => ({
        id: it._id,
        attributes: {
          heading: it.heading || '',
          subtitle: it.subtitle || '',
          body: it.body || [],
          image: it.image || null,
          imageAlt: it.imageAlt || '',
          variants: it.variants || [],
        }
      }))
    }
  } catch (error: any) {
    console.error('Error fetching offer items from Sanity:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to fetch offers: ${error.message}`
    })
  }
})


