import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SecretStatusView from '../views/SecretStatusView.vue';
import PipelineView from '../views/PipelineView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/secret-status',
    name: 'secret-status',
    component: SecretStatusView
  },
  {
    path: '/pipeline',
    name: 'pipeline',
    component: PipelineView
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
