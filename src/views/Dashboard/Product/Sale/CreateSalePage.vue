
<template>
  <!-- Main layout component for the Add Sale page -->
  <DashboardLayout pageTitle="Add Sale">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Navigation buttons at the top -->
      <div class="top-buttons">
        <router-link to="/sale" class="button back-btn">Back</router-link>
      </div>

      <!-- Form for adding a new sale -->
      <form @submit.prevent="handleAddSales">
        <!-- Section for selecting whether to print a receipt -->
        <div class="form-group">
          <span class="font-medium text-gray-700">Print Receipt:</span>
          <label class="radio-label">
            <input type="radio" value="yes" v-model="printReceipt" />
            Yes
          </label>
          <label class="radio-label">
            <input type="radio" value="no" v-model="printReceipt" />
            No
          </label>
        </div>

        <!-- Section for selecting a customer if printing a receipt -->
        <div v-if="printReceipt === 'yes'" class="form-group flex items-center">
          <div class="flex-grow">
            <select v-model="formState.customer_id" class="select-input">
              <option v-for="name in allCustomersNames" :key="name.id" :value="name.id">
                {{ name.customer_detail }}
              </option>
            </select>
          </div>
          <button type="button" class="button btn-brand ml-4" @click="addNewCustomer">Add Customer</button>
        </div>

        <!-- Section for selecting a payment method -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700">Payment method</label>
          <select required v-model="formState.payment_method" class="select-input">
            <option v-for="option in [
                { value: 'cash', label: 'Cash' },
                { value: 'pos', label: 'Pos' },
                { value: 'bank-transfer', label: 'Bank Transfer' },
              ]" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Section for adding products to the sale -->
        <div class="my-8">
          <div class="form-group flex justify-end">
            <span class="font-medium text-gray-700">Total Price: <span v-html="'&#8358;'"></span> {{ totalPrice
              }}</span>
            <button type="button" @click="addProducts" class="button btn-brand !bg-brand/[20%] !text-black !px-3 ml-4">
              Add product
            </button>
          </div>

          <!-- Loop through each product added to the sale and display input fields for each product's details -->
          <div v-for="(product, index) in formState.products" :key="index"
            class="product-group flex justify-between items-end mt-4">
            <!-- Product type selection -->
            <div class="input-group">
              <label class="block text-sm font-medium text-gray-700">Product</label>
              <select v-model="formState.products[index].product_type_id" class="select-input">
                <option v-for="name in allProductTypeName" :key="name.id" :value="name.id">
                  {{ name.product_type_name }}
                </option>
              </select>
            </div>

            <!-- Product batch selection -->
            <div class="input-group">
              <label class="block text-sm font-medium text-gray-700">Product Batch</label>
              <select v-model="formState.products[index].batch_id"
                @change="updateBatchDetails(formState.products[index].batch_id, index)" class="select-input">
                <option v-for="batch in formState.products[index].batches" :key="batch.id" :value="batch.id"
                  :disabled="isBatchSelected(formState.products[index].product_type_id, batch.id, index)">
                  {{ batch.batch_no }}
                </option>
              </select>
            </div>

            <!-- Display available quantity left in the selected batch -->
            <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">Qty left</label>
              <input type="number" :value="formState.products[index].available_qty" class="input readonly-input"
                readonly />
            </div>

            <!-- Input field for the selling price of the product -->
            <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">Price</label>
              <input required v-model="formState.products[index].price_sold_at" type="number" class="input" />
              <label class="priceView"> &#8358; {{ formState.products[index].price_sold_at ?
  parseFloat(formState.products[index].price_sold_at).toLocaleString() :
                '0.00' }}</label>
            </div>

            <!-- Input field for the quantity of the product being sold -->
            <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">Qty Sold</label>
              <input required v-model="formState.products[index].quantity" type="number" class="input" min="1" />
            </div>

            <!-- Selection for VAT applicability -->
            <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">VAT</label>
              <select v-model="formState.products[index].vat" class="select-input">
                <option v-for="option in vatOptions" :key="option.id" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- Display the calculated amount for the product -->
            <div class="input-group flex-1">
              <label class="block text-sm font-medium text-gray-700">Amount</label>
              <span>
                {{ formState.products[index].amount ? formState.products[index].amount.toFixed(2) : '0.00' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Submit button for the form -->
        <button type="submit" class="button submit-button">Submit</button>
      </form>
    </div>

    <!-- Modal for adding a new customer -->
    <CustomerFormModal v-if="showModal" @close="closeModal" />
  </DashboardLayout>
</template>

<script setup>
// Import necessary functions and components from Vue and other dependencies
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/products';
import { useCustomerstore } from '@/stores/customers';
import CustomerFormModal from '@/components/UI/Modal/CustomerFormModal.vue';
import { storeToRefs } from 'pinia';
import { getDb, getAllDb, setDb } from '@/utils/db'

// Initialize the router for navigation
const router = useRouter();

// Access product and customer stores
const productsStore = useProductStore();
const customersStore = useCustomerstore();

// Extract data from the stores
const { allCustomersNames } = storeToRefs(customersStore);
const { allProductTypeName } = storeToRefs(productsStore);

// const isOnline = () => navigator.onLine;
const showModal = ref(false);

// Function to open the customer form modal
const addNewCustomer = () => {
  showModal.value = true;
};

// Function to close the customer form modal
const closeModal = () => {
  showModal.value = false;
};

// Reactive state for sales loading status
const salesLoading = ref(false);

// Reactive state for whether to print a receipt
const printReceipt = ref('no');

// Options for VAT selection
const vatOptions = reactive([
  { id: 'yes', value: 'yes', label: 'Yes' },
  { id: 'no', value: 'no', label: 'No' }
]);

// Reactive state for form data
const formState = reactive({
  customer_id: "",
  payment_method: "cash",
  products: [
    {
      product_type_id: "",
      price_sold_at: null,
      quantity: null,
      batch_no: '',
      available_qty: null,
      amount: 0,
      vat: 'no'
    },
  ],
});

// Function to add a new product to the form
const addProducts = () => {
  const lastProduct = formState.products[formState.products.length - 1];
  if (lastProduct.product_type_id.trim() !== "" && lastProduct.quantity > 0 && lastProduct.price_sold_at > 0) {
    formState.products.push({
      product_type_id: "",
      price_sold_at: 0,
      quantity: 0,
      batch_no: '',
      available_qty: 0,
      amount: 0,
      vat: 'no'
    });
  }
};

// Function to reset the form
const resetForm = () => {
  formState.customer_id = "";
  formState.payment_method = "";
  formState.products = [
    {
      product_type_id: "",
      price_sold_at: null,
      batch_no: null,
      quantity: null,
    },
  ];
};

// Function to handle form submission
const handleAddSales = async () => {
  salesLoading.value = true;
  let products = formState.products.filter(product => product.amount > 0).map(product => ({
    product_type_id: product.product_type_id,
    batch_no: product.batch_no,
    price_sold_at: parseInt(product.price_sold_at),
    quantity: parseInt(product.quantity),
    vat: parseInt(product.vat === 'yes' ? 1 : 0),
  }));

  let payload = {
    customer_id: formState.customer_id,
    payment_method: formState.payment_method,
    products: products,
  };

  try {
    let res = await productsStore.handleAddSaless(payload);
    productsStore.handleGetProducts();
    salesLoading.value = false;
    router.push('/sale'); // Redirect to the sale page after successful submission
    return res;
  } catch (error) {
    console.error('Failed to submit sale:', error);
  } finally {
    salesLoading.value = false;
    resetForm();
  }
};

// Computed property to calculate the total price
const totalPrice = computed(() => {
  return formState.products.reduce((sum, product, index) => {
    return sum + calculateAmount(index);
  }, 0).toFixed(2);
});

// Function to check if a batch is already selected
const isBatchSelected = (productId, batchId, currentIndex) => {
  return formState.products.some((product, index) => {
    return index !== currentIndex &&
      product.product_type_id === productId &&
      product.batch_id === batchId;
  });
};

// Function to update product details based on selected product type
const updatePriceId = (productTypeId, index) => {
  const productInfo = allProductTypeName.value.find(product => product.id === productTypeId);
  if (productInfo) {
    formState.products[index].batches = productInfo.batches;
    formState.products[index].vat = productInfo.vat === "Yes" ? 'yes' : 'no';
  } else {
    formState.products[index].batches = [];
    formState.products[index].vat = 'no';
  }
};

// Function to update batch details based on selected batch
const updateBatchDetails = (batchId, index) => {
  const productInfo = allProductTypeName.value.find(p => p.batches.some(b => b.id === batchId));
  const batchInfo = productInfo ? productInfo.batches.find(batch => batch.id === batchId) : null;

  if (batchInfo && productInfo) {
    formState.products[index].available_qty = batchInfo.batch_quantity_left;
    formState.products[index].price_sold_at = batchInfo.batch_selling_price;
    formState.products[index].batch_no = batchInfo.batch_no;
  } else {
    formState.products[index].available_qty = "";
    formState.products[index].price_sold_at = "";
    formState.products[index].vat = 'no';
    formState.products[index].amount = 0;
  }
};

// Function to calculate the amount for each product
const calculateAmount = (index) => {
  const product = formState.products[index];
  if (!product || product.price_sold_at === null || product.quantity === null || product.price_sold_at === "" || product.quantity === "") {
    return 0;
  }

  const baseAmount = parseFloat(product.price_sold_at) * parseInt(product.quantity);
  let amount = baseAmount;
  if (product.vat === 'yes' && baseAmount > 0) {
    const vatPercentage = 7.5;
    amount += baseAmount * (vatPercentage / 100);
  }

  product.amount = amount;
  return amount;
};

// Watchers to update the form state and calculate amounts when relevant fields change
watch(() => formState.products.map(p => p.product_type_id), (newProductTypeIds, oldProductTypeIds) => {
  newProductTypeIds.forEach((productTypeId, index) => {
    if (productTypeId !== oldProductTypeIds[index]) {
      updatePriceId(productTypeId, index);
    }
  });
}, { deep: true });

watch(() => formState.products.map(p => p.batch_id), (newBatchIds, oldBatchIds) => {
  newBatchIds.forEach((batchId, index) => {
    if (batchId !== oldBatchIds[index]) {
      updateBatchDetails(batchId, index);
    }
  });
}, { deep: true });

watch(() => formState.products.map(product => product.quantity), (newQuantities, oldQuantities) => {
  newQuantities.forEach((quantity, index) => {
    if (quantity !== oldQuantities[index]) {
      if (quantity > formState.products[index].available_qty) {
        formState.products[index].quantity = formState.products[index].available_qty;
      }
      calculateAmount(index);
    }
  });
}, { deep: true });

watch(() => formState.products.map(product => product.vat), (newVats, oldVats) => {
  formState.products.forEach((product, index) => {
    if (newVats[index] !== oldVats[index]) {
      calculateAmount(index);
    }
  });
}, { deep: true });

watch(() => formState.products.map(product => product.price_sold_at), (newPrices, oldPrices) => {
  formState.products.forEach((product, index) => {
    if (newPrices[index] !== oldPrices[index]) {
      calculateAmount(index);
    }
  });
}, { deep: true });

// Fetch initial data when the component is mounted
onMounted(async () => {
  // try {
  //   await customersStore.handleAllCustomersName();
  //   await productsStore.handleGetAllProductTypeName();
  // } catch (error) {
  //   console.error;
  // }
    try {
      const [customers, productTypes] = await Promise.all([
        customersStore.handleAllCustomersName().catch(async (error) => {
          console.error('Fetching customers failed, retrieving from cache:', error);
          return await getDb('customers', 'all');
        }),
        productsStore.handleGetAllProductTypeName().catch(async (error) => {
          console.error('Fetching product types failed, retrieving from cache:', error);
          return await getDb('productTypes', 'all');
        }),
      ]);
  
      if (customers) {
        await setDb('customers', { id: 'all', data: customers });
      }
      if (productTypes) {
        await setDb('productTypes', { id: 'all', data: productTypes });
      }
    } catch (error) {
      console.error('Failed to initialize data:', error);
    }
});
</script>

<style scoped>
/* Container styling */
.container {
  padding: 20px;
}

/* Styling for top navigation buttons */
.top-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* Styling for form groups */
.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

/* Styling for radio button labels */
.radio-label {
  margin-left: 10px;
}

/* Styling for input groups */
.input-group {
  flex: 1;
  margin-right: 20px;
  height: 100px;
}

/* Styling for select inputs and text inputs */
.select-input,
.input {
  display: block;
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Styling for readonly inputs to have a different color */
.readonly-input {
  background-color: #f5f5f5;
}

/* Styling for buttons */
button {
  margin-right: 10px;
}

/* Styling for submit button */
.submit-button {
  background-color: #28a745;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Hover effect for submit button */
.submit-button:hover {
  background-color: #218838;
}

/* Styling for brand buttons */
.btn-brand {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Disabled state styling for brand buttons */
.btn-brand:disabled {
  background-color: #007bff;
  cursor: not-allowed;
  opacity: 0.65;
}

/* Hover effect for enabled brand buttons */
.btn-brand:hover:not(:disabled) {
  background-color: #0056b3;
}

/* Styling for back button */
.back-btn {
  background-color: #6c757d;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Hover effect for back button */
.back-btn:hover {
  background-color: #5a6268;
}

/* Styling for product groups */
.product-group {
  display: flex;
  gap: 20px;
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

</style>
