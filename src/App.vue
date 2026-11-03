<template>
  <div id="app">
    <TopNav v-if="!isLoginPage" />
    <div :class="['main-content', { 'full-screen': isLoginPage }]">
      <router-view />
    </div>
    <ToastContainer />
  </div>
</template>

<script>
import TopNav from './components/TopNav.vue';
import ToastContainer from './components/ToastContainer.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: "App",
  components: {
    TopNav,
    ToastContainer,
  },
  setup() {
    const route = useRoute();
    const isLoginPage = computed(() => route.path === '/login');
    return { isLoginPage };
  },
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  padding: 20px;
  flex-grow: 1;
  min-width: 0;
}

@media (max-width: 991.98px) {
  .main-content {
    padding: 12px;
  }
}

.full-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding: 0;
  /* Remove padding for full screen */
}
</style>
