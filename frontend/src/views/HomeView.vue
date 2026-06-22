<template>
  <v-container class="py-8 px-4" style="max-width: 1200px;">
    <!-- Top News Desks & Inline Search -->
    <v-row class="align-center mb-8 gy-4">
      <v-col cols="12" md="8">
        <div class="d-flex flex-wrap gap-2 align-center">
          <span class="text-caption text-medium-emphasis font-sans font-weight-black mr-3 tracking-wider">NEWS DESKS</span>
          <v-btn
            v-for="cat in categories"
            :key="cat"
            variant="flat"
            class="text-capitalize font-weight-bold px-5 rounded-lg category-btn font-sans"
            :class="{ 'active-category': selectedCategory === cat && !isSearchActive }"
            @click="selectCategory(cat)"
          >
            {{ cat }}
          </v-btn>
        </div>
      </v-col>

      <v-col cols="12" md="4" class="d-flex justify-md-end">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search news..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="search-input w-100"
          @keyup.enter="handleSearch"
          @click:clear="clearSearch"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Search Results Header -->
    <v-row v-if="isSearchActive" class="mb-6 align-center">
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <div class="text-h6 text-white font-sans">
          Search results for: <span class="text-indigo-lighten-2 font-weight-bold">"{{ activeSearchQuery }}"</span>
        </div>
        <v-btn variant="text" color="indigo-lighten-3" class="text-capitalize font-sans" prepend-icon="mdi-close" @click="clearSearch">
          Clear Search
        </v-btn>
      </v-col>
    </v-row>

    <!-- Top Headline Carousel (Trending) -->
    <div v-if="trendingArticles.length > 0 && !isSearchActive" class="mb-12">
      <v-carousel
        cycle
        height="380"
        hide-delimiter-background
        show-arrows="hover"
        class="rounded-xl overflow-hidden elevation-4"
      >
        <v-carousel-item
          v-for="article in trendingArticles"
          :key="article.id"
          :src="article.image"
          cover
        >
          <div class="carousel-overlay d-flex flex-column justify-end pa-6 pa-md-12">
            <div class="carousel-caption-box max-width-700">
              <v-chip color="red" size="small" class="mb-3 font-weight-bold font-sans">
                TRENDING
              </v-chip>
              <h3 class="text-h4 font-weight-black text-white mb-3 font-serif leading-tight">
                {{ article.title }}
              </h3>
              <p class="text-body-2 text-slate-300 mb-4 font-sans leading-relaxed text-line-clamp-2">
                {{ article.description }}
              </p>
              <div class="d-flex align-center gap-3">
                <v-btn
                  color="indigo"
                  variant="flat"
                  size="small"
                  class="text-capitalize font-sans font-weight-bold"
                  @click="openArticleModal(article)"
                >
                  Read Article
                </v-btn>
                <span class="text-caption text-slate-400 font-sans">
                  {{ article.source }} • {{ formatDate(article.published_at) }}
                </span>
              </div>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </div>

    <!-- Main Content Loading -->
    <div v-if="loading" class="py-12 text-center">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <div class="mt-4 text-medium-emphasis font-sans">Retrieving news feed...</div>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      class="mb-8 font-sans"
      title="News Retrieval Error"
      text="Unable to communicate with the service. Please verify that the application server is running."
    ></v-alert>

    <!-- Empty State -->
    <div v-else-if="filteredArticles.length === 0" class="text-center py-16 font-sans">
      <v-icon size="64" color="indigo-lighten-4" class="mb-4">mdi-newspaper-minus</v-icon>
      <h3 class="text-h6 font-weight-bold text-white mb-2">No Articles Found</h3>
      <p class="text-body-2 text-medium-emphasis max-width-500 mx-auto">
        Try typing a different keyword or relaxing your search filters.
      </p>
    </div>

    <!-- Articles Grid -->
    <div v-else>
      <!-- Featured Section (First Article - Only on Desks Feed) -->
      <v-row v-if="featuredArticle && !isSearchActive" class="mb-10">
        <v-col cols="12">
          <v-card class="elevation-4 glass-card hero-card overflow-hidden" @click="openArticleModal(featuredArticle)">
            <v-row no-gutters class="fill-height flex-column flex-md-row">
              <v-col cols="12" md="7" class="position-relative overflow-hidden" style="min-height: 320px;">
                <v-img
                  :src="featuredArticle.image"
                  alt="Featured Article"
                  height="100%"
                  cover
                  class="hero-image"
                ></v-img>
                <div class="featured-badge font-sans">Featured</div>
              </v-col>
              <v-col cols="12" md="5" class="d-flex flex-column justify-center pa-8 pa-md-10">
                <span class="text-caption text-indigo-lighten-3 font-weight-bold font-sans uppercase mb-2">
                  #{{ featuredArticle.category }} News
                </span>
                <h2 class="text-h4 font-weight-black text-white mb-4 hero-title leading-tight font-serif">
                  {{ featuredArticle.title }}
                </h2>
                <p class="text-body-2 text-medium-emphasis mb-6 leading-relaxed font-sans font-weight-light">
                  {{ featuredArticle.description }}
                </p>
                <v-divider class="mb-4 border-slate-800"></v-divider>
                <div class="d-flex align-center justify-space-between font-sans">
                  <div class="d-flex align-center">
                    <v-avatar size="32" color="indigo-darken-3" class="mr-3 text-caption font-weight-bold text-white">
                      {{ featuredArticle.author.charAt(0) }}
                    </v-avatar>
                    <div>
                      <div class="text-body-2 font-weight-bold text-white leading-none mb-1">{{ featuredArticle.author }}</div>
                      <div class="text-caption text-medium-emphasis">{{ formatDate(featuredArticle.published_at) }}</div>
                    </div>
                  </div>
                  <span class="text-caption text-indigo-lighten-2 font-weight-bold">{{ featuredArticle.source }}</span>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <!-- Standard News Grid -->
      <v-row class="gy-6">
        <v-col v-for="article in paginatedArticles" :key="article.id" cols="12" md="6" lg="4">
          <v-card class="h-100 hover-card glass-card d-flex flex-column overflow-hidden" @click="openArticleModal(article)">
            <div class="overflow-hidden position-relative" style="height: 200px;">
              <v-img
                :src="article.image"
                height="200"
                cover
                class="card-image"
              ></v-img>
            </div>

            <v-card-text class="pa-5 d-flex flex-column flex-grow-1">
              <span class="text-caption text-indigo-lighten-3 font-weight-bold font-sans uppercase mb-2">
                {{ article.category }}
              </span>
              <h3 class="text-h6 font-weight-bold text-white mb-3 card-title leading-snug font-serif">
                {{ article.title }}
              </h3>
              <p class="text-body-2 text-medium-emphasis mb-6 flex-grow-1 leading-relaxed font-sans font-weight-light text-line-clamp-3">
                {{ article.description }}
              </p>
              <v-divider class="my-3 border-slate-800"></v-divider>
              <div class="d-flex align-center justify-space-between mt-auto font-sans">
                <div class="d-flex align-center">
                  <v-avatar size="24" color="indigo-darken-4" class="mr-2 text-caption font-weight-bold text-white">
                    {{ article.author.charAt(0) }}
                  </v-avatar>
                  <span class="text-caption text-medium-emphasis font-weight-bold text-truncate" style="max-width: 120px;">
                    {{ article.author }}
                  </span>
                </div>
                <span class="text-caption text-slate-400">{{ formatDate(article.published_at) }}</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Load More Button -->
      <v-row v-if="hasMore" class="mt-10 justify-center">
        <v-btn
          color="indigo-lighten-1"
          variant="outlined"
          class="px-8 py-4 font-weight-bold text-capitalize font-sans"
          @click="loadMore"
        >
          Load More Articles
        </v-btn>
      </v-row>
    </div>

    <!-- Article Details Modal Overlay (Popup Dialog) -->
    <v-dialog v-model="isModalOpen" max-width="800px" scrollable class="article-modal">
      <v-card v-if="activeArticle" class="glass-card overflow-hidden border-indigo dialog-box">
        <v-img :src="activeArticle.image" height="350" cover class="position-relative">
          <div class="modal-image-overlay pa-6 d-flex align-end justify-space-between">
            <v-chip color="indigo" class="font-weight-bold font-sans" label>
              {{ activeArticle.category }}
            </v-chip>
            <v-btn icon="mdi-close" color="black" variant="flat" size="small" @click="isModalOpen = false"></v-btn>
          </div>
        </v-img>

        <v-card-text class="pa-6 pa-md-8 text-white font-sans scrollable-text">
          <h2 class="text-h4 font-weight-black mb-4 font-serif leading-tight">
            {{ activeArticle.title }}
          </h2>

          <div class="d-flex align-center justify-space-between flex-wrap gap-4 mb-6 border-b-slate pb-4">
            <div class="d-flex align-center">
              <v-avatar size="36" color="indigo-darken-3" class="mr-3 text-caption font-weight-bold">
                {{ activeArticle.author.charAt(0) }}
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-bold text-white">{{ activeArticle.author }}</div>
                <div class="text-caption text-medium-emphasis">{{ formatDate(activeArticle.published_at) }}</div>
              </div>
            </div>
            <span class="text-caption text-indigo-lighten-3 font-weight-bold">{{ activeArticle.source }}</span>
          </div>

          <div class="text-body-1 text-slate-300 leading-relaxed font-weight-light mb-8">
            <p class="mb-4">{{ activeArticle.content }}</p>
          </div>

          <v-divider class="mb-6 border-slate-800"></v-divider>

          <div class="d-flex justify-end gap-3">
            <v-btn variant="text" color="indigo-lighten-3" class="text-capitalize" @click="isModalOpen = false">
              Close
            </v-btn>
            <v-btn color="indigo" class="text-capitalize font-weight-bold" prepend-icon="mdi-open-in-new" :href="activeArticle.url" target="_blank">
              Read Original Source
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  source: string;
  author: string;
  published_at: string;
  category: string;
}

