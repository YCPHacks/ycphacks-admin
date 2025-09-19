import axios from "axios";

const API_URL = "http://localhost:8080/api/sponsors";

export const getSponsors = () => axios.get(API_URL);

export const addSponsor = (sponsor) => axios.post(API_URL, sponsor);

export const updateSponsor = (id, sponsor) =>
  axios.put(`${API_URL}/${id}`, sponsor);

export const deleteSponsor = (id) => axios.delete(`${API_URL}/${id}`);
