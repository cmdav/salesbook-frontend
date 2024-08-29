<template>
  <DashboardLayout pageTitle="Add Purchase">
    <div class="container">
      <div class="top-buttons">
        <router-link to="/purchase" class="button back-btn">Back</router-link>
        <div class="total-and-add">
          <span class="total-cost-price">Total Cost Price: &#8358; {{ totalCostPrice }}</span>
          <button type="button" @click="addPurchase" class="button add-purchase-button">Add Purchase</button>
        </div>
      </div>
      <div v-if="isLoading" class="loading-icon">Loading...</div>
      <form v-else @submit.prevent="handleSubmit">
        <div class="batch-container">
          <label for="batch_no">Batch No</label>
          <input class="batch_input" type="text" v-model="batchNo" readonly />
        </div>
        <div v-for="(purchase, index) in purchases" :key="index" class="purchase-form">
          <div v-if="index !== 0" class="top-buttons">
            <button type="button" @click="addPurchase" class="button add-purchase-button">Add Purchase</button>
          </div>
          <div class="form-row">
            <div>
              <label for="supplier_id">Supplier <span class="required">*</span></label>
              <select v-model="purchase.supplier_id" @change="() => handleSupplierChange(index)">
                <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                  {{ supplier.supplier_detail }}
                </option>
              </select>
            </div>
            <div>
              <label for="product_type_id">Product Type <span class="required">*</span></label>
              <select v-model="purchase.product_type_id" @change="() => handleSupplierChange(index)">
                <option v-for="productType in productTypes" :key="productType.id" :value="productType.id"
                  :disabled="isDuplicatePurchase(purchase.supplier_id, productType.id)">
                  {{ productType.product_type_name }}
                </option>
              </select>
            </div>
            <div>
              <label for="purchase_unit_name">Purchase Unit <span class="required">*</span></label>
              <input type="text" v-model="purchase.purchase_unit_name" class="short-input" readonly />
            </div>
            <div>
              <label for="cost_price">Cost Price <span class="required">*</span></label>
              <div class="tooltip-container">
                <input type="number" v-model="purchase.cost_price" maxlength="9" @mouseover="showTooltip" data-tooltip="Enter the cost price per item" required />
                <span class="tooltip">Enter the cost price per item</span>
              </div>
              <label class="priceView">&#8358; {{ purchase.cost_price ? parseFloat(purchase.cost_price).toLocaleString() : '0.00' }}</label>
            </div>
            <div>
              <label for="selling_price">Selling Price <span class="required">*</span></label>
              <div class="tooltip-container">
                <input type="number" v-model="purchase.selling_price" @change="handleSellingPriceChange(index)"
                  maxlength="9" @mouseover="showTooltip" data-tooltip="Enter the selling price per item" required />
                <span class="tooltip">Enter the selling price per item</span>
              </div>
              <label class="priceView">&#8358; {{ purchase.selling_price ? parseFloat(purchase.selling_price).toLocaleString() : '0.00' }}</label>
            </div>
            <div>
              <label for="purchase_qty">Purchase Qty <span class="required">*</span></label>
              <input type="number" v-model="purchase.capacity_qty" maxlength="9" />
            </div>
            <div>
              <label for="expiry_date">Expiry Date</label>
              <input type="date" v-model="purchase.expiry_date" :min="minExpiryDate" class="expiry-date" />
            </div>
            <div>
              <label for="amount">Amount</label>
              <span class="priceView">&#8358; {{ RowTotalCost(purchase).toLocaleString() }}</span>
            </div>
            <input type="hidden" v-model="purchase.price_id" />
            <div v-if="index !== 0" class="remove-button">
              <button type="button" @click="removePurchase(index)" class="button remove-purchase-button">Remove</button>
            </div>
          </div>
          <hr class="separator" />
        </div>
        <button type="submit" class="button submit-button" :disabled="isSubmitting">{{ isSubmitting ? 'Please wait...' : 'Submit' }}</button>
      </form>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/apiService';
