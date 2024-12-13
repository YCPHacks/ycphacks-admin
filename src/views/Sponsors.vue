<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Our Sponsors</h2>

    <!-- Add Sponsor Button -->
    <div class="text-end mb-3">
      <button class="btn btn-primary" @click="addSponsor">
        Add Sponsor
      </button>
    </div>

    <!-- Table Section -->
    <div class="table-container shadow-lg rounded overflow-hidden">
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="thead-light">
          <tr>
            <th class="text-left">Sponsor Name</th>
            <th class="text-left">Sponsor Tier</th>
            <th class="text-center">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="sponsors.length === 0">
            <td colspan="3" class="text-center">No sponsors available</td>
          </tr>
          <tr v-for="(sponsor, index) in sponsors" :key="index">
            <td>{{ sponsor.name }}</td>
            <td>{{ sponsor.tier }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-warning me-2" @click="editSponsor(index)">
                Edit
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

// List of sponsors
const sponsors = reactive([
  { name: "Sponsor A", tier: "Gold" },
  { name: "Sponsor B", tier: "Silver" },
  { name: "Sponsor C", tier: "Bronze" },
  { name: "Sponsor D", tier: "Platinum" },
]);

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
</style>
