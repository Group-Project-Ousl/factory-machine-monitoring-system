<template>
  <div class="settings-wrapper">
    <header class="settings-header">
      <div class="header-info">
        <h2 class="view-title">Settings</h2>
        <p class="subtitle">Manage account identity, machine safety limits, and system connectivity</p>
      </div>
      <div class="settings-tabs">
        <button v-for="tab in ['Account', 'Thresholds', 'Connectivity', 'System']" 
                :key="tab"
                :class="['tab-btn', { active: activeTab === tab }]"
                @click="activeTab = tab">
          {{ tab }}
        </button>
      </div>
    </header>

    <div class="tab-content">
      <div v-if="activeTab === 'Account'" class="pane animate-in">
        <div class="dual-grid">
          <section class="settings-card profile-grid">
            <div class="avatar-section">
              <div class="avatar-large">DF</div>
              <div class="verified-badge" title="Verified Operator"><i class="mdi mdi-check-decagram"></i></div>
              <button class="edit-overlay"><i class="mdi mdi-camera"></i></button>
            </div>
            <div class="form-fields">
              <div class="field-row">
                <div class="field">
                  <label>Full Name</label>
                  <input type="text" v-model="account.name" />
                </div>
                <div class="field">
                  <label>Job Role</label>
                  <select v-model="account.role">
                    <option value="Senior Operator">Senior Operator</option>
                    <option value="Maintenance Engineer">Maintenance Engineer</option>
                    <option value="Plant Manager">Plant Manager</option>
                  </select>
                </div>
              </div>
              <div class="field">
                <label>Email Address</label>
                <input type="email" v-model="account.email" />
              </div>
            </div>
          </section>

          <section class="settings-card">
            <h3 class="card-title">Security Update</h3>
            <div class="form-fields">
              <div class="field">
                <label>Update Password</label>
                <input type="password" v-model="password" placeholder="••••••••" @input="checkStrength" />
                <div class="strength-meter">
                  <div class="strength-bar" :style="{ width: strengthScore + '%', backgroundColor: strengthColor }"></div>
                </div>
                <div class="strength-footer">
                  <span class="strength-label" :style="{ color: strengthColor }">Strength: {{ strengthLabel }}</span>
                </div>
              </div>
              <div class="password-requirements">
                <div :class="['requirement', { met: hasMinLength }]">
                  <i class="mdi" :class="hasMinLength ? 'mdi-check-circle' : 'mdi-circle-outline'"></i> 8+ Characters
                </div>
                <div :class="['requirement', { met: hasSpecial }]">
                  <i class="mdi" :class="hasSpecial ? 'mdi-check-circle' : 'mdi-circle-outline'"></i> Special Character
                </div>
              </div>
            </div>
          </section>
        </div>

        <section class="settings-card mt-6">
          <h3 class="card-title">Active Sessions</h3>
          <div class="session-list">
            <div v-for="session in sessions" :key="session.id" class="session-item">
              <div class="s-info">
                <i :class="['mdi', session.icon]"></i>
                <div class="s-details">
                  <span class="device">{{ session.device }}</span>
                  <span class="location">{{ session.ip }} • {{ session.time }}</span>
                </div>
              </div>
              <button class="btn-text-red">Revoke</button>
            </div>
          </div>
        </section>
      </div>

      <div v-if="activeTab === 'Thresholds'" class="pane animate-in">
        <section class="settings-card">
          <h3 class="card-title">Machine Safety & Efficiency Thresholds</h3>
          <div class="threshold-grid">
            <div class="control-item">
              <div class="c-label">Temperature Limit <span class="val">{{ thresholds.temp }}°C</span></div>
              <input type="range" min="40" max="150" v-model="thresholds.temp" class="slider-blue" />
            </div>
            <div class="control-item">
              <div class="c-label">Pressure Limit <span class="val">{{ thresholds.pressure }} PSI</span></div>
              <input type="range" min="0" max="5000" v-model="thresholds.pressure" class="slider-blue" />
            </div>
            <div class="control-item">
              <div class="c-label">Vibration Level <span class="val">{{ thresholds.vibration }} mm/s</span></div>
              <input type="range" min="0" max="20" step="0.1" v-model="thresholds.vibration" class="slider-blue" />
            </div>
            <div class="control-item">
              <div class="c-label">Low Efficiency Warning <span class="val text-orange">{{ thresholds.efficiency }}%</span></div>
              <input type="range" min="10" max="90" v-model="thresholds.efficiency" class="slider-orange" />
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
                <label class="switch">
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
                <input type="text" placeholder="ID" v-model="maintenance.id" />
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
import { ref, computed } from 'vue';

const activeTab = ref('Account');

/* --- State Management --- */
const account = ref({ name: 'df', email: 'operator.01@factorywatch.com', role: 'Senior Operator' });
const password = ref('');
const strengthScore = ref(0);

const thresholds = ref({ temp: 92, pressure: 2500, vibration: 4.5, efficiency: 40 });
const connectivity = ref({ endpoint: 'https://api.factorywatch.com/v1', polling: '1m' });
const localization = ref({ timezone: 'GMT+5:30', units: 'Metric' });
const maintenance = ref({ id: '', date: '' });