import { catchAxiosError } from '@/services/Response';

const router = useRouter();

const suppliers = ref([]);
const productTypes = ref([]);
const batchNo = ref('');
const isLoading = ref(false);
const error = ref(null);
const isSubmitting = ref(false);

const purchases = reactive([
  {
    supplier_id: '',
    product_type_id: '',
    price_id: '',
    cost_price: '',
    selling_price: '',
    batch_no: '',
    product_identifier: '',
    expiry_date: '',
    purchase_unit_name: '',
    capacity_qty: '',
    original_selling_price: null
  }
]);

const minExpiryDate = new Date().toISOString().split('T')[0];

const totalCostPrice = ref(0);
const tooltipMessage = ref('');
const tooltipVisible = ref(false);

const fetchData = async () => {
  try {
    isLoading.value = true;
    const [suppliersResponse, productTypesResponse, lastBatchNumberResponse] = await Promise.all([
      apiService.get('all-suppliers'),
      apiService.get('all-product-type'),
      apiService.get('last-batch-number'),
    ]);

    if (suppliersResponse.data) {
      suppliers.value = suppliersResponse.data;
      purchases[0].supplier_id = suppliers.value[0].id;
    } else {
      error.value = 'No suppliers found';
    }

    if (productTypesResponse.data) {
      productTypes.value = productTypesResponse.data;
    } else {
      error.value = 'No product types found';
    }

    if (lastBatchNumberResponse.data) {
      const lastBatchNo = lastBatchNumberResponse.data;
      batchNo.value = String(lastBatchNo).padStart(5, '0');
      purchases.forEach(purchase => purchase.batch_no = batchNo.value);
    } else {
      batchNo.value = '000';
      purchases.forEach(purchase => purchase.batch_no = batchNo.value);
    }
  } catch (err) {
    catchAxiosError(err);
  } finally {
    isLoading.value = false;
  }
};

const handleSupplierChange = async (index) => {
  const purchase = purchases[index];
  if (!purchase.product_type_id || !purchase.supplier_id) {
    catchAxiosError({ message: 'Please select both supplier and product type.' });
    return;
  }

  // Retrieve the purchase unit name from the productTypes array
  const productType = productTypes.value.find(pt => pt.id === purchase.product_type_id);
  if (productType) {
    purchase.purchase_unit_name = productType.purchase_unit_name;
  } else {
    purchase.purchase_unit_name = '';
  }

  try {
    const priceData = await apiService.get(`latest-supplier-price/${purchase.product_type_id}/${purchase.supplier_id}`);
    if (priceData.data) {
      purchase.price_id = priceData.data.id;
      purchase.cost_price = priceData.data.cost_price || '';
      purchase.selling_price = priceData.data.selling_price || '';
      purchase.original_selling_price = priceData.data.selling_price || null;
    } else {
      purchase.price_id = '';
      purchase.cost_price = '';
      purchase.selling_price = '';
      purchase.original_selling_price = null;
    }
  } catch (err) {
    catchAxiosError(err);
  }
};


const addPurchase = () => {
  const lastPurchase = purchases[purchases.length - 1];
  if (lastPurchase.supplier_id && lastPurchase.product_type_id && lastPurchase.cost_price && lastPurchase.selling_price) {
    purchases.push({
      supplier_id: suppliers.value.length > 0 ? suppliers.value[0].id : '',
      product_type_id: '',
      price_id: '',
      cost_price: '',
      capacity_qty: '',
      selling_price: '',
      batch_no: batchNo.value,
      product_identifier: '',
      expiry_date: '',
      purchase_unit_name: '',
      original_selling_price: null
    });
  } else {
    catchAxiosError({ message: 'Please fill out all required fields before adding a new purchase.' });
  }
};

const removePurchase = (index) => {
  purchases.splice(index, 1);
  calculateTotalCost();
};

const isDuplicatePurchase = (supplier_id, product_type_id) => {
  return purchases.some(purchase => purchase.supplier_id === supplier_id && purchase.product_type_id === product_type_id);
};

