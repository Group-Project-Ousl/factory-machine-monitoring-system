<template>
  <div class="profile-wrapper">
    <div v-if="loading" style="text-align: center; padding: 50px;">
      <p>Loading profile...</p>
    </div>
    <div v-else>
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
          <div class="field email-edit-field">
            <label>Phone Number</label>
            <input type="tel" v-model="user.phone" class="inline-input" placeholder="Enter phone number" />
          </div>
        </div>
      </section>

      <section class="profile-card">
        <h3 class="card-title">Professional Details</h3>
        <div class="details-grid">
          <div class="detail-item">
            <label>Department</label>
            <input type="text" v-model="user.department" class="inline-input" placeholder="Enter department" />
          </div>
          <div class="detail-item">
            <label>Workstation</label>
            <input type="text" v-model="user.workstation" class="inline-input" placeholder="Enter workstation" />
          </div>
          <div class="detail-item">
            <label>Current Shift</label>
            <input type="text" v-model="user.shift" class="inline-input" placeholder="e.g., Morning (06:00 - 14:00)" />
          </div>
          <div class="detail-item">
            <label>Supervisor</label>
            <input type="text" v-model="user.supervisor" class="inline-input" placeholder="Enter supervisor name" />
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
        <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 20px;">Change your password securely</p>
        <div class="security-form-grid">
          <div class="field">
            <label>Current Password</label>
            <div class="password-wrapper">
              <input :type="showOldPass ? 'text' : 'password'" v-model="oldPassword" placeholder="Enter current password" />
              <button class="eye-btn" @click="showOldPass = !showOldPass">
                <i class="mdi" :class="showOldPass ? 'mdi-eye-off' : 'mdi-eye'"></i>
              </button>
            </div>
          </div>

          <div class="field">
            <label>New Password</label>
            <div class="password-wrapper">
              <input :type="showPass ? 'text' : 'password'" v-model="newPassword" @input="checkStrength" placeholder="Enter new password" />
              <button class="eye-btn" @click="showPass = !showPass">
                <i class="mdi" :class="showPass ? 'mdi-eye-off' : 'mdi-eye'"></i>
              </button>
            </div>
            <div class="strength-meter">
              <div class="strength-bar" :style="{ width: strengthScore + '%', backgroundColor: strengthColor }"></div>
            </div>
            <span class="strength-label" :style="{ color: strengthColor }">Strength: {{ strengthLabel }}</span>
          </div>

          <div class="field">
            <label>Confirm New Password</label>
            <div class="password-wrapper">
              <input :type="showConfirmPass ? 'text' : 'password'" v-model="confirmPassword" placeholder="Confirm new password" />
              <button class="eye-btn" @click="showConfirmPass = !showConfirmPass">
                <i class="mdi" :class="showConfirmPass ? 'mdi-eye-off' : 'mdi-eye'"></i>
              </button>
            </div>
            <p v-if="confirmPassword && newPassword !== confirmPassword" style="color: #ef4444; font-size: 0.85rem; margin-top: 6px;">
              <i class="mdi mdi-alert-circle"></i> Passwords do not match
            </p>
          </div>

          <div class="password-requirements">
            <p style="font-weight: 600; margin-bottom: 12px; color: #0f172a;">Password Requirements:</p>
            <div :class="['requirement', { met: hasMinLength }]">
              <i class="mdi" :class="hasMinLength ? 'mdi-check-circle' : 'mdi-circle-outline'"></i> 8+ Characters
            </div>
            <div :class="['requirement', { met: hasSpecial }]">
              <i class="mdi" :class="hasSpecial ? 'mdi-check-circle' : 'mdi-circle-outline'"></i> Special Character
            </div>
            <button class="btn-primary" @click="updatePassword" :disabled="!canUpdatePassword" style="margin-top: 20px; width: 100%;">
              <i class="mdi mdi-lock-reset"></i> Update Password
            </button>
          </div>
        </div>
      </section>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { auth, db } from '../firebase';
import { onAuthStateChanged, updatePassword as firebaseUpdatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

/* --- State Management --- */
const user = ref({
  name: '',
  role: 'Operator',
  employeeId: '',
  email: '',
  phone: '',
  department: '',
  workstation: '',
  shift: '',
  supervisor: '',
  avatarUrl: null as string | null
});

const loading = ref(true);
const currentUserId = ref('');

/* --- Fetch User Data from Firebase --- */
onMounted(() => {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      currentUserId.value = firebaseUser.uid;
      try {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          user.value = {
            name: userData.name || firebaseUser.displayName || '',
            role: userData.role || 'Operator',
            employeeId: userData.employeeId || firebaseUser.uid.substring(0, 8).toUpperCase(),
            email: userData.email || firebaseUser.email || '',
            phone: userData.phone || '',
            department: userData.department || '',
            workstation: userData.workstation || '',
            shift: userData.shift || '',
            supervisor: userData.supervisor || '',
            avatarUrl: userData.avatarUrl || null
          };
        } else {
          // If no Firestore doc, use auth data
          user.value = {
            name: firebaseUser.displayName || '',
            role: 'Operator',
            employeeId: firebaseUser.uid.substring(0, 8).toUpperCase(),
            email: firebaseUser.email || '',
            phone: '',
            department: '',
            workstation: '',
            shift: '',
            supervisor: '',
            avatarUrl: null
          };
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        loading.value = false;
      }
    } else {
      loading.value = false;
    }
  });
});

