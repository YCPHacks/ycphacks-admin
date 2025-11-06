<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">All Activities for {{ event.eventName || 'No Event Selected' }}</h2>
    <!-- Create Activity Button -->
    <button @click="showCreateActivityModal = true" class="btn btn-primary create-activity-btn">Create Activity</button>

    <!-- Table Section -->
    <div class="table-container shadow-lg rounded overflow-hidden">
      <div class="table-responsive">
        <!-- Search Input -->
        <div class="mb-4">
          <input type="text" v-model="searchQuery" class="form-control" placeholder="Search by activity name or description..." />
        </div>
        <table class="table table-striped table-hover">
          <thead class="thead-light">
          <tr>
            <th class="text-left sortable" @click="sortBy('activityName')">
              Activity
              <span v-if="sortKey === 'activityName'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th class="text-left sortable" @click="sortBy('activityDate')">
              Date
              <span v-if="sortKey === 'activityDate'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th class="text-center sortable" @click="sortBy('activityDescription')">
              Description
              <span v-if="sortKey === 'activityDescription'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th></th> <!-- For edit buttons -->
          </tr>
          </thead>

          <tbody>
          <tr v-if="getActivities.length === 0">
            <td colspan="4" class="text-center">No activities</td>
          </tr>
          <tr v-for="activity in sortedActivities" :key="activity.id">
            <td>{{ activity.activityName }}</td>
            <td>{{ activity.activityDate }}</td>
            <td>{{ activity.activityDescription }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-warning" @click="openUpdateActivityModal(activity)">Edit</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Creating an Activity -->
    <div v-if="showCreateActivityModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Create Activity</h3>
        <form @submit.prevent="createActivity">
          <div class="form-group" style="margin: 10px 0">
            <label for="activityName">Activity Name</label>
            <input type="text" id="activityName" v-model="activityForm.activityName" class="form-control" required />
            <p v-if="errors.activityName" class="text-danger">{{ errors.activityName }}</p>
          </div>

          <div class="form-group" style="margin-bottom: 10px">
            <label for="date">Date</label>
            <input type="datetime-local" id="date" v-model="activityForm.activityDate" class="form-control" required />
            <p v-if="errors.activityDate" class="text-danger">{{ errors.activityDate }}</p>
          </div>

          <div class="form-group" style="margin-bottom: 10px">
            <label for="activityDescription">Description</label>
            <textarea type="text" id="activityDescription" v-model="activityForm.activityDescription" class="form-control" required />
            <p v-if="errors.activityDescription" class="text-danger">{{ errors.activityDescription }}</p>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn btn-success">Save</button>
            <button type="button" class="btn btn-secondary" @click="showCreateActivityModal = false">Cancel</button>
          </div>

          <p class="error">{{ message }}</p>
        </form>
      </div>
    </div>

    <!-- Modal for Updating an Activity -->
    <div v-if="showUpdateActivityModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Update Activity</h3>
        <form @submit.prevent="updateActivity">
          <div class="form-group" style="margin: 10px 0">
            <label for="updateActivityName">Activity Name</label>
            <input type="text" id="updateActivityName" v-model="activityForm.activityName" class="form-control" required/>
            <p v-if="errors.activityName" class="text-danger">{{ errors.activityName }}</p>
          </div>

          <div class="form-group" style="margin-bottom: 10px">
            <label for="updateDate">Date</label>
            <input type="datetime-local" id="updateDate" v-model="activityForm.activityDate" class="form-control" required/>
            <p v-if="errors.activityDate" class="text-danger">{{ errors.activityDate }}</p>
          </div>

          <div class="form-group" style="margin-bottom: 10px">
            <label for="updateActivityDescription">Description</label>
            <textarea id="updateActivityDescription" v-model="activityForm.activityDescription" class="form-control" required></textarea>
            <p v-if="errors.activityDescription" class="text-danger">{{ errors.activityDescription }}</p>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn btn-success">Update</button>
            <button type="button" class="btn btn-secondary" @click="showUpdateActivityModal = false">Cancel</button>
          </div>

          <p class="error">{{ message }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from "@/router/index.js";
import store from "@/store/store.js";
import { mapGetters } from "vuex";

export default {
  name: "Activities",
  data() {
    return {
      showCreateActivityModal: false,
      showUpdateActivityModal: false,
      event: { // NOTE THIS IS TEMPORARY AND SHOULD BE REPLACED WITH A CALL TO THE BACKEND TO GET THE CORRECT EVENT
        id: 1,
        eventName: 'YCP Hacks 2025',
        startDate: new Date('2025-11-07T22:00:00.000Z'),
        endDate: new Date('2025-11-09T21:00:00.000Z'),
        canChange: true
      },
      sortKey: 'activityName', // default column
      sortOrder: 'asc',        // 'asc' or 'desc'
      searchQuery: '',
      activityForm: {
        id: null,
        eventId: 1, // Event ID
        activityName: '',
        activityDate: '',
        activityDescription: ''
      },
      isLoading: false,
      errors: {},
      message: ''
    };
  },
  computed: {
    ...mapGetters(['getActivities']),
    sortedActivities() {
      if (!this.getActivities || this.getActivities.length === 0) return [];

      //  ️Filter by search query
      const filtered = this.getActivities.filter(a =>
          a.activityName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          a.activityDescription.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      // Sort the filtered results
      return [...filtered].sort((a, b) => {
        let aVal = a[this.sortKey];
        let bVal = b[this.sortKey];

        if (this.sortKey === 'activityDate') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        if (aVal < bVal) return this.sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return this.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
  },
  created() {
    this.fetchActivities();
  },
  methods: {
    async fetchActivities() {
      this.isLoading = true

      await store.dispatch('getAllActivities', this.event.id);

      this.isLoading = false;
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    async createActivity() {
      this.isLoading = true;

      const activityToSend = {
        ...this.activityForm,
        activityDate: new Date(this.activityForm.activityDate).toISOString()
      };
      const result = await store.dispatch('createActivity', activityToSend);

      if (result.success) {
        await this.fetchActivities(); // Refresh activity list
        this.showCreateActivityModal = false; // Close modal
        this.resetActivityForm();
      }
      else {
        this.message = result.message;
        this.errors = result.errors;
      }

      if (!this.errors) this.errors = {};
      this.isLoading = false;
    },
    async updateActivity() {
      this.isLoading = true;

      const activityToSend = {
        id: this.currentActivityId,
        ...this.activityForm,
        activityDate: new Date(this.activityForm.activityDate).toISOString()
      };
      const result = await store.dispatch('updateActivity', activityToSend);

      if (result.success) {
        await this.fetchActivities(); // Refresh activity list
        this.showUpdateActivityModal = false; // Close modal
        this.resetActivityForm();
      }
      else {
        this.message = result.message;
        this.errors = result.errors;
      }

      if (!this.errors) this.errors = {};
      this.isLoading = false;
    },
    formatForDatetimeLocal(dateString) {
      const date = new Date(dateString);
      // Offset to local time and trim seconds and milliseconds
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16); // keeps "YYYY-MM-DDTHH:mm"
    },
    openUpdateActivityModal(activity) {
      this.activityForm = {
        ...activity,
        activityDate: this.formatForDatetimeLocal(activity.activityDate)
      };
      this.showUpdateActivityModal = true;
    },
    resetActivityForm() {
      this.activityForm = {
        id: null,
        eventId: 1,
        activityName: '',
        activityDate: '',
        activityDescription: ''
      };
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 100%;
  position: relative;
}

.create-activity-btn {
  position: absolute;
  top: 20px;
  right: 20px;
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
  min-width: 1200px;
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

.error {
  padding: 5px;
  color: red;
  text-align: center;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: #f5f5f5;
}
</style>
