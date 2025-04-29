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
   * Helper: Cache a value in localStorage for 1 day (24h)
   */
  const getCachedUrl = (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        const { url, timestamp } = JSON.parse(cached);
        const CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day
        if (Date.now() - timestamp < CACHE_TTL) {
          return url;
        }
      } catch {}
    }
    return null;
  };
  const setCachedUrl = (key: string, url: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify({ url, timestamp: Date.now() }));
  };

  /**
   * Get a properly formatted URL for a Sanity image, with 1-day cache
   */
  const getSanityImageUrl = (image: any, width = 800): string => {
    if (!image) return '';
    // Use a cache key based on image ref/id and width
    const cacheKey = `aiupd8_media_sanity_${(image._ref || image._id || image.asset?._ref || image.asset?._id || JSON.stringify(image)).replace(/[^a-zA-Z0-9_]/g, '')}_${width}`;
    const cached = getCachedUrl(cacheKey);
    if (cached) return cached;
    
    try {
      // Check if this is a Sanity asset
      if (image._sanityAsset) {
        image = image._sanityAsset;
      }
      
      const builder = createImageUrlBuilder();
      
      // If it's already a URL string, return it
      let url = '';
      if (typeof image === 'string') url = image;
      else if (image.asset) url = builder.image(image).width(width).url();
      else if (image._ref || image._id) url = builder.image(image).width(width).url();
      else if (image.url) url = image.url;
      if (url) setCachedUrl(cacheKey, url);
      return url;
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
   * Extract image URL from any media object structure, with 1-day cache
   */
  const getMediaUrl = (media: any): string => {
    if (!media) return '';
    // Use a cache key based on JSON string of media
    const cacheKey = `aiupd8_media_url_${JSON.stringify(media).replace(/[^a-zA-Z0-9_]/g, '')}`;
    const cached = getCachedUrl(cacheKey);
    if (cached) return cached;
    
    let url = '';
    // Handle null or undefined case
    if (media === null || media === undefined) return '';
    
    // Check if this is a Sanity asset
    if (media._sanityAsset || media.asset || media._ref || media._id) {
      url = getSanityImageUrl(media);
    }
    
    // Handle direct URL string
    else if (typeof media === 'string') url = media;
    
    // Handle standard URL object
    else if (media.url) url = media.url;
    
    // Handle formats with preference for medium size
    else if (media.formats) {
      url = media.formats.medium?.url || media.formats.small?.url || media.formats.thumbnail?.url || media.url;
      url = formatStrapiUrl(url || '');
    }
    
    // Handle nested data structure from Strapi v4
    else if (media.data) {
      const attributes = media.data.attributes || {};
      url = attributes.formats?.medium?.url || attributes.formats?.small?.url || attributes.url;
      url = formatStrapiUrl(url || '');
    }
    
    // Handle attributes directly
    else if (media.attributes) {
      url = media.attributes.formats?.medium?.url || media.attributes.formats?.small?.url || media.attributes.url;
      url = formatStrapiUrl(url || '');
    }
    
    if (url) setCachedUrl(cacheKey, url);
    return url;
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
