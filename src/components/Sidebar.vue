<template>
  <div class="sidebar-wrapper">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-left">
          <div class="logo-box">
            <i :class="headerIcon" aria-hidden="true"></i>
          </div>
          <h1 class="title">{{ headerTitle }}</h1>
        </div>
      </div>

      <nav class="menu">
        <ul>
          <li v-for="item in menuItems" :key="item.name" class="menu-item">
            <button
              class="nav-button"
              :class="{ active: isActive(item) }"
              @click="onMainClick(item)"
            >
              <span class="icon">
                <i :class="item.icon" aria-hidden="true"></i>
              </span>
              <span class="label">{{ item.name }}</span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- Sidebar footer: profile + logout -->
      <div class="sidebar-footer">
        <div class="profile" title="Profile">
          <div class="avatar">{{ avatarText }}</div>
          <div class="profile-text">
            <div class="name">{{ profileName }}</div>
            <div class="role">{{ profileRole }}</div>
          </div>
        </div>

        <button class="logout-btn" @click="logout" aria-label="Logout">
          <i class="mdi mdi-logout"></i>
          <span class="logout-label">Logout</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const menuItems = [
  { name: "Dashboard", icon: "mdi mdi-grid-large", routeName: "Dashboard" },
  { name: "Analytics", icon: "mdi mdi-pulse", routeName: "Analytics" },
  { name: "Alerts", icon: "mdi mdi-bell-outline", routeName: "Alerts" }
];

const onMainClick = (item: any) => item.routeName && router.push({ name: item.routeName });
const isActive = (item: any) => route.name === item.routeName;

// derive header from active menu item (UI-only)
const headerItem = computed(() => {
  const active = menuItems.find(i => i.routeName === route.name);
  return active || menuItems[0] || { name: "FactoryMon", icon: "mdi mdi-chart-box-outline" };
});
// Changed: always show "Factory Watch" as the sidebar header title
const headerTitle = computed(() => 'Factory Watch');
const headerIcon = computed(() => headerItem.value.icon);

/* new profile state + logout */
const profileName = ref<string>('df');
const profileRole = ref<string>('Operator');
const avatarText = computed(() => {
  // Use initials or single letters as avatar text
  return profileName.value ? profileName.value.slice(0, 2).toUpperCase() : 'U';
});

const logout = () => {
  try {
    // clear auth data (adjust keys as needed)
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  } catch (e) { /* ignore */ }
  // simple reload to reset app state (adjust to your auth flow)
  window.location.href = '/';
};
</script>

<style scoped>
/* Sidebar Container */
.sidebar {
  position: fixed;
  left: 0; top: 0; bottom: 0;
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
.brand { padding: 24px 20px; display: flex; align-items: center; justify-content: space-between; position: relative; }
.logo-box {
  background: #2563eb;
  width: 42px; height: 42px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
}
.logo-box i { color: #ffffff; font-size: 18px; }
.title { font-size: 1.15rem; font-weight: 700; color: #0f172a; margin-left: 12px; }

/* Menu */
.menu { padding: 0 12px; }
.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.nav-button {
  width: 100%; display: flex; align-items: center; padding: 18px 20px; margin-bottom: 6px;
  border: none; background: transparent ; cursor: pointer; border-radius: 14px;
  color: #0f172a; /* darker base color for label text */
  transition: background-color 150ms ease, transform 120ms ease, box-shadow 150ms ease, color 150ms ease;
  font-weight: 700; /* make label text bold */
  font-size: 1.15rem; /* increase text size */
}
.nav-button .icon {
  font-size: 22px;       /* larger icon */
  margin-right: 16px;
  display: flex; align-items: center; color: inherit;
  transition: color 150ms ease;
}

/* Hover - visible rounded highlight similar to image */
.nav-button:hover:not(.active) {
  background: #e6f3ff;       /* soft blue highlight */
  color: #2563eb;            /* blue text on hover */
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(37,99,235,0.06);
}

/* make sure icon also turns blue on hover */
.nav-button:hover:not(.active) .icon i { color: #2563eb; }

/* Active State - stronger contrast for active text */
.nav-button.active {
  background: #eff6ff;
  color: #1b4fd6;
}
.nav-button.active .icon i { color: #1b4fd6; }
.nav-button.active .label { color: #1b4fd6; }
.nav-button:hover:not(.active) { background: #f8fafc; }

/* Sidebar footer (profile + logout) */
.sidebar-footer {
  margin-top: auto;
  padding: 18px;
  display: flex;
  /* stack vertically so logout sits under profile (matches provided image) */
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  /* remove space-between since items are stacked */
}

/* Profile block as rounded card */
.profile {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;           /* light card background similar to image */
  padding: 10px 12px;
  border-radius: 12px;
  width: 100%;                   /* fill footer width so logout sits visibly below */
  box-sizing: border-box;
}

/* keep avatar size and look */
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px; /* Matches the logo and button radius */
  /* Creative Gradient Background */
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); 
  color: #2563eb; /* Primary Blue from your logo */
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  border: 1.5px solid #ffffff; /* Clean white border ring */
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.08); /* Soft blue shadow */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: visible;
}

/* Logout button: auto-width so it sits under the profile card */
.logout-btn {
  width: auto;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px; /* increased padding */
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 12px;
  color: #64748b; /* Muted gray for inactive state */
  font-weight: 700;
  font-size: 1rem; /* increased font size */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Updated Creative Avatar UI */
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px; /* Matches the logo and button radius */
  /* Creative Gradient Background */
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); 
  color: #2563eb; /* Primary Blue from your logo */
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  border: 1.5px solid #ffffff; /* Clean white border ring */
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.08); /* Soft blue shadow */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: visible;
}

/* Hover effect to match the logout button interaction */
.avatar:hover {
  transform: scale(1.05) rotate(-2deg);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.2);
}

/* Logout button */
/* Updated Creative Logout Button */
.logout-btn {
  width: auto;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px; /* increased padding */
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 12px;
  color: #64748b; /* Muted gray for inactive state */
  font-weight: 700;
  font-size: 1rem; /* increased font size */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* The Creative Icon Box */
.logout-btn i {
  font-size: 22px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff1f2; /* Very soft red tint */
  color: #e11d48;      /* Modern vibrant red */
  border-radius: 10px;
  transition: all 0.3s ease;
}

/* Hover Interaction */
.logout-btn:hover {
  background: #fff1f2; /* Light red background for the whole button */
  color: #e11d48;      /* Text turns red */
  transform: translateX(4px); /* Subtle slide-out effect */
}

/* Icon change on hover */
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