<template>
  <header class="top-navbar">
    <div class="nav-left">
      <!-- Back / Close button -->
      <button
        class="icon-btn close-btn"
        aria-label="Back"
        @click="goBack"
      >
        <i class="mdi mdi-arrow-left"></i>
      </button>

      <!-- Dynamic Page Title -->
      <h2 class="page-title">{{ pageTitle }}</h2>
    </div>

    <div class="nav-right">
      <div class="time-display">
        {{ currentTime }}
      </div>

      <button class="settings-btn" aria-label="Settings">
        <i class="mdi mdi-cog-outline"></i>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/* Router */
const route = useRoute()
const router = useRouter()

/* Dynamic page title from routes meta */
const pageTitle = computed(() => {
  return route.meta.title as string || 'FM System'
})

/* Clock */
const currentTime = ref('')

const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
}

let timer: number
onMounted(() => {
  updateClock()
  timer = window.setInterval(updateClock, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

/* Back button logic */
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.top-navbar {
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #edf2f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 999;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 22px;
  color: #64748b;
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  background: #f2e8e8;
  padding: 6px 14px;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  display: inline-block;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.time-display {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

.settings-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1e293b;
  transition: all 0.2s ease;
}

.settings-btn:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.settings-btn i {
  font-size: 20px;
}
</style>
