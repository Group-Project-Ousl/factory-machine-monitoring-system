<template>
  <div class="login-page">
    <div class="login-card machine-card">

      <!-- Title -->
      <div class="page-title title-lg" style="justify-content:center; margin-bottom: 16px;">
        <span class="icon"><i class="mdi mdi-lock-reset"></i></span>
        <span>Forgot Password</span>
      </div>

      <p class="label-text subtitle-lg" style="text-align:center; margin-bottom: 22px;">
        Enter your email and we will send a reset link.
      </p>

      <!-- ✅ INPUT AREA: Email -->
      <div class="field">
        <label class="label-text label-lg">Email</label>
        <input
          v-model="email"
          class="form-input input-lg"
          type="email"
          placeholder="Enter your registered email"
        />
      </div>

      <!-- ✅ BUTTON: Send Reset Link -->
      <button
        class="btn-primary btn-lg"
        style="width:100%; margin-top: 18px;"
        @click="sendResetLink"
        :disabled="loading"
      >
        {{ loading ? 'Sending...' : 'Send Verification Link' }}
      </button>

      <!-- ✅ BUTTON: Back to Login -->
      <button
        class="btn-secondary btn-lg"
        style="width:100%; margin-top: 12px;"
        @click="goLogin"
      >
        Back to Login
      </button>

      <!-- ✅ MESSAGE AREA (center) -->
      <div v-if="message" class="demo demo-center">
        <p class="label-text label-lg" style="margin: 18px 0 8px;">Info:</p>
        <div class="label-text demo-text">{{ message }}</div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { sendPasswordResetEmail } from 'firebase/auth'

const router = useRouter()

// ✅ input data
const email = ref('')

// ✅ ui states
const loading = ref(false)
const message = ref('')

async function sendResetLink() {
  const e = email.value.trim()

  // 1) validation
  if (!e) {
    alert('Email එක enter කරන්න')
    return
  }

  loading.value = true
  message.value = ''

  try {
    // 2) send reset mail
    await sendPasswordResetEmail(auth, e)

    // 3) success message (security-friendly)
    message.value = 'If this email is registered, a reset link has been sent. Check Inbox/Spam.'
  } catch (err) {
    console.error(err)
    // 4) error message (still safe)
    message.value = 'If this email is registered, a reset link has been sent. Check Inbox/Spam.'
  } finally {
    loading.value = false
  }
}

function goLogin() {
  router.push('/login')
}
</script>

<style scoped>
/* same theme as your login/register pages */
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
    0 12px 30px rgba(37, 9, 219, 0.12),
    0 6px 18px rgba(37, 99, 235, 0.25);

  border-top: 1px solid rgba(37, 99, 235, 0.15);
}

.login-card * {
  box-sizing: border-box;
}

.field {
  margin-top: 14px;
}

.title-lg { font-size: 1.6rem; }
.subtitle-lg { font-size: 1rem; }
.label-lg { font-size: 0.95rem; }
.input-lg { font-size: 1rem; padding: 10px 14px; }
.btn-lg { font-size: 1rem; padding: 11px 16px; }

.demo { margin-top: 12px; }
.demo-text { font-size: 0.9rem; line-height: 1.7; }
.demo-center { text-align: center; }
</style>
