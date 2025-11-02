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
          Not in Team
        </button>
      </li>
    </ul>

    <div class="row mt-4">
        <div class="col-md-12 mb-4">
            <h4 class="mb-3">Team List</h4>

            <div class="table-container shadow-lg rounded overflow-hidden">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="thead-light">
                            <tr>
                                <th class="text-left">Team Name</th>
                                <th class="text-left">Users</th>
                                <th class="text-left">Project Name</th>
                                <th class="text-left">Presentation Link</th>
                                <th class="text-left">GitHub Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="teams.length === 0">
                                <td colspan="5" class="alert alert0info p-2 text-center">No Teams Available</td>
                            </tr>
                            <tr v-for="(teamData, index) in teams" :key="teamData.id || index" @click="openEditTeamForm(teamData)" style="cursor: pointer;">
                                <td class="text-center">{{ teamData.teamName }}</td>
                                <td class="text-center">{{ teamData.user }}</td>
                                <td class="text-center">{{ teamData.projectName }}</td>
                                <td class="text-center">{{ teamData.presentationLink }}</td>
                                <td class="text-center">{{ teamData.githubLink }}</td>
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

            editTeamData: {}
        }
    },
    created() {
        this.fetchTeams();
    },
    methods: {
        async fetchTeams() {
            try{
                const response = await axios.get("http://localhost:3000/teams/all");
                this.teams = response.data.data;
            }catch(err){
                console.error("Error fetching teams: ", err);
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
</style>