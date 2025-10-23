<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Our Sponsors</h2>

    <div class="d-flex justify-content-end gap-2 mb-3">
      <!-- Add Sponsor Tier Button -->
      <div v-if="isOscar" class="text-end mb-3">
        <button class="btn btn-primary" @click="toggleAddTierForm">
          Add Sponsor Tier
        </button>
      </div>

      <!-- Remove Sponsor Tier Button -->
      <div v-if="isOscar" class="text-end mb-3">
        <button class="btn btn-primary" @click="toggleRemoveTierForm">
          Remove Sponsor Tier
        </button>
      </div>

      <!-- Add Sponsor Button -->
      <div class="text-end mb-3">
        <button class="btn btn-primary" @click="toggleAddForm">
          Add Sponsor
        </button>
      </div>

      <!-- Remove Sponsor Button -->
      <div v-if="isOscar" class="text-end mb-3">
        <button class="btn btn-primary" @click="toggleRemoveForm">
          Remove Sponsor
        </button>
      </div>
    </div>

    <!-- Add Sponsor Tier Form -->
    <div v-if="showAddTierForm" class="popup-overlay">
      <div class="card p-3 popup">
        <h5>Add Sponsor Tier</h5>
        <form @submit.prevent="handleAddTier">
          <div v-if="addTierFormError" class="alert alert-danger p-2 mb-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i> {{ addTierFormError }}
          </div>
          <div class="mb-2">
            <label class="form-label">Name</label>
            <input v-model="addTierName" type="text" class="form-control" required/>
          </div>
          <div class="mb-2">
            <label class="form-label">Lower Threshold</label>
            <input v-model="addLowerThreshold" type="number" class="form-control" required/>
          </div>
          <div class="mb-2">
            <label class="form-label">Image Specs (Width x Height)</label>
            <div class="col-6">
              <input 
                type="number"
                class="form-control"
                placeholder="Width (px)"
                v-model="addImageWidth"
                required
              />
            </div>
            <div class="col-6">
              <input 
                type="number"
                class="form-control"
                placeholder="Height (px)"
                v-model="addImageHeight"
                required
              />
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button type="button" class="btn btn-secondary" @click="cancelAddTier">
              Cancel
            </button>
            <button type="submit" class="btn btn-success">Submit</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Remove Sponsor Tier Form -->
    <div v-if="showRemoveTierForm && isOscar" class="popup-overlay">
      <div class="card p-3 popup">
        <h5>Remove Sponsor Tier</h5>
        <form @submit.prevent="removeSponsorTiers">
          <div v-if="removeTierFormError" class="alert alert-danger p-2 mb-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i> {{ removeTierFormError }}
          </div>
          <p class="alert alert-warning">
            <strong>⚠️ Are you absolutely sure?</strong> 
            This will permanently delete the tier and cannot be undone.
          </p>
          
          <p>Please confirm the name of the tier you wish to delete:</p>
          <div class="mb-2">
            <label class="form-label">Name</label>
            <input v-model="removeTierName" type="text" class="form-control" />
          </div>
          
          <button type="button" class="btn btn-secondary" @click="cancelRemoveTier">
            Cancel
          </button>
          
          <button type="submit" class="btn btn-danger ms-2" :disabled="isDeleteButtonDisabled">
            Confirm Delete
          </button>
        </form>
      </div>
    </div>

    <!-- Add Sponsor Form -->
    <div v-if="showAddForm" class="popup-overlay">
      <div class="card p-3 popup">
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
            <label class="form-label">$ Amount</label>
            <input v-model.number="editAmount" type="number" class="form-control" required min="0" />
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
    </div>

    <!-- Remove Sponsor Form -->
    <div v-if="showRemoveForm && isOscar" class="popup-overlay">
      <div class="card p-3 popup">
        <h5>Remove Sponsor</h5>
        <form @submit.prevent="removeSponsor">
          <div v-if="removeFormError" class="alert alert-danger p-2 mb-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i> {{ removeFormError }}
          </div>
          <p class="alert alert-warning">
            <strong>⚠️ Are you absolutely sure?</strong> 
            This will permanently delete the sponsor and cannot be undone.
          </p>
          
          <p>Please confirm the name of the sponsor you wish to delete:</p>
          <div class="mb-2">
            <label class="form-label">Name</label>
            <input v-model="removeName" type="text" class="form-control" required />
          </div>
          <button type="button" class="btn btn-secondary" @click="cancelRemove">
              Cancel
          </button>
          <button type="submit" class="btn btn-danger ms-2" :disabled="isDeleteButtonDisabled">Confirm Delete</button>
        </form>
      </div>
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
          <div class="mb-2">
            <label class="form-label">$ Amount</label>
            <input v-model.number="editAmount" type="number" class="form-control" required min="0" />
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

    <!-- Edit Sponsor Tier Popup -->
    <div v-if="showEditTierForm && isOscar" class="popup-overlay">
      <div class="card p-3 popup" :key="currentEditTierId">
        <h5>Edit Sponsor Tier</h5>
        <form @submit.prevent="handleUpdateTier">
          <div v-if="editTierFormError" class="alert alert-danger p-2 mb-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i> {{ editTierFormError }}
          </div>
          <div class="mb-2">
            <label class="form-label">Tier Name</label>
            <input v-model="editTierName" type="text" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label">Minimum Donation Amount ($)</label>
            <input v-model.number="editTierLowerThreshold" type="number" class="form-control" required min="0" />
          </div>
          <div class="mb-2">
            <label class="form-label">Image Specs (Width x Height)</label>
            <div class="col-6">
              <input 
                type="number"
                class="form-control"
                placeholder="Width (px)"
                v-model="editImageWidth" required
                min="1"
              />
            </div>
            <div class="col-6">
              <input 
                type="number"
                class="form-control"
                placeholder="Height (px)"
                v-model="editImageHeight" required
                min="1"
              />
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" @click="cancelEditTier">
              Cancel
            </button>
            <button type="submit" class="btn btn-success">Save</button>
          </div>
        </form>
      </div>
    </div>

    <div class="row mt-4">

      <div class="col-md-4 mb-4"> 
          <h4 class="mb-3">Tier Ranges</h4>
          
          <div class="table-container shadow-lg rounded overflow-hidden">
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead class="thead-light">
                  <tr>
                    <th class="text-left">Tier Name</th>
                    <th class="text-left">Donation Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="tierRanges.length === 0">
                    <td colspan="2" class="alert alert-info p-2 text-center">No tiers defined</td>
                  </tr>
                  <tr v-for="(tierData, index) in tierRanges" :key="tierData.id || index" @click="openEditTierForm(tierData)" style="cursor: pointer;">
                    <td class="text-center">{{ tierData.tier }}</td>
                    <td class="text-center">{{ tierData.range }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
      </div>

      <div class="col-md-8 mb-4">
        <h4 class="mb-3">Sponsors List</h4>
        
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
                  <td colspan="3" class="alert alert-info p-2 text-center">No sponsors available</td>
                </tr>
                <tr 
                  v-for="(sponsor, index) in sponsors" 
                  :key="sponsor.id || index" 
                  @click="openEditForm(index)" 
                  style="cursor: pointer"
                  >
                  
                  <td 
                    class="text-left"
                    
                    :class="{ 'highlight-name-needs-update': isSponsorTierInvalid(sponsor, tiers) }"
                  >
                    {{ sponsor.name }}
                  </td>
                  
                  <td class="text-left">
                    {{ sponsor.tier }}
                  </td>
                  
                  <td class="text-left">{{ sponsor.website }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getSponsors, addSponsor, updateEventSponsor, deleteSponsor, getSponsorTiers, addSponsorTier, updateSponsorTier, removeSponsorTier } from "@/services/sponsorService";
import { useStore, mapGetters } from 'vuex';

// List of sponsors
const sponsors = ref([]);
const tiers = ref([]);
const currentEventId = ref(null);

// Form state - for sponsors
const addName = ref("");
const addTier = ref("");
const addWebsite = ref("");
const addPNG = ref("");
const addAmount = ref(0);
const removeName = ref("");
const showAddForm = ref(false);
const showRemoveForm = ref(false);

// Add Sponsor Tier Variables
const addImageHeight = ref(null);
const addImageWidth = ref(null);
const addTierName = ref("");
const showAddTierForm = ref(false);
const addLowerThreshold = ref(null);
const showRemoveTierForm = ref(false);
const removeTierName = ref("");

const showEditTierForm = ref(false);
const currentEditTierId = ref(null);
const editTierName = ref("");
const editTierLowerThreshold = ref(null);
const editTierFormError = ref(null);
const editImageHeight = ref(null);
const editImageWidth = ref(null);

// Error State Variables
const addFormError = ref(null);
const editFormError = ref(null);
const removeFormError = ref(null);
const addTierFormError = ref(null);
const removeTierFormError = ref(null);

// Edit sponsor state
const showEditForm = ref(false);
const editIndex = ref(null);
const editId = ref(null);
const editName = ref("");
const editTier = ref("");
const editWebsite = ref("");
const editPNG = ref("");
const editAmount = ref(0);

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

const store = useStore();

// Checks if the user is oscar level
const isOscar = computed(() => {
    return store.getters.UserRole === 'oscar'; 
});

const formatCurrency = (amount) => {
  // Assuming amount is a number or can be converted to one
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0, // No cents needed for thresholds
  }).format(amount);
};

