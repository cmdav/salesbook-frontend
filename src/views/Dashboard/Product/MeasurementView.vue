<template>
  <DashboardLayout pageTitle="Measurement Page">
    <div class="actions">
      <input type="text" v-model="search" placeholder="Search by ..." class="search-input" />
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
              <h3 class="text-2xl font-semibold capitalize">{{ group.group_name }}</h3>
              <div class="header-actions">
                <!-- <button class="add-button" @click="openCreatePurchaseUnitModal(group.id)">
                  Add Purchase Unit
                </button> -->
                <button
                  class="action-button"
                  @click="openCreatePurchaseUnitModal(group.id)"
                  title="Add Purchase Unit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </button>

                <!-- <button class="edit-button" @click="openEditGroupModal(group)">Edit Group</button> -->
                <button
                  class="action-button edit"
                  @click="openEditGroupModal(group)"
                  title="Edit Purchase Unit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                    />
                  </svg>
                </button>
                <!-- <button class="delete-button" @click="openDeleteGroupModal(group.id)">
                  Delete Group
                </button> -->
                 <button
            class="action-button delete"
            @click="openDeleteGroupModal(group.id)"
            title="Delete Purchase Unit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
              />
            </svg>
          </button>
              </div>
            </div>

            <div class="purchase-units-tree">
              <div v-for="unit in group.purchase_units" :key="unit.id" class="purchase-unit-branch">
                <PurchaseUnitNode
                  :unit="unit"
                  :groupId="group.id"
                  @add-sub-unit="openCreateSubPurchaseUnitModal"
                  @edit-unit="openEditPurchaseUnitModal"
                  @delete-unit="openDeleteModal"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <p class="text-center">{{ errorMessage }}</p>
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

        <sub-purchase-unit-modal
          v-if="isSubPurchaseUnitModalOpen"
          @close="closeSubPurchaseUnitModal"
          @sub-unit-added="fetchMeasurementGroups"
          @sub-unit-updated="fetchMeasurementGroups"
          :groupId="selectedGroupId"
          :purchaseUnitId="selectedPurchaseUnitId"
          :subPurchaseUnit="selectedSubPurchaseUnit"
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

        <div
          v-if="showDeleteModal"
          class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full"
        >
          <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
            <header
              class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]"
            >
              <h3 class="text-[22px] font-EBGaramond500 text-[#244034]">Confirm Deletion</h3>
            </header>
            <p class="text-center py-4">Are you sure you want to delete this purchase unit?</p>
            <div class="flex justify-center">
              <button @click="confirmDelete" class="btn-brand !bg-green-400 mr-6">Delete</button>
              <button @click="closeDeleteModal" class="btn-brand !bg-red-600">Cancel</button>
            </div>
          </div>
        </div>

        <div
          v-if="showDeleteGroupModal"
          class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full"
        >
          <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
            <header
              class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]"
            >
              <h3 class="text-[22px] font-EBGaramond500 text-[#244034]">Confirm Group Deletion</h3>
            </header>
            <p class="text-center py-4">
              Are you sure you want to delete this measurement group? This will also delete all
              associated purchase units.
            </p>
            <div class="flex justify-center">
              <button @click="confirmDeleteGroup" class="btn-brand !bg-green-400 mr-6">
                Delete
              </button>
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
import SubPurchaseUnitModal from '@/components/UI/Modal/subPurchaseUnitModal.vue'
import UploadModal from '@/components/UI/Modal/UploadModal.vue'
import Pagination from '@/components/UI/Pagination/PaginatePage.vue'
import PurchaseUnitNode from '@/components/UI/Node/PurchaseUnitNode.vue'
// import ConfirmationModal from '@/components/UI/Modal/confirmationModal.vue'

const measurementGroups = ref([])
const isGroupModalOpen = ref(false)
const isModalOpen = ref(false)
const selectedGroupId = ref(null)
const selectedPurchaseUnitId = ref(null)
const selectedGroup = ref(null)
const selectedPurchaseUnit = ref(null)
const showDeleteModal = ref(false)
const showDeleteGroupModal = ref(false)
const itemToDelete = ref(null)
const groupToDelete = ref(null)
const showUploadModal = ref(false)
const search = ref('')
const isSearching = ref(false)
const errorMessage = ref('')
const modalTitle = 'Purchase Unit'

