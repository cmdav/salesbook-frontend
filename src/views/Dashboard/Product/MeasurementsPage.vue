<template>
  <DashboardLayout pageTitle="Measurement Page">
    <div class="actions">
      <input type="text" v-model="search" placeholder="Search..." class="search-input" />
      
      <div>
        <button class="button upload-btn" @click="openUploadModal()">Upload</button>
        <button class="button add-btn" @click="openCreateModal">Add</button>
      </div>
    </div>

    <section class="page-container">
      <div class="container">
        <div class="card-grid" v-if="purchaseUnits.length > 0">
          <div v-for="purchaseUnit in purchaseUnits" :key="purchaseUnit.id" class="purchase-card">
            <div class="purchase-card-header">
              <h4 class="text-2xl font-semibold">
                Purchase Unit: {{ purchaseUnit.purchase_unit_name }}
              </h4>
              <button
                class="add-selling-unit-button"
                @click="openCreateSellingUnitModal(purchaseUnit.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path fill="white" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" />
                </svg>
              </button>
              
              <button class="add-selling-unit-button" @click="openDeleteModal(purchaseUnit.id)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="white"
                    fill-rule="evenodd"
                    d="m6.774 6.4l.812 13.648a.8.8 0 0 0 .798.752h7.232a.8.8 0 0 0 .798-.752L17.226 6.4zm11.655 0l-.817 13.719A2 2 0 0 1 15.616 22H8.384a2 2 0 0 1-1.996-1.881L5.571 6.4H3.5v-.7a.5.5 0 0 1 .5-.5h16a.5.5 0 0 1 .5.5v.7zM14 3a.5.5 0 0 1 .5.5v.7h-5v-.7A.5.5 0 0 1 10 3zM9.5 9h1.2l.5 9H10zm3.8 0h1.2l-.5 9h-1.2z"
                  />
                </svg>
              </button>
            </div>
            <div v-if="purchaseUnit.selling_units.length > 0">
              <div
                v-for="sellingUnit in purchaseUnit.selling_units"
                :key="sellingUnit.id"
                class="selling-unit-card"
              >
                <div class="selling-unit-header">
                  <h5 class="text-lg font-medium">
                    Selling Unit: {{ sellingUnit.selling_unit_name }}
                  </h5>
                  <button
                    class="add-selling-capacity-button"
                    @click="openCreateSellingCapacityModal(sellingUnit.id)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path fill="white" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" />
                    </svg>
                  </button>

                  <!-- <button class="add-selling-unit-button" @click="openSellingDeleteModal(sellingUnit.id)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="white"
                    fill-rule="evenodd"
                    d="m6.774 6.4l.812 13.648a.8.8 0 0 0 .798.752h7.232a.8.8 0 0 0 .798-.752L17.226 6.4zm11.655 0l-.817 13.719A2 2 0 0 1 15.616 22H8.384a2 2 0 0 1-1.996-1.881L5.571 6.4H3.5v-.7a.5.5 0 0 1 .5-.5h16a.5.5 0 0 1 .5.5v.7zM14 3a.5.5 0 0 1 .5.5v.7h-5v-.7A.5.5 0 0 1 10 3zM9.5 9h1.2l.5 9H10zm3.8 0h1.2l-.5 9h-1.2z"
                  />
                </svg>
              </button> -->
                </div>
                <ul>
                  <li v-for="capacity in sellingUnit.selling_unit_capacities" :key="capacity.id">
                    Quantity: {{ capacity.selling_unit_capacity }}
                  </li>
                </ul>
                <button class="update-selling-unit-button" @click="openEditSellingUnitModal(sellingUnit)">
                Edit Selling Unit
              </button>
              </div>
            </div>
            <div v-else>
              <p class="text-center">No Selling Units Available</p>
            </div>
            <button class="update-selling-unit-button" @click="openEditPurchaseUnitModal(purchaseUnit)">
                Edit Purchase Unit
              </button>
          </div>
          

        </div>

        <div v-else>
          <p class="text-center">No purchase units found.</p>
        </div>

        

        <div v-if="!isSearching" class="mx-auto w-fit my-5">
          <Pagination
            :currentPage="currentPage"
            :totalPages="totalPages"
            @changePage="changePage"
          />
        </div>

        <div v-if="showDeleteModal" class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full">
          <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
            <header class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]">
            <h3 class="text-[22px] font-EBGaramond500 text-[#244034]">Confirm Deletion</h3>
            </header>
            <p class="text-center py-4">Are you sure you want to delete this purchase unit?</p>
            <div class="flex justify-center">
              <button @click="confirmDelete" class="btn-brand !bg-green-400 mr-6"> Delete</button>
              <button @click="closeDeleteModal" class="btn-brand !bg-red-600">Cancel</button>
            </div>
          </div>
        </div>
        <!-- <div v-if="showSellingDeleteModal" class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full">
          <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
            <header class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]">
            <h3 class="text-[22px] font-EBGaramond500 text-[#244034]">Confirm Deletion</h3>
            </header>
            <p class="text-center py-4">Are you sure you want to delete this selling unit?</p>
            <div class="flex justify-center">
              <button @click="confirmDelete" class="btn-brand !bg-green-400 mr-6"> Delete</button>
              <button @click="closeSellingDeleteModal" class="btn-brand !bg-red-600">Cancel</button>
            </div>
          </div>
        </div> -->

        <UploadModal
          v-if="showUploadModal"
          @close="closeUploadModal"
          @updated="forceRefresh"
          :url="'/process-csv'"
          type="PurchaseUnit"
          :downloadUrl="'purchase_unit'"
          :modalTitle="modalTitle"
        />
        <!-- Purchase Unit Modal -->
        <create-edit-modal
          v-if="isModalOpen"
          @close="closeModal"
          @purchase-unit-added="fetchPurchaseUnits"
          @purchase-unit-updated="fetchPurchaseUnits"
          :purchaseUnit="selectedPurchaseUnit"
        />

        <!-- Selling Unit Modal -->
        <create-selling-unit-modal
          v-if="isSellingUnitModalOpen"
          :purchaseUnitId="selectedPurchaseUnitId"
          @close="closeSellingUnitModal"
          @selling-unit-added="fetchPurchaseUnits"
          @selling-unit-updated="fetchPurchaseUnits"
          :sellingUnit="selectedSellingUnit"
        />

        <!-- Selling Unit Capacity Modal -->
        <selling-unit-capacity-modal
          v-if="isSellingUnitCapacityModalOpen"
          :sellingUnitId="selectedSellingUnitId"
          @close="closeSellingUnitCapacityModal"
          @selling-capacity-added="fetchPurchaseUnits"
        />
      </div>
    </section>

  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import apiService from '@/services/apiService'
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'
import DashboardLayout from '@/components/Layouts/dashboardLayout.vue'
import CreateEditModal from '@/components/UI/Modal/purchaseUnitModal.vue'
import UploadModal from '@/components/UI/Modal/UploadModal.vue'
import Pagination from '@/components/UI/Pagination/PaginatePage.vue'
import CreateSellingUnitModal from '@/components/UI/Modal/sellingUnitModal.vue'
import SellingUnitCapacityModal from '@/components/UI/Modal/sellingUnitCapacityModal.vue'

