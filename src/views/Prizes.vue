<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Prizes & Categories</h2>

    <div class="d-flex justify-content-end gap-2 mb-3">
      <!-- Add Category Button -->
      <div v-if="isOscar" class="text-end mb-3">
        <button class="btn btn-primary" @click="toggleAddCategoryForm">
          Add Category
        </button>
      </div>
    </div>

    <!-- Add Category Form -->
    <!-- This really only has the name, but will eventually have the subcategories -->
    <div v-if="showAddCategoryForm && isOscar" class="popup-overlay">
      <div class="card p-3 popup">
        <h5>Add Category</h5>
        <form @submit.prevent="handleAddCategory">
          <div v-if="addCategoryFormError" class="alert alert-danger p-2 mb-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i> {{ addCategoryFormError }}
          </div>
          <div class="mb-2">
            <label class="form-label">Name</label>
            <input v-model="currentAddCategory_Name" type="text" class="form-control" required/>
          </div>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button type="button" class="btn btn-secondary" @click="cancelAddCategory">
              Cancel
            </button>
            <button type="submit" class="btn btn-success">Submit</button>
          </div>
        </form>
      </div>
    </div>


    <!-- Edit Category Popup -->
    <div v-if="showEditCategoryForm && isOscar" class="popup-overlay">
      <div class="card p-3 popup" :key="currentEditCategory_Id">
        <h5>Edit Category</h5>
        <form @submit.prevent="handleEditCategory">
          <div v-if="editCategoryFormError" class="alert alert-danger p-2 mb-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i> {{ editCategoryFormError }}
          </div>
          <div class="mb-2">
            <label class="form-label">Category Name</label>
            <input v-model="currentEditCategory_Name" type="text" class="form-control" required />
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-danger" @click="handleRemoveCategory">
              Remove
            </button>
            <button type="button" class="btn btn-secondary align-self-end ms-auto" @click="cancelEditCategory">
              Cancel
            </button>
            <button type="submit" class="btn btn-success">Save</button>
          </div>
        </form>
      </div>
    </div>


    <!-- Add Prize Form -->
    <div v-if="showAddPrizeForm && isOscar" class="popup-overlay">
      <div class="card p-3 popup">
        <h5>Add Prize</h5>
        <form @submit.prevent="handleAddPrize">
          <div v-if="addPrizeFormError" class="alert alert-danger p-2 mb-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i> {{ addPrizeFormError }}
          </div>
          <div class="mb-2">
            <label class="form-label">Name</label>
            <input v-model="currentAddPrize_Name" type="text" class="form-control" required/>

            <label class="form-label">Placement</label>
            <input v-model="currentAddPrize_Placement" type="number" min=1 class="form-control" required/>

            <label class="form-label">Handed Out</label>
            <input v-model="currentAddPrize_HandedOut" type="checkbox" class=""/>
          </div>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button type="button" class="btn btn-secondary" @click="cancelAddPrize">
              Cancel
            </button>
            <button type="submit" class="btn btn-success">Submit</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Prize Form -->
    <div v-if="showEditPrizeForm && isOscar" class="popup-overlay">
      <div class="card p-3 popup">
        <h5>Edit Prize</h5>
        <form @submit.prevent="handleEditPrize">
          <div v-if="editPrizeFormError" class="alert alert-danger p-2 mb-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i> {{ editPrizeFormError }}
          </div>
          <div class="mb-2">
            <label class="form-label">Name</label>
            <input v-model="currentEditPrize_Name" type="text" class="form-control" required/>

            <label class="form-label">Placement</label>
            <input v-model="currentEditPrize_Placement" type="number" min=1 class="form-control" required/>

            <label class="form-label">Handed Out</label>
            <input v-model="currentEditPrize_HandedOut" type="checkbox" class=""/>
          </div>
          <div class="d-flex gap-2 mt-3">
            <button type="button" class="btn btn-danger" @click="handleRemovePrize">
              Remove
            </button>
            <button type="button" class="btn btn-secondary align-self-end ms-auto" @click="cancelEditPrize">
              Cancel
            </button>
            <button type="submit" class="btn btn-success">Submit</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Categories Tables -->
    <div v-if="categories.length === 0" class="col-md-12 mb-4">
      <div class="alert alert-info p-2 text-center">No categories yet</div>
    </div>

    <div class="col-md-12 mb-4" v-for="categoryData in categories" :key="categoryData.id" style="padding-bottom: 5vw">
      <div class="container">
        <div class="row mb-1 justify-content-between">

          <div class="col col-auto me-1 align-self-center px-2">
            <h4 class="mb-0">{{categoryData.categoryName}}</h4>
          </div>
          <button class="col col-1 btn btn-primary" @click="openEditCategoryForm(categoryData.id)">Edit</button>

          <div v-if="isOscar" class="col text-end">
            <button class="btn btn-primary" @click="openAddPrizeForm(categoryData.id)">
              Add Prize
            </button>
          </div>
        </div>
      </div>

      <div class="table-container shadow-lg rounded overflow-hidden">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="thead-light">
              <tr>
                <th class=text-left>Placement</th>
                <th class=text-left>Name</th>
                <th class=text-left>Handed Out?</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="prizes.filter((p) => p.categoryId === categoryData.id).length === 0">
                <td colspan=3 class="alert alert-info text-center">No prizes yet</td>
              </tr>

              <tr
                  v-for="prize in prizes
                      .filter(p => p.categoryId === categoryData.id)
                      .sort((p1, p2) => p1.placement - p2.placement)"
                  @click="openEditPrizeForm(prize.id)">

                <td class=text-center>{{prize.placement}}</td>
                <td class=text-center>{{prize.prizeName}}</td>
                <td class=text-center>{{prize.handedOut? "Yes" : "No"}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="ms-2">
        <p>Click a prize to edit.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from 'vuex';

const store = useStore();

// List of categories
const categories = ref([]);
const prizes = ref([]);
const currentEventId = ref(null);


// Category Form states
const showAddCategoryForm = ref(false);
const showEditCategoryForm = ref(false);

const currentAddCategory_Name = ref("");
const addCategoryFormError = ref(null);

const currentEditCategory_Id = ref(null);
const currentEditCategory_Name = ref(null);
const currentEditCategory_EventId = ref(null);
const editCategoryFormError = ref(null);

// Prize Form States
const showAddPrizeForm = ref(false);
const showEditPrizeForm = ref(false);

const currentAddPrize_Name = ref("");
const currentAddPrize_CategoryId = ref(null);
const currentAddPrize_Placement = ref(null);
const currentAddPrize_HandedOut = ref(null);
const addPrizeFormError = ref(null);

const currentEditPrize_Id = ref(null);
const currentEditPrize_EventId = ref(null);
const currentEditPrize_Name = ref("");
const currentEditPrize_CategoryId = ref(null);
const currentEditPrize_Placement = ref(null);
const currentEditPrize_HandedOut = ref(null);
const editPrizeFormError = ref(null);


// Validate Characters
const validateName = (name) => {
  // Regex restricts input to standard keyboard characters:
  // letters (a-z), numbers (0-9), space (\s), and common punctuation in company names.
  // The 'i' flag makes it case-insensitive (a-zA-Z).
  const allowedChars = /^[a-zA-Z0-9\s\-.()'&!@#$%,]+$/;
  // ^ may change later since this is for categories ^

  // If the name is empty, we let the 'required' attribute handle it.
  if (!name) return null;

  if (!allowedChars.test(name)) {
    return "Category Name contains restricted characters. Please use only standard letters, numbers, spaces, and common symbols (e.g., -, ., ', &, @, #).";
  }
  return null;// what's the difference between this null and the name not being given null?
};


// Checks if the user is oscar level
const isOscar = computed(() => {
    return store.getters.UserRole === 'oscar';
});

const isCategoryDeleteButtonDisabled = computed(() => {
  const enteredName = currentRemoveCategory_Name.value.trim();

  // Checks if it's blank -> should be grayed out
  if(enteredName === '') return true;

  const categoryExists = categories.value.some(category => {
    // Checks if the name exists
    return category.categoryName.toLowerCase() === enteredName.toLocaleLowerCase();
  });

  return !categoryExists;
});



const fetchCategories = async () => {
  try{
    if (!currentEventId.value) {
      let eventId = null;

      const activeEvent = await store.dispatch('getActiveEvent');

      if (activeEvent.success) {
        eventId = store.getters.getEvent.id;
      }
      else
      {
        console.warn("Could not determine current event ID. Cannot fetch categories.");
        categories.value = [];
        return;
      }

      currentEventId.value = eventId;
    }

    const getEventCategoriesSuccess = await store.dispatch('getCategoriesForEvent', currentEventId.value);

    if (!getEventCategoriesSuccess.success) {
      console.warn("Could not get categories from event ID.");
      categories.value = [];
      return;
    }

    const categoriesForEvent = store.getters.getCategories;
    categories.value = Array.isArray(categoriesForEvent)
      ? categoriesForEvent.map(s => ({
          id: s.id,
          categoryName: s.categoryName,
          eventId: s.eventId
        })) : [];
  }
  catch (err){
      console.error("Error fetching categories: ", err);
  }
}

const fetchPrizes = async () => {
  try{
    if (!currentEventId.value) {
      let eventId = null;

      const activeEvent = await store.dispatch('getActiveEvent');

      if (activeEvent.success) {
        eventId = store.getters.getEvent.id;
      }
      else
      {
        console.warn("Could not determine current event ID. Cannot fetch prizes.");
        prizes.value = [];
        return;
      }

      currentEventId.value = eventId;
    }

    const getEventPrizesSuccess = await store.dispatch('getPrizesForEvent', currentEventId.value);

    if (!getEventPrizesSuccess.success) {
      console.warn("Could not get prizes from event ID.");
      prizes.value = [];
      return;
    }

    let prizesForEvent = store.getters.getPrizes;
    prizes.value = Array.isArray(prizesForEvent)
        ? prizesForEvent.map(s => ({
          id: s.id,
          eventId: s.eventId,
          prizeName: s.prizeName,
          categoryId: s.categoryId,
          placement: s.placement,
          handedOut: s.handedOut
        })) : [];
  }
  catch (err){
    console.error("Error fetching categories: ", err);
  }
}

// Fetch categories on load
onMounted(async () => {

    const activeEventResp = await store.dispatch('getActiveEvent');
    if (activeEventResp) {
      currentEventId.value = activeEventResp.eventId;
    }

    await fetchCategories();
    await fetchPrizes();
});

// Toggle Category Forms
const toggleAddCategoryForm = async () => {
  showAddCategoryForm.value = !showAddCategoryForm.value;
  currentAddCategory_Name.value = '';
  addCategoryFormError.value = null;
};

const toggleEditCategoryForm = async (categoryId) => {
  showEditCategoryForm.value = !showEditCategoryForm.value;
  currentEditCategory_Id.value = categoryId;
  currentEditCategory_Name.value = '';
  editCategoryFormError.value = null;
};

// Cancel Category Forms
const cancelAddCategory = () => {
  showAddCategoryForm.value = false;
  currentAddCategory_Name.value = '';
  addCategoryFormError.value = null;
}

const cancelEditCategory = () => {
  showEditCategoryForm.value = false;
  currentEditCategory_Id.value = null;
  editCategoryFormError.value = null;
}


// Toggle Prize Forms
const openAddPrizeForm = (categoryId) => {
  showAddPrizeForm.value = true;
  currentAddPrize_Name.value = "";
  currentAddPrize_CategoryId.value = categoryId;
  currentAddPrize_Placement.value = null;
  currentAddPrize_HandedOut.value = false;
  addPrizeFormError.value = null;
}

const openEditPrizeForm = (prizeId) => {
  const prizeFromId = prizes.value.find(p => p.id === prizeId);

  console.log(prizeId);

  showEditPrizeForm.value = true;
  currentEditPrize_Id.value = prizeId;
  currentEditPrize_Name.value = prizeFromId.prizeName;
  currentEditPrize_CategoryId.value = prizeFromId.categoryId;
  currentEditPrize_Placement.value = prizeFromId.placement;
  currentEditPrize_HandedOut.value = prizeFromId.handedOut;
  addPrizeFormError.value = null;
}

// Cancel Prize Forms
const cancelAddPrize = () => {
  showAddPrizeForm.value = false;
  currentAddPrize_Name.value = "";
  currentAddPrize_CategoryId.value = null;
  currentAddPrize_Placement.value = null;
  currentAddPrize_HandedOut.value = null;
  addPrizeFormError.value = null;
}

const cancelEditPrize = () => {
  showEditPrizeForm.value = false;
  currentEditPrize_Id.value = null;
  currentEditPrize_Name.value = "";
  currentEditPrize_Placement.value = null;
  currentEditPrize_HandedOut.value = null;
  editPrizeFormError.value = null;
}

const handleAddCategory = async () => {
  addCategoryFormError.value = null;

  try{
    const category = await store.dispatch('createCategory', {
      categoryName: currentAddCategory_Name.value,
      eventId: currentEventId.value
    });

    const resCategories = await store.getters.getCategories;
    categories.value = resCategories === null ? [] : resCategories;

    showAddCategoryForm.value = false;
  }catch (err){
    addCategoryFormError.value = err || "Failed to add sponsor tier.";
  }
}


const handleAddPrize = async () => {
  addPrizeFormError.value = null;

  try{
    const prize = await store.dispatch('createPrize', {
      eventId: currentEventId.value,
      prizeName: currentAddPrize_Name.value,
      categoryId: currentAddPrize_CategoryId.value,
      placement: currentAddPrize_Placement.value,
      handedOut: currentAddPrize_HandedOut.value
    });

    const resPrizes = await store.getters.getPrizes;
    prizes.value = resPrizes === null ? [] : resPrizes;

    showAddPrizeForm.value = false;
  }catch (err){
    addPrizeFormError.value = err || "Failed to add sponsor tier.";
  }

}


const handleEditCategory = async (categoryId) => {
    editCategoryFormError.value = null;

    try{
      await store.dispatch('updateCategory', {
        id: currentEditCategory_Id.value,
        categoryName: currentEditCategory_Name.value,
        eventId: currentEventId.value,
      });

      await fetchCategories();

      showEditCategoryForm.value = false;
  }catch (err){
      editCategoryFormError.value = err || "Failed to update category.";
  }
}

const handleEditPrize = async () => {
  editPrizeFormError.value = null;

  try{
    console.log("Category ID: " + currentEditPrize_CategoryId.value)

    await store.dispatch('updatePrize', {
      id: currentEditPrize_Id.value,
      eventId: currentEventId.value,
      prizeName: currentEditPrize_Name.value,
      categoryId: currentEditPrize_CategoryId.value,
      placement: currentEditPrize_Placement.value,
      handedOut: currentEditPrize_HandedOut.value
    });

    await fetchPrizes();

    showEditPrizeForm.value = false;
  }catch (err){
    editPrizeFormError.value = err || "Failed to update prize.";
  }
}

const handleRemoveCategory = async () => {

  try {
    const idToDelete = currentEditCategory_Id.value;
    const deleteResp = await store.dispatch('deleteCategory', idToDelete);

    if (!deleteResp.success)
      return;

    const index = categories.value.findIndex((c) => c.id === idToDelete);
    if(index !== -1){
        categories.value.splice(index, 1);
    }

    const resCategories = await store.getters.getCategories;
    categories.value = resCategories === null ? [] : resCategories;


    currentEditCategory_Id.value = null;
    currentEditCategory_Name.value = null;
    currentEditCategory_EventId.value = null;

    showEditCategoryForm.value = false;

  } catch (err) {
      editCategoryFormError.value = err || "Failed to delete category due to a server error.";
  }
};

const handleRemovePrize = async () => {
  try {
    const idToDelete = currentEditPrize_Id.value;
    const deleteResp = await store.dispatch('deletePrize', idToDelete);

    if (!deleteResp.success)
      return;

    const index = prizes.value.findIndex((c) => c.id === idToDelete);
    if(index !== -1) {
      prizes.value.splice(index, 1);
    }

    const resPrizes = await store.getters.getPrizes;
    prizes.value = resPrizes === null ? [] : resPrizes;

    currentEditPrize_Id.value = null;
    currentEditPrize_Name.value = null;
    currentEditPrize_CategoryId.value = null;
    currentEditPrize_Placement.value = null;
    currentEditPrize_HandedOut.value = null;
    currentEditPrize_EventId.value = null;

    showEditPrizeForm.value = false;
  } catch (err) {
    editPrizeFormError.value = err || "Failed to delete sponsor tier due to a server error.";
  }
};


// Open edit form
const openEditCategoryForm = async (categoryId) => {
  const category = categories.value.find((category) => category.id === categoryId);
  currentEditCategory_Id.value = category.id;
  currentEditCategory_Name.value = category.categoryName;
  currentEditCategory_EventId.value = category.eventId;
  showEditCategoryForm.value = true;
  editCategoryFormError.value = null;
};
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

.preview-img {
  width: 140px;
  height: auto;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-top: 5px;
}

</style>
