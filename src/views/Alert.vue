<template>
  <div class="dashboard-container">
    <div class="stats-row">
      <div class="machine-card stat-box">
        <span class="label-text">Total Alerts</span>
        <div class="stat-value text-main">6</div>
      </div>
      <div class="machine-card stat-box">
        <span class="label-text">Active</span>
        <div class="stat-value text-idle">3</div>
      </div>
      <div class="machine-card stat-box">
        <span class="label-text">Critical</span>
        <div class="stat-value text-error">2</div>
      </div>
    </div>

    <div class="machine-card main-content">
      <div class="header-row">
        <h2 class="page-title">System Alerts</h2>
        <div class="tab-group">
          <button 
            v-for="tab in ['All', 'Active', 'Resolved']" 
            :key="tab"
            @click="activeTab = tab"
            :class="['tab-btn', activeTab === tab ? 'active' : '']"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <div class="alerts-list">
        <div 
          v-for="alert in filteredAlerts" 
          :key="alert.id"
          :class="['alert-item', alert.severity === 'critical' ? 'critical-bg' : 'warning-bg']"
        >
          <div class="icon-container">
            <i :class="['mdi', alert.severity === 'critical' ? 'mdi-alert-outline' : 'mdi-alert-circle-outline']"></i>
          </div>

          <div class="alert-body">
            <div class="title-line">
              <span class="machine-id">{{ alert.title }}</span>
              <span :class="['badge', alert.severity === 'critical' ? 'badge-error' : 'badge-idle']">
                {{ alert.severity }}
              </span>
            </div>
            <p class="label-text">{{ alert.description }}</p>
            <div class="metadata">
              <span>{{ alert.machineId }}</span>
              <span class="dot">•</span>
              <span>{{ alert.time }}</span>
            </div>

            <div class="action-buttons">
              <button class="btn-secondary btn-sm">Acknowledge</button>
              <button class="btn-primary btn-sm">Resolve</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeTab = ref('All');

const alerts = ref([
  {
    id: 1,
    title: 'High Temperature Alert',
    severity: 'critical',
    description: 'Machine temperature exceeded safe threshold of 90°C',
    machineId: 'M-004',
    time: '15 minutes ago',
    status: 'Active'
  },
  {
    id: 2,
    title: 'Low Efficiency',
    severity: 'warning',
    description: 'Machine efficiency dropped below 70%',
    machineId: 'M-007',
    time: '45 minutes ago',
    status: 'Active'
  },
  {
    id: 3,
    title: 'Maintenance Due',
    severity: 'warning',
    description: 'Scheduled maintenance is overdue by 2 days',
    machineId: 'M-003',
    time: '2 hours ago',
    status: 'Active'
  }
]);

const filteredAlerts = computed(() => {
  if (activeTab.value === 'All') return alerts.value;
  return alerts.value.filter(a => a.status === activeTab.value);
});
</script>

<style scoped>
/* Supplemental Layout Styles using your variables */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.stat-box {
  padding: 24px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 8px;
}

.text-main { color: #1a1d23; }
.text-idle { color: #ffc107; }
.text-error { color: #dc3545; }

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

/* Tabs */
.tab-group {
  background: #f1f3f5;
  padding: 4px;
  border-radius: 8px;
  display: flex;
}

.tab-btn {
  border: none;
  background: transparent;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  border-radius: 6px;
}

.tab-btn.active {
  background: #ffffff;
  color: #1a1d23;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* Alerts List Styling */
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.alert-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid transparent;
}

.critical-bg { background-color: #fdecea; border-color: #f8d7da; }
.warning-bg { background-color: #fff8e1; border-color: #ffeeba; }

.icon-container {
  width: 40px;
  height: 40px;
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.critical-bg .icon-container { color: #dc3545; }
.warning-bg .icon-container { color: #ffc107; }

.title-line {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.metadata {
  font-size: 12px;
  font-weight: 600;
  color: #adb5bd;
  margin-top: 8px;
}

.dot { margin: 0 4px; }

.action-buttons {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.btn-sm {
  padding: 6px 16px;
  font-size: 13px;
}
</style>