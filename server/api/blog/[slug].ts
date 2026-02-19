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

    // title, excerpt, body, outro are now internationalizedArray fields.
    // We fetch them as-is so the frontend can pick the right locale.
    const query = `*[_type == "blogPost" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      mainImage,
      publishedAt,
      excerpt,
      body[]{
        ...,
        _type == "youtube" => { url },
        _type == "toolEmbed" => {
          "tool": tool->{
            _id,
            title,
            toolsentence,
            link,
            youtubeLink,
            image,
            showcaseImages
          }
        }
      },
      outro
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
        // i18n arrays passed through unchanged
        title: post.title ?? [],
        slug: post.slug ?? '',
        publishedAt: post.publishedAt ?? null,
        excerpt: post.excerpt ?? [],
        // body / outro: each entry is { _key: 'nl'|'en', value: blockContent[] }
        body: post.body ?? [],
        outro: post.outro ?? [],
        mainImage: post.mainImage ?? null,
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