import axios from "axios";
import store from "../store/store.js";

const API_URL = `${store.state.apiBaseUrl}/hardware`;

export default {
    async getHardware(){
        const res = await axios.get(`${API_URL}/`);
        return res.data;
    },

    async getHardwareAvailability(){
        const res = await axios.get(`${API_URL}/availability/`);
        return res.data;
    }
}