<template>
  <v-container class="py-8">
    <!-- Header Section -->
    <v-row class="mb-8">
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 font-weight-bold mb-4 gradient-text">
          DevSecOps Secret Management
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis max-width-600 mx-auto">
          A secure, modern approach to managing secrets in Git using Mozilla SOPS, AGE cryptography, and GitHub Actions.
        </p>
      </v-col>
    </v-row>

    <!-- Architecture Section -->
    <v-row class="mb-12">
      <v-col cols="12">
        <v-card class="elevation-4 glass-card pa-6">
          <v-card-title class="text-h5 font-weight-bold d-flex align-center mb-4">
            <v-icon color="primary" class="mr-3">mdi-sitemap</v-icon>
            System Architecture & Flow
          </v-card-title>
          
          <v-card-text>
            <!-- Desktop Layout (Horizontal flow) -->
            <div class="d-none d-md-flex align-center justify-space-between py-6 px-4">
              <!-- Step 1 -->
              <div class="arch-node-container">
                <v-card class="arch-card pa-4 text-center" variant="outlined">
                  <div class="icon-circle mx-auto mb-3 bg-indigo-darken-3">
                    <v-icon size="32" color="primary">mdi-account-coder</v-icon>
                  </div>
                  <div class="font-weight-bold mb-1">1. Developer</div>
                  <div class="text-caption text-medium-emphasis">
                    Generates AGE key, encrypts secrets via SOPS
                  </div>
                </v-card>
              </div>

              <!-- Arrow -->
              <div class="arrow-container text-center">
                <v-icon size="36" class="arrow-pulse">mdi-arrow-right-thick</v-icon>
                <div class="text-caption text-indigo-lighten-3 font-weight-bold">Git Commit</div>
              </div>

              <!-- Step 2 -->
              <div class="arch-node-container">
                <v-card class="arch-card pa-4 text-center" variant="outlined">
                  <div class="icon-circle mx-auto mb-3 bg-red-darken-4">
                    <v-icon size="32" color="error">mdi-github</v-icon>
                  </div>
                  <div class="font-weight-bold mb-1">2. Git Repository</div>
                  <div class="text-caption text-medium-emphasis">
                    Stores <code class="text-error">secrets.enc.yaml</code> safely
                  </div>
                </v-card>
              </div>

              <!-- Arrow -->
              <div class="arrow-container text-center">
                <v-icon size="36" class="arrow-pulse">mdi-arrow-right-thick</v-icon>
                <div class="text-caption text-indigo-lighten-3 font-weight-bold">Trigger CI/CD</div>
              </div>

              <!-- Step 3 -->
              <div class="arch-node-container">
                <v-card class="arch-card pa-4 text-center text-green" variant="outlined">
                  <div class="icon-circle mx-auto mb-3 bg-green-darken-4">
                    <v-icon size="32" color="success">mdi-server-security</v-icon>
                  </div>
                  <div class="font-weight-bold mb-1 text-white">3. GitHub Actions</div>
                  <div class="text-caption text-medium-emphasis">
                    Decrypts via AGE Key, builds projects
                  </div>
                </v-card>
              </div>

              <!-- Arrow -->
              <div class="arrow-container text-center">
                <v-icon size="36" class="arrow-pulse">mdi-arrow-right-thick</v-icon>
                <div class="text-caption text-indigo-lighten-3 font-weight-bold">Inject Env</div>
              </div>

              <!-- Step 4 -->
              <div class="arch-node-container">
                <v-card class="arch-card pa-4 text-center" variant="outlined">
                  <div class="icon-circle mx-auto mb-3 bg-blue-darken-3">
                    <v-icon size="32" color="info">mdi-cloud-upload</v-icon>
                  </div>
                  <div class="font-weight-bold mb-1">4. Deploy (Backend/FE)</div>
                  <div class="text-caption text-medium-emphasis">
                    Backend reads env securely; frontend consumes API
                  </div>
                </v-card>
              </div>
            </div>

            <!-- Mobile Layout (Vertical flow) -->
            <div class="d-flex d-md-none flex-column align-center">
              <v-card class="arch-card-mobile pa-4 text-center my-2 w-100" variant="outlined">
                <v-icon size="28" color="primary" class="mb-2">mdi-account-coder</v-icon>
                <div class="font-weight-bold">1. Developer</div>
                <div class="text-caption text-medium-emphasis">Generates AGE key, encrypts secrets via SOPS</div>
              </v-card>

              <v-icon size="28" class="my-1 text-indigo">mdi-arrow-down-thick</v-icon>

              <v-card class="arch-card-mobile pa-4 text-center my-2 w-100" variant="outlined">
                <v-icon size="28" color="error" class="mb-2">mdi-github</v-icon>
                <div class="font-weight-bold">2. Git Repository</div>
                <div class="text-caption text-medium-emphasis">Stores secrets.enc.yaml safely in Git</div>
              </v-card>

              <v-icon size="28" class="my-1 text-indigo">mdi-arrow-down-thick</v-icon>

              <v-card class="arch-card-mobile pa-4 text-center my-2 w-100" variant="outlined">
                <v-icon size="28" color="success" class="mb-2">mdi-server-security</v-icon>
                <div class="font-weight-bold">3. GitHub Actions</div>
                <div class="text-caption text-medium-emphasis">Decrypts via AGE Key and builds assets</div>
              </v-card>

              <v-icon size="28" class="my-1 text-indigo">mdi-arrow-down-thick</v-icon>

              <v-card class="arch-card-mobile pa-4 text-center my-2 w-100" variant="outlined">
                <v-icon size="28" color="info" class="mb-2">mdi-cloud-upload</v-icon>
                <div class="font-weight-bold">4. Deployment Target</div>
                <div class="text-caption text-medium-emphasis">Hosts apps; backend runs with loaded env variables</div>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Key Principles Section -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="h-100 hover-card glass-card pa-4">
          <v-card-title class="d-flex align-center font-weight-bold">
            <v-icon color="primary" class="mr-2">mdi-shield-lock</v-icon>
            Zero-Trust in Git
          </v-card-title>
          <v-card-text class="text-medium-emphasis">
            Plain-text secrets are never stored in the repository. They are encrypted locally using SOPS + AGE, allowing configuration versioning without security leaks.
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="h-100 hover-card glass-card pa-4">
          <v-card-title class="d-flex align-center font-weight-bold">
            <v-icon color="secondary" class="mr-2">mdi-key-chain</v-icon>
            Asymmetric Cryptography
          </v-card-title>
          <v-card-text class="text-medium-emphasis">
            AGE provides extremely fast, modern, and simple file encryption using lightweight public/private keys, replacing complex and heavy GPG architectures.
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="h-100 hover-card glass-card pa-4">
          <v-card-title class="d-flex align-center font-weight-bold">
            <v-icon color="info" class="mr-2">mdi-eye-off</v-icon>
            Backend Confidentiality
          </v-card-title>
          <v-card-text class="text-medium-emphasis">
            Secrets are loaded directly into the backend environment. The client frontend can only inspect the presence and status of secrets, keeping actual credentials completely hidden.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Logic is handled in the template and CSS
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #818cf8 0%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.max-width-600 {
  max-width: 600px;
}

.glass-card {
  background: rgba(30, 41, 59, 0.7) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 16px !important;
}

.arch-card {
  width: 180px;
  min-height: 180px;
  background: rgba(15, 23, 42, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.arch-card:hover {
  transform: translateY(-8px);
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.15);
}

.arch-card-mobile {
  background: rgba(15, 23, 42, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-center: center;
  justify-content: center;
  align-items: center;
}

.arrow-container {
  flex-grow: 1;
  padding: 0 8px;
}

.arrow-pulse {
  animation: pulse 2s infinite ease-in-out;
  color: #6366f1;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
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
