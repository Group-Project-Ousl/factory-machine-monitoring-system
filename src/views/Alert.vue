<template>
  <div class="dashboard-container">
    <div class="stats-row">
      <div class="machine-card stat-box">
        <span class="label-text">Total Alerts</span>
        <div class="stat-value text-main">{{ totalAlerts }}</div>
      </div>
      <div class="machine-card stat-box">
        <span class="label-text">Active</span>
        <div class="stat-value text-idle">{{ activeAlerts }}</div>
      </div>
      <div class="machine-card stat-box">
        <span class="label-text">Critical</span>
        <div class="stat-value text-error">{{ criticalAlerts }}</div>
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
          v-for="alert in combinedFilteredAlerts" 
          :key="alert.id"
          :class="['alert-item', (alert.severity === 'critical' || alert.severity === 'error') ? 'critical-bg' : 'warning-bg']"
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
            <p class="label-text">{{ formatAlertDescription(alert) }}</p>
            <div class="metadata">
              <span>{{ alert.machineName || alert.machineId }}</span>
              <span class="dot">•</span>
              <span>{{ alert.time || alert.timeStamp?.toDate?.()?.toLocaleString?.() || alert.createdAt }}</span>
            </div>

            <div class="action-buttons">
              <button v-if="!alert.generated" class="btn-secondary btn-sm" @click="acknowledgeAlert(alert.id)">Acknowledge</button>
              <button v-if="!alert.generated" class="btn-primary btn-sm" @click="resolveAlert(alert.id)">Resolve</button>
              <button v-if="alert.generated" class="btn-outline btn-sm" @click="persistGeneratedAlert(alert)">Create Alert</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* filepath: c:\Users\MSI\Documents\GitHub\factory-machine-monitoring-system\src\views\Alert.vue */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  collection, query, orderBy, onSnapshot, updateDoc, doc,
  addDoc, where, getDocs, serverTimestamp, getDoc
} from 'firebase/firestore'
import { db } from '../firebase'

// Make this a top-level function so the template can call it
function formatAlertDescription(alert) {
  if (!alert) return ''
  const raw = alert.description || ''
  const hasParenId = /\([A-Za-z0-9_\-]{6,}\)/.test(raw)
  if (!hasParenId) return raw

  const machine = machines.value?.find(m => (m.id || m.machineId || m.name) === alert.machineId)
  const machineName = alert.machineName || machine?.name || alert.machineId || 'Machine'

  const title = (alert.title || '').toLowerCase()
  if (title.includes('temp') || title.includes('temperature')) {
    const cur = (machine && machine.temp !== undefined) ? machine.temp : (raw.match(/-?\d+(\.\d+)?/g)?.[0] ?? 'N/A')
    const limit = (!isNaN(Number(thresholds.value?.temp))) ? Number(thresholds.value.temp) : (raw.match(/-?\d+(\.\d+)?/g)?.[1] ?? 'N/A')
    return `Temperature ${cur}°C (limit: ${limit}°C) — ${machineName} is above the temperature limit.`
  }
  if (title.includes('efficien')) {
    const cur = (machine && machine.efficiency !== undefined) ? machine.efficiency : (raw.match(/-?\d+(\.\d+)?/g)?.[0] ?? 'N/A')
    const limit = (!isNaN(Number(thresholds.value?.efficiency))) ? Number(thresholds.value.efficiency) : (raw.match(/-?\d+(\.\d+)?/g)?.[1] ?? 'N/A')
    return `Efficiency ${cur}% (limit: ${limit}%) — ${machineName} is below the efficiency limit.`
  }
  return raw.replace(/\s*\([^)]+\)/, '')
}

const activeTab = ref('All')
const alerts = ref([])          // persisted alerts from Firestore
const machines = ref([])        // dashboard cards / machine snapshots
const generated = ref([])       // in-memory generated alerts (machine comparisons)
const thresholds = ref({ temp: 92, pressure: 2500, vibration: 4.5, efficiency: 90 })

let unsub = { alerts: null, machines: null, thresholds: null, telemetry: null }

