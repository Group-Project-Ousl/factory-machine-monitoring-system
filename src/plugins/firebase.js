import { reactive } from 'vue'
import { auth, db, storage } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import 'firebase/auth'

const firebaseState = reactive({
  user: auth.currentUser || null,
  ready: false
})

onAuthStateChanged(auth, (user) => {
  firebaseState.user = user
  firebaseState.ready = true
})

export default {
  install(app) {
    const api = { auth, db, storage, state: firebaseState }
    app.provide('firebase', api)
    app.config.globalProperties.$firebase = api
  }
}
 