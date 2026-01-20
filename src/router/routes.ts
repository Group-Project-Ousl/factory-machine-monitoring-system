import { RouteRecordRaw } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
          title: 'Dashboard',
          icon: 'mdi mdi-grid-large',
          showInSidebar: true,
          order: 1
        }
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('../views/Analytics.vue'),
        meta: {
          title: 'Analytics',
          icon: 'mdi mdi-chart-line',
          showInSidebar: true,
          order: 2
        }
      },
      {
        path: 'alert',
        name: 'Alert',
        component: () => import('../views/Alert.vue'),
        meta: {
          title: 'Alerts',
          icon: 'mdi mdi-bell-alert',
          showInSidebar: true,
          order: 3
        }
      }
    ]
  },

  // Login WITHOUT sidebar & topbar
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: 'Login'
    }
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default routes
