<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

/* --- State Management --- */
const lastUpdatedTime = ref(new Date().toLocaleTimeString());
const activeTab = ref('All');

// Explicitly typing the tabs for better reliability
interface StatusTab {
  label: string;
  count: number;
}

const tabs = ref<StatusTab[]>([
  { label: 'All', count: 8 },
  { label: 'Running', count: 3 },
  { label: 'Idle', count: 3 },
  { label: 'Maintenance', count: 1 },
  { label: 'Error', count: 1 }
]);

const machineSummary = ref([
  { label: 'Total', value: 8, color: '#0f172a' },
  { label: 'Running', value: 3, color: '#10b981' },
  { label: 'Idle', value: 3, color: '#f59e0b' },
  { label: 'Errors', value: 1, color: '#ef4444' }
]);

// Machine Interface for Type Safety
interface Machine {
  id: string;
  type: string;
  status: 'Running' | 'Idle' | 'Error' | 'Maintenance';
  temp: number;
  uptime: number;
  efficiency?: number;
}

const machines = ref<Machine[]>([
  { id: 'M-001', type: 'CNC Mill', status: 'Idle', temp: 34.6, uptime: 100 },
  { id: 'M-002', type: 'Lathe', status: 'Running', temp: 80.2, efficiency: 83.0, uptime: 89 },
  { id: 'M-003', type: 'Press', status: 'Error', temp: 103.6, uptime: 0 },
  { id: 'M-004', type: 'Assembly Line', status: 'Idle', temp: 35.9, uptime: 100 },
  { id: 'M-005', type: 'Welder', status: 'Running', temp: 68.2, efficiency: 82.1, uptime: 87 },
  { id: 'M-006', type: 'Quality Check', status: 'Maintenance', temp: 29.4, uptime: 0 },
  { id: 'M-007', type: 'CNC Mill', status: 'Idle', temp: 29.4, uptime: 100 },
  { id: 'M-008', type: 'Lathe', status: 'Running', temp: 70.6, efficiency: 79.5, uptime: 89 }
]);

/* --- Computed & Helpers --- */
const filteredMachines = computed(() => {
  if (activeTab.value === 'All') return machines.value;
  return machines.value.filter(m => m.status === activeTab.value);
});

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Running': '#10b981',
    'Idle': '#f59e0b',
    'Error': '#ef4444',
    'Maintenance': '#2563eb'
  };
  return colors[status] || '#64748b';
};

/* --- Lively Data Update --- */
let dataTimer: ReturnType<typeof setInterval> | null = null;

const simulateUpdates = () => {
  lastUpdatedTime.value = new Date().toLocaleTimeString();
  
  machines.value.forEach(m => {
    if (m.status === 'Running') {
      // Simulate slight temperature and efficiency fluctuations
      m.temp = parseFloat((m.temp + (Math.random() * 2 - 1)).toFixed(1));
      if (m.efficiency) {
        m.efficiency = parseFloat(Math.min(100, Math.max(0, m.efficiency + (Math.random() * 1 - 0.5))).toFixed(1));
      }
    }
  });
};

onMounted(() => {
  dataTimer = setInterval(simulateUpdates, 60000);
});

onUnmounted(() => {
  if (dataTimer) clearInterval(dataTimer);
});
</script>

<template>
  <div class="monitoring-wrapper">
    <header class="view-header">
      <div class="header-left">
        <h2 class="view-title">Machine Monitoring</h2>
        <p class="last-updated">System Status: Active | {{ lastUpdatedTime }}</p>
      </div>
      <div class="header-right">
        <button class="primary-btn">
          <i class="mdi mdi-plus"></i> Add Machine
        </button>
      </div>
    </header>

    <section class="controls-bar">
      <div class="filter-group">
        <button class="icon-square-btn" aria-label="Filter list">
          <i class="mdi mdi-filter-variant"></i>
        </button>
        <div class="status-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.label"
            :class="['tab-item', { active: activeTab === tab.label }]"
            @click="activeTab = tab.label"
          >
            {{ tab.label }} <span class="badge-count">{{ tab.count }}</span>
          </button>
        </div>
      </div>
    </section>

    <div class="summary-grid">
      <div v-for="stat in machineSummary" :key="stat.label" class="summary-card">
        <span class="summary-label">{{ stat.label }}</span>
        <div class="summary-value" :style="{ color: stat.color }">{{ stat.value }}</div>
      </div>
    </div>

    <div class="machines-container">
      <div v-for="machine in filteredMachines" :key="machine.id" class="machine-card">
        <div class="card-header">
          <div class="machine-identity">
            <h3 class="m-id">{{ machine.id }}</h3>
            <p class="m-type">{{ machine.type }}</p>
          </div>
          <div class="status-indicators">
            <span class="indicator-dot" :style="{ backgroundColor: getStatusColor(machine.status) }"></span>
            <span class="status-pill" :class="machine.status.toLowerCase()">{{ machine.status }}</span>
            <button class="mini-action-btn"><i class="mdi mdi-tune-variant"></i></button>
          </div>
        </div>

        <div class="card-content">
          <div class="data-row">
            <div class="data-label"><i class="mdi mdi-thermometer"></i> Temp</div>
            <div class="data-val" :class="{ 'warning-text': machine.temp > 90 }">{{ machine.temp }}°C</div>
          </div>
          
          <div v-if="machine.efficiency !== undefined" class="efficiency-box">
            <div class="data-row">
              <div class="data-label"><i class="mdi mdi-pulse"></i> Efficiency</div>
              <div class="data-val">{{ machine.efficiency }}%</div>
            </div>
            <div class="progress-track">
              <div class="progress-bar" :style="{ width: machine.efficiency + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <span class="uptime-text">Uptime: {{ machine.uptime }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles remain unchanged as they were structurally correct */
