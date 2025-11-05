<template>
    <div class="container mt-5">
        <h2 class="mb-4 text-center">Team Registration</h2>

        <div class="d-flex justify-content-end gap-2 mb-3">
            <!-- Add Team Button -->
            <div class="text-end mb-3">
                <button class="btn btn-primary" @click="toggleAddForm">
                    Add Team
                </button>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-md-12 mb-4">
                <h4 class="mb-3">
                    Team List
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
                                        No Teams Available
                                    </td>
                                </tr>
                                <tr 
                                    v-for="(item, index) in filteredTeamData" 
                                    :key="item.id || index" 
                                    @click="openEditTeamForm(item)" 
                                    style="cursor: pointer;"
                                >
                                    <td v-for="header in tableHeaders" :key="header.key" class="text-center">
                                        <span v-if="header.key === 'participants'">
                                            {{ formatParticipants(item.participants) }}
                                        </span>
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

        <!-- Add New Team Modal -->
        <div v-if="showAddForm" class="popup-overlay">
            <div class="card p-4 popup">
                <header class="mb-4 text-center border-bottom pb-3">
                    <h5>Add New Team</h5>
                </header>

                <!-- Error/Success Alert Structure -->
                <div v-if="error || success" :class="['alert p-2 mb-3', error ? 'alert-danger' : 'alert-success']" role="alert">
                    <i class="bi bi-info-circle-fill"></i> {{ error || success }}
                </div>

                <form @submit.prevent="handleAddTeam">
                    <div v-if="addFormError" class="alert alert-danger p-2 mb-3">
                        <i class="bi bi-exclamation-triangle-fill"></i> {{ addFormError }}
                    </div>
                    
                    <!-- Team Name (Fixed v-model) -->
                    <div class="mb-3">
                        <label class="form-label">Team Name *</label>
                        <input v-model="formData.teamName" type="text" class="form-control" required />
                    </div>
                    
                    <!-- Project Name (Fixed v-model) -->
                    <div class="mb-3">
                        <label class="form-label">Project Name</label>
                        <input v-model="formData.projectName" type="text" class="form-control"/>
                    </div>
                    
                    <!-- Project Description (Fixed v-model) -->
                    <div class="mb-3">
                        <label class="form-label">Project Description</label>
                        <textarea v-model="formData.projectDescription" class="form-control"></textarea>
                    </div>
                    
                    <!-- Presentation Link (Fixed v-model) -->
                    <div class="mb-3">
                        <label class="form-label">Presentation Link</label>
                        <input v-model="formData.presentationLink" type="text" class="form-control"/>
                    </div>
                    
                    <!-- GitHub Link (Fixed v-model) -->
                    <div class="mb-3">
                        <label class="form-label">GitHub Link</label>
                        <input v-model="formData.gitHubLink" type="text" class="form-control"/>
                    </div>
                    
                    <!-- Participants Selection -->
                    <div class="mb-4">
                        <label class="form-label">Initial Participants (Select {{ MIN_PARTICIPANTS }} or more) *</label>
                        
                        <div v-if="loading && showAddForm" class="text-info fst-italic">Loading participants...</div>
                        
                        <div v-else-if="checkedInUnassignedUsers.length > 0">
                            <select 
                                v-model="selectedParticipantsIds" 
                                multiple 
                                class="form-control"
                                required
                                :size="Math.min(10, checkedInUnassignedUsers.length + 1)"
                            >
                                <option 
                                    v-for="p in checkedInUnassignedUsers" 
                                    :key="p.id" :value="p.id" >
                                    {{ formatParticipants(p) }}
                                </option>
                            </select>
                            <div class="form-text text-muted">Hold Ctrl (Cmd on Mac) to select multiple participants.</div>
                        </div>
                        
                        <p v-else class="text-muted small p-2 bg-light rounded">
                            No unassigned participants available to form a new team.
                        </p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-secondary" @click="handleCancel">
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            class="btn btn-success"
                            :disabled="loading || !isTeamMinMet"
                        >
                            <span v-if="loading">Submitting...</span>
                            <span v-else>Submit</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

const API_BASE_URL = 'http://localhost:3000';

