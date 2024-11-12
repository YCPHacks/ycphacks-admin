<template>
  <div>
    <h1>Overview</h1>
    <p>Welcome to the dashboard!</p>
  </div>
  <div class="dashboard">
    <!-- Top Metrics Section -->
    <div class="metrics-container">
      <div class="metric-box checked-users">
        <h3>750</h3>
        <p>Checked In Users</p>
      </div>
      <div class="metric-box rsvp-users">
        <h3>975</h3>
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

    <!-- Upcoming Events Table -->
    <div class="upcoming-events">
      <h3>Upcoming Events</h3>
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

    <!-- Discord Channels Section -->
    <div class="discord-channels">
      <h3>Discord Channels</h3>
      <p>In the YCPHacks discord, you can communicate with hundreds of hackers!</p>
      <button>Open #team_forming channel</button>
      <button>Open #random channel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      showAllEvents: false
    };
  },
  methods: {
    toggleEvents() {
      this.showAllEvents = !this.showAllEvents;
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
</style>