interface NewsResponse {
  articles: Article[];
  fetchedFrom: string;
  secretLoaded: boolean;
}

const trendingArticles = ref<Article[]>([]);
const feedArticles = ref<Article[]>([]);
const loading = ref(true);
const error = ref(false);

const selectedCategory = ref('World');
const categories = ['World', 'Technology', 'Business', 'AI', 'Sports'];

// Search state
const searchQuery = ref('');
const activeSearchQuery = ref('');
const isSearchActive = ref(false);

// Dialog detail modal state
const isModalOpen = ref(false);
const activeArticle = ref<Article | null>(null);

// Pagination state
const visibleCount = ref(6);

const fetchTrendingNews = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await axios.get<NewsResponse>(`${apiUrl}/api/news/trending`);
    trendingArticles.value = response.data.articles;
  } catch (err) {
    console.error('Error fetching trending news:', err);
  }
};

const fetchCategoryNews = async (category: string) => {
  loading.value = true;
  error.value = false;
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await axios.get<NewsResponse>(`${apiUrl}/api/news?category=${category}`);
    feedArticles.value = response.data.articles;
  } catch (err) {
    console.error('Error fetching category news:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const selectCategory = (category: string) => {
  selectedCategory.value = category;
  visibleCount.value = 6;
  fetchCategoryNews(category);
};

const handleSearch = async () => {
  if (!searchQuery.value || !searchQuery.value.trim()) return;
  
  loading.value = true;
  error.value = false;
  activeSearchQuery.value = searchQuery.value.trim();
  isSearchActive.value = true;
  visibleCount.value = 6;

  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await axios.get<NewsResponse>(`${apiUrl}/api/news/search`, {
      params: { q: activeSearchQuery.value }
    });
    feedArticles.value = response.data.articles;
  } catch (err) {
    console.error('Search error:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  activeSearchQuery.value = '';
  isSearchActive.value = false;
  selectCategory(selectedCategory.value);
};

const openArticleModal = (article: Article) => {
  activeArticle.value = article;
  isModalOpen.value = true;
};

// Pagination filters
const featuredArticle = computed(() => {
  return feedArticles.value.length > 0 && !isSearchActive.value ? feedArticles.value[0] : null;
});

const filteredArticles = computed(() => {
  return feedArticles.value;
});

const paginatedArticles = computed(() => {
  if (isSearchActive.value) {
    return filteredArticles.value.slice(0, visibleCount.value);
  }
  return filteredArticles.value.slice(1, visibleCount.value + 1);
});

const hasMore = computed(() => {
  if (isSearchActive.value) {
    return filteredArticles.value.length > visibleCount.value;
  }
  return filteredArticles.value.length > visibleCount.value + 1;
});

const loadMore = () => {
  visibleCount.value += 6;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

onMounted(async () => {
  await Promise.all([
    fetchTrendingNews(),
    fetchCategoryNews(selectedCategory.value)
  ]);
});
</script>

<style scoped>
/* Font System overrides */
.font-sans {
  font-family: 'Inter', sans-serif !important;
}
.font-serif {
  font-family: 'Lora', Georgia, serif !important;
}

.search-input {
  max-width: 320px;
}

.category-btn {
  background-color: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(255, 255, 255, 0.04) !important;
  color: rgba(255, 255, 255, 0.7) !important;
  transition: all 0.3s ease;
  margin-right: 8px;
}
.category-btn:hover {
  background-color: rgba(255, 255, 255, 0.06) !important;
  color: white !important;
}
.active-category {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(52, 211, 153, 0.1) 100%) !important;
  border: 1px solid rgba(99, 102, 241, 0.4) !important;
  color: #a5b4fc !important;
}

/* Carousel Styles */
.carousel-overlay {
  background: linear-gradient(to top, rgba(8, 12, 20, 0.95) 0%, rgba(8, 12, 20, 0.4) 60%, transparent 100%);
  height: 100%;
}
.carousel-caption-box {
  background: rgba(8, 12, 20, 0.4);
  backdrop-filter: blur(4px);
  padding: 16px;
  border-radius: 12px;
}

/* Hero Card Styles */
.hero-card {
  cursor: pointer;
}
.hero-card:hover {
  transform: translateY(-6px);
  border-color: rgba(99, 102, 241, 0.35) !important;
  box-shadow: 0 15px 35px -10px rgba(99, 102, 241, 0.15) !important;
}
.hero-image {
  transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.hero-card:hover .hero-image {
  transform: scale(1.02);
}
.featured-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: #6366f1;
  color: white;
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.hero-title {
  font-family: 'Outfit', sans-serif !important;
  transition: color 0.3s ease;
}
.hero-card:hover .hero-title {
  background: linear-gradient(135deg, #a5b4fc 0%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Standard Cards */
.hover-card {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.hover-card:hover {
  transform: translateY(-8px);
  border-color: rgba(99, 102, 241, 0.25) !important;
  background: rgba(18, 26, 44, 0.85) !important;
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.4) !important;
}
.card-image {
  transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.hover-card:hover .card-image {
  transform: scale(1.04);
}
.card-title {
  transition: color 0.3s ease;
}
.hover-card:hover .card-title {
  color: #a5b4fc !important;
}

.glass-card {
  background: rgba(13, 19, 33, 0.65) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  border-radius: 20px !important;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.border-indigo {
  border: 1px solid rgba(99, 102, 241, 0.22) !important;
}

.border-b-slate {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

/* Modal details */
.modal-image-overlay {
  background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%);
  height: 100%;
}
.scrollable-text {
  max-height: 450px;
  overflow-y: auto;
}

.border-slate-800 {
  border-color: rgba(255, 255, 255, 0.05) !important;
}
.text-line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.text-line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.max-width-700 { max-width: 700px; }
.max-width-500 { max-width: 500px; }
</style>
