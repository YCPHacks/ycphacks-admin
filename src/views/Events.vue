<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">All Events</h2>
    <!-- Create Event Button -->
    <button @click="showCreateEventModal = true" class="btn btn-primary create-event-btn">Create Event</button>

    <!-- Table Section -->
    <div class="table-container shadow-lg rounded overflow-hidden">
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="thead-light">
          <tr>
            <th class="text-left">Event</th>
            <th class="text-left">Start Date</th>
            <th class="text-left">End Date</th>
            <th class="text-center">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="events.length === 0">
            <td colspan="4" class="text-center">No events</td>
          </tr>
          <tr v-for="event in events" :key="event.id">
            <td>{{ event.eventName }}</td>
            <td>{{ event.startDate }}</td>
            <td>{{ event.endDate }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-warning" @click="navigateToEventEdit(event.id)">Edit</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Creating an Event -->
    <div v-if="showCreateEventModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Create Event</h3>
        <form @submit.prevent="createEvent">
          <div class="form-group">
            <label for="eventName">Event Name</label>
            <input type="text" id="eventName" v-model="newEvent.eventName" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="startDate">Start Date</label>
            <input type="date" id="startDate" v-model="newEvent.startDate" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="endDate">End Date</label>
            <input type="date" id="endDate" v-model="newEvent.endDate" class="form-control" required />
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn btn-success">Save</button>
            <button type="button" class="btn btn-secondary" @click="showCreateEventModal = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from "@/router/index.js";

export default {
  name: "Events",
  data() {
    return {
      events: [],
      showCreateEventModal: false,
      newEvent: {
        eventName: '',
        startDate: '',
        endDate: ''
      }
    };
  },
  created() {
    this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await axios.get('http://localhost:3000/event/all');
        this.events = response.data.events;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    },
    async createEvent() {
      try {
        await axios.post('http://localhost:3000/event/create', this.newEvent);
        await this.fetchEvents(); // Refresh events list
        this.showCreateEventModal = false; // Close modal
        this.newEvent = {eventName: '', startDate: '', endDate: ''}; // Reset form
      } catch (error) {
        console.error('Error creating event:', error);
      }
    },
    navigateToEventEdit(id) {
      // Navigate to the event edit page
      this.$router.push({ name: 'EventEdit', params: { id } });
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
</style>
