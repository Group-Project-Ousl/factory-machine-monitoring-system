import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Material Design Icons (REQUIRED for mdi icons)
import '@mdi/font/css/materialdesignicons.css'

createApp(App)
  .use(router)
  .mount('#app')
