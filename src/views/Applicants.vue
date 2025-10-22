<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">User Management</h2>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'participant' }" @click="activeTab = 'participant'">
          Participant Users
        </button>
      </li>
      <!-- Only Oscar should have access to Staff -->
      <li class="nav-item" v-if="isOscar">
        <button class="nav-link" :class="{ active: activeTab === 'staff' }" @click="activeTab = 'staff'">
          Staff Users
        </button>
      </li>
      <li class="nav-item" v-if="isOscar">
        <button class="nav-link" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
          All Users
        </button>
      </li>
    </ul>

    <!-- Add Total Users -->
    <div class="d-flex align-items-center mb-2 tshirt-compact-row">
    
      <h5 class="me-4 text-nowrap">
        👕 T-Shirt Sizes ({{ activeTab.toUpperCase() }}):
      </h5>
      
      <div 
        v-for="(count, size) in tshirtSizeTally.tally" 
        :key="size" 
        class="me-3 text-nowrap"
        :class="{'text-danger fw-bold': size === 'N/A'}"
      >
        <span class="fw-bold">{{ size }}:</span> {{ count }}
      </div>

      <!-- Add Total T-Shirt Sizes -->
      <span class="badge bg-primary fs-6 ms-auto text-nowrap">
        Total Order: {{ tshirtSizeTally.totalShirts }}
      </span>
    </div>

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
                <span 
                  v-if="user.dietaryRestrictions && user.dietaryRestrictions.toLowerCase() !== 'none' && user.dietaryRestrictions.toLowerCase() !== 'null'"
                  :class="getDietaryRestriction(user.dietaryRestrictions)"
                >
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

const DIET_RESTRICTIONS = [
  'vegan',
  'veggie',
  'vegetarian',
  'pescatarian',
  'gluten',
  'dairy',
  'lactose',
  'keto',
  'paleo',
  'low-carb',
  'sugar-free',
];

const RELIGIOUS_RESTRICTIONS = [
  'kosher',
  'halal',
  'jain',
  'buddhist',
];

const ALLERGY_KEYWORDS = [
  'allergy',
  'allergic',
  'nut',
  'shellfish',
  'peanut',
  'tree nut',
  'soy',
  'wheat',
  'egg',
];

export default {
  name: "UserManagement",
  data() {
    return {
      users: [],
      searchQuery: "",
      activeTab: "participant", // 'all' or 'staff'
    };
  },
  computed: {
    isOscar(){
      return this.$store.getters.UserRole === 'oscar';
    },
    filteredUsers() {
      const query = this.searchQuery.toLowerCase();
      let list = this.users;

      if(this.activeTab === "staff"){
        list = this.users.filter(user => user.role.toLowerCase() === "staff" || user.role.toLowerCase() === "oscar");
      }else if(this.activeTab === "participant"){
        list = this.users.filter(user => user.role.toLowerCase() === "participant");
      }

      let filteredList = list.filter(
        user=>
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );

      filteredList.sort((a, b) => {
        // Sort by last name
        if (a.lastName < b.lastName) return -1;
        if (a.lastName > b.lastName) return 1;

        // If last names are equal, sort by first name
        if (a.firstName < b.firstName) return -1;
        if (a.firstName > b.firstName) return 1;
        return 0;
      });
      
      return filteredList;
    },
    tshirtSizeTally() {
      const tally = this.filteredUsers.reduce((acc, user) => {
        const size = user.tShirtSize ? user.tShirtSize.toUpperCase().trim() : 'N/A';
      
        if (size){
          acc[size] = (acc[size] || 0) + 1;
        }
        return acc;
      }, {});

      const order = ['S', 'M', 'L', 'XL', '2XL', '3XL', 'N/A'];
      const orderedTally = {};
      let totalShirts = 0;

      order.forEach(key => {
        if (tally[key]) {
          orderedTally[key] = tally[key];
          // Only count actual sizes towards the order total
          if (key !== 'N/A') { 
            totalShirts += tally[key];
          }
        }
      });

      return {
        tally: orderedTally,
        totalShirts: totalShirts
      };
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
      // console.log('Attempting to toggle check-in for ID:', userId);
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
    },
    getDietaryRestriction(restriction){
      if(!restriction || restriction.toLowerCase() === 'none' || restriction.toLowerCase() === 'null'){
        return '';
      }

      const normalizedRestriction = restriction.toLowerCase();
      
      for (const term of ALLERGY_KEYWORDS) {
        if (normalizedRestriction.includes(term)) {
              return 'badge bg-danger text-white'; // Red
        }
      }

      for (const term of DIET_RESTRICTIONS){
        if(normalizedRestriction.includes(term)){
          return 'badge bg-warning text-dark';
        }
      }

      for (const term of RELIGIOUS_RESTRICTIONS) {
        if (normalizedRestriction.includes(term)) {
          return 'badge bg-info text-dark';
        }
      }

      return 'badge bg-danger text-white';
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

.tshirt-compact-row {
    background-color: #f8f9fa; /* Light background for visibility */
    border: 1px solid #dee2e6;
    padding: 8px 15px; /* Smaller padding */
    border-radius: 0.5rem;
    font-size: 0.9rem; /* Slightly smaller font */
    display: flex; /* Ensures flexible alignment */
    flex-wrap: nowrap; /* CRITICAL: Prevents wrapping to multiple lines */
    overflow-x: auto; /* Allows scrolling if the list gets too long */
}

.tshirt-compact-row h5 {
    font-size: 1.1rem; /* Adjust heading size */
    margin-bottom: 0;
    font-weight: 700;
}

/* Ensure the search bar is still positioned correctly below */
.mb-4 {
    margin-bottom: 1.5rem !important;
}

</style>

