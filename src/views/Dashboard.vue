<template>
  <div>
    <h1>Dashboard</h1>
  </div>
  <div class="dashboard">
    <!-- Top Metrics Section -->
    <div class="metrics-container">
      <div class="metric-box checked-users">
        <!-- Update to be actual number of users checked in -->
        <h3>{{checkedInCount}}</h3>
        <p>Checked In Users</p>
      </div>
      <div class="metric-box rsvp-users">
        <!-- Update to be actual number of users registered -->
        <h3>{{registeredParticipantCount}}</h3>
        <p>Registered Users</p>
      </div>
      <div class="metric-box hardware-items">
        <h3>700</h3>
        <p>Hardware Items</p>
      </div>
      <div class="metric-box hardware-checkouts">
        <h3>65</h3>
        <p>Hardware Checkouts</p>
      </div>
      <div class="metric-box listed-events">
        <h3>25</h3>
        <p>Listed Events</p>
      </div>
      <div class="metric-box listed-prizes">
        <h3>30</h3>
        <p>Listed Prizes</p>
      </div>
      <div class="metric-box listed-projects">
        <h3>0</h3>
        <p>Listed Projects</p>
      </div>
    </div>

    <!-- Event Applications -->
    <div class="application-status">
      <p>Event Applications are <span class="open-status">OPEN</span></p>
      <p>Participants can apply for YCPHacks Events.</p>
    </div>

    <!-- T-shirt Sizes Displayed -->
    <!-- Need to add logic for if the event applications are closed -> shouldn't show if closed -->
    <div class="tshirt-summary-row">
      
      <div class="tshirt-box bg-all">
        <h3>👕 All Users</h3>
        <p class="total-count">Total People: {{ allTally.totalUsers }}</p>
        <p class="shirt-count">Order: <strong>{{ allTally.totalShirts }} Shirts</strong></p>
        <div class="size-details">
          <span 
            v-for="(count, size) in allTally.tally" 
            :key="size" 
            :class="{'text-danger fw-bold': size === 'N/A'}"
          >
            <span class="fw-bold">{{ size }}:</span> {{ count }}
          </span>
        </div>
      </div>

      <div class="tshirt-box bg-participant">
        <h3>🏃‍♂️ Participants</h3>
        <p class="total-count">Total People: {{ participantTally.totalUsers }}</p>
        <p class="shirt-count">Order: <strong>{{ participantTally.totalShirts }} Shirts</strong></p>
        <div class="size-details">
          <span 
            v-for="(count, size) in participantTally.tally" 
            :key="size" 
            :class="{'text-danger fw-bold': size === 'N/A'}"
          >
            <span class="fw-bold">{{ size }}:</span> {{ count }}
          </span>
        </div>
      </div>

      <div class="tshirt-box bg-staff">
        <h3>🧑‍💻 Staff</h3>
        <p class="total-count">Total People: {{ staffTally.totalUsers }}</p>
        <p class="shirt-count">Order: <strong>{{ staffTally.totalShirts }} Shirts</strong></p>
        <div class="size-details">
          <span 
            v-for="(count, size) in staffTally.tally" 
            :key="size" 
            :class="{'text-danger fw-bold': size === 'N/A'}"
          >
            <span class="fw-bold">{{ size }}:</span> {{ count }}
          </span>
        </div>
      </div>
    </div>

    <!-- Upcoming Events Table -->
    <div class="upcoming-events">
      <h3>Upcoming Activities</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Check In</td>
            <td>October 18, 2024 6:00PM</td>
          </tr>
          <tr>
            <td>Team Forming</td>
            <td>October 18, 2024 6:30PM</td>
          </tr>
          <tr>
            <td>Dinner</td>
            <td>October 18, 2024 7:30PM</td>
          </tr>
          <!-- Additional events shown when 'View All' is clicked -->
          <tr v-if="showAllEvents">
            <td>Keynote Speech</td>
            <td>October 18, 2024 8:00PM</td>
          </tr>
          <tr v-if="showAllEvents">
            <td>Workshop 1</td>
            <td>October 19, 2024 9:00AM</td>
          </tr>
          <tr v-if="showAllEvents">
            <td>Workshop 2</td>
            <td>October 19, 2024 11:00AM</td>
          </tr>
        </tbody>
      </table>
      <a href="#" @click.prevent="toggleEvents" class="view-all">
        {{ showAllEvents ? "View Less" : "View All" }}
      </a>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import store from "../store/store.js";


const SIZE_ORDER = ['S', 'M', 'L', 'XL', '2XL', '3XL', 'N/A'];

