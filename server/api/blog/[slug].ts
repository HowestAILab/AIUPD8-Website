import { createClient } from '@sanity/client'

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug')
    
    const config = useRuntimeConfig()
    const client = createClient({
      projectId: config.public.sanity.projectId,
      dataset: config.public.sanity.dataset,
      apiVersion: config.public.sanity.apiVersion,
      token: config.sanityToken,
      useCdn: config.public.sanity.useCdn,
    })

    const query = `*[_type == "blogPost" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      mainImage,
      publishedAt,
      excerpt,
      body[]{
        ...,
        _type == "youtube" => {
          url
        },
        _type == "toolEmbed" => {
          "tool": tool->{
            _id,
            title,
            description,
            isFavourite,
            isExperimental,
            link,
            toolsentence,
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
          }
        }
      }
    }`
    
    const post = await client.fetch(query, { slug })
    
    if (!post) {
      throw createError({
        statusCode: 404,
        message: `Blog post with slug "${slug}" not found`
      })
    }
    
    return {
      data: {
        id: post._id,
        attributes: {
          title: post.title || "Untitled",
          slug: post.slug || "",
          publishedAt: post.publishedAt,
          excerpt: post.excerpt || "",
          body: post.body || [],
          mainImage: {
            data: post.mainImage ? {
              id: 0,
              attributes: {
                url: '',
                _sanityAsset: post.mainImage
              }
            } : null
          },
        }
      }
    }
  } catch (error: any) {
    console.error(`Error fetching blog post: ${error.message}`)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch blog post'
    })
  }
}) 