// computed card counts from persisted alerts + generated (generated treated as active)
const totalAlerts = computed(() => alerts.value.length + generated.value.length)
const activeAlerts = computed(() => alerts.value.filter(a => a.status === 'Active').length + generated.value.length)
const criticalAlerts = computed(() => alerts.value.filter(a => (a.severity === 'critical' || a.severity === 'error')).length + generated.value.filter(a => a.severity === 'critical').length)

// combine persisted alerts with generated ones (avoid duplicates if persisted exists)
const combinedAlerts = computed(() => {
  // build index of active persisted alerts by key (machine+title)
  const idx = new Set(alerts.value.map(a => `${a.machineId}::${a.title}`))
  const merged = [...alerts.value]
  for (const g of generated.value) {
    if (!idx.has(`${g.machineId}::${g.title}`)) merged.unshift(g)
  }
  return merged
})

// filtered according to tab
const combinedFilteredAlerts = computed(() => {
  if (activeTab.value === 'All') return combinedAlerts.value
  if (activeTab.value === 'Active') return combinedAlerts.value.filter(a => a.status === 'Active' || a.generated)
  return combinedAlerts.value.filter(a => a.status === 'Resolved')
})

// helper: persist deduplicated alert (used by machine-eval and manual create)
async function createAlertIfNotExists(title, severity, description, machine) {
  try {
    const machineId = machine.id || machine.machineId || machine.name
    const q = query(
      collection(db, 'alerts'),
      where('machineId', '==', machineId),
      where('status', '==', 'Active'),
      where('title', '==', title)
    )
    const snaps = await getDocs(q)
    if (snaps.size > 0) return // active already exists

    const payload = {
      title,
      description,
      severity,
      machineId,
      machineName: machine.name || machineId,
      status: 'Active',
      createdAt: new Date().toISOString(),
      timeStamp: serverTimestamp()
    }
    await addDoc(collection(db, 'alerts'), payload)
  } catch (err) {
    console.error('createAlertIfNotExists error', err)
  }
}

