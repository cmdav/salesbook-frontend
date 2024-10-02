<template>
  <DashboardLayout pageTitle="Add Sale">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div class="top-buttons">
        <router-link to="/sale" class="button back-btn">Back</router-link>
      </div>

      <form @submit.prevent="addSales">
        <!-- Radio buttons for sending receipt -->
        <div class="form-group">
          <span class="font-medium text-gray-700">Send Receipt To Email:</span>
          <label class="radio-label">
            <input type="radio" value="yes" v-model="printReceipt" />
            Yes
          </label>
          <label class="radio-label">
            <input type="radio" value="no" v-model="printReceipt" />
            No
          </label>
        </div>

        <!-- Customer selection if sending receipt -->
        <div v-if="printReceipt === 'yes'" class="form-group flex items-center">
          <div class="flex-grow">
            <select v-model="formState.customer_id" class="select-input">
              <option v-for="name in allCustomersNames" :key="name.id" :value="name.id">
                {{ name.customer_detail }}
              </option>
            </select>
          </div>
          <button type="button" class="button btn-brand ml-4" @click="addNewCustomer">
            Add Customer
          </button>
        </div>

        <!-- Payment method selection -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700">Payment method</label>
          <select required v-model="formState.payment_method" class="select-input">
            <option v-for="option in paymentMethods" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Product list with dynamic inputs -->
        <div class="my-8">
          <div class="form-group flex justify-end">
            <span class="font-medium text-gray-700">
              Total Price: <span v-html="'&#8358;'"></span> {{ totalPrice }}
            </span>
            <button type="button" @click="addProducts" class="button btn-brand !bg-brand/[20%] !text-black !px-3 ml-4">
              Add product
            </button>
          </div>

          <!-- Loop through products -->
          <div
            v-for="(product, index) in formState.products"
            :key="index"
            class="product-group flex items-end mt-4"
          >
            <!-- Product Type Select -->
            <div class="input-group">
              <label class="block text-sm font-medium text-gray-700">Product</label>
              <select v-model="formState.products[index].product_type_id" class="select-input" @change="handleProductTypeSelect(index)">
                <option v-for="name in data" :key="name.id" :value="name.id" :disabled="isProductSelected(name.id)">
                  {{ name.product_type_name }}
                </option>
              </select>
            </div>

            <!-- Barcode input -->
            <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">Barcode</label>
              <input
                type="text"
                :ref="(el) => setBarcodeRef(el, index)"
                v-model="formState.products[index].barcode"
                class="input"
                @keydown.enter.prevent="handleBarcodeEnter(index)"
              />
            </div>

            <!-- VAT Select -->
            <div class="input-group">
              <label class="block text-sm font-medium text-gray-700">VAT</label>
              <select v-model="formState.products[index].vat" class="select-input">
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

           <!-- Quantity Sold -->
<div class="input-group w-20">
  <label class="block text-sm font-medium text-gray-700">Qty Sold</label>
  <input
    type="number"
    v-model="formState.products[index].quantity_sold"
    min="0"
    class="input"
    @change="checkQuantitySold(index)"
    @input="preventNegativeQuantity(index)"
  />
</div>


            <!-- Selling Price -->
            <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">Selling Price</label>
              <input
                type="text"
                v-model="formState.products[index].selling_price"
                class="input readonly-input"
                readonly
              />
              <label class="priceView">
                &#8358;
                {{
                  formState.products[index].selling_price
                    ? parseFloat(formState.products[index].selling_price).toLocaleString()
                    : '0.00'
                }}</label
              >
            </div>

            <!-- Selling Unit -->
            <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">Selling Unit</label>
              <input
                type="text"
                v-model="formState.products[index].selling_unit_name"
                class="input readonly-input"
                readonly
              />
            </div>

            <!-- Amount -->
            <div class="input-group flex-1">
              <label class="block text-sm font-medium text-gray-700">Amount</label>
              <span>
                {{
                  formState.products[index].amount
                    ? formState.products[index].amount.toFixed(2)
                    : '0.00'
                }}
              </span>
            </div>

            <!-- Remove button for each product row -->
            <div class="input-group">
              <button
                v-if="index >= 0"
                type="button"
                class="button btn-danger remove-btn ml-2"
                @click="removeProduct(index)"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Submit button -->
        <button type="submit" class="button submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </form>
    </div>

    <!-- Customer and Receipt Modals -->
    <CustomerFormModal v-if="showModal" @close="closeModal" />
    <ReceiptModal v-if="showReceiptModal" @close="handleReceiptChoice" />
  </DashboardLayout>
