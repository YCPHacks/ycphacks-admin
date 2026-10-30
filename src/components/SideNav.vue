<!-- src/components/SideNav.vue -->
<template>
  <div class="sidenav">
    <router-link to="/dashboard">Dashboard</router-link>
    <router-link to="/events">Events</router-link>
    <router-link to="/activities">Activities</router-link>
    <router-link to="/applicants">Users</router-link>
    <router-link to="/teams">Team Registration</router-link>
    <router-link to="/hardware">Hardware</router-link>
    <router-link to="/sponsors">Sponsors</router-link>
    <router-link to="/prizes">Prizes</router-link>
    <router-link to="/audit-logs" v-if="UserRole() === 'oscar'">Audit Logs</router-link>
    <div class="spacer"></div>
    <div class="form-check form-switch toast-preference">
      <input id="toast-preference" class="form-check-input" type="checkbox" role="switch"
             :checked="toastPreference" :disabled="isSavingToastPreference" @change="handleToastPreferenceChange"/>
      <label class="form-check-label" for="toast-preference">Pop-up notifications</label>
    </div>
    <button @click="handleLogout" class="logout">Logout</button>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  name: "SideNav",
  data() {
    return {
      isSavingToastPreference: false
    };
  },
  computed: {
    toastPreference() {
      return this.$store.state.user?.notificationPreference_toast ?? true;
    }
  },
  methods: {
    ...mapActions(['logout', 'updateToastPreference']),
    ...mapGetters(['UserRole']),
    handleLogout() {
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
.sidenav {
  width: 200px;
  height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  border-right: 1px solid #ddd;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidenav a {
  padding: 12px;
  text-decoration: none;
  color: #333;
  font-size: 16px;
  margin: 5px 0;
  border-radius: 14px;
  transition: background 0.3s;
}

.sidenav a:hover {
  background-color: #e9ecef;
}

.sidenav a.router-link-active {
  color: #42b983;
}

.spacer {
  flex: 1;
}

.toast-preference {
  margin-left: 12px;
  font-size: 14px;
}

.logout {
  margin-top: auto;
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
</style>
