<!-- src/components/SideNav.vue -->
<template>
  <div class="sidenav">
    <router-link to="/dashboard">Dashboard</router-link>
    <router-link to="/applicants">Applicants</router-link>
  </div>
</template>

<script>
export default {
  name: "SideNav",
};
</script>

<style scoped>
.sidenav {
  width: 200px;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.sidenav a {
  padding: 10px;
  text-decoration: none;
  color: #333;
  margin: 5px 0;
}

.sidenav a.router-link-active {
  font-weight: bold;
  color: #42b983;
}
</style>
