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
          type="email"
          placeholder="Enter your email"
        />
      </div>

      <div class="field">
        <label class="label-text label-lg">Password</label>
        <input
          v-model="password"
          class="form-input input-lg"
          type="password"
          placeholder="Enter your password"
        />
      </div>

      <button class="btn-primary btn-lg" style="width:100%; margin-top: 18px;" @click="login">
        Login
      </button>

      <button class="btn-secondary btn-lg" style="width:100%; margin-top: 12px;" @click="goSignup">
        Create New Account
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

/* ===== NEW: Google Sign-In imports (ADDED ONLY) ===== */
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const router = useRouter()

const email = ref('')           // changed from username
const password = ref('')

async function login() {
  const e = email.value.trim()   // changed var name
  const p = password.value.trim()

  if (!e || !p) {
    alert('input email and password')
    return
  }

  try {
    await signInWithEmailAndPassword(auth, e, p)
    localStorage.setItem('user', JSON.stringify({ name: auth.currentUser?.displayName, email: auth.currentUser?.email }))
    router.push('/dashboard')
  } catch (err) {
    alert(err.message)
  }
}

function goSignup() {
  router.push('/sign') 
}

/* ===== NEW: Google Login function (ADDED ONLY) ===== */
const googleProvider = new GoogleAuthProvider()

async function googleLogin() {
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
    alert(err.message)
  }
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
  text-align: center;          /* text center */
  display: flex;
  flex-direction: column;
  align-items: center;         /* center inside card */
}

.demo p,
.demo .demo-text {
  text-align: center;
  width: 100%;
}

/* ===== NEW: Google login button styles (ADDED ONLY) ===== */
.google-btn {
  width: 100%;
  margin-top: 12px;     /* space under Create Account button */
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
</style>
