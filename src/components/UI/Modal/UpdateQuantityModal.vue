<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2 class="text-xl font-semibold text-center mb-5 pb-5">Update Product Quantity</h2>
      
      <!-- Product Search -->
      <div class="search-section">
        <label>Product Name <span class="required">*</span></label>
        <div class="custom-select">
          <input
            type="text"
            :value="getSelectedProductName"
            @focus="showDropdown = true"
            @input="(e) => handleSearch(e)"
            placeholder="Search product type..."
            class="search-input"
          />
          <div v-show="showDropdown" class="options-container">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="option"
              @click="selectProduct(product)"
            >
              {{ product.product_type_name }}
            </div>
          </div>
        </div>
      </div>

      <!-- Mode Selection -->
      <div class="mode-section">
        <label>Mode <span class="required">*</span></label>
        <select v-model="isActual" required>
          <option value="">Select Option</option>
          <option :value="1">Actual</option>
          <option :value="0">Estimate</option>
        </select>
      </div>

      <!-- Purchase Units -->
      <div v-if="selectedProduct" class="purchase-units-section">
        <h3 class="text-lg font-semibold mb-2">Purchase Units</h3>
        <div v-for="unit in purchaseUnits" :key="unit.purchase_unit_id" class="unit-row">
          <span>{{ unit.purchase_unit_name }}</span>
          <input
            type="number"
            v-model="unit.quantity"
            min="0"
            placeholder="Enter quantity"
          />
        </div>
      </div>

      <!-- Buttons -->
      <div class="button-group">
        <button @click="closeModal" class="cancel-btn">Cancel</button>
        <button 
          @click="updateQuantities" 
          :disabled="!canSubmit"
          class="submit-btn"
        >
          Update
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import apiService from '@/services/apiService';
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response';

const emit = defineEmits(['close', 'updated']);

const searchQuery = ref('');
const showDropdown = ref(false);
const productTypes = ref([]);
const selectedProduct = ref(null);
const isActual = ref('');
const purchaseUnits = ref([]);

const getSelectedProductName = computed(() => {
  return selectedProduct.value ? selectedProduct.value.product_type_name : '';
});

const filteredProducts = computed(() => {
  if (!searchQuery.value) return productTypes.value;
  return productTypes.value.filter(product =>
    product.product_type_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const canSubmit = computed(() => {
  return selectedProduct.value && 
         isActual.value !== '' && 
         purchaseUnits.value.some(unit => unit.quantity > 0);
});

const handleSearch = (e) => {
  searchQuery.value = e.target.value;
  showDropdown.value = true;
};

const selectProduct = (product) => {
  selectedProduct.value = product;
  showDropdown.value = false;
  searchQuery.value = product.product_type_name;
  
  // Get purchase units directly from the product's measurement data
  purchaseUnits.value = product.product_measurement.map(unit => ({
    ...unit,
    quantity: 0
  }));
};

const updateQuantities = async () => {
  try {
    const payload = {
      product_type_id: selectedProduct.value.id,
      is_actual: isActual.value,
      purchase_unit_data: purchaseUnits.value
        .filter(unit => unit.quantity > 0)
        .map(unit => ({
          purchase_unit_id: unit.purchase_unit_id,
          quantity: parseInt(unit.quantity)
        }))
    };

    await apiService.update(`/estimated-stores/${selectedProduct.value.id}?type=quantity`, payload);
    catchAxiosSuccess({ message: 'Quantities updated successfully' });
    emit('updated');
    closeModal();
  } catch (error) {
    catchAxiosError(error);
  }
};

const closeModal = () => {
  emit('close');
};

// Fetch product types on mount
onMounted(async () => {
  try {
    const response = await apiService.get('all-product-type?mode=estimate');
    console.log(response)
    productTypes.value = response.data || [];
  } catch (error) {
    catchAxiosError(error);
  }
});

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const select = document.querySelector('.custom-select');
    if (select && !select.contains(e.target)) {
      showDropdown.value = false;
    }
  });
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-title {
  text-align: center;
  font-weight: 700;
  font-size: 1.5rem;
  color: #C35214;
  margin-bottom: 2rem;
}

.search-section,
.mode-section,
.purchase-units-section {
  margin-bottom: 1.5rem;
}

.custom-select {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 0;
  font-size: 0.9rem;
}

.options-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.option {
  padding: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.option:hover {
  background-color: #f5f5f5;
}

.unit-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.unit-row input {
  width: 120px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn,
.submit-btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

.submit-btn {
  background-color: #C35214;
  color: white;
}

.submit-btn:hover {
  background-color: #a94611;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.required {
  color: #dc3545;
}

select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  background-color: white;
}

h3 {
  margin-bottom: 1rem;
  
  font-weight: 600;
}

/* Scrollbar styling */
.options-container::-webkit-scrollbar {
  width: 6px;
}

.options-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.options-container::-webkit-scrollbar-thumb {
  background: #C35214;
  border-radius: 3px;
}

.options-container::-webkit-scrollbar-thumb:hover {
  background: #a94611;
}
</style>