import { RouteRecordRaw } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'

export const routes: Array<RouteRecordRaw> = [


  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default routes
