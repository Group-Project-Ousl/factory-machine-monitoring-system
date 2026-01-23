<script setup lang="ts"> 
import { ref, computed, onMounted, onUnmounted } from 'vue';
import * as AddMachineModule from './addmachine.vue';
const AddMachine = (AddMachineModule as any).default || (AddMachineModule as any).AddMachine || (AddMachineModule as any);


import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.js'


const lastUpdatedTime = ref(new Date().toLocaleTimeString());
const activeTab = ref('All');


const tabs = ref<{ label: string; count: number }[]>([])
const machineSummary = ref<{ label: string; value: number; color: string }[]>([])


interface Machine {
  id: string;
  name?: string; 
  type: string;
  status: 'Running' | 'Idle' | 'Error' | 'Maintenance';
  temp?: number | null;
  uptime?: number;
  efficiency?: number;
  target?: number;
  createdAt?: string;
}


const machines = ref<Machine[]>([])


// helper to normalize various status strings into the expected enum
function normalizeStatus(s: any): Machine['status'] {
  if (typeof s !== 'string') return 'Idle';
  const str = s.trim().toLowerCase();
  if (str.includes('run')) return 'Running';
  if (str.includes('idle')) return 'Idle';
  if (str.includes('maint')) return 'Maintenance';
  if (str.includes('err') || str.includes('error')) return 'Error';
  return 'Idle';
}

function updateCountsFromMachines() {
  // ensure statuses are normalized before counting
  machines.value.forEach(m => {
    m.status = normalizeStatus(m.status);
  });

  const counts = { All: machines.value.length, Running: 0, Idle: 0, Maintenance: 0, Error: 0 }
  machines.value.forEach(m => {
    if (m.status === 'Running') counts.Running++
    else if (m.status === 'Idle') counts.Idle++
    else if (m.status === 'Maintenance') counts.Maintenance++
    else if (m.status === 'Error') counts.Error++
  })

  tabs.value = [
    { label: 'All', count: counts.All },
    { label: 'Running', count: counts.Running },
    { label: 'Idle', count: counts.Idle },
    { label: 'Maintenance', count: counts.Maintenance },
    { label: 'Error', count: counts.Error }
  ]

  machineSummary.value = [
    { label: 'Total', value: counts.All, color: '#1e293b' },
    { label: 'Running', value: counts.Running, color: '#10b981' },
    { label: 'Idle', value: counts.Idle, color: '#f59e0b' },
    { label: 'Errors', value: counts.Error, color: '#ef4444' }
  ]
}


updateCountsFromMachines()