const sessions = ref([
  { id: 1, device: 'Desktop - Chrome', ip: '192.168.1.12', time: 'Active Now', icon: 'mdi-monitor' },
  { id: 2, device: 'Mobile - Safari', ip: '172.16.0.4', time: '2h ago', icon: 'mdi-cellphone' }
]);

const systemFeatures = ref([
  { id: 1, name: 'Predictive Maintenance', desc: 'AI-driven failure prediction', enabled: true },
  { id: 2, name: 'Cloud Sync', desc: 'Sync local data with server', enabled: true }
]);

/* --- Password Complexity Logic --- */
const hasMinLength = computed(() => password.value.length >= 8);
const hasSpecial = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(password.value));

const strengthLabel = computed(() => {
  if (strengthScore.value === 0) return 'None';
  if (strengthScore.value <= 33) return 'Weak';
  if (strengthScore.value <= 66) return 'Medium';
  return 'Strong';
});

const strengthColor = computed(() => {
  if (strengthScore.value <= 33) return '#ef4444'; 
  if (strengthScore.value <= 66) return '#f59e0b';
  return '#10b981';
});

const checkStrength = () => {
  let score = 0;
  if (password.value.length > 0) score += 20;
  if (hasMinLength.value) score += 30;
  if (hasSpecial.value) score += 30;
  if (/[A-Z]/.test(password.value)) score += 20;
  strengthScore.value = Math.min(score, 100);
};

const save = () => alert('Configuration Saved Successfully');
</script>

<style scoped>
/* Unified Layout */
.settings-wrapper { padding: 32px 32px 100px 32px; background: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; }
.settings-header { margin-bottom: 32px; }
.view-title { font-size: 1.5rem; font-weight: 700; color: #0f172a; }
.subtitle { color: #64748b; font-size: 0.9rem; margin-top: 4px; }

/* Tabs */
.settings-tabs { display: flex; gap: 24px; border-bottom: 1px solid #edf2f7; margin-top: 20px; }
.tab-btn { padding: 12px 4px; border: none; background: none; color: #64748b; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent; transition: 0.2s; }
.tab-btn.active { color: #0f172a; border-color: #0f172a; }

/* Cards & Grid */
.settings-card { background: white; border-radius: 16px; border: 1px solid #edf2f7; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.dual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.mt-6 { margin-top: 24px; }

/* Account Section */
.profile-grid { display: flex; gap: 32px; align-items: flex-start; }
.avatar-large { width: 80px; height: 80px; border-radius: 12px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; }
.avatar-section { position: relative; }
.verified-badge { position: absolute; top: -5px; right: -5px; color: #2563eb; background: white; border-radius: 50%; font-size: 1.2rem; }
.edit-overlay { position: absolute; bottom: -5px; right: -5px; background: #0f172a; color: white; border: none; padding: 5px; border-radius: 6px; cursor: pointer; }

/* Form Elements */
.form-fields { flex: 1; display: flex; flex-direction: column; gap: 16px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 0.85rem; font-weight: 600; color: #64748b; }
input, select { padding: 10px; border-radius: 8px; border: 1px solid #edf2f7; background: #f8fafc; font-family: inherit; }

/* Password Meter */
.strength-meter { height: 6px; background: #f1f5f9; border-radius: 3px; margin-top: 12px; overflow: hidden; }
.strength-bar { height: 100%; transition: all 0.4s ease; }
.strength-label { font-size: 0.75rem; font-weight: 700; margin-top: 6px; display: block; }
.password-requirements { margin-top: 12px; display: flex; flex-direction: column; gap: 6px; }
.requirement { font-size: 0.8rem; color: #94a3b8; display: flex; align-items: center; gap: 8px; }
.requirement.met { color: #10b981; }

/* Thresholds */
.threshold-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.c-label { display: flex; justify-content: space-between; font-weight: 700; font-size: 0.9rem; margin-bottom: 12px; }
.val { color: #2563eb; }
.text-orange { color: #f59e0b; }
.slider-blue { width: 100%; height: 6px; appearance: none; background: #edf2f7; border-radius: 10px; }
.slider-orange { width: 100%; height: 6px; appearance: none; background: #fffbeb; border-radius: 10px; border: 1px solid #fef3c7; }

/* Sessions & Switches */
.session-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8fafc; border-radius: 10px; margin-bottom: 10px; }
.switch {  position: relative; width: 60px; height: 32px;  }
.switch input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute;  cursor: pointer;  top: 0;  left: 0;  right: 0;  bottom: 0; background: #cbd5e1;  border-radius: 32px; transition: .4s; }
.toggle-slider:before {  position: absolute;  content: ""; height: 24px;   width: 24px;  left: 4px; bottom: 4px; background: white; border-radius: 50%; transition: .4s; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
input:checked + .toggle-slider { background: #2563eb; }
input:checked + .toggle-slider:before {  transform: translateX(28px); }

/* Sticky Footer */
.settings-footer { position: fixed; bottom: 0; left: 0; right: 0; background: white; padding: 16px 32px; border-top: 1px solid #edf2f7; display: flex; justify-content: flex-end; gap: 12px; z-index: 100; }
.btn-primary { background: #0f172a; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }
.btn-ghost { background: transparent; color: #64748b; border: 1px solid #edf2f7; padding: 10px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }

/* Animations */
.animate-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>