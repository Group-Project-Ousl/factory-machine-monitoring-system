import { RouteRecordRaw } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'

export const routes: Array<RouteRecordRaw> = [


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
