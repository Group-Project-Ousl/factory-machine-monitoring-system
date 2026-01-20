<template>
  <div class="login-page">
    <div class="login-card machine-card">

      <!-- Title -->
      <div class="page-title title-lg" style="justify-content:center; margin-bottom: 16px;">
        <span class="icon">
          <i class="mdi mdi-factory"></i>
        </span>
        <span>Factory Monitor</span>
      </div>

      <p class="label-text subtitle-lg" style="text-align:center; margin-bottom: 22px;">
        Sign in to access the dashboard
      </p>

      <!-- Username -->
      <div class="field">
        <label class="label-text label-lg">Username</label>
        <input
          v-model="username"
          class="form-input input-lg"
          type="text"
          placeholder="Enter your username"
        />
      </div>

      <!-- Password -->
      <div class="field">
        <label class="label-text label-lg">Password</label>
        <input
          v-model="password"
          class="form-input input-lg"
          type="password"
          placeholder="Enter your password"
        />
      </div>

      <!-- Login Button -->
      <button
        class="btn-primary btn-lg"
        style="width:100%; margin-top: 18px;"
        @click="login"
      >
        Login
      </button>

      <!-- Signup -->
      <button
        class="btn-secondary btn-lg"
        style="width:100%; margin-top: 12px;"
        @click="goSignup"
      >
        Create New Account
      </button>

      <!-- Demo -->
      <div class="demo">
        <p class="label-text label-lg" style="margin: 18px 0 8px;">Demo accounts:</p>
        <div class="label-text demo-text">
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

  // Demo auth 
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

  
  localStorage.setItem('user', JSON.stringify({ name: found.name, role: found.role }))

  router.push('/dashboard') 
}

function goSignup() {
  router.push('/signup') 
}
</script>

<style scoped>

.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #d3e5ea;
}


.login-card {
  width: 500px;
  max-width: 94vw;

  box-shadow:
    0 12px 30px rgba(37, 9, 219, 0.12),        /* depth */
    0 6px 18px rgba(37, 99, 235, 0.25);     /* visible blue glow */

  /* ✨ subtle highlight edge */
  border-top: 1px solid rgba(37, 99, 235, 0.15);
}


.login-card * {
  box-sizing: border-box;
}


/* spacing */
.field {
  margin-top: 14px;
}

.demo {
  margin-top: 12px;
}



.title-lg {
  font-size: 1.6rem;   
}

.subtitle-lg {
  font-size: 1rem;
}

.label-lg {
  font-size: 0.95rem;
}

.input-lg {
  font-size: 1rem;
  padding: 10px 14px;   
}


.btn-lg {
  font-size: 1rem;
  padding: 11px 16px;
}


.demo-text {
  font-size: 0.9rem;
  line-height: 1.7;
}
</style>

