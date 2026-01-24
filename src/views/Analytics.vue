<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import {
  Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, 
  PointElement, CategoryScale, Filler, type ChartArea, type ScriptableContext
} from 'chart.js';
import { Line } from 'vue-chartjs';

// register Chart.js components (required for vue-chartjs to work)
ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler);

// new imports for Firestore
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase.js'

// Machine interface (compatible with Dashboard)
interface Machine {
  id: string;
  name?: string;
  type?: string;
  status?: 'Running' | 'Idle' | 'Error' | 'Maintenance' | string;
  temp?: number | null;
  uptime?: number;
  efficiency?: number;
  target?: number;
  createdAt?: string;
}

 // reactive machines store
 const machines = ref<Machine[]>([])
 
 const summaryMetrics = ref([
   { label: 'Avg Efficiency', value: 0, suffix: '%', trendType: 'positive', trendIcon: 'mdi mdi-trending-up', trendText: 'Stable' },
   { label: 'Total Production', value: 0, suffix: '', trendType: 'positive', trendIcon: 'mdi mdi-factory', trendText: 'Target Met' },
   { label: 'Active Alerts', value: 0, suffix: '', trendType: 'critical', trendIcon: 'mdi mdi-alert-circle-outline', trendText: 'Check' }
 ] as Array<{ label: string; value: number | string; suffix?: string; trendType?: string; trendIcon?: string; trendText?: string }>)

 const productionData = ref({
   labels: [] as string[],
   datasets: [{
     label: 'Production',
     backgroundColor: 'rgba(59,130,246,0.1)',
     borderColor: 'rgba(59,130,246,1)',
     data: [] as number[],
     fill: true
   }]
 })

 const efficiencyData = ref({
   labels: [] as string[],
   datasets: [{
     label: 'Efficiency',
     backgroundColor: 'rgba(16,185,129,0.1)',
     borderColor: 'rgba(16,185,129,1)',
     data: [] as number[],
     fill: true
   }]
 })

 const productionOptions = { responsive: true, maintainAspectRatio: false } as any
 const efficiencyOptions = { responsive: true, maintainAspectRatio: false } as any
 const lastUpdatedTime = ref('')

// helper: recompute derived metrics & chart data from machines
function refreshFromMachines() {
  // Average Efficiency
  const effValues = machines.value.map(m => m.efficiency).filter(v => typeof v === 'number') as number[]
  const avgEff = effValues.length ? parseFloat((effValues.reduce((a,b)=>a+b,0)/effValues.length).toFixed(1)) : 0
  summaryMetrics.value[0].value = avgEff

  // Total Production (estimate) -> sum(target * uptime%)
  const totalProduction = machines.value.reduce((sum, m) => {
    const tgt = Number(m.target ?? 0)
    const up = Number(m.uptime ?? 0) / 100
    return sum + Math.round(tgt * up)
  }, 0)
  summaryMetrics.value[1].value = totalProduction

  // Active Alerts = errors count
  const errors = machines.value.filter(m => String(m.status).toLowerCase().includes('err')).length
  summaryMetrics.value[2].value = errors

  // Update production chart: use machine names and estimated production or target
  productionData.value = {
    ...productionData.value,
    labels: machines.value.map(m => m.name || m.id),
    datasets: [{
      ...productionData.value.datasets[0],
      data: machines.value.map(m => Math.round((m.target ?? 0) * ( (m.uptime ?? 0) / 100 )))
    }]
  }

  // Update efficiency chart with per-machine efficiency (fill missing with 0)
  efficiencyData.value = {
    ...efficiencyData.value,
    labels: machines.value.map(m => m.name || m.id),
    datasets: [{
      ...efficiencyData.value.datasets[0],
      data: machines.value.map(m => typeof m.efficiency === 'number' ? m.efficiency : 0)
    }]
  }

  lastUpdatedTime.value = new Date().toLocaleTimeString()
}

