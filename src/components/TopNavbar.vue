<template>
  <header class="top-navbar">
    <div class="nav-left">
      <!-- simple breadcrumb: only Dashboard link -->
      <nav class="breadcrumb" v-if="!isDashboard">
        <RouterLink to="/dashboard" class="crumb-link">Dashboard</RouterLink>
      </nav>

      <!-- Dynamic Page Title with animation -->
      <transition name="title-fade" mode="out-in">
        <h2 class="page-title" :key="pageTitle">{{ pageTitle }}</h2>
      </transition>
    </div>

    <div class="nav-right">
      <div class="time-display">
        {{ currentTime }}
      </div>

      <button
        class="settings-btn"
        aria-label="Settings"
        @click="goSettings"
        :aria-pressed="isSettingsActive"
        :class="{ active: isSettingsActive }"
      >
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
  return (route.meta.title as string) || 'FM System'
})

/* helper flags */
const isDashboard = computed(() => route.name === 'Dashboard' || route.path === '/dashboard')
const isSettingsActive = computed(() => route.name === 'Settings' || route.path === '/settings')

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

/* Navigation helpers */
const goSettings = () => {
  if (!isSettingsActive.value) router.push('/settings')
}
</script>

<script lang="ts">
export default { name: 'TopNavbar' }
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

/* breadcrumb */
.breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; color: #64748b; }
.crumb-link { color: #1e293b; text-decoration: none; font-weight: 600; }

/* page title styling and animation */
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
  transition: transform .22s ease, opacity .22s ease;
}

/* transition classes for title */
.title-fade-enter-from { opacity: 0; transform: translateY(-6px) scale(.995); }
.title-fade-enter-active { transition: all .22s ease; }
.title-fade-leave-to { opacity: 0; transform: translateY(6px) scale(.995); }
.title-fade-leave-active { transition: all .18s ease; }

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

/* settings button active state */
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
.settings-btn.active {
  background: #0f172a;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(15,23,42,0.08);
}

.settings-btn:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.settings-btn i { font-size: 20px; }
</style>
