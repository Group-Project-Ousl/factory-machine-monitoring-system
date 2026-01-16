<template>
  <div id="app">
    <Header />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
</script>

<style>
#app { font-family: Arial, sans-serif; color:#222; background:#f8fafc; min-height:100vh; }
main { padding: 1rem; }
</style>