const tierRanges = computed(() => {
  if (!tiers.value || tiers.value.length === 0) {
    return [];
  }

  const sortedTiers = [...tiers.value].sort((a, b) => {
    const aValue = Number(a.lowerThreshold || 0); 
    const bValue = Number(b.lowerThreshold || 0);
    
    return aValue - bValue; 
  });

  const result = [];

  for (let i = 0; i < sortedTiers.length; i++) {
    const currentTier = sortedTiers[i];
    const nextTier = sortedTiers[i + 1];
    
    // Lower boundary of the current range
    const lower = Number(currentTier.lowerThreshold || 0); 
    
    let higherThreshold;

    if (nextTier) {
      const nextLower = Number(nextTier.lowerThreshold || 0);
      higherThreshold = formatCurrency(nextLower - 1);
    } else {
      // Highest tier range
      higherThreshold = 'and up';
    }

    const lowerThreshold = formatCurrency(lower);

    result.push({
      tier: currentTier.tier,
      range: `${lowerThreshold} - ${higherThreshold}`, 
      id: currentTier.id, 
      lowerThreshold: lower,
      imageWidth: currentTier.width, 
      imageHeight: currentTier.height,
    });
  }
  return result;
});

const validateTierAmount = (amount, tierId) => {
  const selectedTier = tiers.value.find(t => t.id === tierId);

  if(!selectedTier){
    console.warn("Selected tier ID not found for validation.");
    return null;
  }

  const lowerThreshold = Number(selectedTier.lowerThreshold || 0);

  const sortedTiers = [...tiers.value].sort((a, b) =>
    Number(a.lowerThreshold || 0) - Number(b.lowerThreshold || 0)
  );

  let upperThreshold = Infinity;
  let upperThresholdDisplayValue;

  const currentIndex = sortedTiers.findIndex(t => t.id === tierId);

  if(currentIndex !== -1){
    const nextTier = sortedTiers[currentIndex + 1];

    if(nextTier){
      const nextLower = Number(nextTier.lowerThreshold);

      upperThreshold = nextLower;
      upperThresholdDisplayValue = nextLower - 1;
    }else{
      upperThreshold = Infinity;
      upperThresholdDisplayValue = "up";
    }
  }else{
    upperThreshold = Infinity;
    upperThresholdDisplayValue = "up";
  }

  if(amount >= lowerThreshold && amount < upperThreshold){
    return null;
  }
  
  const minRange = formatCurrency(lowerThreshold);
  
  let maxRange;
  if (upperThresholdDisplayValue === "up") {
      maxRange = "and up";
  } else {
      maxRange = formatCurrency(upperThresholdDisplayValue);
  }
  
  return `The entered amount (${formatCurrency(amount)}) does not match the selected tier range (${minRange} - ${maxRange}).`;
}

