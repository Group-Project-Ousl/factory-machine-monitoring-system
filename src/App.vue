<script setup>
import Sidebar from './components/Sidebar.vue'
import TopNavbar from './components/TopNavbar.vue'
</script>

<template>
  <Sidebar />
  <TopNavbar />

  <main class="content">
    <router-view />
  </main>
</template>
