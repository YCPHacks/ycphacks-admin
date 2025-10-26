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

    <div v-if="showEditUserForm && isOscar" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit User: {{ editUserData.firstName }} {{ editUserData.lastName }}</h5>
            <button type="button" class="btn-close" @click="cancelEditUser"></button>
          </div>
          
          <div class="modal-body">
            <div v-if="editUserError" class="alert alert-danger">{{ editUserError }}</div>
            
            <form @submit.prevent="handleUpdateUser">
              <div class="mb-3">
                <label for="editFirstName" class="form-label">First Name</label>
                <input type="text" class="form-control" id="editFirstName" v-model="editUserData.firstName" required>
              </div>

              <div class="mb-3">
                <label for="editLastName" class="form-label">Last Name</label>
                <input type="text" class="form-control" id="editLastName" v-model="editUserData.lastName" required>
              </div>

              <div class="mb-3">
                <label for="editEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="editEmail" v-model="editUserData.email" required>
              </div>
              
              <div class="mb-3" v-if="isOscar">
                <label for="editRole" class="form-label">Role</label>
                
                <select 
                  class="form-select" 
                  id="editRole" 
                  v-model="editUserData.role"
                >
                  <option 
                      v-for="role in userRoles" 
                      :key="role.value" 
                      :value="role.value"
                  >
                      {{ role.text }}
                  </option>
                </select>
              </div>
              
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label for="editAge" class="form-label">Age</label>
                  <input type="number" class="form-control" id="editAge" v-model="editUserData.age">
                </div>
                <div class="col-md-4 mb-3">
                  <label for="editPhone" class="form-label">Phone Number</label>
                  <input type="text" class="form-control" id="editPhone" v-model="editUserData.phoneNumber">
                </div>
                <div class="col-md-4 mb-3">
                  <label for="editSchool" class="form-label">School</label>
                  <input type="text" class="form-control" id="editSchool" v-model="editUserData.school">
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="editTShirtSize" class="form-label">T-Shirt Size</label>
                  <select 
                      class="form-select" 
                      id="editTShirtSize" 
                      v-model="editUserData.tShirtSize"
                  >
                      <option 
                          v-for="size in tShirtSizes" 
                          :key="size.value" 
                          :value="size.value"
                      >
                          {{ size.text }}
                      </option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="editDietary" class="form-label">Dietary Restrictions</label>
                  <input type="text" class="form-control" id="editDietary" v-model="editUserData.dietaryRestrictions">
                </div>
              </div>
              
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="cancelEditUser">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEditUserForm && isOscar" class="modal-backdrop fade show"></div>

    <!-- Table Section -->
    <div class="table-container shadow-lg rounded overflow-hidden">
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="thead-light">
            <tr>
              <th class="text-left role-column-header" v-if="activeTab === 'all'">Role</th>
              <th class="text-left" v-if="activeTab === 'participant'">Checked In?</th>
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
            <tr v-for="(user, index) in filteredUsers" :key="user.id"
              @click="openEditUserForm(index)" style="cursor: pointer;">
              <!-- Add Check Boxes for Check in -->
               <td v-if="activeTab === 'all'" class="role-column">
                <div class="role-badge-wrapper">
                  <span 
                    class="badge role-badge text-center" 
                    :class="getRoleBadgeClass(user.role)"
                  >
                    {{ user.role.toUpperCase() }}
                  </span>
                </div>
              </td>
              <td class="text-center align-middle table-checkbox-center" v-if="activeTab === 'participant'">
                <input 
                  type="checkbox" 
                  :checked="user.checkIn" 
                  @change="toggleCheckIn(user.id)" 
                  @class.stop
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

      showEditUserForm: false,
      editUserIndex: null,
      editUserData: {},
      editUserOriginalData: {},
      editUserError: null,

      tShirtSizes: [
        { value: null, text: '-Select One-' },
        { value: "XS", text: 'XS' },
        { value: "S", text: 'S' },
        { value: "M", text: 'M' },
        { value: "L", text: 'L' },
        { value: "XL", text: 'XL' },
        { value: "2XL", text: '2XL' },
        { value: "3XL", text: '3XL' }
      ],
      userRoles: [
        { value: 'PARTICIPANT', text: 'Participant' },
        { value: 'STAFF', text: 'Staff' },
        { value: 'OSCAR', text: 'Oscar' }
      ]
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
          user.email.toLowerCase().includes(query) ||
          (user.tShirtSize && user.tShirtSize.toLowerCase().includes(query)) ||
          (user.dietaryRestrictions && user.dietaryRestrictions.toLowerCase().includes(query)) ||
          (user.school && user.school.toLowerCase().includes(query))
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
    },
    getRoleBadgeClass(role) {
      if (!role) return 'bg-secondary';
      
      const normalizedRole = role.toLowerCase().trim();
      
      switch (normalizedRole) {
        case 'oscar':
          // Highest authority, stands out immediately
          return 'bg-danger text-white'; 
        case 'staff':
          // Important, but secondary to Oscar
          return 'bg-primary text-white';
        case 'participant':
          return 'bg-success text-white'; 
        default:
          // Fallback for unexpected roles
          return 'bg-secondary text-white';
      }
    },
    openEditUserForm(index){
      const user = this.filteredUsers[index];

      const originalIndex = this.users.findIndex(u => u.id === user.id);

      if(originalIndex === -1){
        console.error("Could not find user in original array.")
        return;
      }

      this.editUserIndex = originalIndex;
      this.showEditUserForm = true;
      this.editUserError = null;

      const {password, mlhCodeOfConduct, mlhPrivaryPolicy, mlhEmails, ...editableData } = user
      this.editUserData = {...editableData};
      this.editUserOriginalData = { ... editableData };

      if (this.editUserData.role) {
        this.editUserData.role = this.editUserData.role.toUpperCase();
      }
    },
    async handleUpdateUser(){
      this.editUserError = null;

      const userId = this.editUserData.id;

      try{
        const payload ={
          firstName: this.editUserData.firstName,
          lastName: this.editUserData.lastName,
          age: this.editUserData.age,
          email: this.editUserData.email,
          phoneNumber: this.editUserData.phoneNumber,
          school: this.editUserData.school,
          tShirtSize: this.editUserData.tShirtSize,
          dietaryRestrictions: this.editUserData.dietaryRestrictions,
          role: this.editUserData.role,
        };

        await axios.put(`http://localhost:3000/user/${userId}`, payload);

        const userToUpdate = this.users[this.editUserIndex];
        if(userToUpdate){
          Object.assign(userToUpdate, this.editUserData);
        }
        this.showEditUserForm = false;
        this.editUserIndex = null;
      } catch (err) {
        console.error("Error updating user:", err);
        const errorMessage = err.response?.data?.message || err.response?.data?.error || "An unknown error occurred during user update.";
        this.editUserError = errorMessage;
      }
    },
    cancelEditUser() {
      this.showEditUserForm = false;
      this.editUserIndex = null;
      this.editUserError = null;
      this.editUserData = {};
    },
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
  table-layout: auto;
}

.table thead th.role-column-header{
  /* Apply shrink-wrap to header */
  width: 130px;
  white-space: nowrap;
  text-align: center;
  max-width: 130px;
}

.table tbody tr td.role-column {
  width: 130px;
  max-width: 130px;
  padding: 0.3rem 2px;
  white-space: nowrap;
  overflow: hidden;
  
  vertical-align: middle;
  text-align: center;
}

.table tbody tr td:last-child{
  width: 1px;
  white-space: nowrap;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.role-badge-wrapper {
  width: 130px;
  max-width: 130px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.badge.role-badge{
  /* padding: 0.1rem 2px !important; */
  padding-top: 0.1rem !important;
  padding-bottom: 0.1rem !important;
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
  font-size: 0.8em !important;
  display: block;
  white-space: nowrap !important;
  line-height: 1 !important;
  font-weight: 700 !important;
  margin: 0;
  text-align: center;
}

.table tbody tr td .badge{
  font-weight: normal;
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

