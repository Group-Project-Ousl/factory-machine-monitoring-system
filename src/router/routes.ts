import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/dashboard'
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: () => import('../views/Dashboard.vue' as any),
		meta: { title: 'Dashboard', icon: 'mdi mdi-grid-large' }
	},
	{
  		path: '/login',
  		name: 'Login',
  		component: () => import('../views/login.vue' as any)
},


	{
		path: '/analytics',
		name: 'analytics',
		component: () => import('../views/Analytics.vue'),
		
	},

	
	// optional catch-all redirect back to dashboard
	{
		path: '/:pathMatch(.*)*',
		redirect: '/dashboard'
	}
];

export default routes;