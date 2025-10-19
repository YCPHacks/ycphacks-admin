<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">User Management</h2>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
          All Users
        </button>
      </li>
      <!-- Only Oscar should have access to Staff -->
      <li class="nav-item" v-if="isOscar">
        <button class="nav-link" :class="{ active: activeTab === 'staff' }" @click="activeTab = 'staff'">
          Staff Users
        </button>
      </li>
    </ul>

    <!-- Add Total Users -->

    <!-- Add Total T-Shirt Sizes -->

    <!-- Search Input -->
    <div class="mb-4">
      <input type="text" v-model="searchQuery" class="form-control" placeholder="Search by name" />
    </div>

    <!-- Add Oscar functionality for changing User info -->
    <!-- - Also for changing user's role -->
    <!-- Add Download User emails button-->
    <!-- Add Export All Users button -->

    <!-- Table Section -->
    <div class="table-container shadow-lg rounded overflow-hidden">
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="thead-light">
            <tr>
              <th class="text-left">Checked In?</th>
              <th class="text-left">First Name</th>
              <th class="text-left">Last Name</th>
              <th class="text-left">Age</th>
              <th class="text-left">Email</th>
              <th class="text-left">Phone Number</th>
              <th class="text-left">School</th>
              <th class="text-left">T-Shirt Size</th>
              <th class="text-left">Dietary Restrictions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">
                No users found
              </td>
            </tr>
            <tr v-for="user in filteredUsers" :key="user.id">
              <!-- Add Check Boxes for Check in -->
              <td class="text-center align-middle table-checkbox-center">
                <input 
                  type="checkbox" 
                  :checked="user.checkIn" 
                  @change="toggleCheckIn(user.id)" 
                  class="form-check-input"
                >
              </td>
              <td>{{ user.firstName }}</td>
              <td>{{ user.lastName }}</td>
              <td>{{ user.age }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phoneNumber }}</td>
              <td>{{ user.school }}</td>
              <td>{{ user.tShirtSize }}</td>
              <!-- Add in dietary highlights -->
              <td class="text-center">
                <span v-if="user.dietaryRestrictions" class="badge bg-warning text-dark">
                  {{ user.dietaryRestrictions }}
                </span>
                <span v-else class="text-muted">–</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserManagement",
  data() {
    return {
      users: [],
      searchQuery: "",
      activeTab: "all", // 'all' or 'staff'
    };
  },
  computed: {
    isOscar(){
      return this.$store.getters.UserRole === 'oscar';
    },
    filteredUsers() {
      const query = this.searchQuery.toLowerCase();
      const filteredList = this.activeTab === "all"
        ? this.users
        : this.users.filter(user => user.role.toLowerCase() === "staff");

      return filteredList.filter(
        user =>
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:3000/user/all");
        this.users = response.data.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async toggleCheckIn(userId){
      console.log('Attempting to toggle check-in for ID:', userId);
      const userIdNumber = Number(userId);
      const user = this.users.find(u => u.id === userIdNumber);
      if(!user) return;

      const newCheckInStatus = !user.checkIn;

      try{
        await axios.put(`http://localhost:3000/user/${userId}/checkin`, {
          checkIn: newCheckInStatus
        });
        
        user.checkIn = newCheckInStatus;
      }catch (err){
        console.error(`Error toggling check-in for user ${userId}:`, err);
      }
    }
  },
};
</script>
<style scoped>
.container {
  max-width: 100%;
}

.nav-tabs {
  border-bottom: 1px solid #dee2e6;
}

.nav-link {
  color: #495057;
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.nav-link.active {
  background-color: #f8f9fa;
  border-color: #dee2e6 #dee2e6 #fff;
  font-weight: bold;
}

.table-container {
  border-radius: 0.75rem;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  margin: 0;
  font-size: 0.875rem;
  /* min-width: 1200px; */
}

.table td:nth-child(5){
  max-width: 150px;
  word-break: break-all;
  white-space: normal !important;
}

.thead-light th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  vertical-align: middle;
  text-align: center;
  white-space: normal;
}

table tbody tr td.table-checkbox-center .form-check-input{
  margin-left: auto !important;
  margin-right: auto !important;
  display: block !important;
  float: none !important;
}

.table td{
  text-align: center;
  vertical-align: middle;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f2f2f2;
}

.table-hover tbody tr:hover {
  background-color: #e9ecef;
}

.shadow-lg {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-control {
  border-radius: 0.5rem;
}

</style>

