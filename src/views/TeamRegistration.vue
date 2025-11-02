<template>
 <div class="container mt-5">
    <h2 class="mb-4 text-center">Team Registration</h2>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'Teams' }" @click="activeTab = 'Teams'">
          Teams
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'notInTeam' }" @click="activeTab = 'notInTeam'">
          Participants Not in Team
        </button>
      </li>
    </ul>

    <div class="row mt-4">
        <div class="col-md-12 mb-4">
            <h4 class="mb-3">
                {{ activeTab === 'Teams' ? 'Team List' : 'Unassigned Users' }}
            </h4>

            <div class="table-container shadow-lg rounded overflow-hidden">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="thead-light">
                            <tr>
                                <th v-for="header in tableHeaders" :key="header.key" class="text-left">
                                    {{ header.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="filteredTeamData.length === 0">
                                <!-- Colspan should match the number of dynamic headers -->
                                <td :colspan="tableHeaders.length" class="alert alert0info p-2 text-center">
                                    {{ activeTab === 'Teams' ? 'No Teams Available' : 'All participants are assigned to a team.' }}
                                </td>
                            </tr>
                            <tr 
                                v-for="(item, index) in filteredTeamData" 
                                :key="item.id || index" 
                                @click="openEditTeamForm(item)" 
                                style="cursor: pointer;"
                            >
                                <td v-for="header in tableHeaders" :key="header.key" class="text-center">
                                    <!-- Special handling for the 'Users' column on the Teams tab -->
                                    <span v-if="header.key === 'participants' && activeTab === 'Teams'">
                                        {{ formatParticipants(item.participants) }}
                                    </span>
                                    <!-- General case for all other fields -->
                                    <span v-else>
                                        {{ item[header.key] }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
 </div>
</template>

<script>
import axios from "axios";

export default{
    name: "TeamRegistration",
    data(){
        return {
            teams: [],
            users: [],
            unassignedUsers: [],
            activeTab: "Teams",

            showEditTeamForm: false,
            editTeamIndex: null,
            editTeamData: {},
            editTeamOriginalData: {},
            editTeamError: null
        }
    },
    computed:{
        isOscar(){
            return this.$store.getters.UserRole === 'oscar';
        },
        filteredTeamData() {
            if(this.activeTab === 'Teams'){
                return this.teams;
            }else if(this.activeTab === 'notInTeam'){
                return this.unassignedUsers;
            }
            return [];
        },
        tableHeaders() {
            if (this.activeTab === 'Teams') {
                // Headers for the Team List
                return [
                    { key: 'teamName', label: 'Team Name' },
                    { key: 'participants', label: 'Users' },
                    { key: 'projectName', label: 'Project Name' },
                    { key: 'projectDescription', label: 'Project Description' },
                    { key: 'presentationLink', label: 'Presentation Link' },
                    { key: 'githubLink', label: 'GitHub Link' },
                ];
            } else {
                // Headers for Unassigned Participants
                return [
                    { key: 'firstName', label: 'First Name' },
                    { key: 'lastName', label: 'Last Name' },
                    { key: 'email', label: 'Email Address' }
                ];
            }
        },
    },
    created() {
        this.fetchTeams();
        this.fetchUnassignedUsers();
    },
    methods: {
        async fetchTeams() {
            try{
                const response = await axios.get("http://localhost:3000/teams/all");
                this.teams = response.data.data;
            }catch(err){
                console.error("Error fetching teams: ", err);
            }
        },
        formatParticipants(participants){
            if(!participants || participants.length === 0){
                return 'No members assigned';
            }
            return participants.map(p => p.name || p.id).join(', ');
        },
        async fetchUnassignedUsers(){
            try{
                const res = await axios.get("http://localhost:3000/teams/unassignedParticipants");
                this.unassignedUsers = res.data.data;
            }catch(err){
                console.error("Error fetching unassigned users:", err);
            }
        }
    }
}
</script>

<style scoped>
.container {
  max-width: 100%;
  position: relative;
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
  table-layout: fixed;
  width: 100%;
}

.thead-light th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  vertical-align: middle;
  text-align: center;
  white-space: nowrap;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.mb-4 {
  margin-bottom: 1.5rem !important;
}
</style>