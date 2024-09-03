<template>
  <DashboardLayout pageTitle="Measurement Page">
    <div class="actions">
      <input type="text" v-model="search" placeholder="Search..." class="search-input" />
      <div >
          <button class="button upload-btn" @click="openUploadModal()">Upload</button>
          <button class="button add-btn" @click="openCreateModal">Add</button>
        </div>
    </div>

    <section class="page-container">
      <div class="container">
        <!-- <div class="container_btn">
          <button class="add-button" @click="openUploadModal()">Upload Purchase Units</button>
          <button class="add-button" @click="openCreateModal">Add New Purchase Unit</button>
        </div> -->
        <div class="card-grid">
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
              <!-- <button class="add-selling-unit-button" @click="deletePurchase(id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" fill-rule="evenodd" d="m6.774 6.4l.812 13.648a.8.8 0 0 0 .798.752h7.232a.8.8 0 0 0 .798-.752L17.226 6.4zm11.655 0l-.817 13.719A2 2 0 0 1 15.616 22H8.384a2 2 0 0 1-1.996-1.881L5.571 6.4H3.5v-.7a.5.5 0 0 1 .5-.5h16a.5.5 0 0 1 .5.5v.7zM14 3a.5.5 0 0 1 .5.5v.7h-5v-.7A.5.5 0 0 1 10 3zM9.5 9h1.2l.5 9H10zm3.8 0h1.2l-.5 9h-1.2z"/></svg>
              </button> -->
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
                </div>
                <ul>
                  <li v-for="capacity in sellingUnit.selling_unit_capacities" :key="capacity.id">
                    Quantity: {{ capacity.selling_unit_capacity }}
                  </li>
                </ul>
              </div>
            </div>
            <div v-else>
              <p class="text-center">No Selling Units Available</p>
            </div>
          </div>
        </div>


        <div v-if="!isSearching" class="mx-auto w-fit my-5">
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage" />
    </div>
        <!-- <div class="pagination">
          <button @click="changePage(currentPage - 1)" :disabled="!pagination.prev_page_url">
            Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="changePage(currentPage + 1)" :disabled="!pagination.next_page_url">
            Next
          </button>
        </div> -->

        <UploadModal
          v-if="showUploadModal"
          @close="closeUploadModal"
          @updated="forceRefresh"
          :url="'/process-csv'"
          type="PurchaseUnit"
        />
        <!-- Purchase Unit Modal -->
        <create-edit-modal
          v-if="isModalOpen"
          @close="closeModal"
          @purchase-unit-added="fetchPurchaseUnits"
        />

        <!-- Selling Unit Modal -->
        <create-selling-unit-modal
          v-if="isSellingUnitModalOpen"
          :purchaseUnitId="selectedPurchaseUnitId"
          @close="closeSellingUnitModal"
          @selling-unit-added="fetchPurchaseUnits"
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

    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemToDelete"
      :url="'purchase-units'"
      :modalTitle="modalTitle"
    />
  </DashboardLayout>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import apiService from '@/services/apiService'
import { catchAxiosError } from '@/services/Response'
import DashboardLayout from '@/components/Layouts/dashboardLayout.vue'
import CreateEditModal from '@/components/UI/Modal/purchaseUnitModal.vue'
import DeleteModal from '@/components/UI/Modal/DeleteModals.vue'
import UploadModal from '@/components/UI/Modal/UploadModal.vue'
import Pagination from '@/components/UI/Pagination/PaginatePage.vue';
import CreateSellingUnitModal from '@/components/UI/Modal/sellingUnitModal.vue'
import SellingUnitCapacityModal from '@/components/UI/Modal/sellingUnitCapacityModal.vue'

const purchaseUnits = ref([])
const isModalOpen = ref(false)
const isSellingUnitModalOpen = ref(false)
const isSellingUnitCapacityModalOpen = ref(false)
const selectedPurchaseUnitId = ref(null)
const selectedSellingUnitId = ref(null)

const showDeleteModal = ref(false)
const itemToDelete = ref(null)

const pagination = ref({})
const currentPage = ref(1)
const totalPages = ref(0)
const showUploadModal = ref(false)
const search = ref('')
const isSearching = ref(false)

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

// const deletePurchase = async (id) => {
//     console.log("Function Called")
//     try {
//         const response = await apiService.delete(`/purchase-units/${id}`)
//         catchAxiosSuccess(response)
//     } catch (error) {
//         catchAxiosError(error);
//     }
// }

const openCreateModal = () => {
  isModalOpen.value = true
}

const openCreateSellingUnitModal = (purchaseUnitId) => {
  selectedPurchaseUnitId.value = purchaseUnitId
  isSellingUnitModalOpen.value = true
}

const openCreateSellingCapacityModal = (sellingUnitId) => {
  selectedSellingUnitId.value = sellingUnitId
  isSellingUnitCapacityModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const closeSellingUnitModal = () => {
  isSellingUnitModalOpen.value = false
}

// function openDeleteModal(item) {
//   itemToDelete.value = item;
//   showDeleteModal.value = true;
// }

function closeDeleteModal() {
  showDeleteModal.value = false
  itemToDelete.value = null
}

const closeSellingUnitCapacityModal = () => {
  isSellingUnitCapacityModalOpen.value = false
}

onMounted(() => fetchPurchaseUnits(currentPage.value))

watch(search, async (newSearch) => {
  if (newSearch) {
    isSearching.value = true
    try {
      const response = await apiService.get(`search-purchase-units?search=${newSearch}`)
      purchaseUnits.value = response.data
      console.log(response.data)
      return purchaseUnits.value
    } catch (error) {
      console.error('Failed to fetch data:', error.message)
    }
  } else {
    isSearching.value = false
    fetchPurchaseUnits(currentPage.value)
  }
})

function openUploadModal(){
  showUploadModal.value = true;
  console.log("Clickedd")
}

function closeUploadModal(){
  showUploadModal.value =false;
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
</style>