// Sub Purchase Unit state
const isSubPurchaseUnitModalOpen = ref(false)
const selectedSubPurchaseUnit = ref(null)

const route = useRoute()
const router = useRouter()

const pagination = ref({})
const currentPage = ref(1)
const totalPages = ref(0)

const fetchMeasurementGroups = async (page = 1) => {
  try {
    const response = await apiService.get(`measurement-groups?page=${page}`)
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

// Group Modal handlers
const openCreateGroupModal = () => {
  isGroupModalOpen.value = true
  selectedGroup.value = null
}

const openEditGroupModal = (group) => {
  selectedGroup.value = group
  isGroupModalOpen.value = true
}

const closeGroupModal = () => {
  isGroupModalOpen.value = false
  refreshCurrentPage()
}

// Purchase Unit Modal handlers
const openCreatePurchaseUnitModal = (groupId) => {
  selectedGroupId.value = groupId
  selectedPurchaseUnit.value = null
  isModalOpen.value = true
}

const openEditPurchaseUnitModal = (groupId, purchaseUnit) => {
  selectedGroupId.value = groupId
  selectedPurchaseUnit.value = purchaseUnit
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  refreshCurrentPage()
}

// Sub Purchase Unit Modal handlers
const openCreateSubPurchaseUnitModal = (groupId, purchaseUnitId) => {
  selectedGroupId.value = groupId
  selectedPurchaseUnitId.value = purchaseUnitId
  selectedSubPurchaseUnit.value = null
  isSubPurchaseUnitModalOpen.value = true
}

const closeSubPurchaseUnitModal = () => {
  isSubPurchaseUnitModalOpen.value = false
  selectedSubPurchaseUnit.value = null
  refreshCurrentPage()
}

// Delete handlers
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

// Upload Modal handlers
const openUploadModal = () => {
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
}

const forceRefresh = () => {
  refreshCurrentPage()
}

// Pagination handlers
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page
    fetchMeasurementGroups(page)
  }
}

const refreshCurrentPage = () => {
  fetchMeasurementGroups(currentPage.value)
}

// Search functionality
watch(search, async (newSearch) => {
  if (newSearch) {
    isSearching.value = true
    try {
      const response = await apiService.get(`search-purchase-units?search=${newSearch}`)
      if (response.data) {
        measurementGroups.value = response.data
      } else {
        measurementGroups.value = []
        errorMessage.value = 'No Purchase Unit found for the search.'
      }
    } catch (error) {
      measurementGroups.value = []
      errorMessage.value = 'No Purchase Unit found for the search.'
    } finally {
      isSearching.value = false
    }
  } else {
    isSearching.value = false
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
.page-container {
  padding: 2rem;
  background-color: #f4f5f7;
}

.group-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  width: 100%;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.search-input {
  width: 300px;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  color: white;
}

.upload-btn,
.add-btn {
  background-color: #c35214;
}

.upload-btn {
  margin-right: 1rem;
}

.group-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.group-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.purchase-units-tree {
  padding: 1rem 0;
}

.purchase-unit-branch {
  margin-bottom: 1rem;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.modal__body {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.btn-brand {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-brand:hover {
  opacity: 0.9;
}

@media (max-width: 900px) {
  .group-grid {
    grid-template-columns: 1fr;
  }

  .search-input {
    width: 200px;
  }

  .header-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .group-card {
    padding: 1rem;
  }
}
</style>

/*
<style scoped>
.page-container {
  padding: 2rem;
  background-color: #f4f5f7;
}

.group-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  width: 100%;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.search-input {
  width: 300px;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  color: white;
}

.upload-btn,
.add-btn {
  background-color: #c35214;
}

.upload-btn {
  margin-right: 1rem;
}

.group-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.group-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.add-button,
.edit-button,
.delete-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
}

.add-button {
  background-color: #c35214;
}

.edit-button {
  background-color: #c8640b;
}

.delete-button {
  background-color: #dc2626;
}

.purchase-units-tree {
  padding: 1rem 0;
}

.purchase-unit-branch {
  margin-bottom: 1rem;
}

@media (max-width: 1400px) {
  .group-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .group-grid {
    grid-template-columns: 1fr;
  }

  .search-input {
    width: 200px;
  }

  .header-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .group-card {
    padding: 1rem;
  }
}
</style>
*/
