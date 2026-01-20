<script setup lang="ts"> 
import { ref, computed, onMounted, onUnmounted } from 'vue';

/* --- State Management --- */
const lastUpdatedTime = ref(new Date().toLocaleTimeString());
const activeTab = ref('All');

const tabs = ref([
  { label: 'All', count: 8 },
  { label: 'Running', count: 3 },
  { label: 'Idle', count: 3 },
  { label: 'Maintenance', count: 1 },
  { label: 'Error', count: 1 }
]);

const machineSummary = ref([
  { label: 'Total', value: 8, color: '#1e293b' },
  { label: 'Running', value: 3, color: '#10b981' },
  { label: 'Idle', value: 3, color: '#f59e0b' },
  { label: 'Errors', value: 1, color: '#ef4444' }
]);

// Interface for type safety
interface Machine {
  id: string;
  type: string;
  status: 'Running' | 'Idle' | 'Error' | 'Maintenance';
  temp: number;
  uptime: number;
  efficiency?: number;
}

const machines = ref<Machine[]>([
  { id: 'M-001', type: 'CNC Mill', status: 'Idle', temp: 25.3, uptime: 100 },
  { id: 'M-002', type: 'Lathe', status: 'Running', temp: 75.2, efficiency: 75.7, uptime: 87 },
  { id: 'M-003', type: 'Press', status: 'Error', temp: 99.4, uptime: 0 },
  { id: 'M-004', type: 'Assembly Line', status: 'Idle', temp: 36.6, uptime: 100 },
  { id: 'M-005', type: 'Welder', status: 'Running', temp: 72.7, efficiency: 93.7, uptime: 97 },
  { id: 'M-006', type: 'Quality Check', status: 'Maintenance', temp: 33.1, uptime: 0 },
  { id: 'M-007', type: 'CNC Mill', status: 'Idle', temp: 29.4, uptime: 100 },
  { id: 'M-008', type: 'Lathe', status: 'Running', temp: 70.6, efficiency: 79.5, uptime: 89 }
]);

/* --- Computed: Sorting & Filtering --- */
const filteredMachines = computed(() => {
  // Priority map: Running (1) -> Idle (2) -> Maintenance (3) -> Error (4)
  const statusPriority: Record<string, number> = {
    'Running': 1,
    'Idle': 2,
    'Maintenance': 3,
    'Error': 4
  };

  if (activeTab.value === 'All') {
    // Return a sorted copy of the array
    return [...machines.value].sort((a, b) => {
      return statusPriority[a.status] - statusPriority[b.status];
    });
  }
  
  // Filter based on selected tab
  return machines.value.filter(m => m.status === activeTab.value);
});

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Running': '#10b981',
    'Idle': '#f59e0b',
    'Error': '#ef4444',
    'Maintenance': '#3b82f6'
  };
  return colors[status] || '#64748b';
};

/* --- Real-time Updates --- */
let dataTimer: ReturnType<typeof setInterval> | null = null;
const simulateUpdates = () => {
  lastUpdatedTime.value = new Date().toLocaleTimeString();
  machines.value.forEach(m => {
    if (m.status === 'Running') {
      m.temp = parseFloat((m.temp + (Math.random() * 0.4 - 0.2)).toFixed(1));
      if (m.efficiency) {
        m.efficiency = parseFloat(Math.min(100, Math.max(0, m.efficiency + (Math.random() * 0.2 - 0.1))).toFixed(1));
      }
    }
  });
};

onMounted(() => { dataTimer = setInterval(simulateUpdates, 30000); });
onUnmounted(() => { if (dataTimer) clearInterval(dataTimer); });
</script>

