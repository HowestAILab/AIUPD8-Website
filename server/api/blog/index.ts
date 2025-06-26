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

    // Query to get all published blog posts
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
      data: posts.map(post => ({
        id: post._id,
        attributes: {
          title: post.title || "Untitled",
          slug: post.slug || "",
          publishedAt: post.publishedAt,
          excerpt: post.excerpt || "",
          mainImage: {
            data: post.mainImage ? {
              id: 0, // Not a real ID, just for format consistency
              attributes: {
                url: '', // URL is constructed on the frontend
                _sanityAsset: post.mainImage
              }
            } : null
          },
        }
      }))
    }
  } catch (error) {
    console.error('Error fetching blog posts from Sanity:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to fetch blog posts: ${error.message}`
    })
  }
}) 