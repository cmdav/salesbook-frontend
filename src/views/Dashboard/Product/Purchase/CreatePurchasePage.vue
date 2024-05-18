<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/apiService';
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response';

const router = useRouter();
const suppliers = ref([]);
const productTypes = ref([]);
const batchNo = ref('');
const isLoading = ref(false);
const error = ref(null);
const purchases = ref([
  {
    supplier_id: '',
    product_type_id: '',
    price_id: '',
    cost_price: '',
    selling_price: '',
    batch_no: '',
    quantity: '',
    product_identifier: '',
    expiry_date: '',
    isCostPriceReadonly: false,
    isSellingPriceReadonly: false
  }
]);

const minExpiryDate = new Date().toISOString().split('T')[0];

const fetchData = async () => {
  try {
    isLoading.value = true;
    const [suppliersResponse, productTypesResponse, lastBatchNumberResponse] = await Promise.all([
      apiService.get('all-suppliers'),
      apiService.get('all-product-type'),
      apiService.get('last-batch-number')
    ]);

    if (suppliersResponse.data) {
      suppliers.value = suppliersResponse.data;
      purchases.value[0].supplier_id = suppliers.value[0].id;
    } else {
      error.value = 'No suppliers found';
    }

    if (productTypesResponse.data) {
      productTypes.value = productTypesResponse.data;
    } else {
      error.value = 'No product types found';
    }

    if (lastBatchNumberResponse.data && lastBatchNumberResponse.data.batch_no) {
      const lastBatchNo = parseInt(lastBatchNumberResponse.data.batch_no);
      batchNo.value = String(lastBatchNo + 1).padStart(5, '0');
      purchases.value.forEach(purchase => purchase.batch_no = batchNo.value);
    } else {
      batchNo.value = '00001';
      purchases.value.forEach(purchase => purchase.batch_no = batchNo.value);
    }
  } catch (err) {
    catchAxiosError(err);
  } finally {
    isLoading.value = false;
  }
};

const handleSupplierChange = async (index) => {
 
  const purchase = purchases.value[index];
  if (!purchase.product_type_id || !purchase.supplier_id) {
    catchAxiosError({ message: 'Please select both supplier and product type.' });
    return;
  }
  try {
    const response = await apiService.get(`latest-supplier-price/${purchase.product_type_id}/${purchase.supplier_id}`);
    if (response.data) {
      purchase.price_id = response.data.id;
      purchase.cost_price = response.data.cost_price;
      purchase.selling_price = response.data.selling_price;
      //purchase.batch_no = response.data.batch_no ? String(parseInt(response.data.batch_no) + 1).padStart(5, '0') : batchNo.value;
      purchase.isCostPriceReadonly = true;
      purchase.isSellingPriceReadonly = true;
    } else {
      purchase.price_id = '';
      purchase.cost_price = '';
      purchase.selling_price = '';
      //purchase.batch_no = batchNo.value;
      purchase.isCostPriceReadonly = false;
      purchase.isSellingPriceReadonly = false;
    }
  } catch (err) {
    catchAxiosError(err);
  }
};

const addPurchase = () => {
  const lastPurchase = purchases.value[purchases.value.length - 1];
  if (lastPurchase.supplier_id && lastPurchase.product_type_id && lastPurchase.quantity && lastPurchase.cost_price && lastPurchase.selling_price) {
    purchases.value.push({
      supplier_id: suppliers.value.length > 0 ? suppliers.value[0].id : '',
      product_type_id: '',
      price_id: '',
      cost_price: '',
      selling_price: '',
      batch_no: batchNo.value,
      quantity: '',
      product_identifier: '',
      expiry_date: '',
      isCostPriceReadonly: false,
      isSellingPriceReadonly: false
    });
  } else {
    catchAxiosError({ message: 'Please fill out all required fields before adding a new purchase.' });
  }
};

