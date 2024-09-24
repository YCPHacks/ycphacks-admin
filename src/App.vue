<!-- src/App.vue -->
<template>
  <div id="app">
    <SideNav />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import SideNav from './components/SideNav.vue';

export default {
  name: "App",
  components: {
    SideNav,
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
</style>