</template>
<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/apiService'; // Service to interact with the backend API
import { useCustomerstore } from '@/stores/customers'; // Pinia store for customer data
import CustomerFormModal from '@/components/UI/Modal/CustomerFormModal.vue'; // Modal component for adding a new customer
import ReceiptModal from '@/components/UI/Modal/ReceiptModal.vue'; // Modal component for showing the receipt
import { storeToRefs } from 'pinia';
import { openDB } from 'idb';
import { generateReceiptPDF } from './sentToPrinter'; // Function to generate PDF for the receipt
import { catchAxiosSuccess } from '@/services/Response'; // Services to handle success and error messages for API responses

const router = useRouter();
const customersStore = useCustomerstore(); // Access the Pinia customer store

// References and reactive variables for form and input fields
const barcodeInputRefs = ref([]); // Ref to track barcode input fields
const data = ref([]); // Holds the product data fetched from the API
const totalPrice = ref(0); // Holds the total price of all products
const res = ref(null); // Ref to store the API response

const { allCustomersNames } = storeToRefs(customersStore); // Store all customer names from the Pinia store

// Control variables for modals and form submission
const showModal = ref(false);
const isSubmitting = ref(false);

// Function to open the 'Add Customer' modal
const addNewCustomer = () => {
  showModal.value = true;
};

// Function to close the 'Add Customer' modal
const closeModal = () => {
  showModal.value = false;
};

// Function to set a reference to the barcode input element
const setBarcodeRef = (el, index) => {
  barcodeInputRefs.value[index] = el;
};

// Function to focus on the next barcode input field
const focusBarcodeInput = () => {
  nextTick(() => {
    const emptyBarcodeField = barcodeInputRefs.value.find((el) => el && !el.value);
    emptyBarcodeField?.focus(); // Focuses on the next empty barcode input
  });
};

// Function to prevent entering a negative quantity
const preventNegativeQuantity = (index) => {
  if (formState.products[index].quantity_sold < 0) {
    formState.products[index].quantity_sold = 0;
  }
};



// State variables for form inputs and product list
const printReceipt = ref('no'); // Tracks whether the user wants to print a receipt
const showReceiptModal = ref(false); // Controls whether the receipt modal is shown

const formState = reactive({
  customer_id: '', // Selected customer ID
  payment_method: 'cash', // Selected payment method
  products: [
    {
      product_type_id: '',
      barcode: '',
      selling_price: '',
      selling_unit_name: '', // Selling unit for the product
      quantity_sold: 0,
      amount: '',
      vat: 'no' // VAT applied to the product
    }
  ]
});

// Function to populate product details based on product selection

const populateProductDetails = (index, product) => {
  if (!product) {
    console.error(`Product not found at index ${index}`);
    return;
  }
  formState.products[index].product_type_id = product.id;
  formState.products[index].barcode = product.barcode || ''; // Handle missing barcode
  formState.products[index].selling_price = product.selling_price || 0;
  formState.products[index].selling_unit_name = product.selling_unit_name || ''; // Populate selling unit name
  formState.products[index].vat = product.vat ? product.vat.toLowerCase() : 'no'; // Set VAT value, default to 'no'
  formState.products[index].amount = calculateAmountWithVat(
    formState.products[index].selling_price,
    formState.products[index].quantity_sold,
    formState.products[index].vat
  );
  nextTick(() => focusBarcodeInput()); // Focus on the next empty barcode input
};
const calculateAmountWithVat = (sellingPrice, quantitySold, vat) => {
  let amount = parseFloat(sellingPrice) * parseFloat(quantitySold || 0); // Calculate the amount
  if (vat === 'yes') {
    amount *= 1.075; // Add 7.5% VAT if applicable
  }
  return isNaN(amount) ? 0 : amount; // Return the calculated amount or 0 if NaN
};

