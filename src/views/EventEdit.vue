<template>
  <div class="container mt-5">
    <h3 class="mb-4 text-center">Edit Event</h3>
    <form @submit.prevent="updateEvent" class="p-4 border rounded shadow-sm bg-light">
      <!-- Event Details -->
      <div class="row g-3">
        <div class="col-md-4">
          <label for="eventName" class="form-label">Event Name</label>
          <input
              type="text"
              id="eventName"
              v-model="event.eventName"
              class="form-control"
              placeholder="Enter the event name"
              required
          />
        </div>
        <div class="col-md-4">
          <label for="startDate" class="form-label">Start Date</label>
          <input type="date" id="startDate" v-model="event.startDate" class="form-control" required />
        </div>
        <div class="col-md-4">
          <label for="endDate" class="form-label">End Date</label>
          <input type="date" id="endDate" v-model="event.endDate" class="form-control" required />
        </div>
      </div>

      <!-- Activities Section -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <h4 class="mb-3">Activities</h4>
            <button type="button" class="btn btn-sm btn-primary" @click="openNewActivityModal">
              Add Activity
            </button>
          </div>
          <ul class="list-group">
            <li v-for="activity in activities" :key="activity.id" class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-1">{{ activity.activityName }}</h6>
                <small class="text-muted">Date: {{ formatDate(activity.activityDate) }}</small>
              </div>
              <button type="button" class="btn btn-sm btn-warning" @click="openEditModal(activity)">Edit</button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Hack Categories Section -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <h4 class="mb-3">Hack Categories</h4>
            <button type="button" class="btn btn-sm btn-primary" @click="openNewCategoryModal">
              Add Category
            </button>
          </div>
          <ul class="list-group">
            <li v-for="category in hackCategories" :key="category.id" class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-1">{{ category.categoryName }}</h6>
              </div>
              <button type="button" class="btn btn-sm btn-warning" @click="openEditCategoryModal(category)">Edit</button>
            </li>
          </ul>
        </div>
      </div>

      <div class="d-flex justify-content-between mt-4">
        <button type="submit" class="btn btn-success">Save Changes</button>
        <button type="button" class="btn btn-secondary" @click="$router.push({ name: 'EventList' })">Cancel</button>
      </div>
    </form>

    <!-- New Activity Modal -->
    <div v-if="showNewActivityModal" class="modal-container">
      <div class="modal-backdrop"></div>
      <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add New Activity</h5>
              <button type="button" class="btn-close" @click="closeNewActivityModal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="newActivityName" class="form-label">Activity Name</label>
                <input type="text" id="newActivityName" v-model="newActivity.activityName" class="form-control" />
              </div>
              <div class="mb-3">
                <label for="newActivityDate" class="form-label">Activity Date</label>
                <input type="datetime-local" id="newActivityDate" v-model="newActivity.activityDate" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="createActivity">Save</button>
              <button type="button" class="btn btn-secondary" @click="closeNewActivityModal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Activity Modal -->
    <div v-if="showEditModal" class="modal-container">
      <div class="modal-backdrop"></div>
      <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Activity</h5>
              <button type="button" class="btn-close" @click="closeEditModal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="editActivityName" class="form-label">Activity Name</label>
                <input type="text" id="editActivityName" v-model="currentActivity.activityName" class="form-control" />
              </div>
              <div class="mb-3">
                <label for="editActivityDate" class="form-label">Activity Date</label>
                <input type="datetime-local" id="editActivityDate" v-model="currentActivity.activityDate" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="saveActivity">Save</button>
              <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Hack Category Modal -->
    <div v-if="showNewCategoryModal" class="modal-container">
      <div class="modal-backdrop"></div>
      <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add New Hack Category</h5>
              <button type="button" class="btn-close" @click="closeNewCategoryModal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="newCategoryName" class="form-label">Category Name</label>
                <input type="text" id="newCategoryName" v-model="newCategory.categoryName" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="createCategory">Save</button>
              <button type="button" class="btn btn-secondary" @click="closeNewCategoryModal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Hack Category Modal -->
    <div v-if="showEditCategoryModal" class="modal-container">
      <div class="modal-backdrop"></div>
      <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Hack Category</h5>
              <button type="button" class="btn-close" @click="closeEditCategoryModal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="editCategoryName" class="form-label">Category Name</label>
                <input type="text" id="editCategoryName" v-model="currentCategory.categoryName" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="saveCategory">Save</button>
              <button type="button" class="btn btn-secondary" @click="closeEditCategoryModal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import store from "../store/store.js";

