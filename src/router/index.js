import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Machines from '../views/Machines.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/machines', name: 'Machines', component: Machines }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