// Function to handle product type selection
const handleProductTypeSelect = async (index) => {
  const productId = formState.products[index].product_type_id;
  let product;

  try {
    if (navigator.onLine) {
      // If online, get product from the fetched API data
      
      product = data.value.find(p => p.id === productId);
    } else {
      // If offline, retrieve product from IndexedDB
      const db = await openDB('sales-db', 2); // Ensure using version 2
      const tx = db.transaction('products', 'readonly');
      const store = tx.objectStore('products');
      
      product = await store.get(productId); // Get the product by ID from IndexedDB
      //console.log(product)
      await tx.done; // Ensure transaction is complete
    }

    if (product) {
      populateProductDetails(index, product); // Populate the product details in the form
    } else {
      console.error('Product not found for the selected type');
    }
  } catch (error) {
    console.error('Error during product selection:', error);
  }
};



// Watcher to update product amounts and total price when any product changes
watch(
  () =>
    formState.products.map((product) => ({
      selling_price: product.selling_price,
      quantity_sold: product.quantity_sold,
      vat: product.vat
    })),
  () => {
    formState.products.forEach((product, index) => {
      formState.products[index].amount = calculateAmountWithVat(
        product.selling_price,
        product.quantity_sold,
        product.vat
      );
    });
    calculateTotalPrice(); // Recalculate the total price
  },
  { deep: true }
);

// Function to calculate the total price of all products
const calculateTotalPrice = () => {
  const total = formState.products.reduce((acc, product) => acc + (product.amount || 0), 0); // Calculate total
  totalPrice.value = isNaN(total) ? '0.00' : total.toFixed(2); // Ensure total is never NaN
};

// Function to check if a product has already been selected
const isProductSelected = (productId) => {
  return formState.products.some((product) => product.product_type_id === productId);
};

// Function to remove a product from the list
const removeProduct = (index) => {
  if (formState.products.length > 1) {
    formState.products.splice(index, 1); // Remove the product at the specified index
    barcodeInputRefs.value.splice(index, 1); // Remove the barcode reference
    nextTick(() => focusBarcodeInput()); // Focus on the next empty barcode input
    calculateTotalPrice(); // Recalculate total price
  }
};

// Function to handle when a barcode is entered
const handleBarcodeEnter = (index) => {
  const product = data.value.find((p) => p.barcode === formState.products[index].barcode); // Find product by barcode

  if (isDuplicateBarcode(formState.products[index].barcode)) {
    alert("This barcode has already been scanned."); // Show alert if barcode is duplicated
    formState.products[index].barcode = ''; // Clear the duplicate barcode
    return;
  }

  if (product) {
    populateProductDetails(index, product); // Populate product details if found
    addProducts(); // Add a new product row
  }
};




// Function to check if the quantity sold exceeds available stock
const checkQuantitySold = (index) => {
  const product = data.value.find(p => p.id === formState.products[index].product_type_id); // Find product by ID
  
  if (product && formState.products[index].quantity_sold > product.quantity_available) {
    formState.products[index].quantity_sold = product.quantity_available; // Reset to available quantity if exceeds
    alert(`Quantity sold exceeds available stock. Resetting to available quantity: ${product.quantity_available}.`);
  }
  
  formState.products[index].amount = calculateAmountWithVat(
    formState.products[index].selling_price,
    formState.products[index].quantity_sold,
    formState.products[index].vat
  );
  calculateTotalPrice(); // Recalculate total price
};

// Function to check if the barcode has already been scanned
const isDuplicateBarcode = (barcode) => {
  return formState.products.filter(product => product.barcode === barcode).length > 1;
};

// Function to add a new product row
const addProducts = () => {
  const lastProduct = formState.products[formState.products.length - 1];

  if (lastProduct.barcode || lastProduct.product_type_id) {
    formState.products.push({
      product_type_id: '',
      barcode: '',
      selling_price: '',
      selling_unit_name: '',
      quantity_sold: 0,
      amount: '',
      vat: 'no'
    });
    nextTick(() => focusBarcodeInput()); // Focus on the next empty barcode input
  }
};


