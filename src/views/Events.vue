<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">All Events</h2>
    <!-- Create Event Button -->
    <button v-if="UserRole ==='oscar'" @click="showCreateEventModal = true" class="btn btn-primary create-event-btn">Create Event</button>

    <!-- Table Section -->
    <div class="table-container shadow-lg rounded overflow-hidden">
      <div class="table-responsive">
        <!-- Search Input -->
        <div class="mb-4">
          <input type="text" v-model="searchQuery" class="form-control" placeholder="Search by event name..." />
        </div>
        <table class="table table-striped table-hover">
          <thead class="thead-light">
          <tr>
            <th class="text-left sortable" @click="sortBy('isActive')">
              Active?
              <span v-if="sortKey === 'isActive'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th class="text-left sortable" @click="sortBy('eventName')">
              Event
              <span v-if="sortKey === 'eventName'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th class="text-center sortable" @click="sortBy('startDate')">
              Start Date
              <span v-if="sortKey === 'startDate'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th class="text-center sortable" @click="sortBy('endDate')">
              End Date
              <span v-if="sortKey === 'endDate'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th>Actions</th> <!-- For edit buttons -->
          </tr>
          </thead>

          <tbody>
          <tr v-if="getEvents.length === 0">
            <td colspan="4" class="text-center">No events</td>
          </tr>
          <tr v-for="event in sortedEvents" :key="event.id" style="text-align: center;">
            <td>{{ event.isActive ? '✅' : '' }}</td>
            <td>{{ event.eventName }}</td>
            <td>{{ event.startDate }}</td>
            <td>{{ event.endDate }}</td>
            <td class="text-center">
              <button @click="openViewEventModal(event)" class="btn btn-info btn-sm me-2">View</button>
              <button v-if="UserRole ==='oscar'" class="btn btn-sm btn-warning" @click="openUpdateEventModal(event)">Edit</button>
              <button v-if="UserRole === 'oscar'" class="btn btn-sm btn-danger" style="margin-left: 0.5rem;" @click="openDeleteEventModal(event)">Delete</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Viewing Event Details -->
    <div v-if="showViewEventModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Event Details</h3>
        <p><strong>Name:</strong> {{ eventForm.eventName }}</p>
        <p><strong>Start Date:</strong> {{ eventForm.startDate }}</p>
        <p><strong>End Date:</strong> {{ eventForm.endDate }}</p>
        <p><strong>Can Change:</strong> {{ eventForm.canChange ? 'Yes' : 'No' }}</p>
        <p><strong>Active:</strong> {{ eventForm.isActive ? 'Yes' : 'No' }}</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showViewEventModal = false; resetEventForm()">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for Creating an Event -->
    <div v-if="showCreateEventModal && UserRole === 'oscar'" class="modal-overlay">
      <div class="modal-content">
        <h3>Create Event</h3>
        <form @submit.prevent="createEvent">
          <div class="form-group" style="margin: 10px 0">
            <label for="eventName">Event Name</label>
            <input type="text" id="eventName" v-model="eventForm.eventName" class="form-control" required />
            <p v-if="errors.eventName" class="text-danger">{{ errors.eventName }}</p>
          </div>

          <div class="form-group" style="margin-bottom: 10px">
            <label for="startDate">Start Date</label>
            <input type="datetime-local" id="startDate" v-model="eventForm.startDate" class="form-control" required />
            <p v-if="errors.startDate" class="text-danger">{{ errors.startDate }}</p>
          </div>

          <div class="form-group" style="margin-bottom: 10px">
            <label for="endDate">End Date</label>
            <input type="datetime-local" id="startDate" v-model="eventForm.endDate" class="form-control" required />
            <p v-if="errors.endDate" class="text-danger">{{ errors.endDate }}</p>
          </div>

          <div class="form-group" style="margin-bottom: 10px">
            <input type="checkbox" id="canChange" v-model="eventForm.canChange" />
            <label for="canChange">Can Change</label>
            <p v-if="errors.canChange" class="text-danger">{{ errors.canChange }}</p>
          </div>

          <div class="form-group" style="margin-bottom: 10px">
            <input type="checkbox" id="isActive" v-model="eventForm.isActive" />
            <label for="isActive">Active?</label>
            <p v-if="errors.isActive" class="text-danger">{{ errors.isActive }}</p>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn btn-success">Save</button>
            <button type="button" class="btn btn-secondary" @click="showCreateEventModal = false; resetEventForm()">Cancel</button>
          </div>

          <p class="error">{{ message }}</p>
        </form>
      </div>
    </div>

    <!-- Modal for Updating an Event -->
    <div v-if="showUpdateEventModal && UserRole === 'oscar'" class="modal-overlay">
      <div class="modal-content">
        <h3>Update Event</h3>
        <form @submit.prevent="updateEvent">
          <div class="form-group" style="margin: 10px 0">
            <label for="eventName">Event Name</label>
            <input type="text" id="eventName" v-model="eventForm.eventName" class="form-control" required />
            <p v-if="errors.eventName" class="text-danger">{{ errors.eventName }}</p>
          </div>

          <div class="form-group" style="margin-bottom: 10px">
            <label for="startDate">Start Date</label>
            <input type="datetime-local" id="startDate" v-model="eventForm.startDate" class="form-control" required />
            <p v-if="errors.startDate" class="text-danger">{{ errors.startDate }}</p>
          </div>

          <div class="form-group" style="margin-bottom: 10px">
            <label for="endDate">End Date</label>
            <input type="datetime-local" id="startDate" v-model="eventForm.endDate" class="form-control" required />
            <p v-if="errors.endDate" class="text-danger">{{ errors.endDate }}</p>
          </div>

          <div class="form-group" style="margin-bottom: 10px">
            <input type="checkbox" id="canChange" v-model="eventForm.canChange" />
            <label for="canChange">Can Change</label>
            <p v-if="errors.canChange" class="text-danger">{{ errors.canChange }}</p>
          </div>

          <div class="form-group" style="margin-bottom: 10px">
            <input type="checkbox" id="isActive" v-model="eventForm.isActive" />
            <label for="isActive">Active?</label>
            <p v-if="errors.isActive" class="text-danger">{{ errors.isActive }}</p>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn btn-success">Update</button>
            <button type="button" class="btn btn-secondary" @click="showUpdateEventModal = false; resetEventForm()">Cancel</button>
          </div>

          <p class="error">{{ message }}</p>
        </form>
      </div>
    </div>

    <!-- Modal for Deleting an Event -->
    <div v-if="showDeleteEventModal && UserRole === 'oscar'" class="modal-overlay">
      <div class="modal-content">
        <h5>Delete Event</h5>
        <form @submit.prevent="deleteEvent">
          <p class="alert alert-warning">
            <strong>⚠️ Are you absolutely sure?</strong>
            This will permanently delete the event and cannot be undone.
          </p>

          <p>Please confirm the name of the event you wish to delete:</p>
          <div class="mb-2">
            <label class="form-label">Name</label>
            <input v-model="eventForm.eventName" type="text" class="form-control" />
          </div>

          <transition name="fade">
            <p v-if="eventForm.eventName === deleteEventName" class="alert alert-warning">
              <strong>⚠️ Warning:</strong> Deleting this item will also remove all related records,
              including activities, prizes, hack categories, and other associated data!
            </p>
          </transition>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="showDeleteEventModal = false;">Cancel</button>
            <button type="submit" class="btn btn-danger" :disabled="!eventForm.eventName || eventForm.eventName !== deleteEventName">Delete</button>
          </div>
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
  name: "Events",
  data() {
    return {
      showViewEventModal: false,
      showCreateEventModal: false,
      showUpdateEventModal: false,
      showDeleteEventModal: false,
      sortKey: 'eventName', // default column
      sortOrder: 'asc',        // 'asc' or 'desc'
      searchQuery: '',
      eventForm: {
        id: null,
        eventName: '',
        startDate: '',
        endDate: '',
        canChange: false,
        isActive: false
      },
      deleteEventName: '',
      isLoading: false,
      errors: {},
      message: ''
    };
  },
  computed: {
    ...mapGetters(['getEvents', 'UserRole']),
    sortedEvents() {
      if (!this.getEvents || this.getEvents.length === 0) return [];

      //  ️Filter by search query
      const filtered = this.getEvents.filter(a =>
          a.eventName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          a.eventDescription.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      // Sort the filtered results
      return [...filtered].sort((a, b) => {
        let aVal = a[this.sortKey];
        let bVal = b[this.sortKey];

        if (this.sortKey === 'eventDate') {
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
    this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      this.isLoading = true

      await store.dispatch('getAllEvents');

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
    async createEvent() {
      this.isLoading = true;

      const eventToSend = {
        ...this.eventForm,
        startDate: new Date(this.eventForm.startDate).toISOString(),
        endDate: new Date(this.eventForm.endDate).toISOString()
      };
      const result = await store.dispatch('createEvent', eventToSend);

      if (result.success) {
        await this.fetchEvents(); // Refresh event list
        this.showCreateEventModal = false; // Close modal
        this.resetEventForm();
      }
      else {
        this.message = result.message;
        this.errors = result.errors;
      }

      if (!this.errors) this.errors = {};
      this.isLoading = false;
    },
    async updateEvent() {
      this.isLoading = true;

      const eventToSend = {
        ...this.eventForm,
        startDate: new Date(this.eventForm.startDate).toISOString(),
        endDate: new Date(this.eventForm.endDate).toISOString()
      };
      const result = await store.dispatch('updateEvent', eventToSend);

      if (result.success) {
        await this.fetchEvents(); // Refresh event list
        this.showUpdateEventModal = false; // Close modal
        this.resetEventForm();
      }
      else {
        this.message = result.message;
        this.errors = result.errors;
      }

      if (!this.errors) this.errors = {};
      this.isLoading = false;
    },
    async deleteEvent() {
      this.isLoading = true;

      if (this.eventForm.eventName === this.deleteEventName) {
        const result = await store.dispatch('deleteEvent', this.eventForm.id);

        if (result.success) {
          await this.fetchEvents(); // Refresh event list
          this.showDeleteEventModal = false; // Close modal
          this.resetEventForm();
          this.deleteEventName = '';
        } else {
          this.message = result.message;
        }
      }

      this.isLoading = false;
    },
    formatForDatetimeLocal(dateString) {
      const date = new Date(dateString);
      // Offset to local time and trim seconds and milliseconds
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16); // keeps "YYYY-MM-DDTHH:mm"
    },
    openViewEventModal(event) {
      this.eventForm = {
        ...event
      };
      this.showViewEventModal = true;
    },
    openUpdateEventModal(event) {
      this.eventForm = {
        ...event,
        startDate: this.formatForDatetimeLocal(event.startDate),
        endDate: this.formatForDatetimeLocal(event.endDate)
      };
      this.showUpdateEventModal = true;
    },
    openDeleteEventModal(event) {
      this.deleteEventName = event.eventName;
      this.eventForm.id = event.id;
      this.showDeleteEventModal = true;
    },
    resetEventForm() {
      this.eventForm = {
        id: null,
        eventId: 1,
        eventName: '',
        eventDate: '',
        eventDescription: ''
      };

      this.errors = {};
      this.message = '';
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 100%;
  position: relative;
}

.create-event-btn {
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
  width: 10%; /* Active column */
}

.table th:nth-child(2),
.table td:nth-child(2) {
  width: 25%; /* Event column */
}

.table th:nth-child(3),
.table td:nth-child(3) {
  width: 25%; /* Start Date column */
}

.table th:nth-child(4),
.table td:nth-child(4) {
  width: 25%; /* End Date column */
}

.table th:nth-child(5),
.table td:nth-child(5) {
  width: 15%; /* Actions column */
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
