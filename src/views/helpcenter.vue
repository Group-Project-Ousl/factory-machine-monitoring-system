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
  padding: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.help-header {
  margin-bottom: 18px;
}

.help-header .form-input {
  margin-top: 12px;
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

/* mobile */
@media (max-width: 860px) {
  .help-grid {
    grid-template-columns: 1fr;
  }
}

.help-card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.help-card-title i {
  font-size: 22px;
}

.help-card-title h2 {
  margin: 0;
  font-size: 1.05rem;
}

.help-list {
  margin: 10px 0 0;
  padding-left: 18px;
  line-height: 1.7;
}

.qa-item {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 10px 12px;
  margin-top: 10px;
  background: #ffffff;
}

.qa-item summary {
  cursor: pointer;
  font-weight: 700;
}

.a {
  margin-top: 8px;
}

.roles {
  display: grid;
  gap: 12px;
  margin-top: 10px;
}

.role-box {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 12px;
  background: #ffffff;
}

.role-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
}

.role-title i {
  font-size: 20px;
}

.help-footer {
  margin-top: 16px;
}

.contact {
  margin-top: 10px;
  display: grid;
  gap: 8px;
}

.contact-item {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.contact-label {
  font-weight: 700;
}

.contact-value {
  color: #0f1724;
  font-weight: 600;
}
</style>
