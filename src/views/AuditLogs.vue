<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Audit Logs</h2>
    <!-- Create Activity Button -->
    <button @click="showSearchAuditLogsModal = true" class="btn btn-primary create-activity-btn">Search Filters</button>

    <!-- Table Section -->
    <div class="table-container shadow-lg rounded overflow-hidden">
      <div class="table-responsive">
        <!-- Search Input -->
        <div class="mb-4">
          <input type="text" v-model="searchQuery" class="form-control" placeholder="Search by action or table name..." />
        </div>
        <table class="table table-striped table-hover">
          <thead class="thead-light">
          <tr>
            <th class="text-center sortable" @click="sortBy('createdAt')">
              Date / Time
              <span v-if="sortKey === 'createdAt'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th class="text-center sortable" @click="sortBy('action')">
              Action
              <span v-if="sortKey === 'action'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th class="text-center sortable" @click="sortBy('tableName')">
              Table
              <span v-if="sortKey === 'tableName'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th class="text-center sortable" @click="sortBy('recordId')">
              Record ID
              <span v-if="sortKey === 'recordId'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th class="text-center sortable" @click="sortBy('userId')">
              User ID
              <span v-if="sortKey === 'userId'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th>Details</th> <!-- For view buttons -->
          </tr>
          </thead>

          <tbody>
          <tr v-if="getAuditLogs.length === 0">
            <td colspan="6" class="text-center">No audit logs</td>
          </tr>
          <tr v-for="log in sortedAuditLogs" :key="log.id" class="text-center">
            <td>{{ formatDateToEST(log.createdAt) }}</td>
            <td>{{ log.action }}</td>
            <td>{{ log.tableName }}</td>
            <td>{{ log.recordId }}</td>
            <td>{{ log.userId }}</td>
            <td class="text-center">
              <button @click="openViewDetailsModal(log)" class="btn btn-info btn-sm me-2">View</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Applying Search Filters -->
    <div v-if="showSearchAuditLogsModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Search Filters</h3>
        <form @submit.prevent="searchAuditLogs">
          <div class="form-group" style="margin-bottom: 10px">
            <label for="startDate">Start Date</label>
            <input type="datetime-local" id="startDate" v-model="filters.start" class="form-control" />
            <p v-if="errors.start" class="text-danger">{{ errors.start }}</p>
          </div>

          <div class="form-group" style="margin-bottom: 10px">
            <label for="endDate">End Date</label>
            <input type="datetime-local" id="endDate" v-model="filters.end" class="form-control" />
            <p v-if="errors.end" class="text-danger">{{ errors.end }}</p>
          </div>

          <div class="form-group" style="margin: 10px 0">
            <label for="action">Action</label>
            <select id="action" v-model="filters.action" class="form-control">
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
            </select>
            <p v-if="errors.action" class="text-danger">{{ errors.action }}</p>
          </div>

          <div class="form-group" style="margin: 10px 0">
            <label for="tableName">Table</label>
            <select id="tableName" v-model="filters.tableName" class="form-control">
              <option value="Event">Events</option>
              <option value="Activity">Activities</option>
              <option value="Hardware">Hardware</option>
              <option value="EventParticipant">Event Participants</option>
              <option value="Team">Teams</option>
              <option value="HackCategory">Hack Categories</option>
              <option value="Prize">Prizes</option>
              <option value="Sponsor">Sponsors</option>
              <option value="SponsorTier">Sponsor Tiers</option>
              <option value="EventSponsor">Event Sponsors</option>
              <option value="Image">Images</option>
              <option value="HardwareImage">Hardware Images</option>
            </select>
            <p v-if="errors.tableName" class="text-danger">{{ errors.tableName }}</p>
          </div>

          <div class="form-group" style="margin-bottom: 10px">
            <label for="user">User</label>
            <input type="number" :min="0" id="user" v-model="filters.userId" class="form-control" />
            <p v-if="errors.userId" class="text-danger">{{ errors.userId }}</p>
          </div>

          <div class="form-group" style="margin-bottom: 10px">
            <label for="limit">Limit</label>
            <input type="number" :min="1" :max="100" id="limit" v-model="filters.limit" class="form-control" />
            <p v-if="errors.limit" class="text-danger">{{ errors.limit }}</p>
          </div>

          <div class="form-group" style="margin: 10px 0">
            <label for="action">Sort</label>
            <select id="action" v-model="filters.action" class="form-control">
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
            <p v-if="errors.sort" class="text-danger">{{ errors.sort }}</p>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn btn-success">Search</button>
            <button type="button" class="btn btn-secondary" @click="showSearchAuditLogsModal = false; resetActivityForm()">Cancel</button>
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
import {formatDateToEST} from "@/utils/formatDate.js";

export default {
  name: "AuditLogs",
  data() {
    return {
      showSearchAuditLogsModal: false,
      showViewDetailsModal: false,
      sortKey: 'createdAt', // default column
      sortOrder: 'desc', // 'asc' or 'desc'
      searchQuery: '',
      filters: {
        tableName: '',
        userId: 0,
        action: '',
        start: '',
        end: '',
        sort: '',
        limit: 0
      },
      isLoading: false,
      errors: {},
      message: ''
    };
  },
  computed: {
    ...mapGetters(['getAuditLogs', 'UserRole']),
    sortedAuditLogs() {
      if (!this.getAuditLogs || this.getAuditLogs.length === 0) return [];

      //  ️Filter by search query
      const filtered = this.getAuditLogs.filter(a =>
          a.tableName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          a.action.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      // Sort the filtered results
      return [...filtered].sort((a, b) => {
        let aVal = a[this.sortKey];
        let bVal = b[this.sortKey];

        if (this.sortKey === 'createdAt') {
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
    this.fetchAuditLogs();
  },
  methods: {
    formatDateToEST,
    async fetchAuditLogs() {
      this.isLoading = true

      if (!this.filters.limit) this.filters.limit = 20;
      await store.dispatch('getAuditLogs', this.filters);

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
    async searchAuditLogs() {
      this.isLoading = true;

      const filtersToSend = {
        ...this.filters,
        start: this.filters.start ? new Date(this.filters.start).toISOString() : '',
        end: this.filters.end ? new Date(this.filters.end).toISOString() : '',
      };
      const result = await store.dispatch('getAuditLogs', filtersToSend);

      if (result.success) {
        this.showSearchAuditLogsModal = false;
      } else {
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
    openViewDetailsModal(log) {
      this.showViewDetailsModal = true;
    },
    resetSearchForm() {
      this.filters = {
        tableName: '',
        userId: 0,
        action: '',
        start: '',
        end: '',
        sort: '',
        limit: 0
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

.table {
  margin: 0;
  font-size: 0.875rem;
  min-width: 1200px;
}

/* Adjust column widths manually */
.table th:nth-child(1),
.table td:nth-child(1) {
  width: 25%; /* Date / Time column */
}

.table th:nth-child(2),
.table td:nth-child(2) {
  width: 15%; /* Action column */
}

.table th:nth-child(3),
.table td:nth-child(3) {
  width: 25%; /* Table Name column */
}

.table th:nth-child(4),
.table td:nth-child(4) {
  width: 10%; /* Record ID column */
}

.table th:nth-child(5),
.table td:nth-child(5) {
  width: 15%; /* User column */
}

.table th:nth-child(6),
.table td:nth-child(6) {
  width: 10%; /* Details column */
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