const isDuplicatePurchase = (supplier_id, product_type_id) => {
  return purchases.value.some(purchase => purchase.supplier_id === supplier_id && purchase.product_type_id === product_type_id);
};

const handleSellingPriceChange = (index) => {
  const purchase = purchases.value[index];
  if (purchase.selling_price < purchase.cost_price) {
    purchase.selling_price = '';
  }
};

const handleSubmit = async () => {
  // Remove last row if not completely filled
  const lastPurchase = purchases.value[purchases.value.length - 1];
  if (!lastPurchase.supplier_id || !lastPurchase.product_type_id || !lastPurchase.quantity || !lastPurchase.cost_price || !lastPurchase.selling_price) {
    purchases.value.pop();
  }

  // Handle form submission
  try {
    const formattedPurchases = purchases.value.map(purchase => {
      if (purchase.price_id) {
        return {
          ...purchase,
          cost_price: undefined, // Remove cost_price if price_id is present
          selling_price: undefined // Remove selling_price if price_id is present
        };
      } else {
        return {
          ...purchase,
          price_id: undefined // Remove price_id if it's not present
        };
      }
    });

    const response = await apiService.post('purchases', { purchases: formattedPurchases });
    catchAxiosSuccess(response);
    router.push('/purchase'); // Redirect to the view purchase page if the submission is successful
  } catch (err) {
    catchAxiosError(err);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <DashboardLayout pageTitle="Add Purchase">
    <div class="container">
      <div class="top-buttons">
        <router-link to="/purchase" class="button back-btn">Back</router-link>
        <button type="button" @click="addPurchase" class="button add-purchase-button">Add Purchase</button>
      </div>
      <div v-if="isLoading" class="loading-icon">Loading...</div>
      <form v-else @submit.prevent="handleSubmit">
        <div class="batch-container">
          <label for="batch_no">Batch No</label>
          <input type="text" v-model="batchNo" readonly />
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
                <option v-for="productType in productTypes" :key="productType.id" :value="productType.id" :disabled="isDuplicatePurchase(purchase.supplier_id, productType.id)">
                  {{ productType.product_type_name }}
                </option>
              </select>
            </div>
            <div>
              <label for="cost_price">Cost Price <span class="required">*</span></label>
              <input type="number" v-model="purchase.cost_price" :readonly="purchase.isCostPriceReadonly" maxlength="9" required />
            </div>
            <div>
              <label for="selling_price">Selling Price <span class="required">*</span></label>
              <input type="number" v-model="purchase.selling_price" @change="handleSellingPriceChange(index)" maxlength="9" :readonly="purchase.isSellingPriceReadonly" required />
            </div>
            <div>
              <label for="quantity">Qty <span class="required">*</span></label>
              <input type="number" v-model="purchase.quantity" maxlength="5" required />
            </div>
            <div>
              <label for="product_identifier">Product Identifier</label>
              <input type="text" v-model="purchase.product_identifier" />
            </div>
            <div>
              <label for="expiry_date">Expiry Date</label>
              <input type="date" v-model="purchase.expiry_date" :min="minExpiryDate" class="expiry-date" />
            </div>
            <input type="hidden" v-model="purchase.price_id" />
          </div>
          <hr class="separator" />
        </div>
        <button type="submit" class="button submit-button">Submit</button>
      </form>
    </div>
  </DashboardLayout>
</template>



<style scoped>
.container {
  padding: 20px;
}

.top-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.batch-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.batch-container input {
  flex: 1;
  margin-right: 10px;
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

input, select {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type="number"] {
  width: 100px;
}

input[type="date"].expiry-date {
  width: 120px;
}

input[readonly] {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

button {
  margin-right: 10px;
}

.add-purchase-button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
}

.add-purchase-button:disabled {
  background-color: #007bff;
  cursor: not-allowed;
  opacity: 0.65;
}

.add-purchase-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-button {
  background-color: #28a745;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #218838;
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
</style>

