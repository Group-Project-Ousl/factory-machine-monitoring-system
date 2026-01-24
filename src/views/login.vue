<template>
  <div class="login-page">
    <div class="login-card machine-card">

      <div class="page-title title-lg" style="justify-content:center; margin-bottom: 16px;">
        <span class="icon"><i class="mdi mdi-factory"></i></span>
        <span>Factory Monitor</span>
      </div>

      <p class="label-text subtitle-lg" style="text-align:center; margin-bottom: 22px;">
        Sign in to access the dashboard
      </p>

      <div class="field">
        <label class="label-text label-lg">Email</label>
        <input
          v-model="email"
          class="form-input input-lg"
          :class="{ 'input-error': authError && errorTarget === 'email' }"
          type="email"
          placeholder="Enter your email"
        />

        <!-- ✅ email error (under email) -->
        <p v-if="authError && errorTarget === 'email'" class="error-text">
          {{ authError }}
        </p>
      </div>

      <div class="field">
        <label class="label-text label-lg">Password</label>
        <input
          v-model="password"
          class="form-input input-lg"
          :class="{ 'input-error': authError && errorTarget === 'password' }"
          type="password"
          placeholder="Enter your password"
        />

        <!-- ✅ password error (under password) -->
        <p v-if="authError && errorTarget === 'password'" class="error-text">
          {{ authError }}
        </p>
      </div>

      <!-- ✅ general error (like google popup blocked etc.) -->
      <p v-if="authError && errorTarget === 'general'" class="error-text center-error">
        {{ authError }}
      </p>

      <button class="btn-primary btn-lg" style="width:100%; margin-top: 18px;" @click="login">
        Login
      </button>

      <button class="btn-secondary btn-lg" style="width:100%; margin-top: 12px;" @click="goSignup">
        Create New Account
      </button>

      <button class="btn-secondary btn-lg" style="width:100%; margin-top: 12px;" @click="goForgot">
        Forgot Password?
      </button>

      <!-- Google button: under Create Account button -->
      <button class="google-btn" @click="googleLogin" type="button">
        <span class="g-icon" aria-hidden="true">G</span>
        <span class="g-text">Continue with Google</span>
      </button>

      <div class="demo">
        <p class="label-text label-lg" style="margin: 25px 0 8px;">Demo accounts:</p>
        <div class="label-text demo-text">
          Use your registered email and password.
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

/* ===== Google Sign-In imports ===== */
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const router = useRouter()

const email = ref('')
const password = ref('')

/* ✅ NEW: inline error state */
const authError = ref('')
const errorTarget = ref('') // 'email' | 'password' | 'general'

function clearError() {
  authError.value = ''
  errorTarget.value = ''
}

async function login() {
  clearError()

  const e = email.value.trim()
  const p = password.value.trim()

  if (!e) {
    authError.value = 'Please enter your email.'
    errorTarget.value = 'email'
    return
  }
  if (!p) {
    authError.value = 'Please enter your password.'
    errorTarget.value = 'password'
    return
  }

  try {
    await signInWithEmailAndPassword(auth, e, p)

    localStorage.setItem(
      'user',
      JSON.stringify({
        name: auth.currentUser?.displayName,
        email: auth.currentUser?.email
      })
    )

    router.push('/dashboard')
  } catch (err) {
    // ✅ show message under password (no popup)
    const code = err?.code || ''
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      authError.value = 'Wrong password. Please check your password.'
      errorTarget.value = 'password'
    } else if (code === 'auth/user-not-found') {
      authError.value = 'No account found for this email.'
      errorTarget.value = 'email'
    } else if (code === 'auth/invalid-email') {
      authError.value = 'Invalid email format.'
      errorTarget.value = 'email'
    } else if (code === 'auth/too-many-requests') {
      authError.value = 'Too many attempts. Please try again later.'
      errorTarget.value = 'general'
    } else {
      authError.value = 'Login failed. Please try again.'
      errorTarget.value = 'general'
    }
  }
}

function goSignup() {
  router.push('/sign')
}

const googleProvider = new GoogleAuthProvider()

async function googleLogin() {
  clearError()

  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    localStorage.setItem(
      'user',
      JSON.stringify({
        name: user.displayName,
        email: user.email
      })
    )

    router.push('/dashboard')
  } catch (err) {
    const code = err?.code || ''
    if (code === 'auth/popup-closed-by-user') {
      authError.value = 'Google sign-in popup closed. Try again.'
    } else if (code === 'auth/popup-blocked') {
      authError.value = 'Popup blocked by browser. Allow popups and try again.'
    } else {
      authError.value = 'Google sign-in failed. Please try again.'
    }
    errorTarget.value = 'general'
  }
}

function goForgot() {
  router.push('/fogetpassword')
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
    0 12px 30px rgba(37, 9, 219, 0.12),
    0 6px 18px rgba(37, 99, 235, 0.25);

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

.demo {
  margin-top: 18px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.demo p,
.demo .demo-text {
  text-align: center;
  width: 100%;
}

/* ===== Google login button styles ===== */
.google-btn {
  width: 100%;
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  background: #ffffff;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  font-weight: 700;
  color: #0f1724;

  transition: transform 120ms ease, box-shadow 150ms ease, border-color 150ms ease;
}

.google-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(37, 99, 235, 0.5);
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.18);
}

.g-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: #e3f2fd;
  color: #1a73e8;
  font-weight: 900;
}

.g-text {
  font-size: 1rem;
}

/* ✅ NEW: inline error UI */
.input-error {
  border: 1px solid #dc3545 !important;
  background: #fff5f5;
}

.error-text {
  margin: 8px 0 0;
  color: #dc3545;
  font-size: 0.9rem;
  font-weight: 600;
}

.center-error {
  text-align: center;
  margin-top: 12px;
}
</style>
