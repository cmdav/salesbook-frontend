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
import apiService from '@/services/apiService';
import { useCustomerstore } from '@/stores/customers';
import CustomerFormModal from '@/components/UI/Modal/CustomerFormModal.vue';
import ReceiptModal from '@/components/UI/Modal/ReceiptModal.vue';
import { storeToRefs } from 'pinia';
import { generateReceiptPDF } from './sentToPrinter';
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response';

const router = useRouter();
const customersStore = useCustomerstore();

const barcodeInputRefs = ref([]);
const data = ref([]);
const totalPrice = ref(0);
const res = ref(null);

const { allCustomersNames } = storeToRefs(customersStore);

const showModal = ref(false);
const isSubmitting = ref(false);

const addNewCustomer = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const setBarcodeRef = (el, index) => {
  barcodeInputRefs.value[index] = el;
};

const focusBarcodeInput = () => {
  nextTick(() => {
    const emptyBarcodeField = barcodeInputRefs.value.find((el) => el && !el.value);
    emptyBarcodeField?.focus();
  });
};
const preventNegativeQuantity = (index) => {
  if (formState.products[index].quantity_sold < 0) {
    formState.products[index].quantity_sold = 0;
  }
};

onMounted(async () => {
  try {
    await customersStore.handleAllCustomersName();
    const response = await apiService.get('/all-product-type-name');
    data.value = response.data;
    focusBarcodeInput();
  } catch (error) {
    console.error('Failed to fetch product type names:', error);
  }
});

const printReceipt = ref('no');
const showReceiptModal = ref(false);

const formState = reactive({
  customer_id: '',
  payment_method: 'cash',
  products: [
    {
      product_type_id: '',
      barcode: '',
      selling_price: '',
      selling_unit_name: '', // Add selling_unit_name field
      quantity_sold: 0,
      amount: '',
      vat: 'no'
    }
  ]
});

const populateProductDetails = (index, product) => {
  formState.products[index].product_type_id = product.id;
  formState.products[index].barcode = product.barcode;
  formState.products[index].selling_price = product.selling_price;
  formState.products[index].selling_unit_name = product.selling_unit_name; // Populate selling unit
  formState.products[index].vat = product.vat.toLowerCase();
  formState.products[index].amount = calculateAmountWithVat(
    formState.products[index].selling_price,
    formState.products[index].quantity_sold,
    formState.products[index].vat
  );
  nextTick(() => focusBarcodeInput());
};

const calculateAmountWithVat = (sellingPrice, quantitySold, vat) => {
  let amount = parseFloat(sellingPrice) * parseFloat(quantitySold || 1); // Ensure quantitySold is never NaN
  if (vat === 'yes') {
    amount *= 1.075;
  }
  return isNaN(amount) ? 0 : amount;
};

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
    calculateTotalPrice();
  },
  { deep: true }
);

const calculateTotalPrice = () => {
  const total = formState.products.reduce((acc, product) => acc + (product.amount || 0), 0);
  totalPrice.value = isNaN(total) ? '0.00' : total.toFixed(2); // Ensure total is never NaN
};

const isProductSelected = (productId) => {
  return formState.products.some((product) => product.product_type_id === productId);
};

const addProducts = () => {
  const lastProduct = formState.products[formState.products.length - 1];
  if (lastProduct.product_type_id || lastProduct.barcode) {
    formState.products.push({
      product_type_id: '',
      barcode: '',
      selling_price: '',
      selling_unit_name: '', // Ensure new product object has selling_unit_name field
      quantity_sold: 0,
      amount: '',
      vat: 'no'
    });
    nextTick(() => focusBarcodeInput());
  }
};

const removeProduct = (index) => {
  if (formState.products.length > 1) {
    formState.products.splice(index, 1);
    barcodeInputRefs.value.splice(index, 1);
    nextTick(() => focusBarcodeInput());
    calculateTotalPrice();
  }
};

const handleBarcodeEnter = (index) => {
  const product = data.value.find((p) => p.barcode === formState.products[index].barcode);

  if (isDuplicateBarcode(formState.products[index].barcode)) {
    alert("This barcode has already been scanned.");
    formState.products[index].barcode = ''; // Clear the duplicate barcode
    return;
  }

  if (product) {
    populateProductDetails(index, product);
    addProducts();
  }
};

const handleProductTypeSelect = (index) => {
  const product = data.value.find((p) => p.id === formState.products[index].product_type_id);
  if (product) {
    populateProductDetails(index, product);
  }
};

const checkQuantitySold = (index) => {
  const product = data.value.find(p => p.id === formState.products[index].product_type_id);
  
  if (product && formState.products[index].quantity_sold > product.quantity_available) {
    formState.products[index].quantity_sold = product.quantity_available; // Reset to available quantity if exceeds
    alert(`Quantity sold exceeds available stock. Resetting to available quantity: ${product.quantity_available}.`);
  }
  
  formState.products[index].amount = calculateAmountWithVat(
    formState.products[index].selling_price,
    formState.products[index].quantity_sold,
    formState.products[index].vat
  );
  calculateTotalPrice();
};

const isDuplicateBarcode = (barcode) => {
  return formState.products.filter(product => product.barcode === barcode).length > 1;
};

const addSales = async () => {
  isSubmitting.value = true;

  const products = formState.products
    .filter((product) => product.amount > 0)
    .map((product) => ({
      product_type_id: product.product_type_id,
      price_sold_at: parseInt(product.selling_price, 10),
      quantity: parseInt(product.quantity_sold, 10),
      vat: product.vat ? product.vat : null
    }));

  const payload = {
    customer_id: formState.customer_id ? formState.customer_id : null,
    payment_method: formState.payment_method,
    products
  };

  try {
    res.value = await apiService.post('/sales', payload);
    console.log(res.value)
    if (res.value.success) {
    
      showReceiptModal.value = true;
    }

    
    return res.value;
  } catch (error) {
    catchAxiosError(error); 
    console.error('Failed to submit sale:', error);
  } finally {
    isSubmitting.value = false;
    resetForm();
  }
};

const handleReceiptChoice = (choice) => {
  showReceiptModal.value = false;
  console.log('User choice:', choice); // Log the choice to confirm it's being captured
  if (choice === 'yes') {
    generateReceiptPDF(res.value.data);
  }
  catchAxiosSuccess(res.value);
  router.push('/sale');
};

const resetForm = () => {
  formState.customer_id = '';
  formState.payment_method = '';
  formState.products = [
    {
      product_type_id: '',
      barcode: '',
      selling_price: '',
      selling_unit_name: '', // Reset selling_unit_name in the form
      quantity_sold: 1,
      amount: '',
      vat: 'no'
    }
  ];
  nextTick(() => focusBarcodeInput());
};

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
