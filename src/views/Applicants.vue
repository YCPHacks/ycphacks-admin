<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">All Users</h2>

    <!-- Search Input -->
    <div class="mb-4">
      <input
          type="text"
          v-model="searchQuery"
          class="form-control"
          placeholder="Search by name"
      />
    </div>

    <!-- Table Section -->
    <div class="table-container shadow-lg rounded overflow-hidden">
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="thead-light">
            <tr>
              <th class="text-left">First Name</th>
              <th class="text-left">Last Name</th>
              <th class="text-left">Phone Number</th>
              <th class="text-left">Hackathons Attended</th>
              <th class="text-left">Role</th>
            </tr>
          </thead>
          <tbody>
          <tr
              v-for="applicant in filteredApplicants"
              :key="applicant.id"
          >
            <td>{{ applicant.firstName }}</td>
            <td>{{ applicant.lastName }}</td>
            <td>{{ applicant.phoneNumber }}</td>
            <td>{{ applicant.hackathonsAttended }}</td>
            <td>{{ applicant.role }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Applicants",
  data() {
    return {
      applicants: [],
      searchQuery: ''
    };
  },
  created() {
    this.fetchApplicants();
  },
  computed: {
    filteredApplicants() {
      const query = this.searchQuery.toLowerCase();
      return this.applicants.filter(applicant =>
          applicant.firstName.toLowerCase().includes(query) ||
          applicant.lastName.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    async fetchApplicants() {
      try {
        const response = await axios.get('http://localhost:3000/user/all');

        console.log(response)
        this.applicants = response.data.data;
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    },
  }
};
</script>

<style>
.container {
  max-width: 100%;
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
</style>
