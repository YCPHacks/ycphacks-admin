<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Registered Applicants</h2>

    <!-- Statistics Section -->
    <div class="mb-4 p-3 bg-light rounded shadow-sm">
      <h5>Total Applicants: {{ totalApplicants }}</h5>
      <h5>T-Shirts</h5>
      <p v-for="(count, size) in tshirtCounts" :key="size">
        {{ size }}: {{ count }}
      </p>
      <h5>Applicant Status Counts:</h5>
      <p>Checked In: {{ statusCounts.checkedIn }}</p>
      <p>Pending: {{ statusCounts.pending }}</p>
      <p>Approved: {{ statusCounts.approved }}</p>
      <p>Denied: {{ statusCounts.denied }}</p>
    </div>

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
            <th class="text-nowrap">First Name</th>
            <th class="text-nowrap">Last Name</th>
            <th class="text-nowrap">Phone Number</th>
            <th class="text-nowrap">DOB</th>
            <th class="text-nowrap">Gender</th>
            <th class="text-nowrap">Country</th>
            <th class="text-nowrap">School</th>
            <th class="text-nowrap">T-Shirt Size</th>
            <th class="text-nowrap">Hackathons Attended</th>
            <th class="text-nowrap">Dietary Restrictions</th>
            <th class="text-nowrap">Status</th>
            <th class="text-nowrap">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="applicant in filteredApplicants"
              :key="applicant.id"
              :class="statusClass(applicant.status)"
          >
            <td>{{ applicant.firstName }}</td>
            <td>{{ applicant.lastName }}</td>
            <td>{{ applicant.phoneNumber }}</td>
            <td>{{ formatDate(applicant.dob) }}</td>
            <td>{{ applicant.gender }}</td>
            <td>{{ applicant.country }}</td>
            <td>{{ applicant.school }}</td>
            <td>{{ applicant.tshirtSize }}</td>
            <td>{{ applicant.hackathonsAttended }}</td>
            <td>{{ applicant.dietaryRestrictions }}</td>
            <td>
              <select
                  v-model="applicant.status"
                  @change="updateStatus(applicant.id, applicant.status)"
                  class="form-select form-select-sm rounded status-dropdown"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
                <option value="checked in">Checked In</option>
              </select>
            </td>
            <td>
              <button
                  @click="deleteApplicant(applicant.id)"
                  class="btn btn-danger btn-sm rounded"
              >
                Delete
              </button>
            </td>
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
    totalApplicants() {
      return this.applicants.length;
    },
    tshirtCounts() {
      return this.applicants.reduce((counts, applicant) => {
        const size = applicant.tshirtSize;
        counts[size] = (counts[size] || 0) + 1;
        return counts;
      }, {});
    },
    statusCounts() {
      return this.applicants.reduce(
          (counts, applicant) => {
            switch (applicant.status) {
              case 'checked in':
                counts.checkedIn += 1;
                break;
              case 'pending':
                counts.pending += 1;
                break;
              case 'approved':
                counts.approved += 1;
                break;
              case 'denied':
                counts.denied += 1;
                break;
            }
            return counts;
          },
          { checkedIn: 0, pending: 0, approved: 0, denied: 0 }
      );
    }
  },
  methods: {
    async fetchApplicants() {
      try {
        const response = await axios.get('http://localhost:3000/registration/');
        this.applicants = response.data;
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    },
    async updateStatus(id, status) {
      try {
        await axios.put(`http://localhost:3000/registration/${id}/status`, { status });
        alert('Status updated successfully!');
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status.');
      }
    },
    async deleteApplicant(id) {
      try {
        await axios.delete(`http://localhost:3000/registration/${id}`);
        this.applicants = this.applicants.filter(applicant => applicant.id !== id);
        alert('Applicant deleted successfully!');
      } catch (error) {
        console.error('Error deleting applicant:', error);
        alert('Failed to delete applicant.');
      }
    },
    statusClass(status) {
      switch (status) {
        case 'pending':
          return 'bg-warning text-dark';
        case 'approved':
          return 'bg-success text-white';
        case 'denied':
          return 'bg-danger text-white';
        case 'checked in':
          return 'bg-info text-white';
        default:
          return '';
      }
    },
    formatDate(date) {
      const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString('en-US', options);
    }
  }
};
</script>

<style>
/* Styles remain the same as in the previous example */
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

.btn-primary {
  border-radius: 2rem;
}

.form-select {
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  width: 100%;
}

.status-dropdown {
  min-width: 150px;
}

.bg-warning {
  background-color: #ffc107 !important;
}

.bg-success {
  background-color: #28a745 !important;
}

.bg-danger {
  background-color: #dc3545 !important;
}

.bg-info {
  background-color: #17a2b8 !important;
}

.text-dark {
  color: #212529 !important;
}

.text-white {
  color: #ffffff !important;
}

.shadow-lg {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-control {
  border-radius: 0.5rem;
}
</style>