// evaluate machines against thresholds and create friendly messages
async function evaluateMachineAndGenerate(machine) {
  try {
    const machineId = machine.id || machine.machineId || machine.name
    const machineName = machine.name || machineId
    const issues = []

    // efficiency: coerce and fallback to 90
    const effThresholdRaw = thresholds.value && thresholds.value.efficiency
    const effThreshold = (!isNaN(Number(effThresholdRaw))) ? Number(effThresholdRaw) : 90
    if (machine.efficiency !== undefined && !isNaN(Number(machine.efficiency)) && Number(machine.efficiency) < effThreshold) {
      issues.push({
        key: 'efficiency',
        title: 'Low Efficiency',
        severity: 'warning',
        // new friendly format (no id in parens)
        description: `Efficiency ${machine.efficiency}% (limit: ${effThreshold}%) — ${machineName} is below the efficiency limit.`,
        value: machine.efficiency,
        threshold: effThreshold
      })
    }

    // temperature: coerce threshold
    const tempThresholdRaw = thresholds.value && thresholds.value.temp
    const tempThreshold = (!isNaN(Number(tempThresholdRaw))) ? Number(tempThresholdRaw) : NaN
    if (machine.temp !== undefined && !isNaN(Number(machine.temp)) && !isNaN(tempThreshold) && Number(machine.temp) > tempThreshold) {
      issues.push({
        key: 'temp',
        title: 'High Temperature Alert',
        severity: 'critical',
        description: `Temperature ${machine.temp}°C (limit: ${tempThreshold}°C) — ${machineName} is above the temperature limit.`,
        value: machine.temp,
        threshold: tempThreshold
      })
    }

    // pressure: coerce threshold
    const pressureThresholdRaw = thresholds.value && thresholds.value.pressure
    const pressureThreshold = (!isNaN(Number(pressureThresholdRaw))) ? Number(pressureThresholdRaw) : NaN
    if (machine.pressure !== undefined && !isNaN(Number(machine.pressure)) && !isNaN(pressureThreshold) && Number(machine.pressure) > pressureThreshold) {
      issues.push({
        key: 'pressure',
        title: 'High Pressure Alert',
        severity: 'warning',
        description: `Machine ${machineName} (${machineId}) pressure ${machine.pressure} exceeded ${pressureThreshold}`,
        value: machine.pressure,
        threshold: pressureThreshold
      })
    }

    // vibration: coerce threshold
    const vibThresholdRaw = thresholds.value && thresholds.value.vibration
    const vibThreshold = (!isNaN(Number(vibThresholdRaw))) ? Number(vibThresholdRaw) : NaN
    if (machine.vibration !== undefined && !isNaN(Number(machine.vibration)) && !isNaN(vibThreshold) && Number(machine.vibration) > vibThreshold) {
      issues.push({
        key: 'vibration',
        title: 'High Vibration Alert',
        severity: 'warning',
        description: `Machine ${machineName} (${machineId}) vibration ${machine.vibration} mm/s exceeded ${vibThreshold} mm/s`,
        value: machine.vibration,
        threshold: vibThreshold
      })
    }

    // uptime example: coerce threshold if present
    const uptimeMinRaw = thresholds.value && thresholds.value.uptimeMin
    const uptimeMin = (!isNaN(Number(uptimeMinRaw))) ? Number(uptimeMinRaw) : NaN
    if (!isNaN(uptimeMin) && machine.uptime !== undefined && !isNaN(Number(machine.uptime)) && Number(machine.uptime) < uptimeMin) {
      issues.push({
        key: 'uptime',
        title: 'Low Uptime',
        severity: 'warning',
        description: `Machine ${machineName} (${machineId}) uptime ${machine.uptime}h below minimum ${uptimeMin}h`,
        value: machine.uptime,
        threshold: uptimeMin
      })
    }

    // build generated alerts and attempt to persist (dedupe)
    for (const it of issues) {
      // add local generated alert (id deterministic for UI dedupe)
      const genId = `gen::${machineId}::${it.key}`
      // avoid duplicates in generated ref
      if (!generated.value.find(a => a.id === genId)) {
        generated.value.unshift({
          id: genId,
          title: it.title,
          description: it.description,
          severity: it.severity,
          machineId,
          machineName,
          status: 'Active',
          generated: true,
          createdAt: new Date().toISOString()
        })
      }
      // also try to persist deduped alert to Firestore so persisted list shows
      await createAlertIfNotExists(it.title, it.severity, it.description, { id: machineId, name: machineName })
    }
  } catch (err) {
    console.error('evaluateMachineAndGenerate error', err)
  }
}

// persist a generated alert manually (button)
async function persistGeneratedAlert(g) {
  try {
    await createAlertIfNotExists(g.title, g.severity, g.description, { id: g.machineId, name: g.machineName })
    // remove generated local copy (it will appear via persisted snapshot)
    generated.value = generated.value.filter(x => x.id !== g.id)
  } catch (err) {
    console.error('persistGeneratedAlert error', err)
  }
}

// acknowledge/resolve persisted alerts
async function acknowledgeAlert (id) {
  try {
    const refDoc = doc(db, 'alerts', id)
    await updateDoc(refDoc, { status: 'Acknowledged', acknowledgedAt: new Date() })
  } catch (err) {
    console.error('ack error', err)
  }
}

async function resolveAlert (id) {
  try {
    const refDoc = doc(db, 'alerts', id)
    await updateDoc(refDoc, { status: 'Resolved', resolvedAt: new Date() })
  } catch (err) {
    console.error('resolve error', err)
  }
}