const isSponsorTierInvalid = (sponsor, currentTiers) => {
    const amount = Number(sponsor.amount) || 0;
    const assignedTierName = sponsor.tier; 

    // Find the currently assigned tier object
    const assignedTier = currentTiers.find(t => t.tier === assignedTierName);
    if (!assignedTier) {
        // Highlight if tier ID is missing (deleted tier)
        return true; 
    }

    const lowerThreshold = Number(assignedTier.lowerThreshold || 0);

    // Sort tiers to find the threshold of the next tier
    const sortedTiers = [...currentTiers].sort((a, b) =>
        Number(a.lowerThreshold || 0) - Number(b.lowerThreshold || 0)
    );

    let upperLimit = Infinity;
    const currentIndex = sortedTiers.findIndex(t => t.tier === assignedTierName);

    if (currentIndex !== -1) {
        const nextTier = sortedTiers[currentIndex + 1];
        if (nextTier) {
            const nextLowerThreshold = Number(nextTier.lowerThreshold || 0);
            upperLimit = nextLowerThreshold - 1;
        }
    }
    
    // Check 1: Must be >= lowerThreshold
    const isAboveLower = amount >= lowerThreshold;
    
    // Check 2: Must be <= upperLimit (which is the effective ceiling, e.g., $1,500)
    const isBelowUpper = amount <= upperLimit;

    // The tier is VALID if BOTH checks pass.
    return !(isAboveLower && isBelowUpper);
};

