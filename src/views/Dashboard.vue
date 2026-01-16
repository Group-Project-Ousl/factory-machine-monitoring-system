<template>
  <section class="dashboard">
    <h2>Dashboard</h2>
    <div class="grid">
      <MachineCard
        v-for="m in machines"
        :key="m.id"
        :name="m.name"
        :status="m.status"
      />
    </div>
  </section>
</template>

<script setup>
import MachineCard from '../components/MachineCard.vue';
const machines = [
  { id: 1, name: 'Cutter A1', status: 'Online' },
  { id: 2, name: 'Press B2', status: 'Offline' },
  { id: 3, name: 'Assembler C3', status: 'Online' }
];
</script>

<style scoped>
.dashboard { padding: 1rem; }
.grid { display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); margin-top:0.5rem; }
h2 { margin: 0 0 0.5rem 0; }
</style>