export default{
    name: "TeamRegistration",
    data(){
        return {
            teams: [],
            users: [],
            unassignedUsers: [],

            showEditTeamForm: false,
            editTeamIndex: null,
            editTeamData: {},
            editTeamOriginalData: {},
            editTeamError: null,

            showAddForm: false, // Controls modal visibility
            addFormError: false,
            showRemoveForm: false,
            formData: {
                teamName: '',
                projectName: '',
                projectDescription: '',
                presentationLink: '',
                gitHubLink: '',
                eventId: 1, // Placeholder
            },
            selectedParticipantsIds: [], // Participants currently selected in the form
            loading: false,
            error: null, // Error message for the Add Form
            success: null, // Success message for the Add Form
            MIN_PARTICIPANTS: 1,
            VISUAL_SLOTS: 4,
        }
    },
    computed:{
        isOscar(){
            return this.$store.getters.UserRole === 'oscar';
        },
        filteredTeamData() {
            // Since tabs are removed, this always returns teams
            return this.teams;
        },
        tableHeaders() {
            // Since tabs are removed, this always returns the Team List headers
            return [
                { key: 'teamName', label: 'Team Name' },
                { key: 'participants', label: 'Users' },
                { key: 'projectName', label: 'Project Name' },
                { key: 'projectDescription', label: 'Project Description' },
                { key: 'presentationLink', label: 'Presentation Link' },
                { key: 'githubLink', label: 'GitHub Link' },
            ];
        },
        checkedInUnassignedUsers(){
            // Retained for use in the Add Team modal
            return this.unassignedUsers;
        },
        isTeamMinMet() {
            return this.selectedParticipantsIds.length >= this.MIN_PARTICIPANTS;
        },
        visualSlots() {
            const totalSlots = Math.max(this.VISUAL_SLOTS, this.selectedParticipantsIds.length);
            // Create an array of nulls and map over it to insert participants
            return Array(totalSlots).fill(null).map((_, index) => this.selectedParticipantsIds[index] || null);
        },
    },
    created() {
        this.fetchTeams();
        this.fetchUnassignedUsers();
    },
    methods: {
        async fetchTeams() {
            try{
                const response = await axios.get(`${API_BASE_URL}/teams/all`);
                this.teams = response.data.data;
            }catch(err){
                console.error("Error fetching teams: ", err);
            }
        },
        formatParticipants(participants){
            if (!participants) {
                return 'No members assigned';
            }

            let participantsArray = participants;
            
            if (!Array.isArray(participants) && typeof participants === 'object') {
                participantsArray = [participants];
            }else if (!Array.isArray(participants)) {
                console.warn("Participants data received in an unexpected non-array, non-object format:", participants);
                return 'Data error';
            }
            
            if (participantsArray.length === 0) {
                return 'No members assigned';
            }

            return participantsArray.map(p => {
                const firstName = p?.firstName || '';
                const lastName = p?.lastName || '';
                const name = p?.name;
                const id = p?.id;

                if (firstName && lastName) {
                    return `${firstName} ${lastName}`;
                }
                if (name) {
                    return name;
                }
                return `ID: ${id || 'Unknown'}`;
            }).join(', ');
        },
        async fetchUnassignedUsers(){
            try{
                const res = await axios.get(`${API_BASE_URL}/teams/unassignedParticipants`);
                
                this.unassignedUsers = res.data.data.map(participant => {
                    return {
                        id: participant.id,
                        firstName: participant.firstName,
                        lastName: participant.lastName,
                        email: participant.email,
                        checkIn: participant.checkIn === true || participant.checkIn === 1, 
                    };
                });
            }catch(err){
                console.error("Error fetching unassigned users:", err);
            }
        },
        openEditTeamForm(item) {
          // Placeholder for your existing edit logic
          console.log("Opening edit form for:", item);
        },

        // --- Add Team Modal Methods ---

        async toggleAddForm() {
            this.showAddForm = true;
            this.addFormError = null;
            this.showRemoveForm = false;

            this.loading = true; 
            await this.fetchUnassignedUsers();
            this.loading = false;
        },
        handleCancel() {
            // Reset form state and close modal
            this.formData = {
                teamName: '',
                projectName: '',
                projectDescription: '',
                presentationLink: '',
                gitHubLink: '',
                eventId: 1,
            };
            this.selectedParticipantsIds = [];
            this.loading = false;
            this.showAddForm = false;
            this.addFormError = null; 
        },
        async handleAddTeam() {
            this.addFormError = null;
            this.error = null;
            this.success = null;
            
            // Client-side validation: Check minimum participants
            if (!this.isTeamMinMet) {
                this.addFormError = `Team must have at least ${this.MIN_PARTICIPANTS} participant(s).`;
                return;
            }
            
            this.loading = true;

            // Prepare the payload
            const teamPayload = {
                ...this.formData,
                // Send only the User IDs for assignment
                participantIds: this.selectedParticipantsIds, 
            };

            try {
                // --- Actual API Call (Uncomment when API is ready) ---
                const response = await axios.post(`${API_BASE_URL}/teams/create`, teamPayload);
                
                // --- Mock API success for demonstration ---
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                
                this.success = `Team '${this.formData.teamName}' successfully registered and ${teamPayload.participantIds.length} members assigned!`;
                
                // Re-fetch the data to update the lists
                this.fetchTeams();
                this.fetchUnassignedUsers();

                // Close the form after a short delay to show the success message
                setTimeout(() => {
                    this.handleCancel(); 
                    this.success = null; 
                }, 1500);

            } catch (err) {
                console.error("Error adding team: ", err);
                this.error = err.response?.data?.message || err.response?.data?.error || "Failed to register team. Please check the form and try again.";
            } finally {
                this.loading = false;
            }
        },
    }
}
</script>

<style scoped>
.container {
  max-width: 100%;
  position: relative;
}

/* Removed nav-tabs and nav-link styles as tabs are gone */

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

.btn {
  font-size: 0.875rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.popup {
  max-width: 400px;
  width: 100%;

  max-height: 90vh;
  overflow-y: auto;

  padding-bottom: 20px;
}
</style>
