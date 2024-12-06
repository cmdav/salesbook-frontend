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
          <!-- Measurement Group Card -->
          <div v-for="group in measurementGroups" :key="group.id" class="group-card">
            <div class="group-card-header">
              <h3 class="text-2xl font-semibold capitalize">{{ group.group_name }}</h3>
              <div class="header-actions">
                <button class="add-button" @click="openCreatePurchaseUnitModal(group.id)">
                  Add Purchase Unit
                </button>
                <button class="edit-button" @click="openEditGroupModal(group)">Edit Group</button>
                <button class="delete-button" @click="openDeleteGroupModal(group.id)">
                  Delete Group
                </button>
              </div>
            </div>

            <!-- Purchase Units Container -->
            <div class="purchase-units-container">
              <div
                v-for="purchaseUnit in group.purchase_units"
                :key="purchaseUnit.id"
                class="purchase-card"
              >
                <!-- Purchase Unit Header -->
                <div class="purchase-card-header">
                  <div class="purchase-unit-info">
                    <h4 class="text-xl font-semibold capitalize">
                      {{ purchaseUnit.purchase_unit_name }}
                    </h4>
                    <div class="purchase-unit-actions">
                      <button
                        class="icon-button"
                        @click="openCreateSubPurchaseUnitModal(group.id, purchaseUnit.id)"
                        title="Add Sub-Purchase Unit"
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
                      <button
                        class="icon-button"
                        @click="openCreateSellingUnitModal(purchaseUnit.id)"
                        title="Add Selling Unit"
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
                      <button
                        class="icon-button edit"
                        @click="openEditPurchaseUnitModal(group.id, purchaseUnit)"
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
                      <button
                        class="icon-button delete"
                        @click="openDeleteModal(purchaseUnit.id)"
                        title="Delete Purchase Unit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="units-container">
                  <!-- Selling Units Section -->
                  <div v-if="purchaseUnit.selling_units.length > 0" class="selling-units-section">
                    <h5 class="section-title">Selling Units</h5>
                    <div class="selling-units-grid">
                      <div
                        v-for="sellingUnit in purchaseUnit.selling_units"
                        :key="sellingUnit.id"
                        class="selling-unit-card"
                      >
                        <div class="selling-unit-header">
                          <h6 class="selling-unit-name">{{ sellingUnit.selling_unit_name }}</h6>
                          <div class="selling-unit-actions">
                            <button
                              class="icon-button"
                              @click="openCreateSellingCapacityModal(sellingUnit.id)"
                              title="Add Capacity"
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
                            <button
                              class="icon-button edit"
                              @click="openEditSellingUnitModal(purchaseUnit.id, sellingUnit.id)"
                              title="Edit Selling Unit"
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
                            <button
                              class="icon-button delete"
                              @click="openDeleteSellingUnitModal(sellingUnit.id)"
                              title="Delete Selling Unit"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div class="capacities-list">
                          <div
                            v-for="capacity in sellingUnit.selling_unit_capacities"
                            :key="capacity.id"
                            class="capacity-item"
                          >
                            <span>{{ capacity.selling_unit_capacity }} units</span>
                            <div class="capacity-actions">
                              <button
                                class="icon-button edit"
                                @click="openEditSellingCapacity(sellingUnit.id, capacity)"
                                title="Edit Selling Capacity"
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
                              <button
                                class="icon-button delete"
                                @click="openDeleteCapacityModal(capacity.id)"
                                title="Delete selling capacity"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Sub Purchase Units Section -->
                  <div v-if="purchaseUnit.sub_purchase_units.length > 0" class="sub-units-section">
                    <h5 class="section-title">Sub Purchase Units</h5>
                    <div class="sub-units-grid">
                      <div
                        v-for="subUnit in purchaseUnit.sub_purchase_units"
                        :key="subUnit.id"
                        class="sub-unit-card"
                      >
                        <div class="sub-unit-header">
                          <div class="sub-unit-info">
                            <h6 class="sub-unit-name">{{ subUnit.purchase_unit_name }}</h6>
                            <span class="sub-unit-ratio"
                              >{{ subUnit.unit }} per {{ purchaseUnit.purchase_unit_name }}</span
                            >
                          </div>
                          <div class="sub-unit-actions">
                            <button
                              class="icon-button"
                              @click="openCreateSellingUnitModal(subUnit.id)"
                              title="Add Selling Unit"
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
                            <button
                              class="icon-button edit"
                              @click="
                                openEditSubPurchaseUnitModal(group.id, purchaseUnit.id, subUnit.id)
                              "
                              title="Edit Sub Purchase Unit"
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
                            <button
                              class="icon-button delete"
                              @click="openDeleteSubUnitModal(subUnit.id)"
                              title="Delete Sub Purchase Unit"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <!-- Sub Unit's Selling Units -->
                        <div v-if="subUnit.selling_units.length > 0" class="sub-unit-selling-units">
                          <h6 class="subsection-title">Selling Units</h6>
                          <div class="selling-units-grid">
                            <div
                              v-for="sellingUnit in subUnit.selling_units"
                              :key="sellingUnit.id"
                              class="selling-unit-card"
                            >
                              <div class="selling-unit-header">
                                <h6 class="selling-unit-name">
                                  {{ sellingUnit.selling_unit_name }}
                                </h6>
                                <div class="selling-unit-actions">
                                  <button
                                    class="icon-button"
                                    @click="openCreateSellingCapacityModal(sellingUnit.id)"
                                    title="Add Capacity"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="20"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    class="icon-button edit"
                                    @click="openEditSellingUnitModal(subUnit.id, sellingUnit.id)"
                                    title="Edit Selling Unit"
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
                                  <button
                                    class="icon-button delete"
                                    @click="openDeleteSellingUnitModal(sellingUnit.id)"
                                    title="Delete Selling Unit"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="20"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div class="capacities-list">
                                <div
                                  v-for="capacity in sellingUnit.selling_unit_capacities"
                                  :key="capacity.id"
                                  class="capacity-item"
                                >
                                  <span>{{ capacity.selling_unit_capacity }} units</span>
                                  <div class="capacity-actions">
                                  
                                    <button
                                      class="icon-button edit"
                                      @click="openEditSellingCapacity(sellingUnit.id, capacity)"
                                      title="Edit Capacity Unit"
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
                                    <button
                                      class="icon-button delete"
                                      @click="openDeleteCapacityModal(capacity.id)"
                                      title="Delete Capacity Unit"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
        <div
          v-if="showDeleteSellingUnitModal"
          class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full"
        >
          <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
            <header
              class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]"
            >
              <h3 class="text-[22px] font-EBGaramond500 text-[#244034]">
                Confirm Selling Unit Deletion
              </h3>
            </header>
            <p class="text-center py-4">
              Are you sure you want to delete this selling unit? This will also delete all
              associated capacities.
            </p>
            <div class="flex justify-center">
              <button @click="confirmDeleteSellingUnit" class="btn-brand !bg-green-400 mr-6">
                Delete
              </button>
              <button @click="closeDeleteSellingUnitModal" class="btn-brand !bg-red-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="showDeleteSubUnitModal"
          class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full"
        >
          <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
            <header
              class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]"
            >
              <h3 class="text-[22px] font-EBGaramond500 text-[#244034]">
                Confirm Sub Purchase Deletion
              </h3>
            </header>
            <p class="text-center py-4">
              Are you sure you want to delete this sub purchase unit? This will also delete all
              associated units.
            </p>
            <div class="flex justify-center">
              <button @click="confirmDeleteSubUnit" class="btn-brand !bg-green-400 mr-6">
                Delete
              </button>
              <button @click="closeDeleteSubUnitModal" class="btn-brand !bg-red-600">Cancel</button>
            </div>
          </div>
        </div>

        <div
          v-if="showDeleteCapacityModal"
          class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full"
        >
          <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
            <header
              class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]"
            >
              <h3 class="text-[22px] font-EBGaramond500 text-[#244034]">
                Confirm Capacity Deletion
              </h3>
            </header>
            <p class="text-center py-4">Are you sure you want to delete this selling capacity?</p>
            <div class="flex justify-center">
              <button @click="confirmDeleteCapacity" class="btn-brand !bg-green-400 mr-6">
                Delete
              </button>
              <button @click="closeDeleteCapacityModal" class="btn-brand !bg-red-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
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

