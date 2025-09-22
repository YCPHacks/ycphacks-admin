import axios from "axios";

const API_URL = "http://localhost:3000/sponsors";

export const getSponsors = () => axios.get(`${API_URL}/all`);
export const addSponsor = (sponsorData) => axios.post(`${API_URL}`, sponsorData);
export const updateSponsor = (id, sponsorData) => axios.put(`${API_URL}/${id}`, sponsorData);
export const deleteSponsor = (id) => axios.delete(`${API_URL}/${id}`);