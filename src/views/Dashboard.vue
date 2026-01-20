<template>
  <div class="dashboard-container">
    <div class="header-row mb-6">
      <div class="filter-tabs">
        <button class="tab-btn active-tab">All (8)</button>
        <button class="tab-btn">Running (3)</button>
        <button class="tab-btn">Idle (3)</button>
        <button class="tab-btn">Maintenance (1)</button>
        <button class="tab-btn">Error (1)</button>
      </div>
      <button class="btn-primary">+ Add Machine</button>
    </div>

    <div class="stats-row mb-8">
      <div v-for="stat in summaryStats" :key="stat.label" class="stat-card">
        <span class="stat-label">{{ stat.label }}</span>
        <div :class="['stat-number', stat.colorClass]">{{ stat.value }}</div>
      </div>
    </div>

    <div class="columnar-grid">
      <div v-for="status in ['Running', 'Idle', 'Error', 'Maintenance']" :key="status" class="status-column">
        <h3 class="column-title" :class="`text-${status.toLowerCase()}`">
          {{ status }} ({{ getMachinesByStatus(status).length }})
        </h3>
        
        <div class="column-content">
          <div v-for="machine in getMachinesByStatus(status)" :key="machine.id" class="machine-card large-card">
            <div class="card-header">
              <div>
                <h3 class="machine-id">{{ machine.id }}</h3>
                <span class="machine-sub">{{ machine.type }}</span>
              </div>
              <div class="status-controls">
                 <span :class="['badge', getBadgeClass(machine.status)]">
                   <span class="dot"></span> {{ machine.status }}
                 </span>
                 <i class="mdi mdi-tune-vertical control-icon"></i>
              </div>
            </div>

            <div class="metrics-area">
              <div class="metric-row">
                <span class="metric-label"><i class="mdi mdi-thermometer-outline"></i> Temp</span>
                <span :class="['metric-value', machine.temp > 85 ? 'text-error' : '']">{{ machine.temp }}°C</span>
              </div>

              <div v-if="machine.efficiency" class="efficiency-wrap">
                <div class="metric-row">
                  <span class="metric-label"><i class="mdi mdi-pulse"></i> Efficiency</span>
                  <span class="metric-value">{{ machine.efficiency }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-inner" :style="{ width: machine.efficiency + '%' }"></div>
                </div>
              </div>
              
              <div class="uptime-footer">Uptime: {{ machine.uptime }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const machines = ref([
  { id: 'M-001', type: 'CNC Mill', status: 'Idle', temp: 32.2, uptime: 100 },
  { id: 'M-002', type: 'Lathe', status: 'Running', temp: 67.9, efficiency: 71.9, uptime: 96 },
  { id: 'M-003', type: 'Press', status: 'Error', temp: 97.2, uptime: 0 },
  { id: 'M-004', type: 'Assembly Line', status: 'Idle', temp: 39.6, uptime: 100 },
  { id: 'M-005', type: 'Welder', status: 'Running', temp: 84.1, efficiency: 76.5, uptime: 97 },
  { id: 'M-006', type: 'Quality Check', status: 'Maintenance', temp: 39.2, uptime: 0 },
  { id: 'M-007', type: 'Packaging', status: 'Running', temp: 55.4, efficiency: 89.2, uptime: 99 },
  { id: 'M-008', type: 'Conveyor', status: 'Idle', temp: 42.1, uptime: 100 },
]);

const summaryStats = [
  { label: 'Total', value: 8, colorClass: '' },
  { label: 'Running', value: 3, colorClass: 'text-running' },
  { label: 'Idle', value: 3, colorClass: 'text-idle' },
  { label: 'Errors', value: 1, colorClass: 'text-error' },
];

const getMachinesByStatus = (status) => machines.value.filter(m => m.status === status);

const getBadgeClass = (status) => {
  const map = { Running: 'badge-running', Idle: 'badge-idle', Error: 'badge-error', Maintenance: 'badge-maintenance' };
  return map[status];
};
</script>

<style scoped>
/* Keeping your theme consistent */
.dashboard-container { font-family: 'Inter', sans-serif; padding: 20px 40px; background: #fcfcfc; min-height: 100vh; }

/* COLUMNAR LAYOUT LOGIC */
.columnar-grid {
  display: flex;
  gap: 24px;
  overflow-x: auto; /* Allow horizontal scroll if many categories */
  align-items: flex-start;
}

.status-column {
  flex: 1;
  min-width: 320px; /* Forces cards to be larger */
  background: #f8f9fa;
  padding: 16px;
  border-radius: 16px;
}

.column-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 20px;
  padding-left: 8px;
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* LARGER CARDS */
.large-card {
  min-height: 200px; /* Increased vertical size */
  padding: 24px !important; /* Increased internal breathing room */
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}

/* Text Colors */
.text-running { color: #2ecc71; }
.text-idle { color: #f1c40f; }
.text-error { color: #e74c3c; }
.text-maintenance { color: #3498db; }

/* Original Styles Restored Below */
.header-row { display: flex; justify-content: space-between; align-items: center; }
.filter-tabs { display: flex; gap: 8px; }
.tab-btn { padding: 6px 16px; border-radius: 8px; border: 1px solid #eee; background: white; font-weight: 600; cursor: pointer; }
.active-tab { background: #000; color: #fff; }
.btn-primary { background: #000; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.stats-row { display: flex; gap: 20px; }
.stat-card { flex: 1; background: white; border: 1px solid #f0f0f0; border-radius: 12px; padding: 16px 20px; }
.stat-label { color: #999; font-size: 12px; }
.stat-number { font-size: 24px; font-weight: 700; margin-top: 4px; }
.machine-card { background: white; border: 1px solid #f0f0f0; border-radius: 16px; }
.card-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
.machine-id { font-size: 20px; font-weight: 800; margin: 0; }
.machine-sub { font-size: 13px; color: #aaa; }
.metric-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
.metric-label { font-size: 14px; color: #666; display: flex; align-items: center; gap: 6px; }
.metric-value { font-size: 15px; font-weight: 700; }
.progress-bar { background: #eee; height: 8px; border-radius: 4px; overflow: hidden; }
.progress-inner { background: #000; height: 100%; }
.badge { padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 5px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.badge-running { background: #e8f5e9; color: #2ecc71; }
.badge-idle { background: #fff8e1; color: #f1c40f; }
.badge-error { background: #fdecea; color: #e74c3c; }
.badge-maintenance { background: #e3f2fd; color: #3498db; }
.control-icon { color: #ccc; cursor: pointer; }
.mb-6 { margin-bottom: 24px; }
.mb-8 { margin-bottom: 32px; }
</style>