<template>
  <div class="monitoring-wrapper">
    <header class="header-section">
      <div class="header-info">
        <h2 class="view-title">Machine Monitoring</h2>
        <p class="last-updated">System Status: Active | {{ lastUpdatedTime }}</p>
      </div>
    </header>

    <section class="controls-bar">
      <div class="filter-container">
        <button class="filter-icon"><i class="mdi mdi-filter-variant"></i></button>
        <div class="tab-group">
          <button 
            v-for="tab in tabs" :key="tab.label"
            :class="['tab-btn', { active: activeTab === tab.label }]"
            @click="activeTab = tab.label"
          >
            {{ tab.label }} ({{ tab.count }})
          </button>
        </div>
        <button class="add-btn">+ Add Machine</button>
      </div>
    </section>

    <div class="summary-grid">
      <div v-for="stat in machineSummary" :key="stat.label" class="summary-card">
        <span class="summary-label">{{ stat.label }}</span>
        <div class="summary-value" :style="{ color: stat.color }">{{ stat.value }}</div>
      </div>
    </div>

    <div class="machines-grid">
      <div v-for="machine in filteredMachines" :key="machine.id" class="machine-card">
        <div class="card-header">
          <div class="info">
            <h3 class="m-id">{{ machine.id }}</h3>
            <p class="m-type">{{ machine.type }}</p>
          </div>
          <div class="status-badge">
            <span class="status-dot" :style="{ backgroundColor: getStatusColor(machine.status) }"></span>
            <span class="status-label" :class="machine.status.toLowerCase()">{{ machine.status }}</span>
            <button class="mini-settings"><i class="mdi mdi-tune"></i></button>
          </div>
        </div>

        <div class="card-body">
          <div class="data-row">
            <span class="label"><i class="mdi mdi-thermometer"></i> Temp</span>
            <span class="value" :class="{ 'error-text': machine.status === 'Error' }">{{ machine.temp }}°C</span>
          </div>
          
          <div v-if="machine.status === 'Running'" class="efficiency-area">
            <div class="data-row compact">
              <span class="label"><i class="mdi mdi-pulse"></i> Efficiency</span>
              <span class="value">{{ machine.efficiency }}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-thumb" :style="{ width: machine.efficiency + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <span class="uptime">Uptime: {{ machine.uptime }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.monitoring-wrapper { padding: 30px; background: #fcfcfc; min-height: 100vh; font-family: 'Inter', sans-serif; }

/* Header & Filters */
.header-section { margin-bottom: 25px; }
.view-title { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0; }
.last-updated { font-size: 0.85rem; color: #94a3b8; margin-top: 4px; }

.controls-bar { margin-bottom: 25px; }
.filter-container { display: flex; align-items: center; gap: 12px; }
.filter-icon { background: #fff; border: 1px solid #e2e8f0; padding: 8px; border-radius: 6px; cursor: pointer; }
.tab-group { display: flex; gap: 8px; flex-grow: 1; }
.tab-btn { background: #fff; border: 1px solid #e2e8f0; padding: 6px 14px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.85rem; }
.tab-btn.active { background: #0f172a; color: #fff; border-color: #0f172a; }
.add-btn { background: #0f172a; color: #fff; border: none; padding: 8px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }

/* Summary Stats */
.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
.summary-card { background: #fff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px; }
.summary-label { font-size: 0.8rem; color: #64748b; font-weight: 500; }
.summary-value { font-size: 1.8rem; font-weight: 700; margin-top: 5px; }

/* Machine Grid Layout (3 Columns) */
.machines-grid { 
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 20px; 
}

.machine-card { 
  background: #fff; 
  border: 1px solid #e2e8f0; 
  border-radius: 14px; 
  padding: 24px; 
  display: flex; 
  flex-direction: column;
}

.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.m-id { font-size: 1.1rem; font-weight: 700; margin: 0; }
.m-type { font-size: 0.85rem; color: #94a3b8; margin: 0; }

.status-badge { display: flex; align-items: center; gap: 6px; background: #f8fafc; padding: 4px 8px; border-radius: 6px; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; }
.status-label { font-size: 0.75rem; font-weight: 700; }
.status-label.running { color: #10b981; }
.status-label.idle { color: #f59e0b; }
.status-label.error { color: #ef4444; }
.status-label.maintenance { color: #3b82f6; }
.mini-settings { background: none; border: none; color: #cbd5e1; cursor: pointer; font-size: 1rem; }

.card-body { flex-grow: 1; min-height: 90px; }
.data-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
.data-row.compact { margin-bottom: 4px; }
.label { font-size: 0.9rem; color: #64748b; }
.value { font-weight: 700; font-size: 0.95rem; }
.error-text { color: #ef4444; }

.progress-track { background: #f1f5f9; height: 7px; border-radius: 4px; overflow: hidden; margin-top: 4px; }
.progress-thumb { background: #0f172a; height: 100%; border-radius: 4px; }

.card-footer { border-top: 1px solid #f8fafc; padding-top: 15px; margin-top: 15px; }
.uptime { font-size: 0.85rem; color: #94a3b8; font-weight: 500; }

/* Responsive adjustments */
@media (max-width: 1200px) { .machines-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 700px) { .machines-grid { grid-template-columns: 1fr; } .summary-grid { grid-template-columns: repeat(2, 1fr); } }
</style>