<template>
  <div class="help-page">

    <!-- HEADER -->
    <header class="help-header">
      <div class="header-title">
        <i class="mdi mdi-lifebuoy"></i>
        <h1>Help Center</h1>
      </div>

      <p class="header-desc">
        Guides, FAQs and troubleshooting for the Factory Monitoring System.
      </p>

      <div class="search-box">
        <i class="mdi mdi-magnify"></i>
        <input
          v-model="query"
          type="text"
          placeholder="Search help topics (login, alerts, dashboard...)"
        />
      </div>
    </header>

    <!-- HELP SECTIONS -->
    <div class="help-grid">

      <section
        v-for="section in filteredSections"
        :key="section.id"
        class="help-card"
      >
        <div class="card-header">
          <i :class="section.icon"></i>
          <h2>{{ section.title }}</h2>
        </div>

        <p v-if="section.subtitle" class="card-subtitle">
          {{ section.subtitle }}
        </p>

        <!-- BULLET SECTION -->
        <ul v-if="section.type === 'bullets'" class="help-list">
          <li v-for="(item, i) in section.items" :key="i">
            {{ item }}
          </li>
        </ul>

        <!-- QA -->
        <div v-else-if="section.type === 'qa'" class="qa">
          <details v-for="(qa, i) in section.items" :key="i">
            <summary>{{ qa.q }}</summary>
            <p>{{ qa.a }}</p>
          </details>
        </div>

        <!-- ROLES -->
        <div v-else-if="section.type === 'roles'" class="roles">

          <div v-for="(role,i) in section.items" :key="i" class="role-card">

            <div class="role-title">
              <i :class="role.icon"></i>
              <h3>{{ role.name }}</h3>
            </div>

            <ul>
              <li v-for="(p,idx) in role.points" :key="idx">
                {{ p }}
              </li>
            </ul>

          </div>

        </div>

      </section>

    </div>

    <!-- CONTACT -->
    <section class="support-card">

      <div class="card-header">
        <i class="mdi mdi-email-outline"></i>
        <h2>Contact Support</h2>
      </div>

      <p>
        If you need additional help contact the system administrator.
      </p>

      <div class="support-grid">

        <div class="support-item">
          <span>Email</span>
          <strong>support@factorymonitor.local</strong>
        </div>

        <div class="support-item">
          <span>Phone</span>
          <strong>+94 77 123 4567</strong>
        </div>

        <div class="support-item">
          <span>Hours</span>
          <strong>Mon–Fri 8.30AM – 5.00PM</strong>
        </div>

      </div>

    </section>

  </div>
</template>

<script setup>
import { ref, computed } from "vue"

const query = ref("")

const sections = ref([
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "mdi mdi-rocket-launch-outline",
    type: "bullets",
    subtitle: "Basic guide to start using the system",
    items: [
      "Login using your username and password.",
      "After login you will be redirected to the dashboard.",
      "Dashboard shows machine status in real-time.",
      "Use the sidebar menu to navigate."
    ]
  },

  {
    id: "roles",
    title: "User Roles & Permissions",
    icon: "mdi mdi-account-group-outline",
    type: "roles",
    subtitle: "Different access levels in the system",
    items: [
      {
        name: "Admin",
        icon: "mdi mdi-shield-account-outline",
        points: [
          "Manage users and roles",
          "View analytics and reports",
          "Manage the entire system"
        ]
      },
      {
        name: "Operator",
        icon: "mdi mdi-account-outline",
        points: [
          "Monitor machine status",
          "View alerts",
          "Report issues"
        ]
      },
      {
        name: "Maintenance",
        icon: "mdi mdi-wrench",
        points: [
          "Receive machine alerts",
          "Inspect sensor data",
          "Perform maintenance tasks"
        ]
      }
    ]
  },

  {
    id: "dashboard",
    title: "Dashboard Overview",
    icon: "mdi mdi-view-dashboard-outline",
    type: "bullets",
    items: [
      "Green = Running normally",
      "Yellow = Idle or warning",
      "Red = Machine error",
      "Blue = Maintenance mode"
    ]
  },

  {
    id: "alerts",
    title: "Alerts & Notifications",
    icon: "mdi mdi-bell-alert-outline",
    type: "bullets",
    items: [
      "Alerts trigger when sensor limits are exceeded.",
      "Common alerts include overheating or vibration.",
      "Operators should notify maintenance.",
      "Maintenance should inspect immediately."
    ]
  },

  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: "mdi mdi-tools",
    type: "qa",
    items: [
      {
        q: "Cannot login?",
        a: "Check username and password or contact admin."
      },
      {
        q: "No sensor data?",
        a: "Check device power and network connection."
      },
      {
        q: "Alerts not appearing?",
        a: "Check alert configuration and system connection."
      }
    ]
  }

])

