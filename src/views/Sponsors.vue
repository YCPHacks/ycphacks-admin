<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Our Sponsors</h2>

    <div class="d-flex justify-content-end gap-2 mb-3">
        <!-- Add Sponsor Button -->
        <div class="text-end mb-3">
          <button class="btn btn-primary" @click="toggleAddForm">
            Add Sponsor
          </button>
        </div>

        <!-- Remove Sponsor Button -->
        <div class="text-end mb-3">
            <button class="btn btn-primary" @click="toggleRemoveForm">
                Remove Sponsor
            </button>
        </div>
    </div>

    <!-- Add Sponsor Form -->
    <div v-if="showAddForm" class="card p-3 mb-3">
      <h5>Add Sponsor</h5>
      <form @submit.prevent="addSponsor">
        <div class="mb-2">
          <label class="form-label">Name</label>
          <input v-model="addName" type="text" class="form-control" required />
        </div>
        <div class="mb-2">
          <label class="form-label">Tier</label>
          <input v-model="addTier" type="text" class="form-control" required />
        </div>
        <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" @click="showAddForm = false">
                Cancel
            </button>
            <button type="submit" class="btn btn-success">Submit</button>
         </div>
      </form>
    </div>

    <!-- Remove Sponsor Form -->
    <div v-if="showRemoveForm" class="card p-3 mb-3">
      <h5>Remove Sponsor</h5>
      <form @submit.prevent="removeSponsor">
        <div class="mb-2">
          <label class="form-label">Name</label>
          <input v-model="removeName" type="text" class="form-control" required />
        </div>
        <button type="button" class="btn btn-secondary" @click="showAddForm = false">
            Cancel
        </button>
        <button type="submit" class="btn btn-danger">Submit</button>
      </form>
    </div>

    <!-- Table Section -->
    <div class="table-container shadow-lg rounded overflow-hidden">
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="thead-light">
          <tr>
            <th class="text-left">Sponsor Name</th>
            <th class="text-left">Sponsor Tier</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="sponsors.length === 0">
            <td colspan="3" class="text-center">No sponsors available</td>
          </tr>
          <tr v-for="(sponsor, index) in sponsors" :key="index">
            <td class="text-center">{{ sponsor.name }}</td>
            <td class="text-center">{{ sponsor.tier }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

// List of sponsors
const sponsors = reactive([
  { name: "Sponsor A", tier: "Gold" },
  { name: "Sponsor B", tier: "Silver" },
  { name: "Sponsor C", tier: "Bronze" },
  { name: "Sponsor D", tier: "Platinum" },
]);

// Form state
const addName = ref("");
const addTier = ref("");
const removeName = ref("");
const showAddForm = ref(false);
const showRemoveForm = ref(false);

// Toggle forms
const toggleAddForm = () => {
  showAddForm.value = true;
  showRemoveForm.value = false;
};

const toggleRemoveForm = () => {
  showRemoveForm.value = true;
  showAddForm.value = false;
};

// Add sponsor
const addSponsor = () => {
  sponsors.push({ name: addName.value, tier: addTier.value });
  addName.value = "";
  addTier.value = "";
  showAddForm.value = false; // hide form after submit
};

// Remove sponsor
const removeSponsor = () => {
  const index = sponsors.findIndex((s) => s.name === removeName.value);
  if (index !== -1) {
    sponsors.splice(index, 1);
  }
  removeName.value = "";
  showRemoveForm.value = false; // hide form after submit
};
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
  min-width: 600px;
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
}
</style>