export default {
  name: "Dashboard",
  data() {
    return {
      showAllEvents: false,
      users: []
    };
  },
  async mounted() {
    await this.$store.dispatch('getActiveEvent'); 
    this.fetchUsers();
  },
  computed: {
    activeEventId(){
      return this.$store.state.activeEvent;
    },
    checkedInCount(){
      return this.users.filter(user => user.checkIn && user.role.toLowerCase() !== 'staff' && user.role.toLowerCase() !== 'oscar').length;
    },
    registeredParticipantCount(){
      return this.users.filter(user =>
        user.role.toLowerCase() !== 'staff' && user.role.toLowerCase() !== 'oscar'
      ).length;
    },
    allTally() {
      return this.calculateTally(this.users);
    },
    participantTally() {
      const participants = this.users.filter(u => u.role.toLowerCase() === "participant");
      return this.calculateTally(participants);
    },
    staffTally() {
      // Assuming 'oscar' is also counted as staff
      const staff = this.users.filter(u => u.role.toLowerCase() === "staff" || u.role.toLowerCase() === "oscar");
      return this.calculateTally(staff);
    }
  },
  methods: {
    toggleEvents() {
      this.showAllEvents = !this.showAllEvents;
    },
    async fetchUsers(){
      const eventId = this.activeEventId;
      
      try {
        const response = await axios.get(`${store.state.apiBaseUrl}/user/all?eventId=${eventId}`);
        this.users = response.data.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    calculateTally(userList) {
      const tally = userList.reduce((acc, user) => {
        const size = user.tShirtSize 
          ? user.tShirtSize.toUpperCase().trim() 
          : 'N/A';
        
        if (size) {
          acc[size] = (acc[size] || 0) + 1;
        }
        return acc;
      }, {}); // Must initialize with {}

      const orderedTally = {};
      let totalShirts = 0;

      SIZE_ORDER.forEach(key => {
        if (tally[key]) {
          orderedTally[key] = tally[key];
          if (key !== 'N/A') { 
            totalShirts += tally[key];
          }
        }
      });

      return {
        tally: orderedTally,
        totalShirts: totalShirts,
        totalUsers: userList.length
      };
    }
  }
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f7f9fc;
  display: grid;
  gap: 20px;
}

.metrics-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.metric-box {
  background-color: #ffffff;
  padding: 15px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.metric-box h3 {
  margin: 0;
  font-size: 24px;
}

.metric-box p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #777;
}

.checked-users {
  background-color: #d4edda;
}

.rsvp-users {
  background-color: #fff3cd;
}

.hardware-checkouts {
  background-color: #d1ecf1;
}

.mentorship-requests {
  background-color: #f8d7da;
}

.listed-events {
  background-color: #cce5ff;
}

.listed-prizes {
  background-color: #d4edda;
}

.hardware-items {
  background-color: #fff3cd;
}

.listed-projects {
  background-color: #f8d7da;
}

.application-status {
  background-color: #ffffff;
  padding: 15px;
  border-left: 5px solid #28a745;
  border-radius: 8px;
}

.application-status .open-status {
  font-weight: bold;
  color: #28a745;
}

.upcoming-events {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.upcoming-events h3 {
  margin-top: 0;
}

.upcoming-events table {
  width: 100%;
  margin: 10px 0;
  border-collapse: collapse;
}

.upcoming-events th,
.upcoming-events td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.view-all {
  color: #007bff;
  text-decoration: none;
  display: inline-block;
  margin-top: 10px;
  cursor: pointer;
}

.discord-channels {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.discord-channels button {
  background-color: #007bff;
  color: #ffffff;
  border: none;
  padding: 10px;
  margin-left: 10px;
  margin-top: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.tshirt-summary-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Three columns, equally sized */
  gap: 15px;
  margin-top: 15px; /* Add some space below top metrics */
}

.tshirt-box {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tshirt-box h3 {
  margin-top: 0;
  font-size: 18px;
  margin-bottom: 5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 5px;
}

.tshirt-box .total-count,
.tshirt-box .shirt-count {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.tshirt-box .shirt-count strong {
  font-size: 16px;
  color: #007bff; /* Highlight the actual order number */
}

.tshirt-box .size-details {
  margin-top: 10px;
  padding-top: 5px;
  border-top: 1px dashed #ddd;
  font-size: 13px;
  display: flex;
  flex-wrap: wrap; /* Allows sizes to wrap if needed */
  gap: 8px; /* Spacing between size: count pairs */
}

/* Custom Backgrounds for T-Shirt Boxes */
.bg-all {
  background-color: #e3f2fd; /* Light Blue */
}
.bg-participant {
  background-color: #fce4ec; /* Light Pink/Rose */
}
.bg-staff {
  background-color: #e8f5e9; /* Light Green */
}
</style>
