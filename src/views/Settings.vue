<template>
  <div class="settings-wrapper">
    <header class="settings-header">
      <div class="header-info">
        <h2 class="view-title">Settings</h2>
        <p class="subtitle">Manage machine safety limits, network connectivity, and system features</p>
      </div>
      <div class="settings-tabs">
        <button v-for="tab in ['Thresholds', 'Connectivity', 'System']" 
                :key="tab"
                :class="['tab-btn', { active: activeTab === tab }]"
                @click="activeTab = tab">
          {{ tab }}
        </button>
      </div>
    </header>

    <div class="tab-content">
      <div v-if="activeTab === 'Thresholds'" class="pane animate-in">
        <section class="settings-card">
          <h3 class="card-title">Machine Safety & Efficiency Thresholds</h3>
          <div class="threshold-grid">
            <div v-for="item in thresholdConfig" :key="item.key" class="control-item">
              <div class="c-label">
                <span class="label-text">{{ item.label }}</span>
                <span class="val-display blue-text">{{ thresholds[item.key] }}{{ item.unit }}</span>
              </div>
              <input type="range" :min="item.min" :max="item.max" :step="item.step" 
                     v-model="thresholds[item.key]" class="custom-thick-slider" />
            </div>
          </div>
        </section>
      </div>

      <div v-if="activeTab === 'Connectivity'" class="pane animate-in">
        <div class="dual-grid">
          <section class="settings-card">
            <h3 class="card-title">Network & Sync</h3>
            <div class="form-fields">
              <div class="field">
                <label>Backend API Endpoint</label>
                <input type="text" v-model="connectivity.endpoint" />
              </div>
              <div class="field">
                <label>Data Polling Frequency</label>
                <select v-model="connectivity.polling">
                  <option value="30s">30 Seconds</option>
                  <option value="1m">1 Minute</option>
                  <option value="5m">5 Minutes</option>
                </select>
              </div>
            </div>
          </section>
          <section class="settings-card">
            <h3 class="card-title">Localization</h3>
            <div class="form-fields">
              <div class="field">
                <label>System Timezone</label>
                <select v-model="localization.timezone">
                  <option value="UTC">UTC (Universal)</option>
                  <option value="GMT+5:30">Colombo (GMT+5:30)</option>
                </select>
              </div>
              <div class="field">
                <label>Measurement Units</label>
                <select v-model="localization.units">
                  <option value="Metric">Metric (Celsius, kg, mm)</option>
                  <option value="Imperial">Imperial (Fahrenheit, lb, in)</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div v-if="activeTab === 'System'" class="pane animate-in">
        <div class="dual-grid">
          <section class="settings-card">
            <h3 class="card-title">System Features</h3>
            <div class="feature-list">
              <div v-for="feature in systemFeatures" :key="feature.id" class="feature-item">
                <div class="f-info">
                  <span class="f-name">{{ feature.name }}</span>
                  <p class="f-desc">{{ feature.desc }}</p>
                </div>
                <label class="switch large-toggle">
                  <input type="checkbox" v-model="feature.enabled" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </section>
          
          <section class="settings-card">
            <h3 class="card-title">Maintenance Scheduler</h3>
            <div class="field">
              <label>Target Machine & Date</label>
              <div class="inline-inputs">
                <input type="text" placeholder="Machine ID" v-model="maintenance.id" />
                <input type="date" v-model="maintenance.date" />
              </div>
            </div>
            <button class="btn-outline mt-4">Save Maintenance Window</button>
          </section>
        </div>
      </div>
    </div>

    <footer class="settings-footer">
      <button class="btn-ghost">Discard Changes</button>
      <button class="btn-primary" @click="save">Save Settings</button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('Thresholds');

/* --- Reactive State Arrays & Objects --- */
// Config for the sliders to keep the template clean and prevent index crashes
const thresholdConfig = [
  { label: 'Temperature Limit', key: 'temp', unit: '°C', min: 40, max: 150, step: 1 },
  { label: 'Pressure Limit', key: 'pressure', unit: ' PSI', min: 0, max: 5000, step: 10 },
  { label: 'Vibration Level', key: 'vibration', unit: ' mm/s', min: 0, max: 20, step: 0.1 },
  { label: 'Low Efficiency Warning', key: 'efficiency', unit: '%', min: 10, max: 90, step: 1 }
];

