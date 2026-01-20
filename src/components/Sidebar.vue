<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="logo-box">
        <i :class="headerIcon"></i>
      </div>
      <h1 class="title">{{ headerTitle }}</h1>
    </div>

    <nav class="menu">
      <button
        v-for="item in menuItems"
        :key="item.routeName"
        class="nav-button"
        :class="{ active: isActive(item) }"
        @click="go(item)"
      >
        <i :class="['icon', item.icon]"></i>
        <span class="label">{{ item.label }}</span>
      </button>
    </nav>

    <div class="sidebar-footer">
      <div class="profile">
        <div class="avatar">{{ avatarText }}</div>
        <div>
          <div>{{ profileName }}</div>
          <small>{{ profileRole }}</small>
        </div>
      </div>

      <button class="logout-btn" @click="logout">
        <i class="mdi mdi-logout"></i> Logout
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// Sidebar menu items
const menuItems = [
  { label: "Dashboard", icon: "mdi mdi-grid-large", routeName: "Dashboard" },
  { label: "Analytics", icon: "mdi mdi-chart-line", routeName: "Analytics" },
  { label: "Alerts", icon: "mdi mdi-bell-alert", routeName: "Alert" }
];

// Navigate to route
const go = (item: any) => {
  if (item.routeName) router.push({ name: item.routeName });
};

// Active menu check
const isActive = (item: any) => route.name === item.routeName;

// Header info
const headerTitle = computed(() => "Factory Watch");
const headerIcon = computed(() => {
  const active = menuItems.find((m) => m.routeName === route.name);
  return active?.icon || "mdi mdi-factory";
});

// Profile info
const profileName = ref("df");
const profileRole = ref("Operator");
const avatarText = computed(() => profileName.value.slice(0, 2).toUpperCase());

// Logout function
const logout = () => {
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  } catch (e) {}
  router.push("/login"); // safer than window.location.href
};
</script>

<style scoped>
/* Sidebar Container */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #edf2f7;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  z-index: 1000;
  font-family: 'Inter', sans-serif;
}

/* Brand Styling */
.brand {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
.logo-box {
  background: #2563eb;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}
.logo-box i {
  color: #ffffff;
  font-size: 18px;
}
.title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin-left: 12px;
}

/* Menu */
.menu {
  padding: 0 12px;
}
.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.nav-button {
  width: 100%;
  display: flex;
  align-items: center;
  
  padding: 14px 20px; 
  margin-bottom: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 12px;
  color: #0f172a;
  transition: all 0.2s ease;
  font-weight: 600;
 
  font-size: 1.1rem;
}
.nav-button .icon {
  font-size: 22px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  color: inherit;
  transition: color 150ms ease;
}
.nav-button:hover:not(.active) {
  background: #e6f3ff;
  color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.06);
}
.nav-button:hover:not(.active) .icon {
  color: #2563eb;
}
.nav-button.active {
  background: #eff6ff;
  color: #1b4fd6;
}
.nav-button.active .icon {
  color: #1b4fd6;
}
.nav-button.active .label {
  color: #1b4fd6;
}
.nav-button:hover:not(.active) {
  background: #f8fafc;
}

/* Sidebar footer (profile + logout) */
.sidebar-footer {
  margin-top: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

/* Profile block */
.profile {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  padding: 10px 12px;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
}

/* Avatar */
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  border: 1.5px solid #ffffff;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: visible;
}
.avatar:hover {
  transform: scale(1.05) rotate(-2deg);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.2);
}

/* Logout button */
.logout-btn {
  width: auto;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 12px;
  color: #64748b;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.logout-btn i {
  font-size: 22px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff1f2;
  color: #e11d48;
  border-radius: 10px;
  transition: all 0.3s ease;
}
.logout-btn:hover {
  background: #fff1f2;
  color: #e11d48;
  transform: translateX(4px);
}
.logout-btn:hover i {
  background: #e11d48;
  color: #ffffff;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.2);
}
.logout-label {
  font-size: 0.95rem;
  transition: color 0.3s ease;
}
</style>

