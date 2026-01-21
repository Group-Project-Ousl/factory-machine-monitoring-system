<template>
  <div class="settings-wrapper">
    <header class="settings-header">
      <h2 class="view-title">Settings</h2>
      <p class="subtitle">System configuration, security, and profile management</p>
    </header>

    <div class="settings-grid">
      <section class="settings-card">
        <div class="card-header">
          <h3 class="card-title">User Profile & Security</h3>
        </div>
        <div class="profile-layout">
          <div class="avatar-container">
            <div class="avatar-box">DF</div>
            <button class="camera-btn" title="Edit Avatar"><i class="mdi mdi-camera"></i></button>
          </div>
          <div class="form-columns">
            <div class="input-field">
              <label>Profile Name</label>
              <input type="text" v-model="profile.name" />
            </div>
            <div class="input-field">
              <label>Email Address</label>
              <input type="email" v-model="profile.email" placeholder="operator@factorywatch.com" />
            </div>
            <div class="input-field">
              <label>Role</label>
              <input type="text" v-model="profile.role" disabled class="disabled-input" />
            </div>
            <div class="security-toggle">
              <div class="toggle-text">
                <span class="label">Two-Factor Auth (2FA)</span>
                <p class="desc">Secure factory control access</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="security.twoFactor" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section class="settings-card">
        <div class="card-header">
          <h3 class="card-title">Connectivity & Localization</h3>
        </div>
        <div class="sync-content">
          <div class="input-field">
            <label>Data Polling Frequency</label>
            <select v-model="sync.interval">
              <option value="30s">Every 30 Seconds</option>
              <option value="1m">Every 1 Minute</option>
              <option value="5m">Every 5 Minutes</option>
            </select>
          </div>
          <div class="input-field">
            <label>Temperature Units (Localization)</label>
            <select v-model="sync.units">
              <option value="C">Celsius (°C)</option>
              <option value="F">Fahrenheit (°F)</option>
            </select>
          </div>
          <div class="input-field" style="margin-top: 10px;">
             <button class="btn-outline-dark" @click="resetPassword">Reset Password</button>
          </div>
        </div>
      </section>

      <section class="settings-card full-width">
        <div class="card-header">
          <h3 class="card-title">Advanced Machine Configuration</h3>
        </div>
        <div class="threshold-grid">
          <div class="slider-box">
            <div class="slider-header">
              <span>Critical Temperature Alert</span>
              <span class="highlight">{{ thresholds.temp }}°C</span>
            </div>
            <input type="range" min="40" max="150" v-model="thresholds.temp" class="styled-range" />
            <p class="helper-text">Defines the 'Error' status threshold for all units.</p>
          </div>
          <div class="slider-box">
            <div class="slider-header">
              <span>Low Efficiency Warning</span>
              <span class="highlight text-orange">{{ thresholds.efficiency }}%</span>
            </div>
            <input type="range" min="10" max="90" v-model="thresholds.efficiency" class="styled-range range-orange" />
            <p class="helper-text">Trigger 'Warning' status when production falls below this value.</p>
          </div>
        </div>
      </section>

      <section class="settings-card">
        <div class="card-header">
          <h3 class="card-title">Maintenance Scheduler</h3>
        </div>
        <div class="maintenance-box">
          <div class="input-field">
            <label>Machine ID</label>
            <input type="text" placeholder="e.g. M-006" v-model="maintenance.targetId" />
          </div>
          <div class="input-field">
            <label>Date</label>
            <input type="date" v-model="maintenance.date" />
          </div>
          <button class="btn-primary-small">Schedule Maintenance</button>
        </div>
      </section>

      <section class="settings-card">
        <div class="card-header">
          <h3 class="card-title">Audit Trail</h3>
        </div>
        <div class="audit-list">
          <div v-for="log in auditLogs" :key="log.time" class="log-item">
            <span class="log-time">{{ log.time }}</span>
            <div class="log-details">
              <span class="log-text">{{ log.action }}</span>
              <span class="log-user">by {{ log.user }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <footer class="sticky-footer">
      <div class="footer-actions">
        <button class="btn-ghost">Discard Changes</button>
        <button class="btn-primary" @click="saveSettings">Save Settings</button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

/* --- Reactive State --- */
const profile = ref({ 
  name: 'df', 
  role: 'Operator', 
  email: 'operator.01@factorywatch.com' 
});

const security = ref({ twoFactor: true });
const sync = ref({ interval: '1m', units: 'C' });
const thresholds = ref({ temp: 92, efficiency: 40 });
const maintenance = ref({ targetId: 'M-006', date: '' });

const auditLogs = ref([
  { time: '14:22', action: 'Temp Threshold changed to 92°C', user: 'df' },
  { time: '10:05', action: 'Machine M-002 status override', user: 'df' },
  { time: 'Yesterday', action: '2FA security enabled', user: 'System' }
]);

const saveSettings = () => alert('Changes saved and synchronized.');
const resetPassword = () => alert('Password reset link sent to ' + profile.value.email);
</script>

<style scoped>
/* Main Layout */
.settings-wrapper { padding: 32px 32px 100px 32px; background: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; }
.view-title { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 0; }
.subtitle { color: #64748b; font-size: 0.9rem; margin: 4px 0 32px 0; }

.settings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.full-width { grid-column: 1 / -1; }

/* Unified Card Style */
.settings-card { background: white; border-radius: 16px; border: 1px solid #edf2f7; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.card-header { margin-bottom: 24px; border-bottom: 1px solid #f8fafc; padding-bottom: 12px; }
.card-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0; }

/* Profile & Security Layout */
.profile-layout { display: flex; gap: 24px; }
.avatar-container { position: relative; }
.avatar-box {
  width: 90px; height: 90px; border-radius: 12px; font-weight: 800; font-size: 1.75rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); color: #2563eb;
  display: flex; align-items: center; justify-content: center; border: 2px solid #fff;
}
.camera-btn { position: absolute; bottom: -5px; right: -5px; background: #0f172a; color: #fff; border: none; padding: 6px; border-radius: 8px; cursor: pointer; }

.form-columns { flex: 1; display: flex; flex-direction: column; gap: 16px; }
.input-field { display: flex; flex-direction: column; gap: 6px; }
.input-field label { font-size: 0.85rem; font-weight: 600; color: #64748b; }
input, select { padding: 12px; border-radius: 10px; border: 1px solid #edf2f7; background: #f8fafc; font-family: inherit; font-weight: 500; }
.disabled-input { opacity: 0.6; cursor: not-allowed; }

.security-toggle { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #f8fafc; }
.toggle-text .label { font-weight: 600; color: #0f172a; font-size: 0.9rem; }
.toggle-text .desc { font-size: 0.75rem; color: #64748b; margin: 2px 0 0 0; }

/* Switch Component */
.switch { position: relative; width: 44px; height: 24px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #cbd5e1; border-radius: 24px; transition: .4s; }
.slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: .4s; }
input:checked + .slider { background: #0f172a; }
input:checked + .slider:before { transform: translateX(20px); }

/* Threshold Sliders */
.threshold-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
.slider-header { display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 12px; font-size: 0.95rem; }
.highlight { color: #2563eb; }
.text-orange { color: #f59e0b; }
.styled-range { width: 100%; height: 6px; appearance: none; background: #edf2f7; border-radius: 10px; cursor: pointer; }
.range-orange::-webkit-slider-thumb { background: #f59e0b; }
.helper-text { font-size: 0.8rem; color: #94a3b8; margin-top: 10px; }

/* Audit Trail */
.audit-list { display: flex; flex-direction: column; gap: 16px; }
.log-item { display: flex; gap: 16px; align-items: flex-start; }
.log-time { font-size: 0.8rem; color: #94a3b8; font-weight: 600; min-width: 60px; }
.log-details { display: flex; flex-direction: column; }
.log-text { font-size: 0.85rem; color: #334155; font-weight: 500; }
.log-user { font-size: 0.75rem; color: #94a3b8; }

/* Sticky Footer */
.sticky-footer { position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #edf2f7; padding: 20px 32px; display: flex; justify-content: flex-end; z-index: 100; }
.footer-actions { display: flex; gap: 12px; }
.btn-primary { background: #0f172a; color: white; border: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; cursor: pointer; }
.btn-primary-small { background: #0f172a; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%; margin-top: 10px; }
.btn-ghost { background: transparent; color: #64748b; border: 1px solid #edf2f7; padding: 12px 28px; border-radius: 10px; font-weight: 700; cursor: pointer; }
.btn-outline-dark { border: 1px solid #0f172a; background: transparent; padding: 8px; border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%; }
</style>