<template>
  <div class="layout">
    <Sidebar />
    <div class="main">
      <TopNavbar />
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import TopNavbar from '../components/TopNavbar.vue'

// Components are already available in template via auto-import with setup syntax
</script>

<style scoped>
.layout {
  display: flex;
}

.main {
  margin-left: 260px;
  width: 100%;
}
</style>
