<template>
  <div>
    <h1>Dashboard</h1>
  </div>
  <div class="dashboard">
    <!-- Top Metrics Section -->
    <div class="metrics-container">
      <div class="metric-box bg-orange">
        <h3>{{checkedInCount}}</h3>
        <p>Checked In Users</p>
      </div>
      <div class="metric-box bg-red">
        <h3>{{registeredParticipantCount}}</h3>
        <p>Registered Users</p>
      </div>
      <div class="metric-box bg-purple">
        <h3>{{reservedHardwareCount}}</h3>
        <p>Hardware Checkouts</p>
      </div>
      <div class="metric-box bg-blue">
        <h3>{{hardwareCount}}</h3>
        <p>Hardware Items</p>
      </div>
      <div class="metric-box bg-yellow">
        <h3>{{categoriesCount}}</h3>
        <p>Hack Categories</p>
      </div>
      <div class="metric-box bg-yellow-green">
        <h3>{{prizesCount}}</h3>
        <p>Listed Prizes</p>
      </div>
      <div class="metric-box bg-green">
        <h3>{{teamsCount}}</h3>
        <p>Teams Competing</p>
      </div>
      <div class="metric-box bg-cyan">
        <h3>{{sponsorCount}}</h3>
        <p>Listed Sponsors</p>
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
      
      <div class="tshirt-box bg-red">
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

      <div class="tshirt-box bg-blue">
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

      <div class="tshirt-box bg-green">
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

    <!-- Upcoming Activities Table -->
    <div class="upcoming-activities">
      <h3>Upcoming Activities</h3>

      <table v-if="sortedActivities.length > 0">
        <thead>
        <tr>
          <th>Title</th>
          <th>Time</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(activity, index) in visibleActivities"
            :key="activity.id"
        >
          <td>{{ activity.activityName }}</td>
          <td>{{ activity.activityDate }}</td>
        </tr>
        </tbody>
      </table>

      <span v-else>There are no activities for the current active event</span>

      <a
          v-if="sortedActivities.length > 3"
          href="#"
          @click.prevent="toggleActivities"
          class="view-all"
      >
        {{ showAllActivities ? "View Less" : "View All" }}
      </a>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import store from "../store/store.js";
import {mapGetters} from "vuex";
import hardwareService from "../services/hardwareService.js";
import {getSponsors} from "@/services/sponsorService.js";

const SIZE_ORDER = ['S', 'M', 'L', 'XL', '2XL', '3XL', 'N/A'];

export default {
  name: "Dashboard",
  data() {
    return {
      showAllActivities: false,
      users: [],
      hardware: [],
      teams: [],
      sponsors: [],
      isLoading: false
    };
  },
  async mounted() {
    await this.$store.dispatch('getActiveEvent'); 
    await this.fetchUsers();
    await this.fetchTeams();
    await this.fetchActivities();
    await this.fetchHardware();
    await this.fetchCategories();
    await this.fetchPrizes();
    await this.fetchSponsors();
  },
  computed: {
    ...mapGetters(['getActivities']),
    activeEventId(){
      return this.$store.state.event?.id;
    },
    checkedInCount(){
      return this.users.filter(user => user.checkIn && user.role.toLowerCase() !== 'staff' && user.role.toLowerCase() !== 'oscar').length;
    },
    sponsorCount() {
      return this.sponsors.length;
    },
    hardwareCount() {
      return this.hardware.length;
    },
    categoriesCount() {
      return store.getters.getCategories.length;
    },
    prizesCount() {
      return store.getters.getPrizes.length;
    },
    teamsCount() {
      return this.teams.length;
    },
    reservedHardwareCount() {
      return this.hardware.filter(hardware => hardware.isAvailable === true).length;
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
    },
    sortedActivities() {
      if (!this.getActivities?.length) return [];

      const now = new Date();

      // Sort activities by earliest and only keep future activities
      return [...this.getActivities]
          .filter(activity => new Date(activity.activityDate) > now)
          .sort((a, b) => new Date(a.activityDate) - new Date(b.activityDate));
    },
    visibleActivities() {
      return this.showAllActivities
          ? this.sortedActivities.slice(0, 6) // show first 6
          : this.sortedActivities.slice(0, 3); // show first 3
    }
  },
  methods: {
    toggleActivities() {
      this.showAllActivities = !this.showAllActivities;
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
    async fetchTeams() {
      const eventId = this.activeEventId;
      try {
        // 2. Use the new endpoint and append eventId as a query parameter
        const response = await axios.get(`${store.state.apiBaseUrl}/teams/all?eventId=${eventId}`);
        this.teams = response.data.data;
      } catch(err) {
        console.error("Error fetching teams: ", err.response?.data?.message || err.message);
      }
    },
    async fetchSponsors() {
      try {
        const sponsorResp = await getSponsors();

        if (!sponsorResp)
          this.sponsors = 0;
        console.log(sponsorResp)

        this.sponsors = sponsorResp.data;
      }
      catch (err) {
        console.log(err)
      }
    },
    async fetchActivities() {
      try {
        this.isLoading = true;

        // Fetch the active event first
        await store.dispatch('getActiveEvent');
        const eventId = store.state.event?.id;

        // Only fetch activities if an event exists
        if (eventId) {
          await store.dispatch('getAllActivities', eventId);
        } else {
          console.warn('No active event found');
        }

      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchHardware() {
      try {
        const hardwareResp = await hardwareService.getHardware();

        if (!hardwareResp) {
          console.log("Error fetching hardware");
          return;
        }

        this.hardware = hardwareResp;
      }
      catch (err) {
        console.log("Error fetching hardware")
      }
    },
    async fetchCategories() {
      try {
        const categoriesResp = await this.$store.dispatch("getCategoriesForEvent", this.activeEventId);
      }
      catch (err) {
        console.log("Error fetching categories")
      }
    },
    async fetchPrizes() {
      try {
        const prizesResp = await this.$store.dispatch('getPrizesForEvent', this.activeEventId);
      }
      catch (err) {

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

.bg-cyan {
  background-color: #c2f8f8;
}

.bg-blue {
  background-color: #cbe1fa;
}

.bg-green {
  background-color: #c1ffcf;
}

.bg-yellow-green {
  background-color: #e0ffb5;
}

.bg-yellow {
  background-color: #f8f5b3;
}

.bg-orange {
  background-color: #ffe7d8ff;
}

.bg-purple {
  background-color: #e6ddff;
}

.bg-red {
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

.upcoming-activities {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.upcoming-activities h3 {
  margin-top: 0;
}

.upcoming-activities table {
  width: 100%;
  margin: 10px 0;
  border-collapse: collapse;
}

.upcoming-activities th,
.upcoming-activities td {
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
