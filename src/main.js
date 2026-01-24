import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebasePlugin from './plugins/firebase'

// Material Design Icons (REQUIRED for mdi icons)
import '@mdi/font/css/materialdesignicons.css'
import './styles/main.css'

const app = createApp(App)
app.use(router)
app.use(firebasePlugin)
app.mount('#app')
