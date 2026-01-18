import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/dashboard'
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: () => import('../views/Dashboard.vue'),
		meta: { title: 'Dashboard', icon: 'mdi mdi-grid-large' }
	},

	
	// optional catch-all redirect back to dashboard
	{
		path: '/:pathMatch(.*)*',
		redirect: '/dashboard'
	}
];

export default routes;