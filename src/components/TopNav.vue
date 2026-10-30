<!-- src/components/TopNav.vue -->
<template>
  <nav class="topnav">
    <span class="brand">YCP Hacks Admin</span>

    <button class="hamburger" type="button" aria-label="Toggle navigation" :aria-expanded="isNavOpen" @click="toggleNav">
      ☰
    </button>

    <div :class="['nav-panel', { open: isNavOpen }]">
      <div class="nav-links">
        <router-link to="/dashboard" @click="closeMenus">Dashboard</router-link>
        <router-link to="/events" @click="closeMenus">Events</router-link>
        <router-link to="/activities" @click="closeMenus">Activities</router-link>
        <router-link to="/applicants" @click="closeMenus">Users</router-link>
        <router-link to="/teams" @click="closeMenus">Team Registration</router-link>
        <router-link to="/hardware" @click="closeMenus">Hardware</router-link>
        <router-link to="/sponsors" @click="closeMenus">Sponsors</router-link>
        <router-link to="/prizes" @click="closeMenus">Prizes</router-link>
        <router-link to="/audit-logs" v-if="UserRole() === 'oscar'" @click="closeMenus">Audit Logs</router-link>
      </div>

      <div class="nav-actions">
        <button class="menu-button" type="button" :aria-expanded="isMenuOpen" @click="toggleMenu">Menu ▾</button>
        <div :class="['nav-menu', { open: isMenuOpen }]">
          <div class="form-check form-switch toast-preference">
            <input id="toast-preference" class="form-check-input" type="checkbox" role="switch"
                   :checked="toastPreference" :disabled="isSavingToastPreference" @change="handleToastPreferenceChange"/>
            <label class="form-check-label" for="toast-preference">Pop-up notifications</label>
          </div>
          <button @click="handleLogout" class="logout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  name: "TopNav",
  data() {
    return {
      isNavOpen: false,
      isMenuOpen: false,
      isSavingToastPreference: false
    };
  },
  computed: {
    toastPreference() {
      return this.$store.state.user?.notificationPreference_toast ?? true;
    }
  },
  mounted() {
    document.addEventListener('click', this.closeMenusOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeMenusOutside);
  },
  methods: {
    ...mapActions(['logout', 'updateToastPreference']),
    ...mapGetters(['UserRole']),
    toggleNav() {
      this.isNavOpen = !this.isNavOpen;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenus() {
      this.isNavOpen = false;
      this.isMenuOpen = false;
    },
    closeMenusOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.closeMenus();
      }
    },
    handleLogout() {
      this.closeMenus();
      this.logout().then(() => {
        this.$router.push('/login');
      });
    },
    // Dispatches directly because importing utils/toast.js here loads the store and router before the app is ready
    async handleToastPreferenceChange(event) {
      this.isSavingToastPreference = true;
      const updateResp = await this.updateToastPreference(event.target.checked);
      this.isSavingToastPreference = false;

      if (!updateResp.success) {
        event.target.checked = this.toastPreference;
        this.$store.dispatch('toasts/notify', { type: 'error', message: updateResp.message });
        return;
      }

      // Only shows when turning toasts on, since non-error toasts are hidden once they're off
      this.$store.dispatch('toasts/notify', { type: 'success', message: 'Pop-up notifications on' });
    }
  }
};
</script>

<style scoped>
.topnav {
  position: sticky;
  top: 0;
  /* Below the modal overlays (1000 and up), so they still cover the bar */
  z-index: 900;
  height: 60px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.topnav a {
  text-decoration: none;
  color: #333;
  white-space: nowrap;
}

.brand {
  color: #333;
  font-weight: 600;
  white-space: nowrap;
}

.topnav .nav-links a {
  padding: 8px;
  font-size: 15px;
  border-radius: 14px;
  transition: background 0.3s;
}

.topnav .nav-links a:hover {
  background-color: #e9ecef;
}

.topnav .nav-links a.router-link-active {
  color: #42b983;
}

.hamburger {
  display: none;
  margin-left: auto;
  padding: 4px 12px;
  font-size: 24px;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
}

.nav-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-actions {
  position: relative;
}

.menu-button {
  padding: 8px 12px;
  font-size: 15px;
  color: #333;
  background: none;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.3s;
}

.menu-button:hover {
  background-color: #e9ecef;
}

.nav-menu {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 240px;
  padding: 12px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.nav-menu.open {
  display: block;
}

.toast-preference {
  margin: 0 0 8px 12px;
  font-size: 15px;
  white-space: nowrap;
}

.logout {
  width: 100%;
  font-size: 15px;
  padding: 12px;
  color: #d9534f;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  border-radius: 14px;
  transition: background 0.3s;
}

.logout:hover {
  background-color: #f8d7da;
}

/* The links don't fit on one row below this width */
@media (max-width: 1199.98px) {
  .hamburger {
    display: block;
  }

  .nav-panel {
    display: none;
  }

  .nav-panel.open {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: calc(100dvh - 60px);
    padding: 12px 16px;
    overflow-y: auto;
    background-color: #f8f9fa;
    border-bottom: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .nav-links {
    flex-direction: column;
    align-items: stretch;
  }

  .topnav .nav-links a {
    padding: 12px;
    font-size: 16px;
  }

  .menu-button {
    display: none;
  }

  .nav-menu {
    display: block;
    position: static;
    min-width: 0;
    margin-top: 8px;
    padding: 12px 0 0;
    background: none;
    border: none;
    border-top: 1px solid #ddd;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>
