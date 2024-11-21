<template>
  <DashboardLayout pageTitle="Measurement Page">
    <div class="actions">
      <input type="text" v-model="search" placeholder="Search..." class="search-input" />
      <div>
        <button class="button upload-btn" @click="openUploadModal()">Upload</button>
        <button class="button add-btn" @click="openCreateGroupModal">Add Group</button>
      </div>
    </div>

    <section class="page-container">
      <div class="container">
        <div class="group-grid" v-if="measurementGroups.length > 0">
          <div v-for="group in measurementGroups" :key="group.id" class="group-card">
            <div class="group-card-header">
              <h3 class="text-2xl font-semibold">Group: {{ group.group_name }}</h3>
              <div class="header-actions">
                <button class="add-button" @click="openCreatePurchaseUnitModal(group.id)">
                  Add Purchase Unit
                </button>
                <button class="edit-button" @click="openEditGroupModal(group)">
                  Edit Group
                </button>
                <button class="delete-button" @click="openDeleteGroupModal(group.id)">
                  Delete Group
                </button>
              </div>
            </div>

            <div class="purchase-units-container">
              <div v-for="purchaseUnit in group.purchase_units" :key="purchaseUnit.id" class="purchase-card">
                <div class="purchase-card-header">
                  <h4 class="text-xl font-semibold">
                    Purchase Unit: {{ purchaseUnit.purchase_unit_name }}
                  </h4>
                  <button
                    class="add-selling-unit-button"
                    @click="openCreateSellingUnitModal(purchaseUnit.id)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                      <path fill="white" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" />
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                          <path fill="white" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" />
                        </svg>
                      </button>
                    </div>

                    <ul class="capacity">
                      <li v-for="capacity in sellingUnit.selling_unit_capacities" :key="capacity.id" class="capacity_sell">
                        Quantity: {{ capacity.selling_unit_capacity }}
                        <span class="update-selling-unit-button capacity_btn" @click="openEditSellingCapacity(sellingUnit.id, capacity)">
                          Edit Capacity
                        </span>
                      </li>
                    </ul>
                    <button class="update-selling-unit-button" @click="openEditSellingUnitModal(purchaseUnit.id, sellingUnit)">
                      Edit Selling Unit
                    </button>
                  </div>
                </div>
                <div v-else>
                  <p class="text-center">No Selling Units Available</p>
                </div>

                <div class="purchase-unit-actions">
                  <button class="update-selling-unit-button" @click="openEditPurchaseUnitModal(purchaseUnit)">
                    Edit Purchase Unit
                  </button>
                  <button class="delete-pur update-selling-unit-button" @click="openDeleteModal(purchaseUnit.id)">
                    Delete Purchase Unit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <p class="text-center">No measurement groups found.</p>
        </div>

        <div v-if="!isSearching" class="mx-auto w-fit my-5">
          <Pagination
            :currentPage="currentPage"
            :totalPages="totalPages"
            @changePage="changePage"
          />
        </div>

        <!-- Modals -->
        <create-group-modal
          v-if="isGroupModalOpen"
          @close="closeGroupModal"
          @group-added="fetchMeasurementGroups"
          @group-updated="fetchMeasurementGroups"
          :group="selectedGroup"
        />

        <create-edit-modal
          v-if="isModalOpen"
          @close="closeModal"
          @purchase-unit-added="fetchMeasurementGroups"
          @purchase-unit-updated="fetchMeasurementGroups"
          :purchaseUnit="selectedPurchaseUnit"
          :groupId="selectedGroupId"
        />

        <create-selling-unit-modal
          v-if="isSellingUnitModalOpen"
          :purchaseUnitId="selectedPurchaseUnitId"
          @close="closeSellingUnitModal"
          @selling-unit-added="fetchMeasurementGroups"
          @selling-unit-updated="fetchMeasurementGroups"
          :sellingUnit="selectedSellingUnit"
        />

        <selling-unit-capacity-modal
          v-if="isSellingUnitCapacityModalOpen"
          :sellingUnitId="selectedSellingUnitId"
          @close="closeSellingUnitCapacityModal"
          @selling-capacity-added="fetchMeasurementGroups"
          @selling-capacity-updated="fetchMeasurementGroups"
          :sellingCapacity="selectedSellingCapacity"
        />

        <UploadModal
          v-if="showUploadModal"
          @close="closeUploadModal"
          @updated="forceRefresh"
          :url="'/process-csv'"
          type="PurchaseUnit"
          :downloadUrl="'purchase_unit'"
          :modalTitle="modalTitle"
        />

        <!-- Delete Confirmation Modals -->
        <div v-if="showDeleteModal" class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full">
          <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
            <header class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]">
              <h3 class="text-[22px] font-EBGaramond500 text-[#244034]">Confirm Deletion</h3>
            </header>
            <p class="text-center py-4">Are you sure you want to delete this purchase unit?</p>
            <div class="flex justify-center">
              <button @click="confirmDelete" class="btn-brand !bg-green-400 mr-6">Delete</button>
              <button @click="closeDeleteModal" class="btn-brand !bg-red-600">Cancel</button>
            </div>
          </div>
        </div>

        <div v-if="showDeleteGroupModal" class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full">
          <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
            <header class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]">
              <h3 class="text-[22px] font-EBGaramond500 text-[#244034]">Confirm Group Deletion</h3>
            </header>
            <p class="text-center py-4">Are you sure you want to delete this measurement group? This will also delete all associated purchase units.</p>
            <div class="flex justify-center">
              <button @click="confirmDeleteGroup" class="btn-brand !bg-green-400 mr-6">Delete</button>
              <button @click="closeDeleteGroupModal" class="btn-brand !bg-red-600">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import apiService from '@/services/apiService'
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'
import DashboardLayout from '@/components/Layouts/dashboardLayout.vue'
import CreateEditModal from '@/components/UI/Modal/purchaseUnitModal.vue'
import CreateGroupModal from '@/components/UI/Modal/measurementGroupModal.vue'
import UploadModal from '@/components/UI/Modal/UploadModal.vue'
import Pagination from '@/components/UI/Pagination/PaginatePage.vue'
import CreateSellingUnitModal from '@/components/UI/Modal/sellingUnitModal.vue'
import SellingUnitCapacityModal from '@/components/UI/Modal/sellingUnitCapacityModal.vue'

