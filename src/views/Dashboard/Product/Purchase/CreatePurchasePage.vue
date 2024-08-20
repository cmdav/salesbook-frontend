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
                <option v-for="productType in productTypes" :key="productType.id" :value="productType.id"
                  :disabled="isDuplicatePurchase(purchase.supplier_id, productType.id)">
                  {{ productType.product_type_name }}
                </option>
              </select>
            </div>
            <div>
              <label for="cost_price">Purchase Unit<span class="required"></span></label>
              <input type="number" v-model="purchase.container_qty" maxlength="9" />
              
            </div>
            <div>
              <label for="cost_price">Purchase Unit Qty<span class="required"></span></label>
              <input type="number" v-model="purchase.capacity_qty" maxlength="9" />
              
            </div>
            <div class="form-row">
            <div>
              <label for="cost_price">Cost Price <span class="required">*</span></label>
              <input type="number" v-model="purchase.cost_price" maxlength="9" required />
              <label class="priceView"> &#8358; {{ purchase.cost_price ?
                parseFloat(purchase.cost_price).toLocaleString() :
                '0.00' }}</label>
            </div>
            <div>
              <label for="selling_price">Selling Price <span class="required">*</span></label>
              <input type="number" v-model="purchase.selling_price" @change="handleSellingPriceChange(index)"
                maxlength="9" required />
              <label class="priceView"> &#8358; {{ purchase.selling_price ?
                parseFloat(purchase.selling_price).toLocaleString() :
                '0.00' }}</label>
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
            <div v-if="index !== 0" class="remove-button">
              <button type="button" @click="removePurchase(index)" class="button remove-purchase-button">Remove</button>
            </div>
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
// Import necessary functions and components from Vue and other dependencies
import { ref, reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/apiService';
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response';

// Initialize the router for navigation
const router = useRouter();

// Reactive variables for data and state
const suppliers = ref([]);
const productTypes = ref([]);
const batchNo = ref('');
const isLoading = ref(false);
const error = ref(null);
const isSubmitting = ref(false); 

// Reactive variable for purchases array
const purchases = reactive([
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
    container_qty: '',
    capacity_qty: '',
    original_selling_price: null 
  }
]);

// Set minimum expiry date to today's date
const minExpiryDate = new Date().toISOString().split('T')[0];

// Function to fetch data from the API
const fetchData = async () => {
  try {
    isLoading.value = true; // Set loading state to true
    const [suppliersResponse, productTypesResponse, lastBatchNumberResponse] = await Promise.all([
      apiService.get('all-suppliers'),
      apiService.get('all-product-type'),
      apiService.get('last-batch-number'),
    ]);

    // Handle suppliers response
    if (suppliersResponse.data) {
      suppliers.value = suppliersResponse.data;
      purchases[0].supplier_id = suppliers.value[0].id;
    } else {
      error.value = 'No suppliers found';
    }

    // Handle product types response
    if (productTypesResponse.data) {
      productTypes.value = productTypesResponse.data;
    } else {
      error.value = 'No product types found';
    }
    console.log(lastBatchNumberResponse.data)
    // Handle last batch number response
    if (lastBatchNumberResponse.data) {
      const lastBatchNo = lastBatchNumberResponse.data;
      batchNo.value = String(lastBatchNo).padStart(5, '0');
      purchases.forEach(purchase => purchase.batch_no = batchNo.value);
    } else {
      batchNo.value = '000';
      purchases.forEach(purchase => purchase.batch_no = batchNo.value);
    }
  } catch (err) {
    catchAxiosError(err); // Handle error
  } finally {
    isLoading.value = false; // Set loading state to false
  }
};

// Function to handle supplier change and fetch latest supplier price
const handleSupplierChange = async (index) => {
  const purchase = purchases[index];
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
      purchase.original_selling_price = response.data.selling_price; // Track the original selling price
    } else {
      purchase.price_id = '';
      purchase.cost_price = '';
      purchase.selling_price = '';
      purchase.original_selling_price = null;
    }
  } catch (err) {
    catchAxiosError(err); // Handle error
  }
};

// Function to add a new purchase row
const addPurchase = () => {
  const lastPurchase = purchases[purchases.length - 1];
  if (lastPurchase.supplier_id && lastPurchase.product_type_id && lastPurchase.quantity && lastPurchase.cost_price && lastPurchase.selling_price) {
    purchases.push({
      supplier_id: suppliers.value.length > 0 ? suppliers.value[0].id : '',
      product_type_id: '',
      price_id: '',
      cost_price: '',
      container_qty: '',
      capacity_qty: '',
      selling_price: '',
      batch_no: batchNo.value,
      quantity: '',
      product_identifier: '',
      expiry_date: '',
      original_selling_price: null
    });
  } else {
    catchAxiosError({ message: 'Please fill out all required fields before adding a new purchase.' });
  }
};

// Function to remove a purchase row
const removePurchase = (index) => {
  purchases.splice(index, 1);
};

// Function to check for duplicate purchases
const isDuplicatePurchase = (supplier_id, product_type_id) => {
  return purchases.some(purchase => purchase.supplier_id === supplier_id && purchase.product_type_id === product_type_id);
};

// Watcher to track changes in selling price
watch(
  purchases,
  (newPurchases) => {
    newPurchases.forEach((purchase) => {
      if (purchase.selling_price !== purchase.original_selling_price) {
        purchase.price_id = ''; // Clear the price_id if selling price changes
      }
    });
  },
  { deep: true }
);

// Function to handle selling price change
const handleSellingPriceChange = (index) => {
  const purchase = purchases[index];
  if (purchase.selling_price < purchase.cost_price) {
    purchase.selling_price = '';
    catchAxiosError({ message: 'Selling price cannot be lower than cost price.' });
  }
};

// Function to handle form submission
const handleSubmit = async () => {
  // Remove last row if not completely filled
  const lastPurchase = purchases[purchases.length - 1];
  if (!lastPurchase.supplier_id || !lastPurchase.product_type_id || !lastPurchase.quantity || !lastPurchase.cost_price || !lastPurchase.selling_price) {
    purchases.pop();
  }

  // Handle form submission
  try {
    isSubmitting.value = true; // Set submitting state to true
    const formattedPurchases = purchases.map(purchase => {
      if (purchase.price_id && purchase.selling_price === purchase.original_selling_price) {
        // If price_id is present and selling price hasn't changed
        return {
          ...purchase,
          cost_price: undefined, // Remove cost_price if price_id is present
          selling_price: undefined // Remove selling_price if price_id is present
        };
      } else {
        // If price_id is not present or selling price has changed
        return {
          ...purchase,
          price_id: undefined // Remove price_id if it's not present or selling price has changed
        };
      }
    });

    const response = await apiService.post('purchases', { purchases: formattedPurchases });
    catchAxiosSuccess(response);
    router.push('/purchase'); // Redirect to the view purchase page if the submission is successful
  } catch (err) {
    catchAxiosError(err); // Handle error
  } finally {
    isSubmitting.value = false; // Set submitting state to false
  }
};

// Fetch initial data when the component is mounted
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

.batch-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

batch-container input {
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

input,
select {
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
</style>
