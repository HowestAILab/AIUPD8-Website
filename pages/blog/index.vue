<template>
  <div>
    <HeaderBar variant="white" />
    <div class="pt-16 min-h-screen bg-light-page-background">
      <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-8 text-center">Blog</h1>
        <div v-if="loading" class="text-center py-8">
          <p>Loading posts...</p>
        </div>
        <div v-else-if="error" class="text-center text-red-500 py-8">
          {{ error }}
        </div>
        <div v-else-if="posts.length === 0" class="text-center py-8">
          <p>No blog posts found.</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogItem v-for="post in posts" :key="post.id" :post="post" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import HeaderBar from '~/components/layout/HeaderBar.vue';
import BlogItem from '~/components/BlogItem.vue';
import { useBlog } from '~/composables/useBlog';

const { posts, loading, error, fetchBlogPosts } = useBlog();

onMounted(async () => {
  await fetchBlogPosts();
});
</script> 