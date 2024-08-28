<template>
  <div class="modal backdrop-blur z-[100] fixed animate__zoomIn min-h-screen h-full">
    <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
      <header class="flex flex-row items-center justify-between border-b-[#000000] mb-[0.6em] border-b-[1px]">
        <h4 v-if="unit" class="text-[32px] font-EBGaramond500 text-[#244034]">Edit Unit</h4>
        <h4 v-else class="text-[32px] font-EBGaramond500 text-[#244034]">Add Selling Unit</h4>
        <button class="close-button" @click="closeModal">&#10005;</button>
      </header>

      <form @submit.prevent="saveUnit" class="max-w-4xl mx-auto p-2">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 pb-1">Purchase Unit Name</label>
          <input
            type="text"
            v-model="form.purchase_unit_name"
            placeholder="Enter Purchase Unit Name"
            required
            class="mt-1 block w-[90%] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div v-for="(sellingUnit, index) in form.selling_units" :key="index" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 pb-1">Selling Unit Name</label>
          <input
            type="text"
            v-model="sellingUnit.selling_unit_name"
            placeholder="Enter Selling Unit Name"
            required
            class="mt-1 block w-[90%] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          
          <div v-for="(capacity, capIndex) in sellingUnit.selling_unit_capacities" :key="capIndex" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 pb-1">Selling Unit Capacity</label>
            <input
              type="number"
              v-model="capacity.selling_unit_capacity"
              placeholder="Enter Selling Unit Capacity"
              required
              class="mt-1 block w-[90%] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="button"
            class="delete-button text-red-500 hover:text-red-700 text-sm font-bold mt-2"
            @click="removeSellingUnit(index)"
          >
            Remove Selling Unit
          </button>
        </div>

        <button
          type="button"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          @click="addSellingUnit"
        >
          Add Selling Unit
        </button>

        <div class="modal-actions mt-4 flex justify-end">
          <button
            type="submit"
            class="save-button px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Save
          </button>
          <button
            type="button"
            class="cancel-button px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            @click="closeModal"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiService from "@/services/apiService"
import { catchAxiosSuccess, catchAxiosError } from '@/services/Response'

const props = defineProps({
  unit: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  purchase_unit_name: '',
  selling_units: [],
});

const addSellingUnit = () => {
  form.value.selling_units.push({
    selling_unit_name: '',
    selling_unit_capacities: [{ selling_unit_capacity: '' }],
  });
};

const removeSellingUnit = (index) => {
  form.value.selling_units.splice(index, 1);
};

const saveUnit = async () => {
  try {
    // Submit Purchase Unit
    const purchaseUnitResponse = await apiService.post('/purchase-units', {
      purchase_unit_name: form.value.purchase_unit_name,
    });
    const purchaseUnitId = purchaseUnitResponse.data.id;

    // Loop through Selling Units and submit each
    for (const sellingUnit of form.value.selling_units) {
      const sellingUnitResponse = await apiService.post('/selling-units', {
        purchase_unit_id: purchaseUnitId,
        selling_unit_name: sellingUnit.selling_unit_name,
      });
      const sellingUnitId = sellingUnitResponse.data.id;

      // Loop through Selling Unit Capacities and submit each
      for (const capacity of sellingUnit.selling_unit_capacities) {
        await apiService.post('/selling-unit-capacities', {
          selling_unit_id: sellingUnitId,
          selling_unit_capacity: capacity.selling_unit_capacity,
        });
      }
    }

    // Emit save event with the new data
    emit('save', { ...form.value });
    catchAxiosSuccess(Response)
    closeModal();
    
  } catch (error) {
    console.error('Error saving unit:', error);
    catchAxiosError(error)
  }
};

const closeModal = () => {
  emit('close');
};

onMounted(() => {
  if (props.unit) {
    form.value = { ...props.unit };
  }
});
</script>

<style scoped>
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

.delete-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #e53e3e;
  font-weight: bold;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.save-button,
.cancel-button {
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  padding: 10px 20px;
}

.save-button {
  background-color: #38a169;
  color: white;
}

.save-button:hover {
  background-color: #2f855a;
}

.cancel-button {
  background-color: #718096;
  color: white;
}

.cancel-button:hover {
  background-color: #4a5568;
}
</style>