const measurementGroups = ref([])
const isGroupModalOpen = ref(false)
const isModalOpen = ref(false)
const isSellingUnitModalOpen = ref(false)
const isSellingUnitCapacityModalOpen = ref(false)
const selectedGroupId = ref(null)
const selectedPurchaseUnitId = ref(null)
const selectedSellingUnitId = ref(null)
const selectedGroup = ref(null)
const selectedPurchaseUnit = ref(null)
const selectedSellingUnit = ref(null)
const selectedSellingCapacity = ref(null)
const showDeleteModal = ref(false)
const showDeleteGroupModal = ref(false)
const itemToDelete = ref(null)
const groupToDelete = ref(null)
const showUploadModal = ref(false)
const search = ref('')
const isSearching = ref(false)
const errorMessage = ref('')
const modalTitle = 'Purchase Unit'

const route = useRoute()
const router = useRouter()

const pagination = ref({})
const currentPage = ref(1)
const totalPages = ref(0)

const emit = defineEmits(['edit-group', 'edit-purchase-unit', 'edit-selling-unit', 'edit-selling-capacity'])

const fetchMeasurementGroups = async () => {
  try {
      const response = await apiService.get(`measurement-groups`)
    console.log(response)
    measurementGroups.value = response.data
    pagination.value = {
      next_page_url: response.data.next_page_url,
      prev_page_url: response.data.prev_page_url
    }
    currentPage.value = response.current_page
    totalPages.value = response.last_page
    router.push({ query: { ...route.query, page: currentPage.value } })
  } catch (error) {
    console.error('Error fetching measurement groups:', error)
    catchAxiosError(error)
  }
}

const openCreateGroupModal = () => {
  isGroupModalOpen.value = true
  selectedGroup.value = null
}

const openEditGroupModal = (group) => {
  selectedGroup.value = group
  isGroupModalOpen.value = true
  emit('edit-group', group)
}

const closeGroupModal = () => {
  isGroupModalOpen.value = false
  refreshCurrentPage()
}