export default {
  name: 'EventEdit',
  props: ['id'],
  data() {
    return {
      event: { eventName: '', startDate: '', endDate: '' },
      activities: [],
      hackCategories: [],
      showEditModal: false,
      showEditCategoryModal: false,
      showNewActivityModal: false,
      showNewCategoryModal: false,
      currentActivity: {},
      currentCategory: {},
      newActivity: { activityName: '', activityDate: '' },
      newCategory: { categoryName: '' }
    };
  },
  created() {
    this.fetchEvent();
    this.fetchActivities();
    this.fetchHackCategories();
  },
  methods: {
    async updateEvent() {
      try {
        const updatedEvent = {
          id: this.id,
          eventName: this.event.eventName,
          startDate: new Date(this.event.startDate).toISOString(),
          endDate: new Date(this.event.endDate).toISOString()
        }
        await axios.put(`${store.state.apiBaseUrl}/event/update`, updatedEvent);
        this.$router.push({ name: 'Events' });
      } catch (e) {
        console.error('Error updating event:', e);
      }
    },
    async fetchEvent() {
      try {
        const response = await axios.get(`${store.state.apiBaseUrl}/event/${this.id}`);
        const event = response.data.event;
        this.event = {
          eventName: event.eventName,
          startDate: new Date(event.startDate).toISOString().split('T')[0],
          endDate: new Date(event.endDate).toISOString().split('T')[0]
        };
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    },
    async fetchActivities() {
      try {
        const response = await axios.get(`${store.state.apiBaseUrl}/event/activity/${this.id}`);
        this.activities = response.data.activities;
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    },
    async fetchHackCategories() {
      try {
        const response = await axios.get(`${store.state.apiBaseUrl}/event/category/${this.id}`);
        this.hackCategories = response.data.categories;
      } catch (error) {
        console.error('Error fetching hack categories:', error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    openEditModal(activity) {
      this.currentActivity = { ...activity, activityDate: new Date(activity.activityDate).toISOString().slice(0, 16) };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    async saveActivity() {
      try {
        await axios.put(`${store.state.apiBaseUrl}/event/activity`, this.currentActivity);
        await this.fetchActivities();
        this.closeEditModal();
      } catch (error) {
        console.error('Error saving activity:', error);
      }
    },
    openEditCategoryModal(category) {
      this.currentCategory = { ...category };
      this.showEditCategoryModal = true;
    },
    closeEditCategoryModal() {
      this.showEditCategoryModal = false;
    },
    async saveCategory() {
      try {
        await axios.put(`${store.state.apiBaseUrl}/event/category`, this.currentCategory);
        this.closeEditCategoryModal();
        await this.fetchHackCategories();
      } catch (error) {
        console.error('Error saving hack category:', error);
      }
    },
    openNewActivityModal() {
      this.newActivity = { activityName: '', activityDate: '', eventId: this.id };
      this.showNewActivityModal = true;
    },
    closeNewActivityModal() {
      this.showNewActivityModal = false;
    },
    async createActivity() {
      try {
        await axios.post(`${store.state.apiBaseUrl}/event/activity`, this.newActivity);
        await this.fetchActivities()
        this.closeNewActivityModal();
      } catch (error) {
        console.error('Error creating activity:', error);
      }
    },
    openNewCategoryModal() {
      this.newCategory = { categoryName: '', eventId: this.id };
      this.showNewCategoryModal = true;
    },
    closeNewCategoryModal() {
      this.showNewCategoryModal = false;
    },
    async createCategory() {
      try {
        await axios.post(`${store.state.apiBaseUrl}/event/category`, this.newCategory);
        await this.fetchHackCategories();
        this.closeNewCategoryModal();
      } catch (error) {
        console.error('Error creating category:', error);
      }
    }
  }
};
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Dark background with transparency */
  z-index: 1049;
}

.modal-dialog {
  z-index: 1051; /* Ensure it stays above the backdrop */
}
</style>