const isSubPurchaseUnitModalOpen = ref(false)
const selectedSubPurchaseUnit = ref(null)
const showDeleteSubUnitModal = ref(false)
const subUnitToDelete = ref(null)

const route = useRoute()
const router = useRouter()

const pagination = ref({})
const currentPage = ref(1)
const totalPages = ref(0)

// const emit = defineEmits(['edit-group', 'edit-purchase-unit', 'edit-selling-unit', 'edit-selling-capacity'])

const fetchMeasurementGroups = async (page = 1) => {
  try {
    const response = await apiService.get(`measurement-groups?page=${page}`)
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

const openEditPurchaseUnitModal = (groupId, purchaseUnit) => {
  selectedGroupId.value = groupId
  selectedPurchaseUnit.value = purchaseUnit
  isModalOpen.value = true
}

const openCreateSubPurchaseUnitModal = (groupId, purchaseUnitId) => {
  selectedGroupId.value = groupId
  selectedPurchaseUnitId.value = purchaseUnitId
  selectedSubPurchaseUnit.value = null
  isSubPurchaseUnitModalOpen.value = true
}

const openEditSubPurchaseUnitModal = (groupId, purchaseUnitId, subUnit) => {
  console.log('group:', groupId)
  console.log('purchase:', purchaseUnitId)
  console.log('subPur:', subUnit)
  selectedGroupId.value = groupId
  selectedPurchaseUnitId.value = purchaseUnitId
  selectedSubPurchaseUnit.value = subUnit
  isSubPurchaseUnitModalOpen.value = true
}

const closeSubPurchaseUnitModal = () => {
  isSubPurchaseUnitModalOpen.value = false
  selectedSubPurchaseUnit.value = null
  refreshCurrentPage()
}

const openDeleteSubUnitModal = (id) => {
  subUnitToDelete.value = id
  showDeleteSubUnitModal.value = true
}

const closeDeleteSubUnitModal = () => {
  showDeleteSubUnitModal.value = false
  subUnitToDelete.value = null
  refreshCurrentPage()
}

const confirmDeleteSubUnit = async () => {
  if (subUnitToDelete.value) {
    try {
      const response = await apiService.delete(`purchase-units/${subUnitToDelete.value}`)
      catchAxiosSuccess(response)
      closeDeleteSubUnitModal()
    } catch (error) {
      catchAxiosError(error)
    }
  }
}
const openCreateSellingUnitModal = (purchaseUnitId) => {
  selectedPurchaseUnitId.value = purchaseUnitId
  selectedSellingUnit.value = null
  isSellingUnitModalOpen.value = true
}

const openEditSellingUnitModal = (purchaseUnitId, sellingUnit) => {
  console.log('purchase:', purchaseUnitId)
  console.log('selling:', sellingUnit)
  selectedPurchaseUnitId.value = purchaseUnitId
  selectedSellingUnit.value = sellingUnit
  isSellingUnitModalOpen.value = true
}

const openCreateSellingCapacityModal = (sellingUnitId) => {
  selectedSellingUnitId.value = sellingUnitId
  selectedSellingCapacity.value = null
  isSellingUnitCapacityModalOpen.value = true
}

const openEditSellingCapacity = (sellingUnitId, capacity) => {
  selectedSellingUnitId.value = sellingUnitId
  selectedSellingCapacity.value = capacity
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

const showDeleteSellingUnitModal = ref(false)
const showDeleteCapacityModal = ref(false)
const sellingUnitToDelete = ref(null)
const capacityToDelete = ref(null)

const openDeleteSellingUnitModal = (id) => {
  sellingUnitToDelete.value = id
  showDeleteSellingUnitModal.value = true
}

const closeDeleteSellingUnitModal = () => {
  showDeleteSellingUnitModal.value = false
  sellingUnitToDelete.value = null
  refreshCurrentPage()
}

const confirmDeleteSellingUnit = async () => {
  if (sellingUnitToDelete.value) {
    try {
      const response = await apiService.delete(`selling-units/${sellingUnitToDelete.value}`)
      catchAxiosSuccess(response)
      closeDeleteSellingUnitModal()
    } catch (error) {
      catchAxiosError(error)
    }
  }
}

const openDeleteCapacityModal = (id) => {
  capacityToDelete.value = id
  showDeleteCapacityModal.value = true
}

const closeDeleteCapacityModal = () => {
  showDeleteCapacityModal.value = false
  capacityToDelete.value = null
  refreshCurrentPage()
}

const confirmDeleteCapacity = async () => {
  if (capacityToDelete.value) {
    try {
      const response = await apiService.delete(`selling-unit-capacities/${capacityToDelete.value}`)
      catchAxiosSuccess(response)
      closeDeleteCapacityModal()
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
1
watch(search, async (newSearch) => {
  if (newSearch) {
    isSearching.value = true
    try {
      const response = await apiService.get(`search-purchase-units?search=${newSearch}`)
      console.log(response.data)
      if (response.data) {
        measurementGroups.value = response.data
      } else {
        measurementGroups.value = []
        errorMessage.value = 'No Purchase Unit found for the search.'
      }
    } catch (error) {
      measurementGroups.value = []
      console.error('Failed to fetch data:', error.message)
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

.header-actions {
  display: flex;
  gap: 1em;
}

.purchase-units-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5em;
}

.purchase-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
}

.add-button,
.edit-button,
.delete-button {
  background-color: #c35214;
  color: white;
  border: none;
  padding: 5px 16px;
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
  display: flex;
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

.selling-unit-actions {
  display: flex;
  gap: 0.5em;
  align-items: center;
}

.capacity-actions {
  display: flex;
}

.delete-button {
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-button:hover {
  background-color: #b91c1c;
}

.capacity-actions .delete-button {
  padding: 4px 8px;
  font-size: 0.875rem;
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

.sub-purchase-units {
  margin: 1em 0;
  padding: 1em;
  background-color: #f0f0f0;
  border-radius: 6px;
}

/* .sub-unit-card {
  background-color: white;
  padding: 0.8em;
  margin-bottom: 0.8em;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
} */

/* .sub-unit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
} */

.sub-unit-name {
  font-weight: 600;
  margin-right: 0.5em;
}

/* .sub-unit-ratio {
  color: #666;
  font-size: 0.9em;
} */

.sub-unit-actions {
  display: flex;
  gap: 0.5em;
}

.purchase-unit-header-actions {
  display: flex;
  gap: 0.8em;
}

.add-sub-unit-button {
  background-color: #c35214;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.selling-units-section {
  margin-top: 1em;
  padding-top: 1em;
  border-top: 1px solid #ddd;
}


.page-container {
  padding: 2rem;
  background-color: #f4f5f7;
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
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.group-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.purchase-card {
  background-color: #f8fafc;
  border-radius: 0.375rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.purchase-unit-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.units-container {
  display: grid;
  gap: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
}

.selling-units-grid,
.sub-units-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(em, 2fr));
  gap: 1rem;
}

.selling-unit-card,
.sub-unit-card {
  background-color: white;
  border-radius: 0.375rem;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.selling-unit-header,
.sub-unit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.selling-unit-name {
  font-weight: 600;
  color: #2d3748;
}

.sub-unit-info {
  display: flex;
  flex-direction: column;
}

.sub-unit-ratio {
  font-size: 0.875rem;
  color: #718096;
}

.action-button {
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #c35214;
}

.icon-button {
  padding: 0.25rem;
  border-radius: 0.25rem;
  color: #4a5568;
  background-color: transparent;
}

.icon-button:hover {
  background-color: #edf2f7;
}

.icon-button.delete {
  color: #e53e3e;
}

.capacities-list {
  margin-top: 0.75rem;
}

.capacity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.capacity-item:last-child {
  border-bottom: none;
}

.text-button {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
  background-color: transparent;
}

.text-button:hover {
  color: #2d3748;
}

.text-button.delete {
  color: #e53e3e;
}

.text-button.delete:hover {
  color: #c53030;
}

.sub-unit-selling-units {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.subsection-title {
  font-size: 1rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.75rem;
}
</style>
