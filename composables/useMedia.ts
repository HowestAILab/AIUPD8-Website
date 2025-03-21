import { useRuntimeConfig } from '#app';
import imageUrlBuilder from '@sanity/image-url';

export function useMedia() {
  const config = useRuntimeConfig();
  
  // Create a Sanity image URL builder
  const createImageUrlBuilder = () => {
    return imageUrlBuilder({
      projectId: config.public.sanity.projectId,
      dataset: config.public.sanity.dataset
    });
  };
  
  /**
   * Get a properly formatted URL for a Sanity image
   */
  const getSanityImageUrl = (image: any, width = 800): string => {
    if (!image) return '';
    
    try {
      // Check if this is a Sanity asset
      if (image._sanityAsset) {
        image = image._sanityAsset;
      }
      
      const builder = createImageUrlBuilder();
      
      // If it's already a URL string, return it
      if (typeof image === 'string') return image;
      
      // Handle Sanity image reference
      if (image.asset) {
        return builder.image(image).width(width).url();
      }
      
      // Handle direct asset reference
      if (image._ref || image._id) {
        return builder.image(image).width(width).url();
      }
      
      // If we have a URL directly, use it
      if (image.url) {
        return image.url;
      }
      
      return '';
    } catch (e) {
      console.error('Error formatting Sanity image URL:', e);
      return '';
    }
  };
  
  /**
   * Formats a Strapi media URL by prepending the DB URL if needed
   */
  const formatStrapiUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${config.public.dbUrl}${url}`;
  };

  /**
   * Extract image URL from any media object structure
   */
  const getMediaUrl = (media: any): string => {
    if (!media) return '';
    
    // Handle null or undefined case
    if (media === null || media === undefined) return '';
    
    // Check if this is a Sanity asset
    if (media._sanityAsset || media.asset || media._ref || media._id) {
      return getSanityImageUrl(media);
    }
    
    // Handle direct URL string
    if (typeof media === 'string') return media;
    
    // Handle standard URL object
    if (media.url) return media.url;
    
    // Handle formats with preference for medium size
    if (media.formats) {
      const url = media.formats.medium?.url || media.formats.small?.url || media.formats.thumbnail?.url || media.url;
      return formatStrapiUrl(url || '');
    }
    
    // Handle nested data structure from Strapi v4
    if (media.data) {
      const attributes = media.data.attributes || {};
      const url = attributes.formats?.medium?.url || attributes.formats?.small?.url || attributes.url;
      return formatStrapiUrl(url || '');
    }
    
    // Handle attributes directly
    if (media.attributes) {
      const url = media.attributes.formats?.medium?.url || media.attributes.formats?.small?.url || media.attributes.url;
      return formatStrapiUrl(url || '');
    }
    
    return '';
  };

  /**
   * Extract image from carousel item
   */
  const getCarouselImageUrl = (item: any): string => {
    if (!item) return '';
    
    // Handle Sanity image
    if (item._sanityAsset || item.asset || item._ref || item._id) {
      return getSanityImageUrl(item);
    }
    
    // If the item itself has an image property
    if (item.image) {
      return getSanityImageUrl(item.image);
    }
    
    // Fallback to standard media handling
    return getMediaUrl(item);
  };
  
  /**
   * Parse YouTube URL to get embed URL
   */
  const getYoutubeEmbedUrl = (url: string): string => {
    if (!url) return '';
    
    // Already an embed URL
    if (url.includes('youtube.com/embed/')) return url;
    
    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }
    
    // Handle standard youtube.com format
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }
    
    // If URL is already an embed or doesn't match patterns, return as is
    return url;
  };
  
  return {
    formatStrapiUrl,
    getMediaUrl,
    getCarouselImageUrl,
    getYoutubeEmbedUrl,
    getSanityImageUrl
  };
}
