<template>
  <DashboardLayout pageTitle="Add Sale">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Navigation buttons at the top -->
      <div class="top-buttons">
        <router-link to="/sale" class="button back-btn">Back</router-link>
      </div>

      <!-- Form for adding a new sale -->
      <form @submit.prevent="addSales">
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
          <button type="button" class="button btn-brand ml-4" @click="addNewCustomer">
            Add Customer
          </button>
        </div>

        <!-- Section for selecting a payment method -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700">Payment method</label>
          <select required v-model="formState.payment_method" class="select-input">
            <option
              v-for="option in [
                { value: 'cash', label: 'Cash' },
                { value: 'pos', label: 'Pos' },
                { value: 'bank-transfer', label: 'Bank Transfer' }
              ]"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Section for adding products to the sale -->
        <div class="my-8">
          <div class="form-group flex justify-end">
            <span class="font-medium text-gray-700"
              >Total Price: <span v-html="'&#8358;'"></span> {{ totalPrice }}</span
            >
            <button
              type="button"
              @click="addProducts"
              class="button btn-brand !bg-brand/[20%] !text-black !px-3 ml-4"
            >
              Add product
            </button>
          </div>

          <!-- Loop through each product added to the sale and display input fields for each product's details -->
          <div
            v-for="(product, index) in formState.products"
            :key="index"
            class="product-group flex items-end mt-4"
          >
            <!-- Product type selection -->
            <div class="input-group">
              <label class="block text-sm font-medium text-gray-700">Product</label>
              <select v-model="formState.products[index].product_type_id" class="select-input" @change="handleProductTypeSelect(index)">
                <option v-for="name in data" :key="name.id" :value="name.id">
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

            <!-- Unit Sales -->
            <div class="input-group">
              <label class="block text-sm font-medium text-gray-700">Unit Sales</label>
              <input
                type="text"
                v-model="formState.products[index].is_container_type"
                class="input"
                readonly
              />
            </div>

            <!-- Purchase Unit -->
            <div class="input-group">
              <label class="block text-sm font-medium text-gray-700">Purchase Unit</label>
              <input
                type="text"
                v-model="formState.products[index].container_capacity"
                class="input"
                readonly
              />
            </div>

            <!-- Cost Price -->
            <div class="input-group">
              <label class="block text-sm font-medium text-gray-700">Cost Price</label>
              <input
                type="text"
                v-model="formState.products[index].cost_price"
                class="input"
                readonly
              />
              <label class="priceView">
                &#8358;
                {{
                  formState.products[index].cost_price
                    ? parseFloat(formState.products[index].cost_price).toLocaleString()
                    : '0.00'
                }}</label
              >
            </div>

            <!-- Selling Price -->
            <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">Selling Price</label>
              <input
                type="text"
                v-model="formState.products[index].selling_price"
                class="input"
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
                type="number"
                v-model="formState.products[index].capacity_qty"
                class="input"
              />
            </div>

            <!-- Container Qty -->
            <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">Container Qty</label>
              <input
                type="number"
                v-model="formState.products[index].container_qty"
                class="input"
              />
            </div>

            <!-- Display the calculated amount for the product -->
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

            <!-- Remove button for each product row except the first one -->
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

        <!-- Submit button for the form -->
        <button type="submit" class="button submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </form>
    </div>

    <!-- Modal for adding a new customer -->
    <CustomerFormModal v-if="showModal" @close="closeModal" />
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/apiService'
import { useCustomerstore } from '@/stores/customers'
import CustomerFormModal from '@/components/UI/Modal/CustomerFormModal.vue'
import { storeToRefs } from 'pinia'

const router = useRouter()
const customersStore = useCustomerstore()

// Store multiple references for barcode inputs
const barcodeInputRefs = ref([])
const data = ref([])

const { allCustomersNames } = storeToRefs(customersStore)

const showModal = ref(false)
const isSubmitting = ref(false) // Reactive variable for submission state

const addNewCustomer = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// Handle setting the ref dynamically for each barcode input
const setBarcodeRef = (el, index) => {
  barcodeInputRefs.value[index] = el
}

// Focus the latest empty barcode input field
const focusBarcodeInput = () => {
  nextTick(() => {
    const emptyBarcodeField = barcodeInputRefs.value.find((el) => el && !el.value)
    
    emptyBarcodeField?.focus()
  })
}

// Focus the barcode input field on page load
onMounted(async () => {
  try {
    await customersStore.handleAllCustomersName()
    const response = await apiService.get('/all-product-type-name')
    data.value = response.data
    focusBarcodeInput() // Autofocus on the first barcode input field
  } catch (error) {
    console.error
  }
})

