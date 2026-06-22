<template>
  <v-container class="py-8">
    <!-- Header Section -->
    <v-row class="mb-8">
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 font-weight-bold mb-4 gradient-text">
          Secret Loading Status
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis max-width-600 mx-auto">
          Verify runtime environment settings and encryption statuses fetched directly from the secure backend service.
        </p>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <v-row justify="center">
      <v-col cols="12" md="8">
        <!-- Status Card -->
        <v-card class="elevation-4 glass-card mb-8 position-relative overflow-hidden">
          <div class="glow-bg" :class="status.secretLoaded ? 'glow-success' : 'glow-error'"></div>

          <v-card-title class="text-h5 font-weight-bold d-flex align-center justify-space-between pa-6">
            <span class="d-flex align-center">
              <v-icon :color="status.secretLoaded ? 'success' : 'error'" class="mr-3 scale-up-down">
                {{ status.secretLoaded ? 'mdi-shield-check' : 'mdi-shield-alert' }}
              </v-icon>
              Decrypted Secret Environment
            </span>
            <v-btn
              icon="mdi-refresh"
              variant="text"
              color="primary"
              :loading="loading"
              @click="fetchSecretStatus"
            ></v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              class="mb-6"
              title="Backend Connection Error"
              text="Could not fetch secret status from the backend. Make sure the backend server is running."
            ></v-alert>

            <!-- Status Details Grid -->
            <v-row v-else class="gy-4">
              <!-- Secret Loaded -->
              <v-col cols="12" sm="6">
                <div class="d-flex flex-column h-100 justify-center pa-4 rounded bg-slate-900 border border-slate-800">
                  <div class="text-caption text-medium-emphasis mb-1">Secret Key Loaded (API_KEY)</div>
                  <div class="d-flex align-center">
                    <v-chip
                      :color="status.secretLoaded ? 'success' : 'error'"
                      text-color="white"
                      class="font-weight-bold px-4"
                      size="large"
                    >
                      <v-icon start>{{ status.secretLoaded ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                      {{ status.secretLoaded ? 'Yes (Encrypted & Loaded)' : 'No' }}
                    </v-chip>
                  </div>
                </div>
              </v-col>

              <!-- Environment -->
              <v-col cols="12" sm="6">
                <div class="d-flex flex-column h-100 justify-center pa-4 rounded bg-slate-900 border border-slate-800">
                  <div class="text-caption text-medium-emphasis mb-1">Target Environment</div>
                  <div class="text-h6 font-weight-bold d-flex align-center">
                    <v-icon color="indigo" class="mr-2" size="24">mdi-server</v-icon>
                    <span class="text-capitalize">{{ status.environment || 'Loading...' }}</span>
                  </div>
                </div>
              </v-col>

              <!-- Build Version -->
              <v-col cols="12" sm="6">
                <div class="d-flex flex-column h-100 justify-center pa-4 rounded bg-slate-900 border border-slate-800">
                  <div class="text-caption text-medium-emphasis mb-1">Build Version</div>
                  <div class="text-h6 font-weight-bold d-flex align-center">
                    <v-icon color="secondary" class="mr-2" size="24">mdi-git</v-icon>
                    <span>v{{ status.buildVersion || '0.0.0' }}</span>
                  </div>
                </div>
              </v-col>

              <!-- Deployment Time -->
              <v-col cols="12" sm="6">
                <div class="d-flex flex-column h-100 justify-center pa-4 rounded bg-slate-900 border border-slate-800">
                  <div class="text-caption text-medium-emphasis mb-1">Latest Deployment Time</div>
                  <div class="text-subtitle-1 font-weight-bold d-flex align-center">
                    <v-icon color="info" class="mr-2" size="24">mdi-clock-outline</v-icon>
                    <span>{{ formattedTime }}</span>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Security Warning & Explanation Card -->
        <v-card class="elevation-2 glass-card border-warning pa-6">
          <v-card-title class="text-h6 font-weight-bold text-amber-lighten-2 d-flex align-center mb-3">
            <v-icon color="warning" class="mr-2">mdi-shield-key-outline</v-icon>
            Security Architecture & Zero Leakage Policy
          </v-card-title>
          <v-card-text class="text-medium-emphasis">
            <p class="mb-4">
              <strong>Why you do not see the actual API Key:</strong> Under secure DevSecOps practices, 
              private credentials should <strong>never</strong> reach the client's browser. If we used 
              <code>VITE_SECRET_KEY</code> or passed the key directly in the API response, any user could inspect 
              the source code, network tabs, or browser memory and extract the key.
            </p>
            <p class="mb-0">
              Instead, the backend service uses Mozilla SOPS to decrypt the secret <code>secrets.enc.yaml</code> 
              on the secure CI/CD server, binds it to <code>process.env.API_KEY</code> at runtime, and exposes only 
              a Boolean state confirmation via this API endpoint.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

interface SecretStatus {
  secretLoaded: boolean;
  environment: string;
  buildVersion: string;
  deploymentTime: string;
}

const status = ref<SecretStatus>({
  secretLoaded: false,
  environment: '',
  buildVersion: '',
  deploymentTime: ''
});

const loading = ref(true);
const error = ref(false);

const formattedTime = computed(() => {
  if (!status.value.deploymentTime) return 'Loading...';
  try {
    const date = new Date(status.value.deploymentTime);
    return date.toLocaleString();
  } catch (e) {
    return status.value.deploymentTime;
  }
});

const fetchSecretStatus = async () => {
  loading.value = true;
  error.value = false;
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await axios.get<SecretStatus>(`${apiUrl}/api/secret-status`);
    status.value = response.data;
  } catch (err) {
    console.error('Error fetching secret status:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSecretStatus();
});
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

.border-warning {
  border: 1px solid rgba(245, 158, 11, 0.3) !important;
}

.bg-slate-900 {
  background-color: rgba(15, 23, 42, 0.8) !important;
}

.border-slate-800 {
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.glow-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  transition: background-color 0.5s ease;
}

.glow-success {
  background: linear-gradient(90deg, #10b981, #34d399);
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.5);
}

.glow-error {
  background: linear-gradient(90deg, #ef4444, #f87171);
  box-shadow: 0 2px 10px rgba(239, 68, 68, 0.5);
}

.scale-up-down {
  animation: scaleInOut 2s infinite ease-in-out;
}

@keyframes scaleInOut {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
