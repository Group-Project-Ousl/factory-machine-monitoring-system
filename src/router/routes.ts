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
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue'),
        meta: {
          title: 'Settings',
          icon: 'mdi mdi-settings',
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
      },

      {
        path: 'help',
        name: 'Help',
        component: () => import('../views/helpcenter.vue' as any),
        meta: {
          title: 'Help Center',
          icon: 'mdi mdi-help-circle',
          showInSidebar: true,
          order: 4
        }
      }
    ]
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login.vue' as any)
  },

  {
    path: '/sign',
    name: 'Sign',
    component: () => import('../views/sign.vue' as any)
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },

  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('../views/welcome.vue' as any)
  },

  
]

export default routes