// helper: check whether a persisted alert still matches current machine + thresholds
function checkAlertStillValid(alert, machine) {
  if (!alert || !machine) return false
  const effThreshold = (!isNaN(Number(thresholds.value?.efficiency))) ? Number(thresholds.value.efficiency) : 90
  const tempThreshold = (!isNaN(Number(thresholds.value?.temp))) ? Number(thresholds.value.temp) : NaN
  const pressureThreshold = (!isNaN(Number(thresholds.value?.pressure))) ? Number(thresholds.value.pressure) : NaN
  const vibThreshold = (!isNaN(Number(thresholds.value?.vibration))) ? Number(thresholds.value.vibration) : NaN

  const title = (alert.title || '').toLowerCase()

  if (title.includes('low efficiency')) {
    return (machine.efficiency !== undefined && !isNaN(Number(machine.efficiency)) && Number(machine.efficiency) < effThreshold)
  }
  if (title.includes('temperature')) {
    return (machine.temp !== undefined && !isNaN(Number(machine.temp)) && !isNaN(tempThreshold) && Number(machine.temp) > tempThreshold)
  }
  if (title.includes('pressure')) {
    return (machine.pressure !== undefined && !isNaN(Number(machine.pressure)) && !isNaN(pressureThreshold) && Number(machine.pressure) > pressureThreshold)
  }
  if (title.includes('vibration')) {
    return (machine.vibration !== undefined && !isNaN(Number(machine.vibration)) && !isNaN(vibThreshold) && Number(machine.vibration) > vibThreshold)
  }
  // default: keep alert
  return true
}

// reconcile persisted Active alerts against current machines and thresholds
async function reconcilePersistedAlerts() {
  try {
    // build machine map for quick lookup
    const machineMap = new Map(machines.value.map(m => [m.id || m.machineId || m.name, m]))
    // check persisted alerts currently loaded in alerts.value
    for (const a of alerts.value) {
      if (a.status !== 'Active') continue
      const mid = a.machineId
      const machine = machineMap.get(mid)
      const stillValid = checkAlertStillValid(a, machine)
      if (!stillValid) {
        try {
          const refDoc = doc(db, 'alerts', a.id)
          await updateDoc(refDoc, {
            status: 'Resolved',
            resolvedAt: serverTimestamp(),
            resolvedBy: 'system',
            resolutionReason: 'Thresholds updated - condition no longer breached'
          })
          console.debug('Auto-resolved alert', a.id)
        } catch (err) {
          console.error('Failed to auto-resolve alert', a.id, err)
        }
      }
    }
  } catch (err) {
    console.error('reconcilePersistedAlerts error', err)
  }
}

// mount: subscribe to thresholds, machines, and persisted alerts
onMounted(() => {
  // thresholds doc
  const tDoc = doc(db, 'config', 'thresholds')
  unsub.thresholds = onSnapshot(tDoc, snap => {
    if (snap.exists()) {
      Object.assign(thresholds.value, snap.data())
      // re-evaluate all machines against updated thresholds so generated alerts reflect the new config
      generated.value = []
      machines.value.forEach(m => {
        evaluateMachineAndGenerate(m).catch(err => console.error('re-eval error', err))
      })
      // after re-evaluation, reconcile persisted alerts to auto-resolve ones no longer valid
      reconcilePersistedAlerts().catch(err => console.error('reconcile error', err))
    }
  })

  // machines (dashboard cards)
  const mq = query(collection(db, 'machines'), orderBy('name'))
  unsub.machines = onSnapshot(mq, snap => {
    machines.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    // evaluate each machine against thresholds to produce generated alerts and persist if needed
    machines.value.forEach(m => evaluateMachineAndGenerate(m))
  })

  // persisted alerts (shows historical & manual)
  const aq = query(collection(db, 'alerts'), orderBy('timeStamp', 'desc'))
  unsub.alerts = onSnapshot(aq, snap => {
    alerts.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    // once persisted alerts arrive, drop generated duplicates that have been persisted
    // remove generated items for which persisted active alert exists
    const persistedKeys = new Set(alerts.value.map(a => `${a.machineId}::${a.title}`))
    generated.value = generated.value.filter(g => !persistedKeys.has(`${g.machineId}::${g.title}`))
  })
})

onUnmounted(() => {
  try { if (unsub.alerts) unsub.alerts() } catch {}
  try { if (unsub.machines) unsub.machines() } catch {}
  try { if (unsub.thresholds) unsub.thresholds() } catch {}
  try { if (unsub.telemetry) unsub.telemetry() } catch {}
})
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