const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showOldPass = ref(false);
const showPass = ref(false);
const showConfirmPass = ref(false);
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
const hasMinLength = computed(() => newPassword.value.length >= 8);
const hasSpecial = computed(() => /[!@#$%^&*()]/.test(newPassword.value));
const strengthLabel = computed(() => strengthScore.value > 66 ? 'Strong' : strengthScore.value > 33 ? 'Medium' : 'Weak');
const strengthColor = computed(() => strengthScore.value > 66 ? '#10b981' : strengthScore.value > 33 ? '#f59e0b' : '#ef4444');
const canUpdatePassword = computed(() => {
  return oldPassword.value.length > 0 && 
         newPassword.value.length >= 8 && 
         hasSpecial.value && 
         newPassword.value === confirmPassword.value;
});

const checkStrength = () => {
  let score = 0;
  if (newPassword.value.length > 0) score += 20;
  if (hasMinLength.value) score += 40;
  if (hasSpecial.value) score += 40;
  strengthScore.value = score;
};

const updatePassword = async () => {
  if (!canUpdatePassword.value) {
    alert('Please fill all fields correctly');
    return;
  }

  const user = auth.currentUser;
  if (!user || !user.email) {
    alert('No user logged in');
    return;
  }

  try {
    // Re-authenticate user with current password
    const credential = EmailAuthProvider.credential(user.email, oldPassword.value);
    await reauthenticateWithCredential(user, credential);
    
    // Update to new password
    await firebaseUpdatePassword(user, newPassword.value);
    
    // Clear fields
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    strengthScore.value = 0;
    
    alert('Password updated successfully!');
  } catch (error: any) {
    console.error('Error updating password:', error);
    if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      alert('Current password is incorrect. Please try again.');
    } else if (error.code === 'auth/weak-password') {
      alert('New password is too weak. Please choose a stronger password.');
    } else {
      alert('Failed to update password. Please try again.');
    }
  }
};

const saveProfile = async () => {
  if (!currentUserId.value) {
    alert('No user logged in');
    return;
  }

  try {
    // Use setDoc with merge to create or update user data in Firestore
    await setDoc(doc(db, 'users', currentUserId.value), {
      name: user.value.name,
      email: user.value.email,
      phone: user.value.phone,
      department: user.value.department,
      workstation: user.value.workstation,
      shift: user.value.shift,
      supervisor: user.value.supervisor,
      role: user.value.role,
      avatarUrl: user.value.avatarUrl,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Failed to update profile. Please try again.');
  }
};
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
  .detail-item label { display: block; font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; }
  .detail-item p { font-weight: 600; color: #334155; margin: 4px 0 0 0; }
  .detail-item input { width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #edf2f7; background: #f8fafc; font-weight: 600; color: #334155; }
.progress-track { height: 12px; background: #e2e8f0; border-radius: 6px; overflow: hidden; }
.progress-bar { height: 100%; background: #2563eb; }

/* Security Update */
.security-form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 1200px) { 
  .security-form-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) { 
  .security-form-grid { grid-template-columns: 1fr; }
}
.password-wrapper { position: relative; display: flex; align-items: center; }
.password-wrapper input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #edf2f7; background: #f8fafc; }
.eye-btn { position: absolute; right: 12px; background: none; border: none; color: #94a3b8; cursor: pointer; }
.strength-meter { height: 6px; background: #f1f5f9; border-radius: 3px; margin-top: 10px; overflow: hidden; }
.strength-bar { height: 100%; transition: 0.4s; }
.strength-label { font-size: 0.85rem; margin-top: 6px; display: inline-block; font-weight: 600; }
.requirement { font-size: 0.875rem; color: #94a3b8; display: flex; align-items: center; gap: 8px; margin-top: 8px; }
.requirement.met { color: #10b981; }
.password-requirements { padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #edf2f7; }

.btn-primary { background: #0f172a; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; }
.btn-primary:disabled { background: #94a3b8; cursor: not-allowed; opacity: 0.6; }
.btn-primary:not(:disabled):hover { background: #1e293b; }
</style>