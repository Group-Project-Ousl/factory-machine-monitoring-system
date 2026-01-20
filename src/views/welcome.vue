<template>
  <div class="welcome">

    <!-- background video -->
    <video class="bg-video" autoplay muted loop playsinline>
      <source src="/factory.mp4" type="video/mp4" />
    </video>

    <div class="overlay"></div>

    <div class="content">
      <h1 class="title">FACTORY <span>MONITOR</span></h1>

      <p class="subtitle">
        Smart monitoring for modern factories
      </p>

      <button class="btn-primary" @click="goLogin">
        Get Started
      </button>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goLogin = () => router.push('/login')


</script>

<style scoped>
.welcome {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.bg-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bg-video,
.overlay {
  pointer-events: none;
}


.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
}

.content {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
}

.title span {
  color: #38bdf8;
}

.subtitle {
  margin: 14px 0 24px;
  font-size: 1.1rem;
}
</style>