const filteredMachines = computed(() => {
  
  const statusPriority: Record<string, number> = {
    'Running': 1,
    'Idle': 2,
    'Maintenance': 3,
    'Error': 4
  };

  if (activeTab.value === 'All') {
    
    return [...machines.value].sort((a, b) => {
      return statusPriority[a.status] - statusPriority[b.status];
    });
  }
  
  
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


let dataTimer: ReturnType<typeof setInterval> | null = null;
const simulateUpdates = () => {
  lastUpdatedTime.value = new Date().toLocaleTimeString();
  machines.value.forEach(m => {
    if (m.status === 'Running') {
      // guard against null/undefined temps and efficiencies
      const currentTemp = typeof m.temp === 'number' ? m.temp : 0;
      m.temp = parseFloat((currentTemp + (Math.random() * 0.4 - 0.2)).toFixed(1));
      if (typeof m.efficiency === 'number') {
        m.efficiency = parseFloat(Math.min(100, Math.max(0, m.efficiency + (Math.random() * 0.2 - 0.1))).toFixed(1));
      }
    }
  });
};

onMounted(() => { dataTimer = setInterval(simulateUpdates, 30000); });
onUnmounted(() => { if (dataTimer) clearInterval(dataTimer); });


let unsubscribe: (() => void) | null = null
onMounted(() => {
  const q = query(collection(db, 'machines'), orderBy('createdAt', 'asc'))
  unsubscribe = onSnapshot(q, snapshot => {
    machines.value = snapshot.docs.map(doc => {
      const data = doc.data() as any
      return {
        id: doc.id,
        name: data.name || '', 
        type: data.type || 'Unknown',
        // normalize incoming status values
        status: normalizeStatus(data.status),
        temp: data.temp ?? null,
        uptime: data.uptime ?? 0,
        efficiency: data.efficiency ?? undefined,
        target: data.target ?? undefined,
        createdAt: data.createdAt ?? undefined
      } as Machine
    })
    updateCountsFromMachines()
    lastUpdatedTime.value = new Date().toLocaleTimeString()
  }, err => {
    console.error('Machines snapshot error:', err)
  })
})

onUnmounted(() => { if (unsubscribe) unsubscribe() })


const showAddModal = ref(false);
// add a toggle to enable sending dummy data to Firebase
const sendDummyToFirebase = ref(false)

// timer for pushing dummy data to Firestore
let firebaseTimer: ReturnType<typeof setInterval> | null = null

// generate and push dummy sensor-like values for each machine into Firestore
async function pushDummyDataToFirebase() {
  if (!machines.value.length) return
  try {
    await Promise.all(machines.value.map(async m => {
      if (!m.id) return
      // create small random variations; keep values sensible
      const currentTemp = typeof m.temp === 'number' ? m.temp : 25 + Math.random() * 5
      const newTemp = parseFloat((currentTemp + (Math.random() * 1.2 - 0.6)).toFixed(1))
      const currentEff = typeof m.efficiency === 'number' ? m.efficiency : 80 + Math.random() * 10
      const newEff = parseFloat(Math.min(100, Math.max(0, currentEff + (Math.random() * 2 - 1))).toFixed(1))
      const newUptime = Math.min(100, (m.uptime ?? 0) + Math.round(Math.random() * 1)) // small change

      await updateDoc(doc(db, 'machines', m.id), {
        temp: newTemp,
        efficiency: newEff,
        uptime: newUptime
      })
    }))
  } catch (err) {
    console.error('Error pushing dummy data:', err)
  }
}

// start interval to push when enabled
onMounted(() => {
  firebaseTimer = setInterval(() => {
    if (sendDummyToFirebase.value) pushDummyDataToFirebase()
  }, 15000) // push every 15s
})

// ensure firebaseTimer is cleared on unmount
onUnmounted(() => {
  if (firebaseTimer) clearInterval(firebaseTimer)
})

function onMachineAdded(_payload: any) {
  
  showAddModal.value = false
}

// track which machine's action menu is open
const openMenuId = ref<string | null>(null)

function toggleMenu(id: string) {
  openMenuId.value = openMenuId.value === id ? null : id
}

// click outside handler to close menus
function handleDocumentClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.action-menu') && !target.closest('.mini-settings')) {
    openMenuId.value = null
  }
}
onMounted(() => document.addEventListener('click', handleDocumentClick))
onUnmounted(() => document.removeEventListener('click', handleDocumentClick))

