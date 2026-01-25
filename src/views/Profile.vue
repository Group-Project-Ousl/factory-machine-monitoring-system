<template>
  <div class="profile-wrapper">
    <header class="profile-header">
      <div class="header-info">
        <h2 class="view-title">User Profile</h2>
        <p class="subtitle">Personal details, professional role, and system activity</p>
      </div>
      <button class="btn-primary" @click="saveProfile">
        <i class="mdi mdi-content-save"></i> Save Profile
      </button>
    </header>

    <div class="profile-grid">
      <section class="profile-card identity-card">
        <div class="profile-banner"></div>
        <div class="avatar-container">
          <div class="avatar-box overflow-hidden">
            <img v-if="user.avatarUrl" :src="user.avatarUrl" class="preview-img" alt="Profile" />
            <span v-else>{{ getInitials(user.name) }}</span>
          </div>
          <div class="verified-badge"><i class="mdi mdi-check-decagram"></i></div>
          <label class="edit-overlay-btn" title="Upload New Photo">
            <i class="mdi mdi-camera"></i>
            <input type="file" @change="handleFileUpload" accept="image/*" class="hidden-input" />
          </label>
        </div>
        <div class="user-main-info">
          <h1 class="user-name">{{ user.name }}</h1>
          <span class="user-role-badge">{{ user.role }}</span>
          <p class="user-id">ID: {{ user.employeeId }}</p>
        </div>
        
        <div class="contact-strip">
          <div class="field email-edit-field">
            <label>Email Address</label>
            <input type="email" v-model="user.email" class="inline-input" />
          </div>
          <div class="contact-item">
            <i class="mdi mdi-phone-outline"></i>
            <span>{{ user.phone }}</span>
          </div>
        </div>
      </section>

      <section class="profile-card">
        <h3 class="card-title">Professional Details</h3>
        <div class="details-grid">
          <div class="detail-item">
            <label>Department</label>
            <p>{{ user.department }}</p>
          </div>
          <div class="detail-item">
            <label>Workstation</label>
            <p>{{ user.workstation }}</p>
          </div>
          <div class="detail-item">
            <label>Current Shift</label>
            <p>{{ user.shift }}</p>
          </div>
          <div class="detail-item">
            <label>Supervisor</label>
            <p>{{ user.supervisor }}</p>
          </div>
        </div>
      </section>

      <section class="profile-card stats-card">
        <h3 class="card-title">Performance Metrics</h3>
        <div class="metrics-grid">
          <div v-for="metric in metrics" :key="metric.label" class="metric-box">
            <div class="metric-header">
              <span class="m-label">{{ metric.label }}</span>
              <span class="m-value blue-text">{{ metric.value }}</span>
            </div>
            <div class="progress-track">
              <div class="progress-bar" :style="{ width: metric.percent + '%' }"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="profile-card full-width">
        <h3 class="card-title">Security Update</h3>
        <div class="security-form-grid">
          <div class="field">
            <label>New Password</label>
            <div class="password-wrapper">
              <input :type="showPass ? 'text' : 'password'" v-model="password" @input="checkStrength" placeholder="••••••••" />
              <button class="eye-btn" @click="showPass = !showPass">
                <i class="mdi" :class="showPass ? 'mdi-eye-off' : 'mdi-eye'"></i>
              </button>
            </div>
            <div class="strength-meter">
              <div class="strength-bar" :style="{ width: strengthScore + '%', backgroundColor: strengthColor }"></div>
            </div>
            <span class="strength-label" :style="{ color: strengthColor }">Strength: {{ strengthLabel }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

/* --- State Management --- */
const user = ref({
  name: 'Daniel Fischer',
  role: 'Senior Operator',
  employeeId: 'FW-0892',
  email: 'd.fischer@factorywatch.com',
  phone: '+49 152 9876543',
  department: 'Thermal Processing',
  workstation: 'Line 04',
  shift: 'Morning (06:00 - 14:00)',
  supervisor: 'Marcus Vane',
  avatarUrl: null as string | null
});

const password = ref('');
const showPass = ref(false);
const strengthScore = ref(0);

const metrics = ref([
  { label: 'Uptime Contribution', value: '94.2%', percent: 94 },
  { label: 'Task Completion', value: '88/100', percent: 88 }
]);

/* --- Methods --- */
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => user.value.avatarUrl = e.target?.result as string;
    reader.readAsDataURL(file);
  }
};

/* --- Password Strength Logic --- */
const hasMinLength = computed(() => password.value.length >= 8);
const hasSpecial = computed(() => /[!@#$%^&*()]/.test(password.value));
const strengthLabel = computed(() => strengthScore.value > 66 ? 'Strong' : strengthScore.value > 33 ? 'Medium' : 'Weak');
const strengthColor = computed(() => strengthScore.value > 66 ? '#10b981' : strengthScore.value > 33 ? '#f59e0b' : '#ef4444');

const checkStrength = () => {
  let score = 0;
  if (password.value.length > 0) score += 20;
  if (hasMinLength.value) score += 40;
  if (hasSpecial.value) score += 40;
  strengthScore.value = score;
};

const saveProfile = () => alert('Profile security and contact info updated.');
</script>

<style scoped>
/* Base Layout */
.profile-wrapper { padding: 32px; background: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; }
.profile-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.view-title { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 0; }
.subtitle { color: #64748b; font-size: 0.9rem; }

.profile-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.full-width { grid-column: 1 / -1; }

/* Cards */
.profile-card { background: white; border-radius: 16px; border: 1px solid #edf2f7; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); overflow: hidden; }
.card-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 20px; }

/* Identity Section */
.identity-card { padding: 0; text-align: center; }
.profile-banner { height: 80px; background: linear-gradient(135deg, #0f172a 0%, #2563eb 100%); }
.avatar-container { position: relative; margin-top: -45px; display: inline-block; }
.avatar-box { width: 90px; height: 90px; background: white; border: 4px solid white; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #2563eb; font-size: 1.75rem; }
.preview-img { width: 100%; height: 100%; object-fit: cover; border-radius: 16px; }
.edit-overlay-btn { position: absolute; bottom: -2px; right: -2px; background: #0f172a; color: white; border-radius: 8px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid white; }
.hidden-input { display: none; }

/* Inline Email Edit */
.email-edit-field { padding: 0 16px; margin-bottom: 12px; }
.inline-input { width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #edf2f7; background: #fff; text-align: center; font-weight: 600; color: #334155; }

/* Details & Stats */
.details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.detail-item label { display: block; font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
.detail-item p { font-weight: 600; color: #334155; margin: 4px 0 0 0; }

.metric-box { margin-bottom: 20px; }
.progress-track { height: 12px; background: #e2e8f0; border-radius: 6px; overflow: hidden; }
.progress-bar { height: 100%; background: #2563eb; }

/* Security Update */
.security-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.password-wrapper { position: relative; display: flex; align-items: center; }
.password-wrapper input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #edf2f7; background: #f8fafc; }
.eye-btn { position: absolute; right: 12px; background: none; border: none; color: #94a3b8; cursor: pointer; }
.strength-meter { height: 6px; background: #f1f5f9; border-radius: 3px; margin-top: 10px; overflow: hidden; }
.strength-bar { height: 100%; transition: 0.4s; }
.requirement { font-size: 0.8rem; color: #94a3b8; display: flex; align-items: center; gap: 8px; margin-top: 8px; }
.requirement.met { color: #10b981; }

.btn-primary { background: #0f172a; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; }
</style>