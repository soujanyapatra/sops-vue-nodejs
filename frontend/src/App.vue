<template>
  <v-app id="app">
    <!-- Premium Editorial App Bar -->
    <v-app-bar flat color="transparent" class="px-md-4 custom-app-bar">
      <v-app-bar-title>
        <div class="d-flex align-center justify-space-between w-100 pr-4">
          <div class="d-flex align-center">
            <v-icon color="indigo-lighten-3" class="mr-2" size="26">mdi-newspaper-variant-outline</v-icon>
            <span class="navbar-brand">{{ projectName }}</span>
          </div>
          <div class="text-caption text-medium-emphasis font-sans font-weight-bold d-none d-sm-block uppercase tracking-wider">
            {{ todayDate }}
          </div>
        </div>
      </v-app-bar-title>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <!-- Footer -->
    <v-footer border class="py-6 text-center justify-center bg-slate-950 text-caption text-medium-emphasis">
      <div class="d-flex flex-column align-center gap-1 font-sans">
        <div>© 2026 {{ projectName }} News Portal. All rights reserved.</div>
        <div class="text-caption text-slate-500">
          Independent world journalism, technology reports, and business analysis.
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const projectName = computed(() => {
  return import.meta.env.VITE_PROJECT_NAME;
});

const todayDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

console.log('test for build')
</script>

<style>
/* Global styles and page transitions */
#app {
  background-color: #080c14 !important; /* Force deep dark theme background */
  font-family: 'Inter', sans-serif !important;
}

.custom-app-bar {
  background: rgba(8, 12, 20, 0.75) !important;
  backdrop-filter: blur(16px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.navbar-brand {
  font-family: 'Lora', Georgia, serif !important;
  font-weight: 800 !important;
  font-size: 1.55rem !important;
  letter-spacing: -0.01em !important;
  background: linear-gradient(135deg, #ffffff 30%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.bg-slate-950 {
  background-color: #030712 !important;
}

.gap-1 {
  gap: 4px;
}

/* Route transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