const filteredSections = computed(() => {
  const q = query.value.toLowerCase()

  if (!q) return sections.value

  return sections.value.filter(s =>
    JSON.stringify(s).toLowerCase().includes(q)
  )
})
</script>

<style scoped>

/* PAGE */

.help-page{
padding:40px;
max-width:1300px;
margin:auto;
background:#f6f9fc;
min-height:100vh;
}

/* HEADER */

.help-header{
background:linear-gradient(135deg,#3b82f6,#6366f1);
padding:40px;
border-radius:16px;
color:white;
margin-bottom:35px;
box-shadow:0 8px 30px rgba(0,0,0,0.15);
}

.header-title{
display:flex;
align-items:center;
gap:15px;
font-size:26px;
font-weight:700;
}

.header-title i{
font-size:32px;
}

.header-desc{
margin-top:10px;
opacity:0.9;
}

/* SEARCH */

.search-box{
margin-top:20px;
background:white;
border-radius:12px;
display:flex;
align-items:center;
padding:10px 15px;
}

.search-box i{
color:#64748b;
margin-right:8px;
}

.search-box input{
border:none;
outline:none;
width:100%;
font-size:15px;
}

/* GRID */

.help-grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:25px;
}

/* CARD */

.help-card{
background:white;
border-radius:14px;
padding:24px;
box-shadow:0 4px 15px rgba(0,0,0,0.06);
transition:0.3s;
}

.help-card:hover{
transform:translateY(-4px);
box-shadow:0 10px 25px rgba(0,0,0,0.08);
}

.card-header{
display:flex;
align-items:center;
gap:10px;
margin-bottom:10px;
}

.card-header i{
font-size:22px;
color:#2563eb;
}

.card-subtitle{
color:#64748b;
margin-bottom:10px;
}

/* LIST */

.help-list{
padding-left:18px;
}

.help-list li{
margin-bottom:8px;
}

/* QA */

.qa details{
border:1px solid #e2e8f0;
border-radius:10px;
padding:10px;
margin-bottom:10px;
background:#f8fafc;
}

.qa summary{
font-weight:600;
cursor:pointer;
}

.qa p{
margin-top:8px;
color:#475569;
}

/* ROLES */

.roles{
display:grid;
gap:15px;
}

.role-card{
background:#f8fafc;
border-radius:12px;
padding:15px;
border:1px solid #e2e8f0;
}

.role-title{
display:flex;
align-items:center;
gap:10px;
margin-bottom:10px;
}

/* SUPPORT */

.support-card{
margin-top:30px;
padding:30px;
border-radius:16px;
background:linear-gradient(135deg,#6366f1,#8b5cf6);
color:white;
}

.support-grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:15px;
margin-top:20px;
}

.support-item{
background:rgba(255,255,255,0.15);
padding:15px;
border-radius:10px;
}

/* RESPONSIVE */

@media (max-width:1100px){

.help-grid{
grid-template-columns:repeat(2,1fr);
}

.support-grid{
grid-template-columns:repeat(2,1fr);
}

}

@media (max-width:700px){

.help-grid{
grid-template-columns:1fr;
}

.support-grid{
grid-template-columns:1fr;
}

.help-page{
padding:20px;
}

}

</style>