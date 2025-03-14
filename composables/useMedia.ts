import { useRuntimeConfig } from '#app';

export function useMedia() {
  const config = useRuntimeConfig();
  
  /**
   * Formats a Strapi media URL by prepending the DB URL if needed
   */
  const formatStrapiUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${config.public.dbUrl}${url}`;
  };

  /**
   * Extract image URL from any Strapi media object structure
   */
  const getMediaUrl = (media: any): string => {
    if (!media) return '';
    
    // Handle null or undefined case
    if (media === null || media === undefined) return '';
    
    // Handle direct URL string
    if (typeof media === 'string') return formatStrapiUrl(media);
    
    // Handle standard Strapi media object
    if (media.url) return formatStrapiUrl(media.url);
    
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
   * Extract image from carousel.image component
   */
  const getCarouselImageUrl = (item: any): string => {
    if (!item) return '';
    console.log('Processing carousel item:', item);
  
    // Handle dynamiczone carousel.image component
    if (item.__component === 'carousel.image' || item.component === 'carousel.image') {
      console.log('Found carousel.image component');
      
      // Access the nested image field inside the component
      let imageField = item.image || {};
      console.log('Raw image field:', imageField);
      
      // If we get a direct image object (with formats/url)
      if (imageField.formats || imageField.url) {
        const url = imageField.formats?.medium?.url || 
                  imageField.formats?.small?.url || 
                  imageField.url;
        console.log('Direct image URL:', url);
        return formatStrapiUrl(url || '');
      }
      
      // Handle nested data structure (data.attributes format)
      if (imageField.data && imageField.data.attributes) {
        const attributes = imageField.data.attributes;
        const url = attributes.formats?.medium?.url || 
                  attributes.formats?.small?.url || 
                  attributes.url;
        console.log('Nested image URL from data.attributes:', url);
        return formatStrapiUrl(url || '');
      }
      
      // Handle when image field itself has a data wrapper
      if (imageField.data && !imageField.data.attributes) {
        imageField = imageField.data;
        console.log('Unwrapped from data layer:', imageField);
      }
      
      // Handle direct attributes
      if (imageField.attributes) {
        const attributes = imageField.attributes;
        const url = attributes.formats?.medium?.url || 
                  attributes.formats?.small?.url || 
                  attributes.url;
        console.log('Image URL from attributes:', url);
        return formatStrapiUrl(url || '');
      }
    }
    
    // Last resort - try to find any URL-like property at any level
    const findImageUrl = (obj: any): string => {
      if (!obj || typeof obj !== 'object') return '';
      
      // Check for common image URL patterns
      if (obj.url && typeof obj.url === 'string') {
        return formatStrapiUrl(obj.url);
      }
      
      if (obj.formats && obj.formats.medium?.url) {
        return formatStrapiUrl(obj.formats.medium.url);
      }
      
      if (obj.formats && obj.formats.small?.url) {
        return formatStrapiUrl(obj.formats.small.url);
      }
      
      // Recursively search in nested objects
      for (const key in obj) {
        if (key === 'image' && obj[key]) {
          const imgUrl = findImageUrl(obj[key]);
          if (imgUrl) return imgUrl;
        }
        
        if (typeof obj[key] === 'object') {
          const imgUrl = findImageUrl(obj[key]);
          if (imgUrl) return imgUrl;
        }
      }
      
      return '';
    };
    
    const url = findImageUrl(item);
    if (url) {
      console.log('Found image URL through deep search:', url);
      return url;
    }
    
    // Fallback to standard media handling
    console.log('Falling back to standard media handling');
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
    getYoutubeEmbedUrl
  };
}
