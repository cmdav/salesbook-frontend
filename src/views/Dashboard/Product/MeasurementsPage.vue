<template>
  <DashboardLayout pageTitle="Measurement Page">
    <section class="page-container">
      <div class="container">
        <button class="add-button" @click="openCreateModal">Add New Purchase Unit</button>
        <div class="card-grid">
          <div v-for="purchaseUnit in purchaseUnits" :key="purchaseUnit.id" class="purchase-card">
            <div class="purchase-card-header">
              <h4 class="text-2xl font-semibold">Purchase Unit: {{ purchaseUnit.purchase_unit_name }}</h4>
              <button class="add-selling-unit-button" @click="openCreateSellingUnitModal(purchaseUnit.id)">
                &#43;
              </button>
            </div>
            <div v-if="purchaseUnit.selling_units.length > 0">
              <div v-for="sellingUnit in purchaseUnit.selling_units" :key="sellingUnit.id" class="selling-unit-card">
                <div class="selling-unit-header">
                  <h5 class="text-lg font-medium">Selling Unit: {{ sellingUnit.selling_unit_name }}</h5>
                  <button class="add-selling-capacity-button" @click="openCreateSellingCapacityModal(sellingUnit.id)">
                    &#43;
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
              <p>No Selling Units Available</p>
            </div>
          </div>
        </div>

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
  </DashboardLayout>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import apiService from '@/services/apiService';
import { catchAxiosError } from '@/services/Response';
import DashboardLayout from '@/components/Layouts/dashboardLayout.vue';
import CreateEditModal from '@/components/UI/Modal/purchaseUnitModal.vue';
import CreateSellingUnitModal from '@/components/UI/Modal/sellingUnitModal.vue';
import SellingUnitCapacityModal from '@/components/UI/Modal/sellingUnitCapacityModal.vue';

const purchaseUnits = ref([]);
const isModalOpen = ref(false);
const isSellingUnitModalOpen = ref(false);
const isSellingUnitCapacityModalOpen = ref(false);
const selectedPurchaseUnitId = ref(null);
const selectedSellingUnitId = ref(null);

const fetchPurchaseUnits = async () => {
  try {
    const response = await apiService.get('/purchase-units');
    purchaseUnits.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching purchase units:', error);
    catchAxiosError(error);
  }
};

const openCreateModal = () => {
  isModalOpen.value = true;
};

const openCreateSellingUnitModal = (purchaseUnitId) => {
  selectedPurchaseUnitId.value = purchaseUnitId;
  isSellingUnitModalOpen.value = true;
};

const openCreateSellingCapacityModal = (sellingUnitId) => {
  selectedSellingUnitId.value = sellingUnitId;
  isSellingUnitCapacityModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const closeSellingUnitModal = () => {
  isSellingUnitModalOpen.value = false;
};

const closeSellingUnitCapacityModal = () => {
  isSellingUnitCapacityModalOpen.value = false;
};

onMounted(fetchPurchaseUnits);
</script>
<style scoped>
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
  grid-template-columns: repeat(2, 1fr); /* Changed to two columns */
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

.add-button {
  background-color: #4caf50;
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
  background-color: #1e88e5;
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 1.5em;
  border-radius: 50%;
}

.add-selling-unit-button:hover {
  background-color: #1565c0;
}

.add-selling-capacity-button {
  background-color: #1e88e5;
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 1.5em;
  border-radius: 50%;
}

.add-selling-capacity-button:hover {
  background-color: #1565c0;
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
</style>

