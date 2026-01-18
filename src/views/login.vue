<template>
  <div class="login-page">
    <div class="login-card machine-card">
      <div class="page-title" style="justify-content:center; margin-bottom: 14px;">
        <span class="icon"><i class="mdi mdi-factory"></i></span>
        <span>Factory Monitor</span>
      </div>

      <p class="label-text" style="text-align:center; margin-top:-6px; margin-bottom: 18px;">
        Sign in to access the dashboard
      </p>

      <div class="field">
        <label class="label-text">Username</label>
        <input
          v-model="username"
          class="form-input"
          type="text"
          placeholder="Enter your username"
        />
      </div>

      <div class="field">
        <label class="label-text">Password</label>
        <input
          v-model="password"
          class="form-input"
          type="password"
          placeholder="Enter your password"
        />
      </div>

      <button class="btn-primary" style="width:100%; margin-top: 14px;" @click="login">
        Sign In
      </button>

      <button class="btn-secondary" style="width:100%; margin-top: 10px;" @click="goSignup">
        Create New Account
      </button>

      <div class="demo">
        <p class="label-text" style="margin: 14px 0 6px;">Demo accounts:</p>
        <div class="label-text" style="line-height: 1.6;">
          admin / admin (Admin)<br />
          operator / operator (Operator)<br />
          maintenance / maintenance (Maintenance)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')

function login() {
  const u = username.value.trim()
  const p = password.value.trim()

  if (!u || !p) {
    alert('input user name and password')
    return
  }

  // Demo auth (later backend connect)
  const users = [
    { u: 'admin', p: 'admin', role: 'Admin', name: 'Admin' },
    { u: 'operator', p: 'operator', role: 'Operator', name: 'Operator' },
    { u: 'maintenance', p: 'maintenance', role: 'Maintenance', name: 'Maintenance' }
  ]

  const found = users.find(x => x.u === u && x.p === p)
  if (!found) {
    alert('Invalid username or password')
    return
  }

  // save user session (future use for sidebar profile)
  localStorage.setItem('user', JSON.stringify({ name: found.name, role: found.role }))

  router.push('/dashboard') // ensure route exists
}

function goSignup() {
  router.push('/signup') // ensure route exists
}
</script>

<style scoped>
/* Login layout only (colors are from main.css) */
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.login-card {
  width: 420px;
  max-width: 92vw;
}

.field {
  margin-top: 12px;
}

.demo {
  margin-top: 10px;
}
</style>
