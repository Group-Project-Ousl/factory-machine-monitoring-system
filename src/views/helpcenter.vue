<template>
  <div class="help-page">
    <!-- Header -->
    <div class="help-header">
      <div class="page-title">
        <span class="icon"><i class="mdi mdi-lifebuoy"></i></span>
        <span>Help Center</span>
      </div>

      <p class="label-text">
        Guides, FAQs, and troubleshooting tips for the Factory Monitoring System.
      </p>

      <input
        v-model="query"
        class="form-input"
        type="text"
        placeholder="Search help topics (e.g., login, alerts, dashboard)..."
      />
    </div>

    <!-- Sections -->
    <div class="help-grid">
      <section
        v-for="section in filteredSections"
        :key="section.id"
        class="machine-card help-card"
      >
        <div class="help-card-title">
          <i :class="section.icon" aria-hidden="true"></i>
          <h2>{{ section.title }}</h2>
        </div>

        <p class="label-text" v-if="section.subtitle">{{ section.subtitle }}</p>

        <!-- Bullets -->
        <ul v-if="section.type === 'bullets'" class="help-list">
          <li v-for="(item, idx) in section.items" :key="idx">{{ item }}</li>
        </ul>

        <!-- Q&A -->
        <div v-else-if="section.type === 'qa'" class="qa">
          <details v-for="(qa, idx) in section.items" :key="idx" class="qa-item">
            <summary><span class="q">{{ qa.q }}</span></summary>
            <div class="a label-text">{{ qa.a }}</div>
          </details>
        </div>

        <!-- Roles -->
        <div v-else-if="section.type === 'roles'" class="roles">
          <div v-for="(role, idx) in section.items" :key="idx" class="role-box">
            <div class="role-title">
              <i :class="role.icon"></i>
              <span>{{ role.name }}</span>
            </div>
            <ul class="help-list">
              <li v-for="(p, pidx) in role.points" :key="pidx">{{ p }}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>

    <!-- Contact -->
    <section class="machine-card help-footer">
      <div class="help-card-title">
        <i class="mdi mdi-email-outline"></i>
        <h2>Contact Support</h2>
      </div>

      <p class="label-text">
        If you need further help, contact the system administrator or maintenance team.
      </p>

      <div class="contact">
        <div class="contact-item">
          <span class="contact-label">Support Email:</span>
          <span class="contact-value">support@factorymonitor.local</span>
        </div>
        <div class="contact-item">
          <span class="contact-label">Phone:</span>
          <span class="contact-value">+94 77 123 4567</span>
        </div>
        <div class="contact-item">
          <span class="contact-label">Hours:</span>
          <span class="contact-value">Mon–Fri, 8.30AM–5.00PM</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const query = ref('')

const sections = ref([
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'mdi mdi-rocket-launch-outline',
    type: 'bullets',
    subtitle: 'New user guide to access and understand the system.',
    items: [
      'Login using your assigned username and password.',
      'After login, you will be redirected to the Dashboard.',
      'Dashboard shows real-time machine status and alerts.',
      'Use the sidebar menu to navigate between pages.'
    ]
  },
  {
    id: 'roles',
    title: 'User Roles & Permissions',
    icon: 'mdi mdi-account-group-outline',
    type: 'roles',
    subtitle: 'Different access levels for each user group.',
    items: [
      {
        name: 'Admin',
        icon: 'mdi mdi-shield-account-outline',
        points: [
          'Manage user accounts and roles',
          'View all machines and analytics',
          'Generate reports and oversee the system'
        ]
      },
      {
        name: 'Operator',
        icon: 'mdi mdi-account-outline',
        points: [
          'Monitor machine status in real time',
          'View alerts and basic machine details',
          'Report issues to maintenance team'
        ]
      },
      {
        name: 'Maintenance',
        icon: 'mdi mdi-wrench-outline',
        points: [
          'Receive fault alerts and warnings',
          'Check abnormal sensor readings',
          'Plan and record maintenance actions'
        ]
      }
    ]
  },
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    icon: 'mdi mdi-view-dashboard-outline',
    type: 'bullets',
    subtitle: 'Understand machine cards, statuses, and colors.',
    items: [
      'Running (Green): machine operating normally.',
      'Idle (Yellow): machine stopped/low activity or warning.',
      'Error (Red): critical fault detected, immediate action needed.',
      'Maintenance (Blue): machine under maintenance mode.'
    ]
  },
  {
    id: 'alerts',
    title: 'Alerts & Notifications',
    icon: 'mdi mdi-bell-alert-outline',
    type: 'bullets',
    subtitle: 'How the system notifies issues early.',
    items: [
      'Alerts trigger when sensor values exceed safe limits.',
      'Common triggers: overheating, unusual vibration, high power usage.',
      'Operators should inform maintenance immediately.',
      'Maintenance team should inspect and resolve before downtime.'
    ]
  },
  {
    id: 'monitoring',
    title: 'Machine Monitoring & Sensors',
    icon: 'mdi mdi-access-point',
    type: 'bullets',
    subtitle: 'What data is collected and displayed.',
    items: [
      'Temperature (°C)',
      'Vibration (level/threshold)',
      'Power consumption (W/kWh)',
      'Machine status (Running/Idle/Error/Maintenance)'
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: 'mdi mdi-tools',
    type: 'qa',
    subtitle: 'Common issues and quick fixes.',
    items: [
      { q: 'I cannot log in. What should I do?', a: 'Check username/password. If still failing, contact Admin to reset credentials.' },
      { q: 'No sensor data showing on dashboard.', a: 'Check IoT device power, Wi-Fi connection, and verify the device is online.' },
      { q: 'Alerts are not appearing.', a: 'Check network connectivity and confirm alert thresholds are configured correctly.' }
    ]
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: 'mdi mdi-frequently-asked-questions',
    type: 'qa',
    subtitle: 'Frequently asked questions about the system.',
    items: [
      { q: 'Can I access the system remotely?', a: 'Yes. The system is web-based and can be accessed with proper credentials.' },
      { q: 'Is data stored for analysis?', a: 'Yes. Historical readings can be stored for trends and reports.' },
      { q: 'Can we add multiple factories later?', a: 'Yes. The system is designed to scale for more machines and sites.' }
    ]
  },
  {
    id: 'limitations',
    title: 'System Limitations',
    icon: 'mdi mdi-alert-circle-outline',
    type: 'bullets',
    subtitle: 'Important notes about the current prototype.',
    items: [
      'Requires stable internet/Wi-Fi for real-time updates.',
      'Sensor accuracy depends on hardware quality and calibration.',
      'Prototype may use simulated/demo data until hardware integration is complete.'
    ]
  }
])

