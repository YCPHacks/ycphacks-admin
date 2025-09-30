import axios from "axios";

const API_URL = "http://localhost:3000/sponsors";

// Get sponsors for a specific event
export const getSponsors = async (eventId) => {
  if (!eventId) throw new Error("eventId is required");
  return axios.get(`${API_URL}`, {
    params: { eventId } // sends ?eventId=1
  });
};

// Add sponsor
export const addSponsor = async (sponsor) => {
  return axios.post(`${API_URL}`, sponsor);
};

// Update sponsor
export const updateSponsor = async (id, updates) => {
  return axios.put(`${API_URL}/${id}`, updates);
};

// Delete sponsor
export const deleteSponsor = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export const getSponsorTiers = async () => {
  return axios.get(`${API_URL}/tiers`);
}