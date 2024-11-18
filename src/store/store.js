import {createStore} from 'vuex';
import axios from "axios";
import router from '../router/index.js';
import UserAdapter from "./UserAdapter";

export default createStore({
    state: {
        user: {},
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            // if the user has been set it's assumed to be safe to navigate to the dashboard
            router.push('/')
        },
    },
    actions: {
        async loginAdminUser({commit}, formData) {
            try {
                const loginData = {
                    email: formData.email,
                    password: formData.password
                }

                const response = await axios.post("http://localhost:3000/user/admin", loginData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.data;
                const user = new UserAdapter(data.data)
                commit("setUser", user);
                document.cookie = `token=${user.token}; path=/;`;
            } catch (error) {
                console.error("Login failed:", error);
            }
        },
        async validateWithToken({commit}) {
            try {
                const token = {
                    token: document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1]
                }

                const response = await axios.post("http://localhost:3000/user/auth", token, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.data;
                const user = new UserAdapter(data.data)

                commit("setUser", user);
            } catch (error) {
                console.error("Login failed:", error);
            }
        },
        async logout({commit}) {
            commit("setUser", {});
            document.cookie = `token=; path=/;`;
        }
    },
    getters: {},
});
