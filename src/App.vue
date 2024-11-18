<template>
  <div id="app">
    <SideNav v-if="!isLoginPage" />
    <div :class="['main-content', { 'full-screen': isLoginPage }]">
      <router-view />
    </div>
  </div>
</template>

<script>
import SideNav from './components/SideNav.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: "App",
  components: {
    SideNav,
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
}

.main-content {
  padding: 20px;
  flex-grow: 1;
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
