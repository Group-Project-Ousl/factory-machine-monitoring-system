<template>
  <div class="login-page">
    <div class="login-card machine-card">
      <div class="page-title" style="justify-content:center; margin-bottom: 14px;">
        <span class="icon"><i class="mdi mdi-account-plus-outline"></i></span>
        <span>Create Account</span>
      </div>

      <p class="label-text" style="text-align:center; margin-bottom: 18px;">
        Fill details to create a new account
      </p>

      <div class="field">
        <label class="label-text">Full Name</label>
        <input v-model="fullName" class="form-input" type="text" placeholder="Enter your full name" />
      </div>

      <div class="field">
        <label class="label-text">Email</label>
        <input v-model="email" class="form-input" type="email" placeholder="Enter your email" />
      </div>

      <div class="field">
        <label class="label-text">Username</label>
        <input v-model="username" class="form-input" type="text" placeholder="Create a username" />
      </div>

      <div class="field">
        <label class="label-text">Mobile Number</label>
        <input v-model="mobile" class="form-input" type="tel" placeholder="07XXXXXXXX" />
      </div>

      <div class="field">
        <label class="label-text">Password</label>
        <input v-model="password" class="form-input" type="password" placeholder="Create a password" />
      </div>

      <div class="field">
        <label class="label-text">Confirm Password</label>
        <input
          v-model="confirmPassword"
          class="form-input"
          type="password"
          placeholder="Confirm your password"
          @keyup.enter="createAccount"
        />
      </div>

      <p v-if="error" style="color:#dc3545; margin: 10px 0 0;">
        {{ error }}
      </p>

      <button class="btn-primary" style="width:100%; margin-top: 16px;" @click="createAccount">
        Create Account
      </button>

      <button class="btn-secondary" style="width:100%; margin-top: 10px;" @click="goLogin">
        Back to Login
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const fullName = ref('')
const email = ref('')
const username = ref('')
const mobile = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

function createAccount () {
  error.value = ''

  // simple validation
  if (!fullName.value.trim() || !email.value.trim() || !username.value.trim() || !mobile.value.trim()) {
    error.value = 'Please fill all fields'
    return
  }

  if (!password.value || password.value.length < 4) {
    error.value = 'Password should be at least 4 characters'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  // Demo: store created user list in localStorage (later backend connect)
  const newUser = {
    name: fullName.value.trim(),
    email: email.value.trim(),
    username: username.value.trim(),
    mobile: mobile.value.trim(),
    role: 'Operator' // default role (can change later)
  }

  const existing = JSON.parse(localStorage.getItem('createdUsers') || '[]')
  existing.push(newUser)
  localStorage.setItem('createdUsers', JSON.stringify(existing))

  alert('Account created successfully! Now login.')

  router.push('/login')
}

function goLogin () {
  router.push('/login')
}
</script>

<style scoped>
/* Reuse same layout classes as login (consistent UI) */
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.login-card {
  width: 460px;
  max-width: 92vw;
}

.field {
  margin-top: 12px;
}
</style>
