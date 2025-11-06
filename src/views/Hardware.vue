<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Hardware List</h2>

    <!-- Add Hardware Button -->
    <button @click="openAddModal" class="btn btn-primary add-hardware-btn">
      Add Hardware
    </button>

    <!-- Table Section -->
    <div class="table-container shadow-lg rounded overflow-hidden mt-3">
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="thead-light">
          <tr>
            <th class="text-left">Hardware Name</th>
            <th class="text-left">Serial Number</th>
            <th class="text-left">Functioning</th>
            <th class="text-left">Description</th>
            <th class="text-left">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="hardwareList.length === 0">
            <td colspan="4" class="text-center">No hardware available</td>
          </tr>
          <tr v-for="hardware in hardwareList" :key="hardware.id">
            <td>{{ hardware.name }}</td>
            <td>{{ hardware.serial }}</td>
            <td>{{ hardware.functional }}</td>
            <td>{{ hardware.description || "—" }}</td>
            <td>
              <button
                  @click="viewHardwareDetails(hardware)"
                  class="btn btn-info btn-sm me-2"
              >
                View
              </button>
              <button
                  @click="editHardware(hardware)"
                  class="btn btn-warning btn-sm me-2"
              >
                Edit
              </button>
              <button
                  @click="deleteHardware(hardware.id)"
                  class="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!--
        <div v-if="hardwareWithWhoHas.length > 0" class="table-container shadow-lg rounded overflow-hidden mt-5">
          <div class="table-responsive">
            <h4 class="text-center mt-3">Assigned Hardware</h4>
            <table class="table table-striped table-hover">
              <thead class="thead-light">
              <tr>
                <th class="text-left">Hardware Name</th>
                <th class="text-left">Serial Number</th>
                <th class="text-left">Assigned To</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="hardware in hardwareWithWhoHas" :key="hardware.id + '-owner'">
                <td>{{ hardware.name }}</td>
                <td>{{ hardware.serial }}</td>
                <td>{{ hardware.whoHasId }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
    -->

    <!-- Modal for Adding/Editing Hardware -->
    <div v-if="showHardwareModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? "Edit Hardware" : "Add Hardware" }}</h3>
        <form @submit.prevent="saveHardware">
          <div class="form-group">
            <label for="hardwareName">Hardware Name</label>
            <input
                type="text"
                id="hardwareName"
                v-model="hardwareForm.name"
                class="form-control"
                required
            />
          </div>
          <div class="form-group mt-2">
            <label for="hardwareSerial">Serial Number</label>
            <input
                type="text"
                id="hardwareSerial"
                v-model="hardwareForm.serial"
                class="form-control"
                required
            />
          </div>
          <div class="form-group mt-3">
            <label>Functional</label>
            <div class="btn-group d-flex" role="group">
              <button
                  type="button"
                  class="btn"
                  :class="hardwareForm.functional ? 'btn-success' : 'btn-outline-success'"
                  @click="hardwareForm.functional = true"
              >
                Yes
              </button>
              <button
                  type="button"
                  class="btn"
                  :class="!hardwareForm.functional ? 'btn-danger' : 'btn-outline-danger'"
                  @click="hardwareForm.functional = false"
              >
                No
              </button>
            </div>
          </div>
          <div class="form-group mt-2">
            <label for="hardwareDescription">Description</label>
            <textarea
                id="hardwareDescription"
                v-model="hardwareForm.description"
                class="form-control"
            ></textarea>
          </div>

          <!-- WhoHasId input -->
          <!--
          <div class="form-group mt-2">
            <label for="hardwareWhoHasID">Who Has ID</label>
            <input
                type="number"
                id="hardwareWhoHasID"
                v-model.number="hardwareForm.whoHasID"
                class="form-control"
                placeholder="Enter user ID or leave blank if unassigned"
            />
          </div>
          -->

          <div class="modal-actions mt-3">
            <button type="submit" class="btn btn-success me-2">
              {{ isEditing ? "Update" : "Save" }}
            </button>
            <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal for Viewing Hardware Details -->
    <div v-if="selectedHardware" class="modal-overlay">
      <div class="modal-content">
        <h3>Hardware Details</h3>
        <p><strong>Name:</strong> {{ selectedHardware.name }}</p>
        <p><strong>Serial Number:</strong> {{ selectedHardware.serial }}</p>
        <p><strong>Functional:</strong> {{ selectedHardware.functional }}</p>
        <p><strong>Description:</strong> {{ selectedHardware.description }}</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="selectedHardware = null">
            Close
          </button>
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
      showHardwareModal: false,
      isEditing: false,
      selectedHardware: null,
      hardwareForm: {
        id: null,
        name: "",
        serial: "",
        functional: true,
        description: "",
        // whoHasID: null,
      },
    };
  },
  created() {
    this.fetchHardwareList();
  },
  // computed: {
  //   hardwareWithWhoHas() {
  //     return this.hardwareList.filter(h => h.whoHasId && h.whoHasId !== "");
  //   },
  // },
  methods: {
    async fetchHardwareList() {
      try {
        const response = await axios.get("http://localhost:3000/hardware/admin");
        const rawData = response.data.hardware || response.data;

        this.hardwareList = rawData.map(item => ({
          id: item.hardwareId || item.id,
          name: item.hardwareName,
          serial: item.serial,
          functional: item.functional ?? true,
          description: item.description || "",
          // whoHasId: item.whoHasId || "",
        }));
      } catch (error) {
        console.error("Error fetching hardware:", error);
      }
    },

    openAddModal() {
      this.isEditing = false;
      this.resetForm();
      this.showHardwareModal = true;
    },

    editHardware(hardware) {
      this.isEditing = true;
      this.hardwareForm = { ...hardware };
      this.showHardwareModal = true;
    },

    async saveHardware() {
      try {
        const payload = {
          id: this.hardwareForm.id,
          name: this.hardwareForm.name,
          serial: this.hardwareForm.serial,
          functional: this.hardwareForm.functional,
          description: this.hardwareForm.description,
          // whoHasID: this.hardwareForm.whoHasID ? Number(this.hardwareForm.whoHasID) : null,
        };

        if (this.isEditing) {
          await axios.put(
              `http://localhost:3000/hardware/update/${this.hardwareForm.id}`,
              payload
          );
        } else {
          await axios.post("http://localhost:3000/hardware/add", payload);
        }
        await this.fetchHardwareList();
        this.closeModal();

      } catch (error) {
        console.error("Error saving hardware:", error);
      }
    },

    async deleteHardware(id) {
      if (!confirm("Are you sure you want to delete this hardware?")) return;
      try {
        await axios.delete(`http://localhost:3000/hardware/delete/${id}`);
        await this.fetchHardwareList();
      } catch (error) {
        console.error("Error deleting hardware:", error);
      }
    },

    viewHardwareDetails(hardware) {
      this.selectedHardware = hardware;
    },

    closeModal() {
      this.showHardwareModal = false;
      this.resetForm();
    },

    resetForm() {
      this.hardwareForm = {
        id: null,
        name: "",
        serial: "",
        functional: true,
        description: "",
        // whoHasID: null,
      };
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

.modal-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
