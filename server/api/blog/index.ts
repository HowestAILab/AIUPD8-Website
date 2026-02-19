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

    // title and excerpt are now internationalizedArrayString / internationalizedArrayText
    const query = `*[_type == "blogPost" && !(_id in path("drafts.**"))]{
      _id,
      title,
      "slug": slug.current,
      mainImage,
      publishedAt,
      excerpt
    }`
    
    const posts = await client.fetch(query)
    
    return {
      data: posts.map((post: any) => ({
        id: post._id,
        // Pass i18n arrays through as-is; the frontend resolves them
        title: post.title ?? [],
        slug: post.slug ?? '',
        publishedAt: post.publishedAt ?? null,
        excerpt: post.excerpt ?? [],
        mainImage: post.mainImage ?? null,
      }))
    }
  } catch (error: any) {
    console.error('Error fetching blog posts from Sanity:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to fetch blog posts: ${error.message}`
    })
  }
}) 