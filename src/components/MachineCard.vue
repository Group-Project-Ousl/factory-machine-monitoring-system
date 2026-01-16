<template>
  <div class="card" :class="statusClass">
    <div class="name">{{ name }}</div>
    <div class="status">{{ status }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
defineProps({
  name: { type: String, required: true },
  status: { type: String, default: 'unknown' }
});
const props = defineProps(['name','status']);
const statusClass = computed(() => ({
  online: props.status.toLowerCase() === 'online',
  offline: props.status.toLowerCase() === 'offline'
}));
</script>

<style scoped>
.card {
  border: 1px solid #e0e6ef;
  padding: 0.75rem;
  border-radius: 6px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  background:#fff;
}
.card.online { border-left: 4px solid #28a745; }
.card.offline { border-left: 4px solid #dc3545; opacity:0.9; }
.name { font-weight:600; }
.status { font-size:0.9rem; color:#555; }
</style>