const filteredSections = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return sections.value

  return sections.value.filter((s) => {
    const base = `${s.title} ${s.subtitle || ''}`.toLowerCase()
    let itemsText = ''

    if (s.type === 'bullets') itemsText = (s.items || []).join(' ').toLowerCase()
    if (s.type === 'qa') itemsText = (s.items || []).map(x => `${x.q} ${x.a}`).join(' ').toLowerCase()
    if (s.type === 'roles') itemsText = (s.items || []).map(r => `${r.name} ${(r.points||[]).join(' ')}`).join(' ').toLowerCase()

    return (base + ' ' + itemsText).includes(q)
  })
})
</script>

<style scoped>
.help-page {
  padding: 32px;
  padding-top: 88px;
  margin-left: 260px;
  margin-right: auto;
  max-width: 1200px;
  box-sizing: border-box;
  width: calc(100% - 260px);
  background: #f8fafc;
  min-height: 100vh;
}

/* mobile */
@media (max-width: 900px) {
  .help-grid {
    grid-template-columns: 1fr;
  }
  .help-page {
    margin: 0 16px;
    padding-top: 80px;
    max-width: 100%;
    margin-left: 0;
    width: auto;
  }
}

.help-header {
  margin-bottom: 32px;
  background: white;
  padding: 32px;
  border-radius: 16px;
  border: 1px solid #edf2f7;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.help-header .page-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.help-header .page-title .icon i {
  font-size: 2.5rem;
  color: #2563eb;
}

.help-header .label-text {
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.6;
}

.help-header .form-input {
  margin-top: 20px;
  padding: 14px 18px;
  font-size: 1.125rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  width: 100%;
  transition: all 0.3s ease;
}

.help-header .form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.help-card-title {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.help-card-title i {
  font-size: 2rem;
  color: #2563eb;
}

.help-card-title h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.machine-card.help-card {
  background: white;
  border: 1px solid #edf2f7;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  transition: all 0.3s ease;
}

.machine-card.help-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

.help-card .label-text {
  font-size: 1.125rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 16px;
}

.help-list {
  margin: 16px 0 0;
  padding-left: 24px;
  line-height: 1.8;
}

.help-list li {
  font-size: 1.125rem;
  color: #334155;
  margin-bottom: 12px;
  font-weight: 500;
}

.qa-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 18px;
  margin-top: 12px;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.qa-item:hover {
  background: #ffffff;
  border-color: #2563eb;
}

.qa-item summary {
  cursor: pointer;
  font-weight: 700;
  font-size: 1.125rem;
  color: #0f172a;
  padding: 4px 0;
}

.qa-item summary:hover {
  color: #2563eb;
}

.a {
  margin-top: 12px;
  font-size: 1.0625rem;
  color: #475569;
  line-height: 1.7;
  padding-left: 8px;
  border-left: 3px solid #2563eb;
}

.roles {
  display: grid;
  gap: 16px;
  margin-top: 16px;
}

.role-box {
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.role-box:hover {
  background: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.role-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  font-size: 1.25rem;
  color: #0f172a;
  margin-bottom: 12px;
}

.role-title i {
  font-size: 1.75rem;
  color: #2563eb;
}

.role-box .help-list {
  margin-top: 12px;
  padding-left: 24px;
}

.role-box .help-list li {
  font-size: 1.0625rem;
  color: #475569;
  font-weight: 500;
}

.help-footer {
  margin-top: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.help-footer .help-card-title {
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.help-footer .help-card-title i {
  color: white;
  font-size: 2rem;
}

.help-footer .help-card-title h2 {
  color: white;
  font-size: 1.75rem;
}

.help-footer .label-text {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.125rem;
}

.contact {
  margin-top: 20px;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.contact-item {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.1);
  padding: 16px 20px;
  border-radius: 12px;
  align-items: center;
}

.contact-label {
  font-weight: 700;
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.9);
}

.contact-value {
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
}

/* Additional professional touches */
.help-page::-webkit-scrollbar {
  width: 10px;
}

.help-page::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.help-page::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 5px;
}

.help-page::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.form-input::placeholder {
  color: #94a3b8;
  font-size: 1.0625rem;
}

/* Badge for section count */
@media (min-width: 901px) {
  .help-grid .help-card:nth-child(odd):last-child {
    grid-column: span 2;
  }
}
</style>
