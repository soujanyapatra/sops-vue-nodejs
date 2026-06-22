<template>
  <v-container class="py-8">
    <!-- Header Section -->
    <v-row class="mb-8">
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 font-weight-bold mb-4 gradient-text">
          CI/CD Pipeline Overview
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis max-width-600 mx-auto">
          Explore the automated GitHub Actions workflow that safely decrypts configuration values and builds the stack.
        </p>
      </v-col>
    </v-row>

    <!-- Timeline Section -->
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card class="elevation-4 glass-card pa-6 mb-8">
          <v-card-title class="text-h5 font-weight-bold d-flex align-center mb-6">
            <v-icon color="primary" class="mr-3">mdi-git-issue</v-icon>
            GitHub Actions Workflow Steps
          </v-card-title>
          
          <v-card-text>
            <v-timeline align="start" density="comfortable">
              <!-- Step 1 -->
              <v-timeline-item dot-color="indigo" icon="mdi-source-branch" fill-dot>
                <template v-slot:opposite>
                  <span class="text-caption text-medium-emphasis">Step 1</span>
                </template>
                <v-card class="timeline-sub-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold">Checkout Repo Code</v-card-title>
                  <v-card-text class="text-medium-emphasis text-body-2">
                    Retrieves project code including the encrypted config file <code>secrets/secrets.enc.yaml</code>. At this stage, secrets are fully encrypted and completely safe in Git.
                  </v-card-text>
                </v-card>
              </v-timeline-item>

              <!-- Step 2 -->
              <v-timeline-item dot-color="indigo-lighten-2" icon="mdi-nodejs" fill-dot>
                <template v-slot:opposite>
                  <span class="text-caption text-medium-emphasis">Step 2</span>
                </template>
                <v-card class="timeline-sub-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold">Install Node.js & Tooling</v-card-title>
                  <v-card-text class="text-medium-emphasis text-body-2">
                    Sets up the Node.js runner environment, downloads Mozilla SOPS binary, and installs the AGE encryption library on the CI worker.
                  </v-card-text>
                </v-card>
              </v-timeline-item>

              <!-- Step 3 -->
              <v-timeline-item dot-color="amber" icon="mdi-key-variant" fill-dot>
                <template v-slot:opposite>
                  <span class="text-caption text-medium-emphasis">Step 3</span>
                </template>
                <v-card class="timeline-sub-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold text-amber-lighten-2">Restore AGE Key</v-card-title>
                  <v-card-text class="text-medium-emphasis text-body-2">
                    Injects the <code>AGE_PRIVATE_KEY</code> from GitHub Repository Secrets into the runner's local key store. This is the only place the private key exists outside the developer's secure environment.
                  </v-card-text>
                </v-card>
              </v-timeline-item>

              <!-- Step 4 -->
              <v-timeline-item dot-color="green" icon="mdi-lock-open-outline" fill-dot>
                <template v-slot:opposite>
                  <span class="text-caption text-medium-emphasis">Step 4</span>
                </template>
                <v-card class="timeline-sub-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold text-green-lighten-2">SOPS Decryption</v-card-title>
                  <v-card-text class="text-medium-emphasis text-body-2">
                    SOPS reads <code>secrets.enc.yaml</code>, decrypts the keys, and outputs a local <code>.env</code> file containing <code>API_KEY</code> and <code>ENVIRONMENT</code> inside the secure build workspace.
                  </v-card-text>
                </v-card>
              </v-timeline-item>

              <!-- Step 5 -->
              <v-timeline-item dot-color="info" icon="mdi-test-tube" fill-dot>
                <template v-slot:opposite>
                  <span class="text-caption text-medium-emphasis">Step 5</span>
                </template>
                <v-card class="timeline-sub-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold">Quality & Test Suites</v-card-title>
                  <v-card-text class="text-medium-emphasis text-body-2">
                    Runs dependency installation, TypeScript verification, linting, and automated unit/integration tests to verify health endpoints and key loading states.
                  </v-card-text>
                </v-card>
              </v-timeline-item>

              <!-- Step 6 -->
              <v-timeline-item dot-color="secondary" icon="mdi-cloud-upload" fill-dot>
                <template v-slot:opposite>
                  <span class="text-caption text-medium-emphasis">Step 6</span>
                </template>
                <v-card class="timeline-sub-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold">Production Deploy</v-card-title>
                  <v-card-text class="text-medium-emphasis text-body-2">
                    Deploys the static client frontend to Vercel and the backend API to Render/Railway, storing the decrypted env vars in the production environment settings.
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Static view with detailed explanations
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

.timeline-sub-card {
  background: rgba(15, 23, 42, 0.5) !important;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.timeline-sub-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
}

code {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  color: #a5b4fc;
}
</style>