const isDeleteButtonDisabled = computed(() => {
  const enteredName = removeTierName.value.trim();

  // Checks if it's blank -> should be grayed out
  if(enteredName === '') return true;

  const tierExists = tiers.value.some(tier => {
    // Checks if the name exists
    return tier.tier.toLowerCase() === enteredName.toLocaleLowerCase();
  });

  return !tierExists;
});

const fetchSponsorsAndTiers = async () => {
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
          amount: s.amount ?? 0,
          tier: s.tier || "",
          sponsorTierId: s.tierId || null,
          image: s.image || "",
          imageWidth: s.imageWidth ?? null,
          imageHeight: s.imageHeight ?? null,   
        }))
      : [];

    const resTiers = await getSponsorTiers();
    tiers.value = Array.isArray(resTiers.data) ? resTiers.data : [];
  }catch (err){
      console.error("Error fetching sponsors: ", err);
  }
}

// Fetch sponsors on load
onMounted(async () => {
    await fetchSponsorsAndTiers();
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

const toggleAddTierForm = async () => {
  showAddTierForm.value = !showAddTierForm.value;
  addTierName.value = '';
  addLowerThreshold.value = null;
  addImageHeight.value = null;
  addImageWidth.value = null;
  addTierFormError.value = null;
};

const toggleRemoveTierForm = () => {
  showRemoveTierForm.value = !showRemoveTierForm.value;
  removeTierFormError.value = null;
}

const cancelAdd = () => {
  showAddForm.value = false;
  addFormError.value = null;
}

const cancelRemove = () => {
    showRemoveForm.value = false;
    removeFormError.value = null;
    removeName.value = "";
}

const cancelAddTier = () => {
  showAddTierForm.value = false;
  addTierFormError.value = null;
}

const cancelRemoveTier = () => {
  showRemoveTierForm.value = false;
  removeTierFormError.value = null;
  removeTierName.value = '';
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

  const tierValidationMessage = validateTierAmount(addAmount.value, addTier.value);
  if (tierValidationMessage) {
      addFormError.value = tierValidationMessage;
      return;
  }

  const transformedWebsite = transformUrlForServer(addWebsite.value);

  try {
    const eventId = await getCurrentEventId();

    await addSponsor({
      sponsorName: addName.value,
      sponsorWebsite: transformedWebsite,
      image: addPNG.value || null,
      amount: addAmount.value,
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
    addAmount.value = 0;
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

  if(!SponsorToRemove || !SponsorToRemove.id){
    removeFormError.value = `Sponsor named "${removeName.value}" was not found. Please check the spelling.`;
    return;
  }

  try {
    const idToDelete = SponsorToRemove.id;
    const eventId = await getCurrentEventId();
  
    await deleteSponsor(idToDelete, eventId);
  
    const index = sponsors.value.findIndex((s) => s.id === idToDelete);
    if(index !== -1){
      sponsors.value.splice(index, 1);
    }
  
    removeName.value = "";
    showRemoveForm.value = false;
  } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to delete sponsor due to a network or server error.";
      removeFormError.value = errorMessage;
  }
};

// Handles Adding Tiers
const handleAddTier = async () => {
  addTierFormError.value = null;

  // const threshold = Number(addLowerThreshold.value);
  if(!addTierName.value || addLowerThreshold.value === null){
    addTierFormError.value = "Lower Threshold must be a non-negative number.";
    return;
  }

  const threshold = Number(addLowerThreshold.value); 
  if(isNaN(threshold) || threshold < 0){
    addTierFormError.value = "Lower Threshold must be a valid, non-negative number.";
    return;
  }

  const width = Number(addImageWidth.value);
  const height = Number(addImageHeight.value);
  if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0) {
    addTierFormError.value = "Image Width and Height must be positive numbers.";
    return;
  }

  try{
    await addSponsorTier({
      tier: addTierName.value,
      lowerThreshold: threshold,
      width: width,
      height: height
    });

    const resTiers = await getSponsorTiers();
    tiers.value = Array.isArray(resTiers.data) ? resTiers.data : [];

    showAddTierForm.value = false;
  }catch (err){
    const errorMessage = err.response?.data?.error || "Failed to add sponsor tier.";
    addTierFormError.value = errorMessage;
  }
}

const openEditTierForm = (tierData) => {
  // console.log("Tier Data Received: ", tierData);
  currentEditTierId.value = tierData.id;
  editTierName.value = tierData.tier;
  editTierLowerThreshold.value = tierData.lowerThreshold;
  
  editImageWidth.value = tierData.imageWidth; 
  editImageHeight.value = tierData.imageHeight;
  
  showEditTierForm.value = true;
};

const cancelEditTier = () => {
  showEditTierForm.value = false;
  currentEditTierId.value = null;
  editTierFormError.value = null;
}

const handleUpdateTier = async () => {
    editTierFormError.value = null;

    const threshold = Number(editTierLowerThreshold.value);
    
    const imageWidth = Number(editImageWidth.value);
    const imageHeight = Number(editImageHeight.value);
    
    if(!editTierName.value || isNaN(threshold) || threshold < 0 || isNaN(imageWidth) || imageWidth <= 0 || isNaN(imageHeight) || imageHeight <= 0){
      editTierFormError.value = "All fields must be valid. Tier Name cannot be empty. Threshold must be non-negative. Image dimensions must be positive numbers.";
      return;
    }

    try{
      await updateSponsorTier(currentEditTierId.value, {
        tier: editTierName.value,
        lowerThreshold: threshold,
        width: imageWidth,
        height: imageHeight
      });

      await fetchSponsorsAndTiers();

      showEditTierForm.value = false;
  }catch (err){
      const errorMessage = err.response?.data?.error || "Failed to update sponsor tier.";
      editTierFormError.value = errorMessage;
  }
}

const removeSponsorTiers = async () => {
  removeTierFormError.value = null;

  const TierToRemove = tiers.value.find((s) => s.tier === removeTierName.value);

  if(!TierToRemove || !TierToRemove.id){
    removeTierFormError.value = `Sponsor named "${removeTierName.value}" was not found. Please check the spelling.`;
    return;
  }

  try {
    const idToDelete = TierToRemove.id;
  
    await removeSponsorTier(idToDelete);

    const index = tiers.value.findIndex((t) => t.id === idToDelete);
    if(index !== -1){
      tiers.value.splice(index, 1);
    }
    
    const resTiers = await getSponsorTiers();
    tiers.value = Array.isArray(resTiers.data) ? resTiers.data : [];
  
    removeTierName.value = "";
    showRemoveTierForm.value = false;
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to delete sponsor tier due to a server error.";
    removeTierFormError.value = errorMessage;
  }
};

// Open edit form
const openEditForm = async (index) => {
    const sponsor = sponsors.value[index];
    editIndex.value = index;
    editId.value = sponsor.id;
    editName.value = sponsor.name;
    editTier.value = tiers.value.find(t => t.tier === sponsor.tier)?.id || "";
    editAmount.value = sponsor.amount;
    editWebsite.value = revertUrlFromServer(sponsor.website);
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

  const tierValidationMessage = validateTierAmount(editAmount.value, editTier.value);
  if (tierValidationMessage) {
      editFormError.value = tierValidationMessage;
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
          amount: editAmount.value,
          sponsorTierId: editTier.value,
          eventId: currentEventId.value,
        });

        await updateEventSponsor(editId.value, {
            sponsorName: editName.value,
            sponsorWebsite: transformedWebsite,
            image: editPNG.value || null,
            amount: editAmount.value,
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

        sponsors.value[editIndex.value].amount = editAmount.value;
        sponsors.value[editIndex.value].name = editName.value;
        sponsors.value[editIndex.value].website = editWebsite.value;
        sponsors.value[editIndex.value].tier = tiers.value.find(t => t.id === editTier.value)?.tier || "";
        sponsors.value[editIndex.value].image = editPNG.value || "";
      }
      showEditForm.value = false;
      editIndex.value = null;
      editId.value = null;
  }catch (err){
    // console.error("Error updating sponsor: ", err);
    const errorMessage = err.response?.data?.message || err.response?.data?.error || "An unknown error occurred during update.";
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

.table {
  margin: 0;
  font-size: 0.875rem;
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

.col-md-9 .table tbody tr td:nth-child(3){
  word-break: break-all;
  max-width: 200px;
  text-align: left !important;
}

.highlight-name-needs-update {
    /* Subtle background to draw attention */
    background-color: #ffe6e6 !important; 
    /* Prominent text color */
    color: #cc0000 !important;
    font-weight: bold;
    /* Optional: A subtle border on the left of the cell */
    border-left: 3px solid #e74c3c;
}

</style>
