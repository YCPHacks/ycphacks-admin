<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Hardware List</h2>

    <!-- Add Hardware Button -->
    <button @click="showAddHardwareModal = true" class="btn btn-primary add-hardware-btn">Add Hardware</button>

    <!-- Table Section -->
    <div class="table-container shadow-lg rounded overflow-hidden">
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="thead-light">
          <tr>
            <th class="text-left">Hardware Name</th>
            <th class="text-left">Quantity</th>
            <th class="text-left">Status</th>
            <th class="text-left">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="hardwareList.length === 0">
            <td colspan="4" class="text-center">No hardware available</td>
          </tr>
          <tr v-for="hardware in hardwareList" :key="hardware.id">
            <td>{{ hardware.name }}</td>
            <td>{{ hardware.quantity }}</td>
            <td>{{ hardware.status }}</td>
            <td>
              <button @click="viewHardwareDetails(hardware)" class="btn btn-info btn-sm">View Details</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Adding Hardware -->
    <div v-if="showAddHardwareModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Add Hardware</h3>
        <form @submit.prevent="addHardware">
          <div class="form-group">
            <label for="hardwareName">Hardware Name</label>
            <input type="text" id="hardwareName" v-model="newHardware.name" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="hardwareQuantity">Quantity</label>
            <input type="number" id="hardwareQuantity" v-model="newHardware.quantity" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="hardwareStatus">Status</label>
            <select id="hardwareStatus" v-model="newHardware.status" class="form-control" required>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
          <div class="form-group">
            <label for="hardwareDescription">Description</label>
            <textarea id="hardwareDescription" v-model="newHardware.description" class="form-control"></textarea>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn btn-success">Save</button>
            <button type="button" class="btn btn-secondary" @click="showAddHardwareModal = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal for Viewing Hardware Details -->
    <div v-if="selectedHardware" class="modal-overlay">
      <div class="modal-content">
        <h3>Hardware Details</h3>
        <p><strong>Name:</strong> {{ selectedHardware.name }}</p>
        <p><strong>Quantity:</strong> {{ selectedHardware.quantity }}</p>
        <p><strong>Status:</strong> {{ selectedHardware.status }}</p>
        <p><strong>Description:</strong> {{ selectedHardware.description }}</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="selectedHardware = null">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HardwareTab",
  data() {
    return {
      hardwareList: [],
      showAddHardwareModal: false,
      newHardware: {
        name: "",
        quantity: 0,
        status: "Available",
        description: "",
      },
      selectedHardware: null,
    };
  },
  created() {
    this.fetchHardwareList();
  },
  methods: {
    async fetchHardwareList() {
      try {
        const response = await axios.get("http://localhost:3000/hardware/all");
        this.hardwareList = response.data.hardware;
      } catch (error) {
        console.error("Error fetching hardware:", error);
      }
    },
    async addHardware() {
      try {
        const payload = { ...this.newHardware };
        await axios.post("http://localhost:3000/hardware/add", payload);

        this.fetchHardwareList(); // Refresh list
        this.showAddHardwareModal = false; // Close modal
        this.newHardware = { name: "", quantity: 0, status: "Available", description: "" }; // Reset form
      } catch (error) {
        console.error("Error adding hardware:", error);
      }
    },
    viewHardwareDetails(hardware) {
      this.selectedHardware = hardware;
    },
  },
};
</script>

<style scoped>
.add-hardware-btn {
  float: right;
  margin-bottom: 10px;
}

.table-container {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.table th {
  background: #e9ecef;
  color: #495057;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
