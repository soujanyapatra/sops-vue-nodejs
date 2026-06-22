<template>
  <v-app id="app">
    <!-- App Bar -->
    <v-app-bar flat border color="background" class="px-md-4">
      <v-app-bar-title class="font-weight-bold d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-shield-lock-open-outline</v-icon>
        <span>DevSecOps Secret Demo</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Navigation buttons for larger screens -->
      <div class="d-none d-sm-flex gap-2">
        <v-btn to="/" prepend-icon="mdi-home-outline" variant="text" class="text-capitalize">
          Home
        </v-btn>
        <v-btn to="/secret-status" prepend-icon="mdi-shield-check-outline" variant="text" class="text-capitalize">
          Secret Status
        </v-btn>
        <v-btn to="/pipeline" prepend-icon="mdi-git" variant="text" class="text-capitalize">
          CI/CD Pipeline
        </v-btn>
      </div>

      <!-- Mobile menu button -->
      <v-btn icon="mdi-menu" class="d-flex d-sm-none" @click="drawer = !drawer"></v-btn>
    </v-app-bar>

    <!-- Navigation Drawer for Mobile -->
    <v-navigation-drawer v-model="drawer" temporary color="background">
      <v-list>
        <v-list-item to="/" prepend-icon="mdi-home-outline" title="Home"></v-list-item>
        <v-list-item to="/secret-status" prepend-icon="mdi-shield-check-outline" title="Secret Status"></v-list-item>
        <v-list-item to="/pipeline" prepend-icon="mdi-git" title="CI/CD Pipeline"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content Area -->
    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <!-- Footer -->
    <v-footer border class="py-4 text-center justify-center bg-slate-950 text-caption text-medium-emphasis">
      <span>
        Secure DevSecOps Management Demo • SOPS + AGE + GitHub Actions • Build 1.0.0
      </span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawer = ref(false);
</script>

<style>
/* Global styles and page transitions */
#app {
  background-color: #0f172a !important; /* Force slate-900 background */
}

.bg-slate-950 {
  background-color: #020617 !important;
}

.gap-2 {
  gap: 8px;
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
