import { ref } from 'vue';
import axios from 'axios';
import { useRuntimeConfig } from '#app';
import type { I18nArray } from '~/composables/i18n';

/**
 * Raw blog post as returned by the server API.
 * All translatable fields are InternationalizedArray values.
 */
export interface BlogPost {
  id: string;
  /** i18n array – use getI18n(post.title, locale) in components */
  title: I18nArray<string>;
  slug: string;
  /** i18n array */
  excerpt: I18nArray<string>;
  publishedAt: string;
  mainImage: any;
  /** i18n array of portable-text block arrays */
  body: I18nArray<any[]>;
  /** i18n array of portable-text block arrays */
  outro: I18nArray<any[]>;
}

export function useBlog() {
  const config = useRuntimeConfig();
  
  const api = axios.create({
    baseURL: config.public.apiBaseUrl
  });
  
  const posts = ref<BlogPost[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const mapBlogPost = (item: any): BlogPost => {
    return {
      id: item.id ?? '',
      title: item.title ?? [],
      slug: item.slug ?? '',
      excerpt: item.excerpt ?? [],
      publishedAt: item.publishedAt ?? '',
      mainImage: item.mainImage ?? null,
      body: item.body ?? [],
      outro: item.outro ?? [],
    };
  };

  async function fetchBlogPosts() {
    loading.value = true;
    error.value = null;

    const CACHE_KEY = 'aiupd8_blog_cache';
    const CACHE_TTL = 24 * 60 * 60 * 1000;
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            posts.value = data;
            loading.value = false;
            return;
          }
        }
      }

      const response = await api.get('/api/blog');
      if (response.data.data) {
        const mapped = response.data.data.map(mapBlogPost);
        posts.value = mapped.sort((a: BlogPost, b: BlogPost) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
        );
        if (typeof window !== 'undefined') {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: posts.value,
            timestamp: Date.now()
          }));
        }
      } else {
        posts.value = [];
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch blog posts';
      posts.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/api/blog/${slug}`);
      if (response.data.data) {
        return mapBlogPost(response.data.data);
      }
      return null;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch blog post';
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    posts,
    loading,
    error,
    fetchBlogPosts,
    fetchBlogPostBySlug,
  };
} 