onMounted(async () => {
  try {
    // Always open the IndexedDB using the current version (2)
    const db = await openDB('sales-db', 2, {
      upgrade(db, oldVersion, newVersion) {
        console.log(newVersion)
        // Upgrade logic for version 1 to version 2
        if (oldVersion < 1) {
          db.createObjectStore('products', { keyPath: 'id' });
        }
        if (oldVersion < 2) {
          db.createObjectStore('sales', { autoIncrement: true });
        }
      }
    });

    if (navigator.onLine) {
      console.log("online")
      // Fetch product data from the API if the app is online
      const response = await apiService.get('/all-product-type-name');
      data.value = response.data; // Store the fetched data in the reactive `data` variable

      // Store product data in IndexedDB
      const tx = db.transaction('products', 'readwrite');
      const store = tx.objectStore('products');
      response.data.forEach((product) => {
        store.put(product);
      });
      await tx.done; // Ensure transaction is complete
    } else {
      
      // If offline, load product data from IndexedDB
      const tx = db.transaction('products', 'readonly');
      const store = tx.objectStore('products');
      data.value = await store.getAll(); // Get all products from the IndexedDB
    }

    focusBarcodeInput(); // Focus on the first empty barcode input
  } catch (error) {
    console.error('Error fetching product data:', error);
  }
});

const addSales = async () => {
  isSubmitting.value = true;

  // Validate that all products have quantities greater than 0
  const invalidProducts = formState.products.filter(product => product.product_type_id && product.quantity_sold <= 0);

  if (invalidProducts.length > 0) {
    alert(`Enter a quantity for all selected products`);
    isSubmitting.value = false;
    return;
  }

  const products = formState.products
    .filter((product) => product.amount > 0)
    .map((product) => ({
      product_type_id: product.product_type_id,
      price_sold_at: parseInt(product.selling_price, 10),
      quantity: parseInt(product.quantity_sold, 10),
      vat: product.vat === 'yes' ? 'yes' : 'no'
    }));

  const payload = {
    customer_id: formState.customer_id ? formState.customer_id : null,
    payment_method: formState.payment_method,
    products
  };

  try {
    if (navigator.onLine) {
      // If online, send the sales data to the server
      res.value = await apiService.post('/sales', payload);
      if (res.value.success) {
        showReceiptModal.value = true;
      }
    } else {
      // If offline, store sales data in IndexedDB
      console.log('App is offline. Storing sales data.');

      // Open IndexedDB
      const db = await openDB('sales-db', 2);

      const tx = db.transaction('sales', 'readwrite');
      const store = tx.objectStore('sales');
      await store.put(payload);
      await tx.done;

      // Register a sync event with the service worker
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready.then((registration) => {
    return registration.sync.register('sync-sales').then(() => {
      console.log('Sync event registered successfully');
      alert('Offline data has been submitted')
    }).catch((err) => {
      console.error('Failed to register sync event:', err);
    });
  });
}

    }
  } catch (error) {
    console.error('Error while adding sales:', error);
  } finally {
    isSubmitting.value = false;
    resetForm();
  }
};


// Function to handle receipt choice (whether to print or not)
const handleReceiptChoice = (choice) => {
  showReceiptModal.value = false;
  if (choice === 'yes') {
    generateReceiptPDF(res.value.data); // Generate the receipt PDF if 'yes'
  }
  catchAxiosSuccess(res.value); // Handle the successful API response
  router.push('/sale'); // Redirect to the sales page
};

// Function to reset the form after submission
const resetForm = () => {
  formState.customer_id = '';
  formState.payment_method = '';
  formState.products = [
    {
      product_type_id: '',
      barcode: '',
      selling_price: '',
      selling_unit_name: '',
      quantity_sold: 1,
      amount: '',
      vat: 'no'
    }
  ];
  nextTick(() => focusBarcodeInput()); // Focus on the next empty barcode input
};

// List of available payment methods
const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'pos', label: 'Pos' },
  { value: 'bank-transfer', label: 'Bank Transfer' }
];
</script>

<style scoped>
/* Your existing CSS styles */
.container {
  padding: 20px;
}

.top-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.radio-label {
  margin-left: 10px;
}

.input-group {
  flex: 1;
  margin-right: 20px;
  height: 100px;
}

.select-input,
.input {
  display: block;
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.readonly-input {
  background-color: #f5f5f5;
}

button {
  margin-right: 10px;
}

.submit-button {
  background-color: #28a745;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: #218838;
  cursor: not-allowed;
  opacity: 0.65;
}

.btn-brand {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-brand:disabled {
  background-color: #007bff;
  cursor: not-allowed;
  opacity: 0.65;
}

.btn-brand:hover:not(:disabled) {
  background-color: #0056b3;
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

.btn-danger {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1em;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>
