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
          <tr v-if="sortedAuditLogs.length === 0">
            <td colspan="6" class="text-center">No audit logs</td>
          </tr>
          <tr v-for="log in sortedAuditLogs" :key="log.id" class="text-center">
            <td>{{ formatDateToEST(log.createdAt) }}</td>
            <td>{{ toTitleCase(log.action) }}</td>
            <td>{{ log.tableName }}</td>
            <td>{{ log.recordId }}</td>
            <td>{{ log.userId ? log.userId : 'N/A' }}</td>
            <td class="text-center">
              <button @click="openViewDetailsModal(log)" class="btn btn-info btn-sm me-2">View</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <!-- Page size dropdown -->
      <div>
        <b-form-select
            id="limit"
            v-model="pagination.limit"
            :options="[5, 10, 25, 50, 100]"
            class="w-auto"
            @update:model-value="changeLimit"
        />
      </div>

      <!-- Pagination -->
      <div class="mt-3">
        <b-pagination
            v-model="pagination.page"
            :total-rows="pagination.totalCount"
            :per-page="pagination.limit"
            @update:model-value="searchAuditLogs"
        />
      </div>
    </div>

    <!-- Modal for Applying Search Filters -->
    <div v-if="showSearchAuditLogsModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Search Filters</h3>
        <form @submit.prevent="applyFilters">
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
            <label for="user">User ID</label>
            <input type="number" :min="0" id="user" v-model="filters.userId" class="form-control" />
            <p v-if="errors.userId" class="text-danger">{{ errors.userId }}</p>
          </div>

          <div class="form-group" style="margin: 10px 0">
            <label for="sort">Sort</label>
            <select id="sort" v-model="filters.sort" class="form-control">
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
            <p v-if="errors.sort" class="text-danger">{{ errors.sort }}</p>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline-secondary" style="margin-right: auto" @click="resetSearchForm">Clear</button>
            <button type="button" class="btn btn-secondary" @click="showSearchAuditLogsModal = false">Cancel</button>
            <button type="submit" class="btn btn-success">Search</button>
          </div>

          <p class="error">{{ message }}</p>
        </form>
      </div>
    </div>

    <!-- Modal for Viewing Log Details -->
    <div v-if="showViewDetailsModal" class="modal-overlay">
      <div class="modal-content w-auto" style="min-width: 50%">

        <!-- Title section -->
        <h5 class="mb-3">
          {{ toTitleCase(selectedLog.action) }} — {{ selectedLog.tableName }}
        </h5>

        <!-- Comparison grid -->
        <div class="row">
          <!-- Old Value Column -->
          <div class="col-6 border-end">
            <h6>Old Value</h6>
            <div v-if="selectedLog.oldValue">
              <div
                  v-for="key in filteredKeys(selectedLog.oldValue)"
                  :key="'old-' + key"
                  :class="['mb-1', isFieldUpdated(key) ? 'bg-warning-subtle' : '']"
              >
                <strong>{{ formatKey(key) }}:</strong> {{ formatValue(selectedLog.oldValue[key]) }}
              </div>
            </div>
            <div v-else class="text-muted">No previous data</div>
          </div>

          <!-- New Value Column -->
          <div class="col-6">
            <h6>New Value</h6>
            <div v-if="selectedLog.newValue">
              <div
                  v-for="key in filteredKeys(selectedLog.newValue)"
                  :key="'new-' + key"
                  :class="['mb-1', isFieldUpdated(key) ? 'bg-warning-subtle' : '']"
              >
                <strong>{{ formatKey(key) }}:</strong> {{ formatValue(selectedLog.newValue[key]) }}
              </div>
            </div>
            <div v-else class="text-muted">No new data</div>
          </div>
        </div>

        <div class="modal-actions mt-3 text-end">
          <button class="btn btn-secondary" @click="showViewDetailsModal = false">
            Close
          </button>
        </div>
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
import {BPagination} from "bootstrap-vue-3";

export default {
  name: "AuditLogs",
  components: {BPagination},
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
        sort: ''
      },
      pagination: {
        page: 1,
        limit: 10,
        totalCount: 0,
        totalPages: 0
      },
      selectedLog: {},
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
    this.searchAuditLogs();
  },
  methods: {
    formatDateToEST,
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    async searchAuditLogs() {
      console.log("HI");
      this.isLoading = true;
      this.message = '';
      this.errors = {};

      const requestPayload = {
        ...this.filters,
        start: this.filters.start ? new Date(this.filters.start).toISOString() : '',
        end: this.filters.end ? new Date(this.filters.end).toISOString() : '',
        page: this.pagination.page,
        limit: this.pagination.limit,
      };
      const result = await store.dispatch('getAuditLogs', requestPayload);

      if (result.success) {
        this.showSearchAuditLogsModal = false;
        this.pagination = result.pagination;
      } else {
        this.message = result.message;
        this.errors = result.errors || {};
      }

      this.isLoading = false;
    },
    applyFilters() {
      this.pagination.page = 1;
      this.showSearchAuditLogsModal = false;
      this.searchAuditLogs();
    },
    changeLimit() {
      this.pagination.page = 1;
      this.searchAuditLogs();
    },
    openViewDetailsModal(log) {
      this.selectedLog = log;
      this.showViewDetailsModal = true;
    },
    formatForDatetimeLocal(dateString) {
      const date = new Date(dateString);
      // Offset to local time and trim seconds and milliseconds
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16); // keeps "YYYY-MM-DDTHH:mm"
    },
    toTitleCase(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    formatKey(key) {
      return key
          .replace(/([A-Z])/g, ' $1')     // camelCase → camel Case
          .replace(/_/g, ' ')             // snake_case → snake case
          .trim()
          .replace(/^\w/, c => c.toUpperCase()); // capitalize first letter
    },
    formatValue(value) {
      if (value == null) return '—';

      // If it's a date string
      if (typeof value === 'string' && !isNaN(Date.parse(value))) {
        return this.formatDateToEST(value);
      }

      return value;
    },
    filteredKeys(obj) {
      if (!obj) return [];
      return Object.keys(obj).filter(k => k !== 'createdAt' && k !== 'updatedAt');
    },
    isFieldUpdated(key) {
      const oldVal = this.selectedLog.oldValue?.[key];
      const newVal = this.selectedLog.newValue?.[key];
      return oldVal !== undefined && newVal !== undefined && oldVal !== newVal;
    },
    resetSearchForm() {
      this.filters = {
        tableName: '',
        userId: 0,
        action: '',
        start: '',
        end: '',
        sort: '',
        limit: 20,
        page: 1
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
