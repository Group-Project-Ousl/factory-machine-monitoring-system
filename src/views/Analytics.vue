<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import {
  Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, 
  PointElement, CategoryScale, Filler, type ChartArea, type ScriptableContext
} from 'chart.js';
import { Line } from 'vue-chartjs';

// 1. Component Registration
ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler);

/* --- Lively State Management --- */
const lastUpdatedTime = ref(new Date().toLocaleTimeString());

const summaryMetrics = ref([
  {
    label: "Average Efficiency",
    value: 87.3,
    suffix: "%",
    trendText: "+2.4% from last week",
    trendIcon: "mdi mdi-trending-up",
    trendType: "positive"
  },
  {
    label: "Total Production (24h)",
    value: 22450,
    suffix: "",
    trendText: "+5.2% from target",
    trendIcon: "mdi mdi-trending-up",
    trendType: "positive"
  },
  {
    label: "Active Alerts",
    value: 3,
    suffix: "",
    trendText: "1 critical, 2 warnings",
    trendIcon: "mdi mdi-pulse",
    trendType: "critical"
  }
]);

/* --- Chart Configurations --- */

// Production Data - Fixed structure for reactivity
const productionData = ref({
  labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
  datasets: [{
    label: 'Output',
    data: [1150, 850, 1180, 880, 950, 850, 1100, 900, 1150, 950, 1100, 800],
    fill: true,
    borderColor: '#3b82f6',
    borderWidth: 2,
    tension: 0.4,
    pointRadius: 0,
    pointHitRadius: 20,
    backgroundColor: (context: ScriptableContext<'line'>) => {
      const chart = context.chart;
      const { ctx, chartArea } = chart;
      if (!chartArea) return 'transparent';
      const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      return gradient;
    },
  }]
});

const productionOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 750 }, // Smooth transition for live updates
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: '#0f172a',
      padding: 12,
      cornerRadius: 8,
      callbacks: { label: (context: any) => ` Output: ${context.parsed.y} units` }
    }
  },
  scales: {
    y: { beginAtZero: true, max: 1200, ticks: { stepSize: 300, color: '#94a3b8' }, grid: { borderDash: [5, 5], color: '#f1f5f9' } },
    x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
  }
};

const efficiencyData = ref({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Efficiency',
    data: [82, 80.5, 85.5, 85.5, 86.5, 89.5, 78],
    borderColor: '#10b981',
    backgroundColor: '#ffffff',
    pointBackgroundColor: '#10b981',
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,
    pointRadius: 6,
    tension: 0.4,
    borderWidth: 3,
  }]
});

const efficiencyOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'nearest' as const, intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true, callbacks: { label: (context: any) => ` Efficiency: ${context.parsed.y}%` } }
  },
  scales: {
    y: { min: 60, max: 100, ticks: { stepSize: 10, color: '#94a3b8' }, grid: { borderDash: [5, 5], color: '#f1f5f9' } },
    x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
  }
};

/* --- Logic for Lively Updates --- */
const simulateDataUpdate = () => {
  lastUpdatedTime.value = new Date().toLocaleTimeString();

  // 1. Update Metrics
  summaryMetrics.value[0].value = parseFloat((85 + Math.random() * 5).toFixed(1));
  summaryMetrics.value[1].value += Math.floor(Math.random() * 20);
  summaryMetrics.value[2].value = Math.floor(Math.random() * 5);

  // 2. Update Production Chart (Immutably update ref to trigger Vue-Chartjs watcher)
  const newPoints = [...productionData.value.datasets[0].data];
  const newDataPoint = 800 + Math.floor(Math.random() * 400);
  newPoints.push(newDataPoint);
  newPoints.shift();

  productionData.value = {
    ...productionData.value,
    datasets: [
      {
        ...productionData.value.datasets[0],
        data: newPoints
      }
    ]
  };
};

let dataTimer: any;

onMounted(() => {
  dataTimer = setInterval(simulateDataUpdate, 60000); // 1 minute interval
});

onUnmounted(() => {
  if (dataTimer) clearInterval(dataTimer);
});
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