const printReceipt = ref('no')

const formState = reactive({
  customer_id: '',
  payment_method: 'cash',
  products: [
    {
      product_type_id: '',
      barcode: '',
      is_container_type: '',
      container_capacity: '',
      cost_price: '',
      selling_price: '',
      capacity_qty: 1, // Default selling unit
      container_qty: 1, // Default container quantity
      amount: '',
      vat: 'no'
    }
  ]
})

// Function to add new products with autofocus on the latest empty barcode field
const addProducts = () => {
  const lastProduct = formState.products[formState.products.length - 1]
  if (lastProduct.product_type_id || lastProduct.barcode) {
    formState.products.push({
      product_type_id: '',
      barcode: '',
      is_container_type: '',
      container_capacity: '',
      cost_price: '',
      selling_price: '',
      capacity_qty: 1, // Default selling unit
      container_qty: 1, // Default container quantity
      amount: ''
    })
    nextTick(() => focusBarcodeInput()) // Autofocus on the new barcode input field after DOM updates
  }
}

// Function to remove a product from the formState.products array
const removeProduct = (index) => {
  if (index > 0) {
    formState.products.splice(index, 1)
    barcodeInputRefs.value.splice(index, 1) // Remove the reference
    nextTick(() => focusBarcodeInput()) // Refocus on the latest empty barcode field after DOM updates
  }
}

// Watcher for barcode field to populate product details and add new product
const handleBarcodeEnter = (index) => {
  const product = data.value.find((p) => p.barcode === formState.products[index].barcode)
  if (product) {
    populateProductDetails(index, product)
    addProducts() // Automatically add a new empty product row
  }
}

// Handle manual product type selection
const handleProductTypeSelect = (index) => {
  const product = data.value.find((p) => p.id === formState.products[index].product_type_id)
  if (product) {
    populateProductDetails(index, product)
  }
}

// Populate the product details when either barcode or product type is selected
const populateProductDetails = (index, product) => {
  formState.products[index].product_type_id = product.id
  formState.products[index].barcode = product.barcode
  formState.products[index].is_container_type = product.is_container_type
  formState.products[index].container_capacity = product.container_capacity
  formState.products[index].cost_price = product.cost_price
  formState.products[index].selling_price = product.selling_price
  formState.products[index].capacity_qty = 1 // Default selling unit
  formState.products[index].container_qty = 1 // Default container quantity
  formState.products[index].amount = formState.products[index].selling_price * formState.products[index].capacity_qty
  nextTick(() => focusBarcodeInput()) // Refocus on the latest empty barcode field after updating product details
}

// Watcher to calculate the total price for each product whenever quantity or price changes
watch(
  () =>
    formState.products.map((product) => ({
      selling_price: product.selling_price,
      capacity_qty: product.capacity_qty
    })),
  () => {
    formState.products.forEach((product, index) => {
      const sellingPrice = parseFloat(product.selling_price) || 0
      const capacityQty = parseFloat(product.capacity_qty) || 0
      const amount = sellingPrice * capacityQty
      formState.products[index].amount = amount
    })
  },
  { deep: true }
)

// Function to handle form submission
const addSales = async () => {
  isSubmitting.value = true
  let products = formState.products
    .filter((product) => product.amount > 0)
    .map((product) => ({
      product_type_id: product.product_type_id,
      price_sold_at: product.selling_price,
      capacity_qty: product.capacity_qty,
      container_qty: product.container_qty,
      vat: product.vat
    }))

  let payload = {
    customer_id: formState.customer_id,
    payment_method: formState.payment_method,
    products: products
  }

  try {
    let res = await apiService.post('/sales', payload)
    router.push('/sale')
    return res
  } catch (error) {
    console.error('Failed to submit sale:', error)
  } finally {
    isSubmitting.value = false // Set submitting state to false
    resetForm()
  }
}

// Function to reset the form after submission
const resetForm = () => {
  formState.customer_id = ''
  formState.payment_method = ''
  formState.products = [
    {
      product_type_id: '',
      barcode: '',
      is_container_type: '',
      container_capacity: '',
      cost_price: '',
      selling_price: '',
      capacity_qty: 1, // Default selling unit
      container_qty: 1, // Default container quantity
      amount: '',
      vat: 'no'
    }
  ]
  nextTick(() => focusBarcodeInput()) // Autofocus on the barcode input field after resetting form
}
</script>

<style scoped>
/* Your CSS styles remain unchanged */
</style>


<style scoped>
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