watch(
  purchases,
  (newPurchases) => {
    newPurchases.forEach((purchase) => {
      if (purchase.selling_price !== purchase.original_selling_price) {
        purchase.price_id = '';
      }
    });
    calculateTotalCost();
  },
  { deep: true }
);

const handleSellingPriceChange = (index) => {
  const purchase = purchases[index];
  if (purchase.selling_price < purchase.cost_price) {
    purchase.selling_price = '';
    catchAxiosError({ message: 'Selling price cannot be lower than cost price.' });
  }
};

const calculateTotalCost = () => {
  totalCostPrice.value = purchases.reduce((acc, purchase) => {
    return acc + RowTotalCost(purchase);
  }, 0);
};

const RowTotalCost = (purchase) => {
  return parseFloat(purchase.cost_price || 0) * parseFloat(purchase.capacity_qty || 1);
};

const handleSubmit = async () => {
  const lastPurchase = purchases[purchases.length - 1];
  if (!lastPurchase.supplier_id || !lastPurchase.product_type_id || !lastPurchase.cost_price || !lastPurchase.selling_price) {
    purchases.pop();
  }

  try {
    isSubmitting.value = true;
    const formattedPurchases = purchases.map(purchase => {
      if (purchase.price_id && purchase.selling_price === purchase.original_selling_price) {
        return {
          ...purchase,
          cost_price: undefined,
          selling_price: undefined
        };
      } else {
        return {
          ...purchase,
          price_id: undefined
        };
      }
    });

    await apiService.post('purchases', { purchases: formattedPurchases });
    router.push('/purchase');
  } catch (err) {
    catchAxiosError(err);
  } finally {
    isSubmitting.value = false;
  }
};

const showTooltip = (event) => {
  tooltipMessage.value = event.target.dataset.tooltip;
  tooltipVisible.value = true;
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.container {
  padding: 20px;
}

.top-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.total-and-add {
  display: flex;
  align-items: center;
}

.total-cost-price {
  margin-right: 10px;
  font-size: 1.2em;
  font-weight: bold;
}

.batch-container {
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
}

.batch-container input {
  width: 50%;
  margin: 0 1em;
}

.purchase-form {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

label {
  display: block;
  margin-bottom: 5px;
}

.required {
  color: red;
}

input,
select {
  display: block;
  width: auto;
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.short-input {
  width: 150px;
}

input[type="number"] {
  width: 100px;
}

input[type="date"].expiry-date {
  width: 120px;
}

button {
  margin-right: 10px;
}

.add-purchase-button {
  background-color: #C35214;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
}

.add-purchase-button:disabled {
  background-color: #e86925;
  cursor: not-allowed;
  opacity: 0.65;
}

.add-purchase-button:hover:not(:disabled) {
  background-color: #e86925;
}

.submit-button {
  background-color: #C35214;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: #e86925;
  cursor: not-allowed;
  opacity: 0.65;
}

.submit-button:hover:not(:disabled) {
  background-color: #e86925;
}

.back-btn {
  background-color: #6c757d;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.back-btn:hover {
  background-color: #5a6268;
}

.loading-icon {
  text-align: center;
  font-size: 18px;
  margin-bottom: 20px;
}

.separator {
  border: 0;
  border-top: 1px solid #ccc;
  margin-top: 20px;
  margin-bottom: 20px;
}

.priceView {
  font-size: 0.8em;
  border: 2px solid rgb(195 82 20 / 50%);
  background-color: rgb(195 82 20 / 50%);
  color: #fff;
  padding: 0.3%;
  border-radius: 4px;
}

.remove-purchase-button {
  background-color: #d9534f;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1.5rem;
}

.remove-purchase-button:hover {
  background-color: #c9302c;
}

.tooltip-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.tooltip {
  visibility: hidden;
  width: 200px;
  background-color: #000;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 4px;

  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -100px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-container:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>
