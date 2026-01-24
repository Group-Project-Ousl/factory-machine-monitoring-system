<template>
  <div class="login-page">
    <div class="login-card machine-card">

      <div class="page-title title-lg" style="justify-content:center; margin-bottom: 16px;">
        <span class="icon"><i class="mdi mdi-lock-reset"></i></span>
        <span>Forgot Password</span>
      </div>

      <p class="label-text subtitle-lg" style="text-align:center; margin-bottom: 22px;">
        Enter your email to receive an OTP
      </p>

      <div class="field">
        <label class="label-text label-lg">Email</label>
        <input
          v-model="email"
          class="form-input input-lg"
          type="email"
          placeholder="Enter your registered email"
        />
      </div>

      <button
        class="btn-primary btn-lg"
        style="width:100%; margin-top: 18px;"
        @click="sendOtp"
      >
        Change Password
      </button>

      <button
        class="btn-secondary btn-lg"
        style="width:100%; margin-top: 12px;"
        @click="goLogin"
      >
        Back to Login
      </button>

      <div class="demo demo-center">
        <p class="label-text label-lg" style="margin: 18px 0 8px;">Note:</p>
        <div class="label-text demo-text">
          OTP feature backend/Firebase integration will be added later.
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')

function sendOtp() {
  const e = email.value.trim()
  if (!e) {
    alert('Email එක enter කරන්න')
    return
  }

  // UI demo only (later connect backend / firebase)
  alert(`OTP sent (demo) to: ${e}`)
}

function goLogin() {
  router.push('/login')
}
</script>

<style scoped>
/*Same background and card style as login/register */
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

/* typography scale (same as your login) */
.title-lg { font-size: 1.6rem; }
.subtitle-lg { font-size: 1rem; }
.label-lg { font-size: 0.95rem; }
.input-lg { font-size: 1rem; padding: 10px 14px; }
.btn-lg { font-size: 1rem; padding: 11px 16px; }

.demo { margin-top: 12px; }
.demo-text { font-size: 0.9rem; line-height: 1.7; }

/* center the bottom text inside card */
.demo-center {
  text-align: center;
}
</style>