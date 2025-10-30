import {createStore, mapGetters} from 'vuex';
import axios from "axios";
import router from '../router/index.js';
import UserAdapter from "./UserAdapter.js";

export default createStore({
    state: {
        user: {},
        sponsors: [],
        activities: []
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            // if the user has been set it's assumed to be safe to navigate to the dashboard
            router.push('/')
        },
        clearUser(state){
            state.user = null
        },
        setSponsors(state, sponsors){
            state.sponsors = sponsors;
        },
        setActivities(state, activities) {
            state.activities = activities;
        },
        clearActivities(state) {
            state.activities = [];
        }
    },
    actions: {
        async loginAdminUser({commit}, formData) {
            try {
                const loginData = {
                    email: formData.email,
                    password: formData.password
                }

                const response = await axios.post("http://localhost:3000/user/admin-login", loginData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = response.data;
                const user = new UserAdapter(data.data)
                commit("setUser", user);

                document.cookie = `token=${user.token}; path=/;`;
                return { success: true, message: data.message }
            } catch (error) {
                return { success: false, message: error.response?.data?.message || "Login Failed" };
            }
        },
        async validateWithToken({commit}) {
            try {
                const token = {
                    token: document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1]
                }

                if (!token) return { success: false, message: "No token found"};

                const response = await axios.post("http://localhost:3000/user/auth", {token}, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.data;
                const user = new UserAdapter(data.data);
                commit("setUser", user);

                return { success: true, message: data.message };
            } catch (error) {
                return { success: false, message: error.response?.data?.message || "Authentication failed" };
            }
        },
        async logout({commit}) {
            commit("clearUser");
            document.cookie = `token=; path=/;`;
            router.push("/login");
        },
        async getAllSponsors({commit}){
            try{
                const response = await axios.get("http://localhost:3000/sponsor/all");
                commit("setSponsors", response.data);
            }catch(err){
                console.error("Error fetching sponsors: ", err);
            }
        },
        async createActivity({ commit }, activity) {
            try {
                if (!activity || Object.keys(activity).length === 0) {
                    return { success: false, message: "Activity is empty" };
                }
                const response = await fetch('http://localhost:3000/event/activity/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(activity)
                });

                const data = await response.json();
                if (response.ok) {
                    return { success: true, message: data.message || "Activity created successfully" };
                } else {
                    return { success: false, message: data.message || "Failed to create activity", errors: data.errors };
                }
            } catch (error) {
                return { success: false, message: error.response?.data?.message || "Network or server error while creating activity" };
            }
        },
        async updateActivity({ commit }, activity) {
            try {
                if (!activity || Object.keys(activity).length === 0) {
                    return { success: false, message: "Activity is empty" };
                }
                const response = await fetch('http://localhost:3000/event/activity', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(activity)
                });

                const data = await response.json();
                if (response.ok) {
                    return { success: true, message: data.message || "Activity updated successfully" };
                } else {
                    return { success: false, message: data.message || "Failed to update activity", errors: data.errors };
                }
            } catch (error) {
                return { success: false, message: error.response?.data?.message || "Network or server error while updating activity" };
            }
        },
        async deleteActivity({ commit }, id) {
            try {
                if (!id) {
                    return { success: false, message: "Something went wrong" };
                }

                const response = await fetch(`http://localhost:3000/event/activity/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();

                if (response.ok) {
                    return { success: true, message: data.message || "Activity deleted successfully" };
                } else {
                    return { success: false, message: data.message || "Failed to delete activity", errors: data.errors };
                }
            } catch (error) {
                return { success: false, message: error.message || "Network or server error while deleting activity" };
            }
        },
        async getAllActivities({ commit }, eventId) {
            try {
                if (!eventId) return;
                const response = await axios.get(`http://localhost:3000/event/activity/${eventId}`);

                // Convert dates from UTC to local time (i.e., EST) and to a user-friendly format
                const activities = response.data.activities.map(activity => {
                    activity.activityDate = (new Date(activity.activityDate)).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                        timeZone: "America/New_York"
                    });

                    return activity;
                });

                commit("setActivities", activities);
                return {success: true, message: response.data.message};
            } catch (error) {
                return {success: false, message: error.response?.data?.message || "Error fetching activity"};
            }
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.user,
        UserRole: (state) => state.user?.role || null,
        allSponsors: (state) => state.sponsors,
        getActivities: (state) => state.activities
    },
});