// subscribe to Firestore machines collection
let unsubscribeMachines: (() => void) | null = null
onMounted(() => {
  const q = query(collection(db, 'machines'), orderBy('createdAt', 'asc'))
  unsubscribeMachines = onSnapshot(q, snapshot => {
    machines.value = snapshot.docs.map(doc => {
      const d = doc.data() as any
      return {
        id: doc.id,
        name: d.name || '',
        type: d.type || '',
        status: d.status || 'Idle',
        temp: d.temp ?? null,
        uptime: d.uptime ?? 0,
        efficiency: typeof d.efficiency === 'number' ? d.efficiency : undefined,
        target: d.target ?? 0,
        createdAt: d.createdAt ?? ''
      } as Machine
    })
    refreshFromMachines()
  }, err => {
    console.error('Machines snapshot error (Analytics):', err)
  })

  // existing simulate timer (if any) remains
  // ...existing onMounted code...
})

onUnmounted(() => {
  if (unsubscribeMachines) unsubscribeMachines()
  // ...existing onUnmounted cleanup...
})
</script>

<template>
  <div class="analytics-wrapper">
    <header class="view-header">
      <div class="header-left">
        <h2 class="view-title">Analytics</h2>
        <p class="last-updated">Last updated: {{ lastUpdatedTime }}</p>
      </div>
      <div class="header-right">
        <button class="settings-btn" aria-label="Settings">
          <i class="mdi mdi-cog-outline"></i>
        </button>
      </div>
    </header>

    <div class="metrics-grid">
      <div v-for="metric in summaryMetrics" :key="metric.label" class="metric-card">
        <div class="card-body">
          <span class="metric-label">{{ metric.label }}</span>
          <div class="metric-value tabular-nums">
            {{ typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value }}{{ metric.suffix || '' }}
          </div>
        </div>
        <div class="card-footer" :class="metric.trendType">
          <i :class="metric.trendIcon" aria-hidden="true"></i>
          <span>{{ metric.trendText }}</span>
        </div>
      </div>
    </div>

    <div class="charts-grid">
      <section class="chart-card production-main">
        <div class="chart-header">
          <h3 class="chart-title">Production (24h)</h3>
          <p class="chart-subtitle">Hourly output vs target</p>
        </div>
        <div class="chart-content">
          <Line :data="productionData" :options="productionOptions" />
        </div>
      </section>

      <section class="chart-card efficiency-side">
        <div class="chart-header">
          <h3 class="chart-title">Efficiency Trend</h3>
          <p class="chart-subtitle">Daily average efficiency</p>
        </div>
        <div class="chart-content">
          <Line :data="efficiencyData" :options="efficiencyOptions" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Keeping your original styles intact as they are structurally sound */
.analytics-wrapper {
  padding: 32px;
  background: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}
.view-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.view-title { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 0; }
.last-updated { font-size: 0.875rem; color: #64748b; margin-top: 4px; }
.metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 24px; }
.metric-card { background: white; padding: 24px; border-radius: 16px; border: 1px solid #edf2f7; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.metric-label { font-size: 0.875rem; color: #64748b; font-weight: 500; }
.metric-value { font-size: 2rem; font-weight: 700; color: #0f172a; margin-top: 8px; transition: all 0.5s ease; }
.tabular-nums { font-variant-numeric: tabular-nums; }
.card-footer { display: flex; align-items: center; gap: 6px; font-size: 0.875rem; margin-top: 16px; font-weight: 600; }
.card-footer.positive { color: #10b981; }
.card-footer.critical { color: #e11d48; }
.charts-grid { display: grid; grid-template-columns: 1.8fr 1fr; gap: 24px; }
.chart-card { background: white; padding: 24px; border-radius: 16px; border: 1px solid #edf2f7; }
.chart-title { font-size: 1.125rem; font-weight: 700; color: #0f172a; }
.chart-subtitle { font-size: 0.875rem; color: #94a3b8; margin: 4px 0 24px 0; }
.chart-content { height: 300px; width: 100%; }
.settings-btn { background: white; border: 1px solid #edf2f7; border-radius: 10px; width: 42px; height: 42px; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 20px; }
</style>