const openCreatePurchaseUnitModal = (groupId) => {
  selectedGroupId.value = groupId
  selectedPurchaseUnit.value = null
  isModalOpen.value = true
}

const openCreateSellingUnitModal = (purchaseUnitId) => {
  selectedPurchaseUnitId.value = purchaseUnitId
  selectedSellingUnit.value = null
  isSellingUnitModalOpen.value = true
}

const openCreateSellingCapacityModal = (sellingUnitId) => {
  selectedSellingUnitId.value = sellingUnitId
  selectedSellingCapacity.value = null
  isSellingUnitCapacityModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  refreshCurrentPage()
}

const closeSellingUnitModal = () => {
  isSellingUnitModalOpen.value = false
  refreshCurrentPage()
}

const closeSellingUnitCapacityModal = () => {
  isSellingUnitCapacityModalOpen.value = false
  refreshCurrentPage()
}

const openDeleteModal = (id) => {
  itemToDelete.value = id
  showDeleteModal.value = true
}

const openDeleteGroupModal = (id) => {
  groupToDelete.value = id
  showDeleteGroupModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
  refreshCurrentPage()
}

const closeDeleteGroupModal = () => {
  showDeleteGroupModal.value = false
  groupToDelete.value = null
  refreshCurrentPage()
}

const confirmDelete = async () => {
  if (itemToDelete.value) {
    try {
      const response = await apiService.delete(`purchase-units/${itemToDelete.value}`)
      catchAxiosSuccess(response)
      closeDeleteModal()
    } catch (error) {
      catchAxiosError(error)
    }
  }
}

const confirmDeleteGroup = async () => {
  if (groupToDelete.value) {
    try {
      const response = await apiService.delete(`measurement-groups/${groupToDelete.value}`)
      catchAxiosSuccess(response)
      closeDeleteGroupModal()
    } catch (error) {
      catchAxiosError(error)
    }
  }
}

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page
    fetchMeasurementGroups(page)
  }
}

const refreshCurrentPage = () => {
  fetchMeasurementGroups(currentPage.value)
}

const openUploadModal = () => {
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
}

const forceRefresh = () => {
  refreshCurrentPage()
}

watch(search, async (newSearch) => {
  if (newSearch) {
    isSearching.value = true
    try {
      const response = await apiService.get(`search-measurement-groups?search=${newSearch}`)
      if (response.data.data.length > 0) {
        measurementGroups.value = response.data.data
      } else {
        measurementGroups.value = []
        errorMessage.value = response.data.message || 'No measurement groups found for the search term.'
      }
    } catch (error) {
      console.error('Failed to fetch data:', error.message)
      measurementGroups.value = []
      errorMessage.value = 'Error occurred while searching for measurement groups.'
    } finally {
      isSearching.value = false
    }
  } else {
    isSearching.value = false
    errorMessage.value = ''
    fetchMeasurementGroups(currentPage.value)
  }
})

onMounted(() => {
  const page = route.query.page ? parseInt(route.query.page) : 1
  currentPage.value = page
  fetchMeasurementGroups(page)
})

watch(
  () => route.query.page,
  (newPage) => {
    const page = newPage ? parseInt(newPage) : 1
    currentPage.value = page
    fetchMeasurementGroups(page)
  }
)
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

.group-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2em;
  width: 100%;
}

.group-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.group-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5em;
  padding-bottom: 1em;
  border-bottom: 2px solid #f0f0f0;
}

.header-actions {
  display: flex;
  gap: 1em;
}

.purchase-units-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5em;
}

.purchase-card {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.purchase-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
}

.selling-unit-card {
  background-color: #fff;
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
  background-color: #c35214;
}

.add-button,
.edit-button,
.delete-button {
  background-color: #c35214;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button {
  background-color: #c8640b;
}

.delete-button {
  background-color: #dc2626;
}

.add-selling-unit-button,
.add-selling-capacity-button {
  background-color: #c8640b;
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 1.5em;
  border-radius: 50%;
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
}

.capacity_sell {
  padding: 12px 0;
}

.capacity_btn {
  margin-left: 2em;
}

.purchase-unit-actions {
  display: flex;
  gap: 1em;
  margin-top: 1em;
}

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
</style>