const thresholds = ref<Record<string, number>>({ temp: 92, pressure: 2500, vibration: 4.5, efficiency: 70 });
const connectivity = ref({ endpoint: 'https://api.factorywatch.com/v1', polling: '1m' });
const localization = ref({ timezone: 'GMT+5:30', units: 'Metric' });
const maintenance = ref({ id: '', date: '' });

const systemFeatures = ref([
  { id: 1, name: 'Predictive Maintenance', desc: 'AI-driven failure prediction', enabled: true },
  { id: 2, name: 'Cloud Sync', desc: 'Sync local data with server', enabled: true }
]);

const save = () => alert('Configuration Saved Successfully');
</script>

<style scoped>
/* Main Layout */
.settings-wrapper { padding: 32px 32px 100px 32px; background: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; }
.settings-header { margin-bottom: 32px; }
.view-title { font-size: 1.5rem; font-weight: 700; color: #0f172a; }
.subtitle { color: #64748b; font-size: 0.9rem; margin-top: 4px; }

/* Tabs */
.settings-tabs { display: flex; gap: 24px; border-bottom: 1px solid #edf2f7; margin-top: 20px; }
.tab-btn { padding: 12px 4px; border: none; background: none; color: #64748b; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent; transition: 0.2s; }
.tab-btn.active { color: #0f172a; border-color: #0f172a; }

/* Cards & Grid */
.settings-card { background: white; border-radius: 16px; border: 1px solid #edf2f7; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.card-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 32px; }
.dual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

/* --- THICK SLIDER STYLES (image_407099.png) --- */
.threshold-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px 60px; }
.c-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.label-text { font-weight: 700; color: #0f172a; font-size: 1rem; }
.val-display { font-weight: 800; font-size: 1rem; }
.blue-text { color: #2563eb; }

.custom-thick-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 28px;
  background: #e2e8f0; 
  border-radius: 14px;
  outline: none;
}

.custom-thick-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #2563eb;
  border-radius: 50%;
  cursor: pointer;
}

.custom-thick-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #2563eb;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* --- ENLARGED TOGGLE STYLES (image_baf375.png) --- */
.large-toggle { width: 60px; height: 32px; position: relative; display: inline-block; }
.large-toggle input { opacity: 0; width: 0; height: 0; }

.toggle-slider { 
  position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; 
  background: #cbd5e1; border-radius: 32px; transition: .4s; 
}

.toggle-slider:before { 
  position: absolute; content: ""; height: 24px; width: 24px; 
  left: 4px; bottom: 4px; background: white; border-radius: 50%; 
  transition: .4s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

input:checked + .toggle-slider { background: #2563eb; }
input:checked + .toggle-slider:before { transform: translateX(28px); }

/* Other Component Styles */
.feature-list { display: flex; flex-direction: column; gap: 16px; }
.feature-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f8fafc; }
.f-info { display: flex; flex-direction: column; gap: 4px; }
.f-name { font-weight: 600; color: #0f172a; font-size: 0.95rem; }
.f-desc { font-size: 0.8rem; color: #64748b; margin: 0; }

.form-fields { flex: 1; display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 0.85rem; font-weight: 600; color: #64748b; }
input, select { padding: 12px; border-radius: 10px; border: 1px solid #edf2f7; background: #f8fafc; font-family: inherit; }
.inline-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.settings-footer { position: fixed; bottom: 0; left: 0; right: 0; background: white; padding: 16px 32px; border-top: 1px solid #edf2f7; display: flex; justify-content: flex-end; gap: 12px; z-index: 100; }
.btn-primary { background: #0f172a; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }
.btn-ghost { background: transparent; color: #64748b; border: 1px solid #edf2f7; padding: 10px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }
.btn-outline { background: white; border: 1px solid #edf2f7; padding: 10px; border-radius: 8px; font-weight: 600; color: #0f172a; cursor: pointer; }

.animate-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>