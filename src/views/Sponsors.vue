<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Our Sponsors</h2>

    <div class="d-flex justify-content-end gap-2 mb-3">
        <!-- Add Sponsor Button -->
        <div class="text-end mb-3">
          <button class="btn btn-primary" @click="toggleAddForm">
            Add Sponsor
          </button>
        </div>

        <!-- Remove Sponsor Button -->
        <div class="text-end mb-3">
            <button class="btn btn-primary" @click="toggleRemoveForm">
                Remove Sponsor
            </button>
        </div>
    </div>

    <!-- Add Sponsor Form -->
    <div v-if="showAddForm" class="card p-3 mb-3">
      <h5>Add Sponsor</h5>
      <form @submit.prevent="handleAddSponsor">
        <div v-if="addFormError" class="alert alert-danger p-2 mb-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i> {{ addFormError }}
        </div>
        <div class="mb-2">
          <label class="form-label">Name</label>
          <input v-model="addName" type="text" class="form-control" required />
        </div>
        <div class="mb-2">
            <label class="form-label">Tier</label>
            <select v-model="addTier" class="form-control" required>
              <option value="" disabled>Select a tier</option>
              <option v-for="tier in tiers" :key="tier.id" :value="tier.id">
                {{ tier.tier }}
              </option>
            </select>
        </div>
        <div class="mb-2">
            <label class="form-label">Website URL</label>
            <input v-model="addWebsite" type="text" class="form-control" />
        </div>
        <div class="mb-2">
            <label class="form-label">Image PNG</label>
            <input v-model="addPNG" type="text" class="form-control" />
        </div>
        <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" @click="cancelAdd">
                Cancel
            </button>
            <button type="submit" class="btn btn-success">Submit</button>
         </div>
      </form>
    </div>

    <!-- Remove Sponsor Form -->
    <div v-if="showRemoveForm" class="card p-3 mb-3">
      <h5>Remove Sponsor</h5>
      <form @submit.prevent="removeSponsor">
        <div v-if="removeFormError" class="alert alert-danger p-2 mb-3" role="alert">
          <i class="bi bi-exclamation-triangle-fill"></i> {{ removeFormError }}
        </div>
        <div class="mb-2">
          <label class="form-label">Name</label>
          <input v-model="removeName" type="text" class="form-control" required />
        </div>
        <button type="button" class="btn btn-secondary" @click="cancelRemove">
            Cancel
        </button>
        <button type="submit" class="btn btn-danger">Submit</button>
      </form>
    </div>

    <!-- Edit Sponsor Popup -->
    <div v-if="showEditForm" class="popup-overlay">
      <div class="card p-3 popup">
        <h5>Edit Sponsor</h5>
        <form @submit.prevent="handleUpdateSponsor">
          <div v-if="editFormError" class="alert alert-danger p-2 mb-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i> {{ editFormError }}
          </div>
          <div class="mb-2">
            <label class="form-label">Name</label>
            <input v-model="editName" type="text" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label">Tier</label>
            <select v-model="editTier" class="form-control" required>
              <option value="" disabled>Select a tier</option>
              <option v-for="tier in tiers" :key="tier.id" :value="tier.id">
                {{ tier.tier }}
              </option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label">Website URL</label>
            <input v-model="editWebsite" type="text" class="form-control" />
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" @click="cancelEdit">
              Cancel
            </button>
            <button type="submit" class="btn btn-success">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-container shadow-lg rounded overflow-hidden">
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="thead-light">
              <tr>
                <th class="text-left">Sponsor Name</th>
                <th class="text-left">Sponsor Tier</th>
                <th class="text-left">Website</th>
              </tr>
          </thead>
          <tbody>
              <tr v-if="sponsors.length === 0">
                <td colspan="3" class="text-center">No sponsors available</td>
              </tr>
              <tr v-for="(sponsor, index) in sponsors" :key="sponsor.id || index" @click="openEditForm(index)" style="cursor: pointer">
                  <td class="text-center">{{ sponsor.name }}</td>      <td class="text-center">{{ sponsor.tier }}</td>
                  <td class="text-center">{{ sponsor.website }}</td>    </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getSponsors, addSponsor, updateEventSponsor, deleteSponsor, getSponsorTiers } from "@/services/sponsorService";

// List of sponsors
const sponsors = ref([]);
const tiers = ref([]);
const currentEventId = ref(null);

// Form state
const addName = ref("");
const addTier = ref("");
const addWebsite = ref("");
const addPNG = ref("");
const removeName = ref("");
const showAddForm = ref(false);
const showRemoveForm = ref(false);

// Error State Variables
const addFormError = ref(null);
const editFormError = ref(null);
const removeFormError = ref(null);

// Edit sponsor state
const showEditForm = ref(false);
const editIndex = ref(null);
const editId = ref(null);
const editName = ref("");
const editTier = ref("");
const editWebsite = ref("");
const editPNG = ref("");