const purchaseUnits = ref([]);
const isModalOpen = ref(false);
const isSellingUnitModalOpen = ref(false);
const isSellingUnitCapacityModalOpen = ref(false);
const selectedPurchaseUnitId = ref(null);
const selectedSellingUnitId = ref(null);
const selectedPurchaseUnit = ref(null); 
const selectedSellingUnit = ref(null);

const showDeleteModal = ref(false);
const itemToDelete = ref(null);

const pagination = ref({});
const currentPage = ref(1);
const totalPages = ref(0);
const showUploadModal = ref(false);
const search = ref('');
const isSearching = ref(false);
const errorMessage = ref('');
const modalTitle =('Purchase Unit')

const emit = defineEmits(['edit-purchase-unit', 'edit-selling-unit'])

const fetchPurchaseUnits = async (page = 1) => {
  try {
    const response = await apiService.get(`purchase-units?page=${page}`)
    purchaseUnits.value = response.data
    console.log(response)
    console.log(response.data)
    pagination.value = {
      next_page_url: response.data.next_page_url,
      prev_page_url: response.data.prev_page_url
    }
    currentPage.value = response.current_page
    totalPages.value = response.last_page
  } catch (error) {
    console.error('Error fetching purchase units:', error)
    catchAxiosError(error)
  }
}

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    fetchPurchaseUnits(page);
  }
}

const openCreateModal = () => {
  isModalOpen.value = true;
  selectedPurchaseUnit.value = null;
}

const openCreateSellingUnitModal = (purchaseUnitId) => {
  selectedPurchaseUnitId.value = purchaseUnitId;
  isSellingUnitModalOpen.value = true;
}

const openCreateSellingCapacityModal = (sellingUnitId) => {
  selectedSellingUnitId.value = sellingUnitId;
  isSellingUnitCapacityModalOpen.value = true;
}

const closeModal = () => {
  isModalOpen.value = false;
}

const closeSellingUnitModal = () => {
  isSellingUnitModalOpen.value = false;
}

