<template>
  <v-container class="py-8">
    <!-- Header Section -->
    <v-row class="mb-6 align-center">
      <v-col cols="12" md="6">
        <h1 class="text-h3 font-weight-bold gradient-text mb-2">
          Secure Blog Feed
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Dynamic articles list fetched securely using a private third-party credential.
        </p>
      </v-col>
      
      <!-- Mini Security Status Dashboard -->
      <v-col cols="12" md="6" class="d-flex justify-md-end">
        <v-card class="glass-card pa-4 w-100" style="max-width: 480px">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-caption text-medium-emphasis font-weight-bold">DECRYPTION ENGINE (SOPS + AGE)</span>
            <v-chip color="success" size="x-small" class="font-weight-bold">ACTIVE</v-chip>
          </div>
          <div class="d-flex align-center justify-space-between mb-1">
            <span class="text-body-2 text-medium-emphasis">Credential Loaded (BLOG_API_KEY):</span>
            <v-chip
              :color="isKeyLoaded ? 'success' : 'error'"
              size="small"
              class="font-weight-bold"
            >
              {{ isKeyLoaded ? 'Yes (Backend Only)' : 'No' }}
            </v-chip>
          </div>
          <div class="d-flex align-center justify-space-between">
            <span class="text-body-2 text-medium-emphasis">API Source:</span>
            <span class="text-caption font-weight-bold text-indigo-lighten-3">{{ fetchedFrom || 'Loading...' }}</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="mb-8 border-slate-800"></v-divider>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <div class="mt-4 text-medium-emphasis">Fetching blog feeds from secure service...</div>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      class="mb-8"
      title="Failed to Load Blog Feed"
      text="Could not connect to the backend server. Verify that the backend is running on port 3000."
    ></v-alert>

    <!-- Blogs List Grid -->
    <div v-else>
      <v-row class="gy-6">
        <v-col v-for="blog in blogs" :key="blog.id" cols="12" md="4">
          <v-card class="h-100 hover-card glass-card d-flex flex-column overflow-hidden">
            <v-img
              :src="blog.cover_image"
              height="200"
              cover
              class="bg-grey-darken-4"
            ></v-img>

            <v-card-text class="pa-5 d-flex flex-column flex-grow-1">
              <!-- Tags -->
              <div class="d-flex flex-wrap gap-2 mb-3">
                <v-chip
                  v-for="tag in blog.tags"
                  :key="tag"
                  size="x-small"
                  color="indigo-lighten-4"
                  variant="outlined"
                  class="mr-1"
                >
                  #{{ tag }}
                </v-chip>
              </div>

              <!-- Title -->
              <h3 class="text-h6 font-weight-bold text-white mb-2 leading-snug">
                {{ blog.title }}
              </h3>

              <!-- Description -->
              <p class="text-body-2 text-medium-emphasis mb-4 flex-grow-1 leading-relaxed">
                {{ blog.description }}
              </p>

              <!-- Author / Date -->
              <v-divider class="my-3 border-slate-800"></v-divider>
              <div class="d-flex align-center justify-space-between mt-auto">
                <div class="d-flex align-center">
                  <v-avatar size="24" color="primary" class="mr-2 text-caption font-weight-bold">
                    {{ blog.author.charAt(0) }}
                  </v-avatar>
                  <span class="text-caption text-medium-emphasis font-weight-bold">{{ blog.author }}</span>
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ blog.published_at }} • {{ blog.read_time }}
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Security / Network Explanation Box -->
      <v-row class="mt-12">
        <v-col cols="12">
          <v-card class="glass-card pa-6 border-indigo">
            <v-card-title class="text-h6 font-weight-bold text-indigo-lighten-3 d-flex align-center mb-3">
              <v-icon color="indigo" class="mr-2">mdi-shield-check</v-icon>
              Security Transparency Panel
            </v-card-title>
            <v-card-text class="text-medium-emphasis">
              <p class="mb-4">
                To demonstrate how this security workflow protects your credentials: open your browser's 
                <strong>Developer Tools (F12) -> Network tab</strong> and reload this page.
              </p>

              <v-row class="gy-3">
                <v-col cols="12" sm="6">
                  <div class="pa-4 rounded bg-red-darken-4 border border-red-500 h-100">
                    <div class="font-weight-bold d-flex align-center mb-1 text-red-200">
                      <v-icon start size="18" color="red-lighten-1">mdi-alert-circle</v-icon>
                      Insecure Client-Side Calls (Never Do This)
                    </div>
                    <code class="d-block bg-black pa-2 rounded text-caption text-red-300 overflow-x-auto">
                      GET https://3rdparty-blogs.com/api?key=devto_sec_secret_api_key_xyz123
                    </code>
                    <div class="text-caption text-red-200 mt-2">
                      ❌ Any web user can view your private credentials in the request details.
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="pa-4 rounded bg-green-darken-4 border border-green-500 h-100">
                    <div class="font-weight-bold d-flex align-center mb-1 text-green-200">
                      <v-icon start size="18" color="green-lighten-1">mdi-check-circle</v-icon>
                      Secure Server-Side Calls (Our Method)
                    </div>
                    <code class="d-block bg-black pa-2 rounded text-caption text-green-300 overflow-x-auto">
                      GET /api/blogs
                    </code>
                    <div class="text-caption text-green-200 mt-2">
                      ✅ Decrypted key is kept strictly in the Node.js backend cache, completely invisible to the client browser.
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Blog {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  tags: string[];
  author: string;
  published_at: string;
  read_time: string;
}

interface BlogsResponse {
  blogs: Blog[];
  keyLoaded: boolean;
  fetchedFrom: string;
}

const blogs = ref<Blog[]>([]);
const isKeyLoaded = ref(false);
const fetchedFrom = ref('');
const loading = ref(true);
const error = ref(false);

const fetchBlogs = async () => {
  loading.value = true;
  error.value = false;
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await axios.get<BlogsResponse>(`${apiUrl}/api/blogs`);
    blogs.value = response.data.blogs;
    isKeyLoaded.value = response.data.keyLoaded;
    fetchedFrom.value = response.data.fetchedFrom;
  } catch (err) {
    console.error('Error fetching blogs:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBlogs();
});
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #818cf8 0%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass-card {
  background: rgba(30, 41, 59, 0.7) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 16px !important;
}

.border-indigo {
  border: 1px solid rgba(99, 102, 241, 0.25) !important;
}

.border-slate-800 {
  border-color: rgba(255, 255, 255, 0.05) !important;
}

.hover-card {
  transition: all 0.3s ease;
}
.hover-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.15) !important;
  background: rgba(30, 41, 59, 0.85) !important;
}
</style>