// Validate Characters
const validateName = (name) => {
  // Regex restricts input to standard keyboard characters: 
  // letters (a-z), numbers (0-9), space (\s), and common punctuation in company names.
  // The 'i' flag makes it case-insensitive (a-zA-Z).
  const allowedChars = /^[a-zA-Z0-9\s\-.()'&!@#$%,]+$/; 
  
  // If the name is empty, we let the 'required' attribute handle it.
  if (!name) return null;

  if (!allowedChars.test(name)) {
    return "Sponsor Name contains restricted characters. Please use only standard letters, numbers, spaces, and common symbols (e.g., -, ., ', &, @, #).";
  }
  return null;
};

const validateUrl = (url) => {
  const trimmedUrl = url ? url.trim() : '';

  // Allow empty string (since URL is not required)
  if (!trimmedUrl) return null; 

  // 1. Protocol Check: Must start with http:// or https://
  // The 'i' flag makes it case-insensitive.
  const protocolRegex = /^(http|https):\/\//i;
  if (!protocolRegex.test(trimmedUrl)) {
    return "URL must start with 'http://' or 'https://'.";
  }

  return null;
};

const transformUrlForServer = (url) => {
    if (!url) return null;
    let transformed = url.trim();

    // The backend only allows: a-zA-Z0-9\s-',.
    // We use safe letter sequences (all caps) to represent blocked characters.
    transformed = transformed.replace(/:/g, 'DOTC');         // Colon: (e.g., in http:)
    transformed = transformed.replace(/\//g, 'DOTS');         // Slash: /
    transformed = transformed.replace(/\?/g, 'DOTQ');         // Question mark: ?
    transformed = transformed.replace(/=/g, 'DOTE');         // Equals sign: =
    transformed = transformed.replace(/&/g, 'DOTA');         // Ampersand: &
    
    // Spaces are allowed by the backend regex but should not be in a URL, so we keep them for now,
    // assuming client-side validation handles invalid URL formats.

    return transformed;
};

const revertUrlFromServer = (transformedUrl) => {
    if (!transformedUrl) return "";
    let original = transformedUrl.trim();

    original = original.replace(/DOTC/g, ':');
    original = original.replace(/DOTS/g, '/');
    original = original.replace(/DOTQ/g, '?');
    original = original.replace(/DOTE/g, '=');
    original = original.replace(/DOTA/g, '&');
    
    return original;
};

// Fetch sponsors on load
onMounted(async () => {
    try{
      currentEventId.value = await getCurrentEventId();
      const eventId = await getCurrentEventId();
      const res = await getSponsors(eventId);

      const data = res.data || {};
      sponsors.value = Array.isArray(data.sponsors)
        ? data.sponsors.map(s => ({
            id: s.id,
            name: s.name,
            website: revertUrlFromServer(s.website),
            tier: s.tier || "",
            image: s.image || ""
          }))
        : [];

      const resTiers = await getSponsorTiers();
      tiers.value = Array.isArray(resTiers.tiers) ? resTiers.tiers : [];
    }catch (err){
        console.error("Error fetching sponsors: ", err);
    }
});

// Toggle forms
const toggleAddForm = async () => {
  showAddForm.value = true;
  showRemoveForm.value = false;
  addFormError.value = null;

  try{
    const resTiers = await getSponsorTiers();
    tiers.value = Array.isArray(resTiers.data) ? resTiers.data : [];
  }catch(err){
    console.error("Error fetching sponsor tiers: ", err);
  }
};

const toggleRemoveForm = async () => {
  showRemoveForm.value = true;
  showAddForm.value = false;
  removeFormError.value = null;
};

const cancelAdd = () => {
  showAddForm.value = false;
  addFormError.value = null;
}

const cancelRemove = () => {
    showRemoveForm.value = false;
    removeFormError.value = null;
    removeName.value = "";
}

// Add sponsor
const handleAddSponsor = async () => {
  addFormError.value = null;

  const validationMessage = validateName(addName.value);
  if (validationMessage) {
      addFormError.value = validationMessage;
      return;
  }

  const urlValidationMessage = validateUrl(addWebsite.value);
  if(urlValidationMessage){
    addFormError.value = urlValidationMessage;
    return;
  }

  const transformedWebsite = transformUrlForServer(addWebsite.value);

  try {
    const eventId = await getCurrentEventId();

    await addSponsor({
      sponsorName: addName.value,
      sponsorWebsite: transformedWebsite,
      image: addPNG.value || null,
      sponsorTierId: addTier.value,
      eventId: currentEventId.value,
    });

    // Re-fetch the sponsors list
    const res = await getSponsors(eventId);
    const data = res.data?.sponsors || [];
    sponsors.value = Array.isArray(data)
      ? data.map(s => ({
          id: s.id,
          name: s.name,
          website: revertUrlFromServer(s.website),
          tier: s.tier || "",
          image: s.image || ""
        }))
      : [];

    addName.value = "";
    addTier.value = "";
    addWebsite.value = "";
    addPNG.value = "";
    showAddForm.value = false;

  } catch(err) {
    // console.error("Error adding sponsor: ", err);
    const errorMessage = err.response?.data?.message || err.response?.data?.error || "An unknown error occurred.";
    addFormError.value = errorMessage;
  }
};

// Remove sponsor
const removeSponsor = async () => {
  removeFormError.value = null;

  const SponsorToRemove = sponsors.value.find((s) => s.name === removeName.value);

  if(!SponsorToRemove){
    // console.warn(`Sponsor with name "${removeName.value}" not found of is missing an ID.`);
    removeFormError.value = `Sponsor named "${removeName.value}" was not found. Please check the spelling.`;
    return;
  }

  try {
    // console.log("Found Sponsor Object: ", SponsorToRemove);
    // console.log("eventId: ", eventId);
    // console.log("idToDelete: ", idToDelete);
  
    await deleteSponsor(idToDelete, eventId);
    // console.log("Sponsor Deleted")
  
    const index = sponsors.value.findIndex((s) => s.id === idToDelete);
    if(index !== -1){
      sponsors.value.splice(index, 1);
    }
  
    removeName.value = "";
    showRemoveForm.value = false;
  } catch (err) {
      // console.error("Error deleting sponsor: ", err);
      // 3. Handle API error (server-side check)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to delete sponsor due to a network or server error.";
      removeFormError.value = errorMessage;
  }
};

// Open edit form
const openEditForm = async (index) => {
    const sponsor = sponsors.value[index];
    editIndex.value = index;
    editId.value = sponsor.id;
    editName.value = sponsor.name;
    editTier.value = tiers.value.find(t => t.tier === sponsor.tier)?.id || "";
    showEditForm.value = true;
    editFormError.value = null;

     try{
      const resTiers = await getSponsorTiers();
      tiers.value = Array.isArray(resTiers.data) ? resTiers.data : [];
    }catch(err){
      console.error("Error fetching sponsor tiers: ", err);
    }
};

// Save changes to update sponsor
const handleUpdateSponsor = async () => {
  editFormError.value = null;

  const validationMessage = validateName(editName.value);
  if (validationMessage) {
      editFormError.value = validationMessage;
      return;
  }

  const urlValidationMessage = validateUrl(editWebsite.value);
  if(urlValidationMessage){
    editFormError.value = urlValidationMessage;
    return;
  }

  const transformedWebsite = transformUrlForServer(editWebsite.value);

  try{
      if(editIndex.value !== null){
        console.log("Updating sponsor with:", {
          editId: editId.value,
          sponsorName: editName.value,
          sponsorWebsite: transformedWebsite,
          image: editPNG.value || null,
          sponsorTierId: editTier.value,
          eventId: currentEventId.value,
        });

        await updateEventSponsor(editId.value, {
            sponsorName: editName.value,
            sponsorWebsite: editWebsite.value,
            image: editPNG.value || null,
            sponsorTierId: editTier.value ,  //dropdown value
            eventId: currentEventId.value,
        });

        console.log({
          editId: editId.value,
          sponsorName: editName.value,
          sponsorWebsite: editWebsite.value,
          image: editPNG.value || null,
          sponsorTierId: editTier.value
        });

        sponsors.value[editIndex.value].name = editName.value;
        sponsors.value[editIndex.value].website = editWebsite.value;
        sponsors.value[editIndex.value].tier = tiers.value.find(t => t.id === editTier.value)?.tier || "";
        sponsors.value[editIndex.value].image = editPNG.value || "";
      }
      showEditForm.value = false;
      editIndex.value = null;
      editId.value = null;
  }catch (err){
    // console.error("Error updating sponsor: ", err);const errorMessage = err.response?.data?.message || err.response?.data?.error || "An unknown error occurred during update.";
    editFormError.value = errorMessage;
  }
};

// Cancel Edit
const cancelEdit = () => {
    showEditForm.value = false;
    editIndex.value = null;
    editId.value = null;
    editFormError.value = null;
};

const getCurrentEventId = () => {
    //return selectedEvent.value.id;
    return 1;
}
</script>

<style scoped>
.alert-danger {
    color: #842029;
    background-color: #f8d7da;
    border-color: #f5c2c7;
    border-radius: 0.5rem;
}

.container {
  max-width: 100%;
  position: relative;
}

.table-container {
  border-radius: 0.75rem;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  margin: 0;
  font-size: 0.875rem;
  min-width: 600px;
}

.thead-light th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  vertical-align: middle;
  text-align: center;
  white-space: nowrap;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f2f2f2;
}

.table-hover tbody tr:hover {
  background-color: #e9ecef;
}

.shadow-lg {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn {
  font-size: 0.875rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.popup {
  max-width: 400px;
  width: 100%;
}
</style>
