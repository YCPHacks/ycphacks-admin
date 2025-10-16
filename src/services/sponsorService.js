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
export const updateEventSponsor = async (id, updates) => {
  return axios.put(`${API_URL}/${id}`, updates);
};

// Delete sponsor
export const deleteSponsor = async (sponsorId, eventId) => {
  return axios.delete(`${API_URL}/${sponsorId}?eventId=${eventId}`);
};

export const getSponsorTiers = async () => {
  return axios.get(`${API_URL}/tiers`);
}

export const addSponsorTier = async (tierData) => {
  return axios.post(`${API_URL}/tiers`, {
    tier: tierData.tier,
    lowerThreshold: tierData.lowerThreshold,
    // imageWidth: tierData.imageWidth,
    // imageHeight: tierData.imageHeight
  });
}

export const removeSponsorTier = async (tierId) => {
  return axios.delete(`${API_URL}/tiers/${tierId}`);
}