function openDeleteModal(item) {
  itemToDelete.value = item;
  console.log(itemToDelete.value)
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  itemToDelete.value = null;
}

const confirmDelete = () => {
  if (itemToDelete.value) {
    deleteUnit(itemToDelete.value)
    closeDeleteModal()
  }
}

const deleteUnit = async (id) => {
  console.log('Function Called')
  try {
    const response = await apiService.delete(`purchase-units/${id}`)
    // console.log(response)
    fetchPurchaseUnits(currentPage.value)
    catchAxiosSuccess(response)
  } catch (error) {
    catchAxiosError(error)
  }
}

const closeSellingUnitCapacityModal = () => {
  isSellingUnitCapacityModalOpen.value = false
}

onMounted(() => fetchPurchaseUnits(currentPage.value))
// onMounted(() => download())
watch(search, async (newSearch) => {
  if (newSearch) {
    isSearching.value = true
    try {
      const response = await apiService.get(`search-purchase-units?search=${newSearch}`)
      console.log(response.data)
      if (response.data.data.length > 0) {
        purchaseUnits.value = response.data.data
      } else {
        purchaseUnits.value = []
        errorMessage.value = response.data.message || 'No purchase units found for the search term.'
      }
      console.log(response.data.data)
      return purchaseUnits.value
    } catch (error) {
      console.error('Failed to fetch data:', error.message)
      purchaseUnits.value = []
      errorMessage.value = 'Error occurred while searching for purchase units.'
    } finally {
      isSearching.value = false
    }
  } else {
    isSearching.value = false
    errorMessage.value = ''
    fetchPurchaseUnits(currentPage.value)
  }
})

const openEditPurchaseUnitModal = (purchaseUnit) => {
  selectedPurchaseUnit.value = purchaseUnit;
  isModalOpen.value = true;
  // Pass the purchaseUnit to the modal
  // This assumes your modal accepts a `purchaseUnit` prop
  emit('edit-purchase-unit', purchaseUnit)
}

const openEditSellingUnitModal = (sellingUnit) => {
  console.log('clicked')
  selectedSellingUnit.value = sellingUnit;
  isSellingUnitModalOpen.value = true;

  emit('edit-selling-unit', sellingUnit)
}

function openUploadModal() {
  showUploadModal.value = true
  console.log('Clickedd')
}

function closeUploadModal() {
  showUploadModal.value = false
}

function forceRefresh() {
  fetchPurchaseUnits(currentPage.value)
}
</script>

<style scoped>
.actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.search-input {
  padding: 8px;
  width: 30%;
  border: 2px solid #ccc;
  border-radius: 4px;
}

.page-container {
  width: 100%;
  padding: 2em;
  background-color: #f4f5f7;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Changed to two columns */
  gap: 1.5em;
  width: 100%;
  justify-content: flex-start;
}

.purchase-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.purchase-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
}

.selling-unit-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
}

.selling-unit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.upload-btn {
  background-color: #c35214;
  margin-right: 2em;
}

.add-btn {
  /* margin-left:; */
  background-color: #c35214;
}

.add-button {
  background-color: #bf650a;
  color: white;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  margin-bottom: 1.5em;
  border-radius: 5px;
  font-size: 1em;
}

.add-button:hover {
  background-color: #45a049;
}

.add-selling-unit-button {
  background-color: #c8640b;
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 1.5em;
  border-radius: 50%;
}

.add-selling-unit-button:hover {
  background-color: #d67b0d;
}
.update-selling-unit-button {
  background-color: #c8640b;
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 1em;
  border-radius: 0.3em;
  width: fit-content;
  margin: 0 auto;
}

.update-selling-unit-button:hover {
  background-color: #d67b0d;
}

.add-selling-capacity-button {
  background-color: #c8640b;
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 1.5em;
  border-radius: 50%;
}

.add-selling-capacity-button:hover {
  background-color: #d67b0d;
}

.delete-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 4px;
  cursor: pointer;
  border-radius: 5px;
}

.delete-button:hover {
  background-color: #e53935;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.pagination button {
  padding: 8px 16px;
  background-color: #c35214;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.pagination span {
  padding: 8px 16px;
  background-color: #c35214;
  border-radius: 4px;
  color: white;
}

/* modal Style */

.modal {
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.modal__body {
  position: relative;
  max-width: 600px; 
  background-color: #fff;
  border-radius: 12px;
  animation: slidedown 0.8s ease;
  max-height: 90vh; 
  overflow-y: auto; 
}

.close-button {
  position: absolute;
  right: 20px;
  top: 20px;
  background: none;
  border: none;
  font-size: 25px;
  cursor: pointer;
}
</style>