// update status in Firestore (optimistic local update)
async function changeStatus(id: string, newStatus: Machine['status']) {
  try {
    // optimistic local update
    const idx = machines.value.findIndex(m => m.id === id)
    if (idx !== -1) machines.value[idx].status = newStatus

    await updateDoc(doc(db, 'machines', id), { status: newStatus })
    openMenuId.value = null
    updateCountsFromMachines()
  } catch (err) {
    console.error('Failed to change status:', err)
  }
}
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
        <button class="add-btn" @click="showAddModal = true">+ Add Machine</button> <!-- wired click -->
        <!-- toggle button to send dummy data to Firebase -->
        <button
          class="add-btn"
          :style="{ background: sendDummyToFirebase ? '#047857' : '#6b7280', marginLeft: '8px' }"
          @click="sendDummyToFirebase = !sendDummyToFirebase"
        >
          {{ sendDummyToFirebase ? 'Pushing dummy → Firebase' : 'Enable dummy Firebase' }}
        </button>
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
           
            <h3 class="m-id">{{ machine.name || machine.id }}</h3>
            <p class="m-type">{{ machine.type }}</p>
          </div>
          <div class="status-badge">
            <span class="status-dot" :style="{ backgroundColor: getStatusColor(machine.status) }"></span>
            <span class="status-label" :class="machine.status.toLowerCase()">{{ machine.status }}</span>

            <!-- mini settings button toggles menu -->
            <button
              class="mini-settings"
              :class="{ open: openMenuId === machine.id }"
              @click.stop="toggleMenu(machine.id)"
              aria-label="Actions"
              :title="openMenuId === machine.id ? 'Close actions' : 'Open actions'"
            >
              <i :class="openMenuId === machine.id ? 'mdi mdi-close' : 'mdi mdi-dots-vertical'"></i>
            </button>

            <!-- action menu (shows options based on current status) -->
            <div v-if="openMenuId === machine.id" class="action-menu">
              <!-- Running: Stop (-> Idle), Set Maintenance, Set Idle -->
              <template v-if="machine.status === 'Running'">
                <button class="action-item stop" @click="changeStatus(machine.id, 'Idle')"><i class="mdi mdi-stop-circle-outline"></i> Stop</button>
                <button class="action-item maintenance" @click="changeStatus(machine.id, 'Maintenance')"><i class="mdi mdi-wrench"></i> Add to Maintenance</button>
                <button class="action-item idle" @click="changeStatus(machine.id, 'Idle')"><i class="mdi mdi-pause-circle-outline"></i> Set Idle</button>
              </template>

              <!-- Idle: Start, Add to Maintenance -->
              <template v-else-if="machine.status === 'Idle'">
                <button class="action-item start" @click="changeStatus(machine.id, 'Running')"><i class="mdi mdi-play-circle-outline"></i> Start</button>
                <button class="action-item maintenance" @click="changeStatus(machine.id, 'Maintenance')"><i class="mdi mdi-wrench"></i> Add to Maintenance</button>
              </template>

              <!-- Error: Add to Maintenance -->
              <template v-else-if="machine.status === 'Error'">
                <button class="action-item maintenance" @click="changeStatus(machine.id, 'Maintenance')"><i class="mdi mdi-wrench"></i> Add to Maintenance</button>
              </template>

              <!-- Maintenance: Set Running, Set Idle -->
              <template v-else-if="machine.status === 'Maintenance'">
                <button class="action-item start" @click="changeStatus(machine.id, 'Running')"><i class="mdi mdi-play-circle-outline"></i> Set Running</button>
                <button class="action-item idle" @click="changeStatus(machine.id, 'Idle')"><i class="mdi mdi-pause-circle-outline"></i> Set Idle</button>
              </template>
            </div>
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

    
    <AddMachine v-if="showAddModal" @close="showAddModal = false" @added="onMachineAdded" />
  </div>
</template>

<style scoped>
.monitoring-wrapper { padding: 30px; background: #fcfcfc; min-height: 100vh; font-family: 'Inter', sans-serif; }


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


.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
.summary-card { background: #fff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px; }
.summary-label { font-size: 0.8rem; color: #64748b; font-weight: 500; }
.summary-value { font-size: 1.8rem; font-weight: 700; margin-top: 5px; }


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
.mini-settings { background: none; border: none; color: #195eb2; cursor: pointer; font-size: 1rem; }

.card-body { flex-grow: 1; min-height: 90px; }
.data-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
.data-row.compact { margin-bottom: 4px; }
.label { font-size: 0.9rem; color: #64748b; }
.value { font-weight: 700; font-size: 0.95rem; }
.error-text { color: #ef4444; }

.progress-track { background: #f1f5f9; height: 7px; border-radius: 4px; overflow: hidden; margin-top: 4px; }
.progress-thumb { background: #094ce7; height: 100%; border-radius: 4px; }

.card-footer { border-top: 1px solid #f8fafc; padding-top: 15px; margin-top: 15px; }
.uptime { font-size: 0.85rem; color: #94a3b8; font-weight: 500; }


@media (max-width: 1200px) { .machines-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 700px) { .machines-grid { grid-template-columns: 1fr; } .summary-grid { grid-template-columns: repeat(2, 1fr); } }
</style>

