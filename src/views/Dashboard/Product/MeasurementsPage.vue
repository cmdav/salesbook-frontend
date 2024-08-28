<template>
    <DashboardLayout pageTitle="Measurement Page">
        <section class="page-container">
  <div class="container">
   
     <button class="add-button" @click="openCreateModal">Add New Purchase Unit</button>
    <div class="card-grid">
      <div
        v-for="purchaseUnit in purchaseUnits"
        :key="purchaseUnit.id"
        class="purchase-card"
      >
        <h4 class="text-3em font-bold">Purchase Unit: {{ purchaseUnit.purchase_unit_name }}</h4>
        <div v-if="purchaseUnit.selling_units.length > 0">
          <div
            v-for="sellingUnit in purchaseUnit.selling_units"
            :key="sellingUnit.id"
            class="selling-unit-card"
          >
            <h3>Selling Unit: {{ sellingUnit.selling_unit_name }}</h3>
            <ul>
              <li
                v-for="capacity in sellingUnit.selling_unit_capacities"
                :key="capacity.id"
              >
                Quantity: {{ capacity.selling_unit_capacity }}
              </li>
            </ul>
            
        <button
          class="add-selling-unit-button"
          @click="openCreateSellingUnitModal(purchaseUnit.id)"
        >
          Add Selling Unit
        </button>
          </div>
        </div>
        <div v-else>
          <p>No Selling Units Available</p>
        </div>
        <!-- <button class="edit-button" @click="editUnit(purchaseUnit)">Edit</button> -->
        <button class="delete-button" @click="deleteUnit()">
          Delete
        </button>
        
      </div>
    </div>

    <!-- Add New Purchase Unit Button -->
   

    <!-- Modals for Create/Edit -->
    <create-edit-modal
      v-if="isModalOpen"
      :unit="selectedUnit"
      @close="closeModal"
      @save="fetchPurchaseUnits"
    />
  </div>

  <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemsId"
      :url="'/purchase-units'"
      :modalTitle="modalTitle"
    />
    </section>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiService from '@/services/apiService'
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'
import DashboardLayout from '@/components/Layouts/dashboardLayout.vue';
import { useSharedComponent } from "@/composable/useSharedComponent";
import CreateEditModal from '@/components/UI/Modal/CreateMeasurementModal.vue';

const purchaseUnits = ref([]);
const isModalOpen = ref(false);
const selectedUnit = ref(null);
const isEdit = ref(false)

const {
  
  DeleteModal,
  useDeleteComposable,
//   defineEmits,

} = useSharedComponent('list-purchase-unit');

const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

// const emit = defineEmits(["forceRefresh"]);

const fetchPurchaseUnits = async () => {
  try {
    const response = await apiService.get('/list-purchase-units');
    purchaseUnits.value = response.data;
  } catch (error) {
    console.error('Error fetching purchase units:', error);
    catchAxiosError(error)
  }
};

const openCreateModal = () => {
  selectedUnit.value = null;
  isModalOpen.value = true;
};

const editUnit = (unit) => {
  selectedUnit.value = unit;
  isModalOpen.value = true;
};

const openCreateSellingUnitModal = (purchaseUnit) => {
  selectedUnit.value = { ...purchaseUnit };
  isEdit.value = false;
  isModalOpen.value = true;
};

const deleteUnit = async (id) => {
  try {
    await apiService.delete(`/purchase-unit/${id}`);
    fetchPurchaseUnits();
  } catch (error) {
    console.error('Error deleting purchase unit:', error);
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

onMounted(fetchPurchaseUnits);
</script>

<style scoped>
.page-container{
    width: 100%;
}
.container {
  display: flex;
  
  flex-direction: column;
  align-items: flex-end;
  /* width: 100%; */
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2em;
  justify-content: center;
}

.purchase-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.purchase-card h2 {
  margin-bottom: 16px;
}

.selling-unit-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
}

.selling-unit-card h3 {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: bold;
}

.selling-unit-card ul {
  list-style-type: none;
  padding: 0;
}

.selling-unit-card li {
  font-size: 14px;
}

.edit-button,
.delete-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 4px;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #45a049;
}

.delete-button {
  background-color: #f44336;
}

.delete-button:hover {
  background-color: #e53935;
}

.add-button {
  background-color: #dc900d;
  color: white;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  display: flex;
  margin: 2em 0;
}

.add-button:hover {
  background-color: #c08102;
}

.add-selling-unit-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 4px;
  cursor: pointer;
}

.add-selling-unit-button:hover {
  background-color: #45a049;
}

</style>