.monitoring-wrapper { 
    padding: 32px; 
    background: #f8fafc; 
    min-height: 100vh; 
    font-family: 'Inter', 
    sans-serif; 
}
.view-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 32px; 
}
.view-title { 
    font-size: 1.5rem; 
    font-weight: 700; 
    color: #0f172a; 
    margin: 0; 
}
.last-updated { 
    font-size: 0.875rem; 
    color: #64748b; 
    margin-top: 4px; 
}
.primary-btn { 
    background: #0f172a; 
    color: white; 
    border: none; 
    padding: 12px 24px; 
    border-radius: 10px; 
    font-weight: 700; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    gap: 8px; 
}
.controls-bar { 
    margin-bottom: 24px; 
}
.filter-group { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
}
.icon-square-btn { 
    width: 42px; 
    height: 42px; 
    background: white; 
    border: 1px solid #edf2f7; 
    border-radius: 10px; 
    color: #64748b; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
}
.status-tabs { 
    display: flex; 
    gap: 8px; 
    background: #fff; 
    padding: 4px; 
    border-radius: 12px; 
    border: 1px solid #edf2f7; 
}
.tab-item { 
    padding: 8px 16px; 
    border-radius: 8px; 
    border: none; 
    background: transparent; 
    color: #64748b; 
    font-weight: 600; 
    cursor: pointer; 
    transition: all 0.2s; 
}
.tab-item.active { 
    background: #0f172a; 
    color: white; 
}
.badge-count { 
    margin-left: 4px; 
    opacity: 0.7; 
    font-size: 0.8em; 
}
.summary-grid { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 24px; 
    margin-bottom: 32px; 
}
.summary-card { 
    background: white; 
    padding: 24px; 
    border-radius: 16px; 
    border: 1px solid #edf2f7; 
}
.summary-label { 
    color: #64748b; 
    font-size: 0.875rem; 
    font-weight: 500; 
}
.summary-value { 
    font-size: 2rem; 
    font-weight: 700; 
    margin-top: 8px; 
}
.machines-container { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); 
    gap: 24px; 
}
.machine-card { 
    background: white; 
    padding: 24px; 
    border-radius: 16px; 
    border: 1px solid #edf2f7; 
    display: flex; 
    flex-direction: column; 
    gap: 24px; 
    transition: transform 0.2s; 
}
.machine-card:hover { transform: translateY(-4px); box-shadow: 0 12px 20px rgba(0,0,0,0.03); }
.card-header { display: flex; justify-content: space-between; align-items: flex-start; }
.m-id { font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 0; }
.m-type { font-size: 0.875rem; color: #94a3b8; margin-top: 2px; }
.status-indicators { display: flex; align-items: center; gap: 8px; }
.indicator-dot { width: 8px; height: 8px; border-radius: 50%; }
.status-pill { font-size: 0.75rem; font-weight: 800; padding: 4px 12px; border-radius: 6px; text-transform: capitalize; }
.status-pill.running { background: #ecfdf5; color: #10b981; }
.status-pill.idle { background: #fffbeb; color: #f59e0b; }
.status-pill.error { background: #fef2f2; color: #ef4444; }
.status-pill.maintenance { background: #eff6ff; color: #2563eb; }
.card-content { display: flex; flex-direction: column; gap: 20px; }
.data-row { display: flex; justify-content: space-between; align-items: center; }
.data-label { display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 0.95rem; }
.data-val { font-weight: 700; color: #0f172a; }
.warning-text { color: #ef4444; }
.progress-track { width: 100%; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; margin-top: 8px; }
.progress-bar { height: 100%; background: #0f172a; transition: width 0.5s ease; }
.card-footer { border-top: 1px solid #f1f5f9; padding-top: 16px; color: #94a3b8; font-size: 0.85rem; font-weight: 500; }
.mini-action-btn { background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 1.2rem; }
</style>