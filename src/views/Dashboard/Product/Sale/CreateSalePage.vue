<template>
  <DashboardLayout pageTitle="Add Sale">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- <div :class="['network-status', { 'online': isOnline, 'offline': !isOnline }]">
            <span>{{ isOnline ? 'Online' : 'Offline' }}</span>
          </div> -->
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
            <select v-model="formState.customer_id" class="select-input" @focus="loadCustomers">
              <option v-for="name in allCustomers" :key="name.id" :value="name.id">
                {{ name.customer_detail }}{{ name.first_name }} {{ name.last_name }}
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
            <option v-for="option in paymentList" :key="option.id" :value="option.id">
              {{ option.payment_identifier }}
            </option>
          </select>
        </div>

        <!-- Product list with dynamic inputs -->
        <div class="my-8">
          <div class="form-group flex justify-end">
            <span class="font-medium text-gray-700">
              Total Price: <span v-html="'&#8358;'"></span> {{ totalPrice }}
            </span>
            <button
              type="button"
              @click="addProducts"
              class="button btn-brand !bg-brand/[20%] !text-black !px-3 ml-4"
            >
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

              <div class="custom-select">
                <input
                  type="text"
                  :value="getSelectedProductName(formState.products[index].product_type_id, index)"
                  @input="(e) => handleSearch(e, index)"
                  @focus="showDropdowns[index] = true"
                  placeholder="Search product type..."
                  class="search-input"
                />
                <div v-show="showDropdowns[index]" class="options-container">
                  <div
                    v-for="productType in getFilteredProductTypes(index)"
                    :key="productType.id"
                    class="option"
                    @click="selectProduct(productType, index)"
                  >
                    {{ productType.product_type_name }}
                  </div>
                </div>
              </div>
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

            <div class="input-group">
              <label class="block text-sm font-medium text-gray-700">Selling Unit</label>
              <select
                v-model="formState.products[index].selling_unit_id"
                class="select-input"
                @change="handleSellingUnitSelect(index)"
              >
                <option value="">Select Unit</option>
                <option
                  v-for="unit in getSellingUnits(formState.products[index].product_type_id)"
                  :key="unit.purchase_unit_id"
                  :value="unit.purchase_unit_id"
                >
                  {{ unit.purchase_unit_name }}
                </option>
              </select>
            </div>

            <!-- Cost Price Input -->
            <!-- <div class="input-group w-32">
              <label class="block text-sm font-medium text-gray-700">Cost Price</label>
              <input
                type="text"
                v-model="formState.products[index].cost_price"
                class="input readonly-input"
                readonly
              />
              <div class="estimation-indicator" v-if="getSelectedUnit(index)">
                {{ getSelectedUnit(index).is_cost_price_est ? 'Estimated' : 'Actual' }}
              </div>
            </div> -->

            <!-- Quantity Available Input
            <div class="input-group w-32">
              <label class="block text-sm font-medium text-gray-700">Qty Available</label>
              <input
                type="text"
                v-model="formState.products[index].quantity_available"
                class="input readonly-input"
                readonly
              />
              <div class="estimation-indicator" v-if="getSelectedUnit(index)">
                {{ getSelectedUnit(index).is_capacity_quantity_est ? 'Estimated' : 'Actual' }}
              </div>
            </div> -->

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
            <!-- <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">Selling Price</label>
              <input
                type="number"
                v-model="formState.products[index].selling_price"
                class="input"
                @change="handleSellingPriceChange(index)"
              />
              <label class="priceView">
                &#8358;
                {{
                  formState.products[index].selling_price
                    ? parseFloat(formState.products[index].selling_price).toLocaleString()
                    : '0.00'
                }}</label
              >
              <div class="estimation-indicator" v-if="getSelectedUnit(index)">
                {{ getSelectedUnit(index).is_selling_price_est ? 'Estimated' : 'Actual' }}
              </div>
            </div> -->

            <div class="input-group w-20">
  <label class="block text-sm font-medium text-gray-700">
    Selling Price
    <span class="estimation-badge" :class="{ 
      'estimated': formState.products[index].is_selling_price_est,
      'actual': !formState.products[index].is_selling_price_est 
    }">
      {{ formState.products[index].is_selling_price_est ? 'Estimated' : 'Actual' }}
    </span>
  </label>
  <input
    type="number"
    :name="'selling_price_' + index"
    v-model="formState.products[index].selling_price"
    class="input"
    :readonly="!formState.products[index].is_selling_price_est"
    @change="handleSellingPriceChange(index)"
  />
  <label class="priceView">
    &#8358;
    {{
      formState.products[index].selling_price
        ? parseFloat(formState.products[index].selling_price).toLocaleString()
        : '0.00'
    }}
  </label>
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
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/apiService' // Service to interact with the backend API
import { useCustomerstore } from '@/stores/customers' // Pinia store for customer data
import CustomerFormModal from '@/components/UI/Modal/CustomerFormModal.vue' // Modal component for adding a new customer
import ReceiptModal from '@/components/UI/Modal/ReceiptModal.vue' // Modal component for showing the receipt
import { storeToRefs } from 'pinia'
import { sendToPrinter } from './sentToPrinter' // Function to generate PDF for the receipt
import { isOnline } from '@/isOnline'
import {
  getAllCustomers,
  getProductById,
  addSale,
  getAllProducts,
  initializeSalesDB,
  getAllPaymentMethods,
  addPaymentMethods
} from '@/services/indexedDbService'
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'

const router = useRouter()
const customersStore = useCustomerstore() // Access the Pinia customer store

// References and reactive variables for form and input fields
const barcodeInputRefs = ref([]) // Ref to track barcode input fields
const data = ref([]) // Holds the product data fetched from the API
const totalPrice = ref(0) // Holds the total price of all products
const res = ref(null) // Ref to store the API response
const isOnlineFlag = ref(true)

const paymentList = ref([])

const { allCustomersNames } = storeToRefs(customersStore) // Store all customer names from the Pinia store

// Control variables for modals and form submission
const showModal = ref(false)
const isSubmitting = ref(false)
const allCustomers = ref([])

// Function to open the 'Add Customer' modal
const addNewCustomer = () => {
  showModal.value = true
}

// Function to close the 'Add Customer' modal
const closeModal = () => {
  showModal.value = false
}

// Function to set a reference to the barcode input element
const setBarcodeRef = (el, index) => {
  barcodeInputRefs.value[index] = el
}

// Function to focus on the next barcode input field
const focusBarcodeInput = () => {
  nextTick(() => {
    const emptyBarcodeField = barcodeInputRefs.value.find((el) => el && !el.value)
    emptyBarcodeField?.focus() // Focuses on the next empty barcode input
  })
}

// Function to prevent entering a negative quantity
const preventNegativeQuantity = (index) => {
  if (formState.products[index].quantity_sold < 0) {
    formState.products[index].quantity_sold = 0
  }
}

// State variables for form inputs and product list
const printReceipt = ref('no')
const showReceiptModal = ref(false)

const formState = reactive({
  customer_id: '',
  payment_method: '',
  products: [
    {
      product_type_id: '',
      barcode: '',
      selling_price: '',
      selling_unit_id: '',
      purchase_unit_id: '',
      quantity_sold: 0,
      amount: '',
      vat: 'no',
      cost_price: '',
      quantity_available: ''
    }
  ]
})

const searchQueries = ref({})
const showDropdowns = ref({})

const getFilteredProductTypes = (index) => {
  if (!searchQueries.value[index]) return data.value
  return data.value.filter((product) =>
    product.product_type_name.toLowerCase().includes(searchQueries.value[index].toLowerCase())
  )
}

const handleSearch = (event, index) => {
  searchQueries.value[index] = event.target.value
  showDropdowns.value[index] = true
}

// const getSelectedUnit = (index) => {
//   const product = data.value.find((p) => p.id === formState.products[index].product_type_id)
//   return product?.purchase_units.find(
//     (unit) => unit.purchase_unit_id === formState.products[index].purchase_unit_id
//   )
// }

// const getEstimationStatus = (isEstimated) => {
//   return isEstimated ? 'Estimated' : 'Actual'
// }

const getSelectedProductName = (productTypeId, index) => {
  if (searchQueries.value[index]) return searchQueries.value[index]
  const product = data.value.find((p) => p.id === productTypeId)
  return product ? product.product_type_name : ''
}

const selectProduct = (productType, index) => {
  formState.products[index].product_type_id = productType.id
  handleProductTypeSelect(index)
  showDropdowns.value[index] = false
  searchQueries.value[index] = ''
}

const getSellingUnits = (productTypeId) => {
  const product = data.value.find((p) => p.id === productTypeId)
  return product ? product.purchase_units : []
}

// const isProductSelected = (productId, sellingUnitId) => {
//   return formState.products.some(
//     product =>
//       product.product_type_id === productId &&
//       product.selling_unit_id === sellingUnitId
//   )
// }

const populateProductDetails = (index, product) => {
  if (!product) {
    console.error(`Product not found at index ${index}`)
    return
  }
  console.log(product)
  formState.products[index].product_type_id = product.id
  formState.products[index].barcode = product.barcode || '' // Handle missing barcode
  formState.products[index].selling_price = product.selling_price || 0
  formState.products[index].selling_unit_name = product.selling_unit_name || '' // Populate selling unit name
  formState.products[index].vat = product.vat ? product.vat.toLowerCase() : 'no' // Set VAT value, default to 'no'
  formState.products[index].amount = calculateAmountWithVat(
    formState.products[index].selling_price,
    formState.products[index].quantity_sold,
    formState.products[index].vat
  )
  nextTick(() => focusBarcodeInput()) // Focus on the next empty barcode input
}
const calculateAmountWithVat = (sellingPrice, quantitySold, vat) => {
  let amount = parseFloat(sellingPrice) * parseFloat(quantitySold || 0) // Calculate the amount
  if (vat === 'yes') {
    amount *= 1.075 // Add 7.5% VAT if applicable
  }
  return isNaN(amount) ? 0 : amount // Return the calculated amount or 0 if NaN
}

// Function to handle product type selection
const handleProductTypeSelect = async (index) => {
  const productId = formState.products[index].product_type_id
  let product

  try {
    const online = await isOnline() // Check the network status on-demand
    if (online) {
      // If online, get product from the fetched API data
      product = data.value.find((p) => p.id === productId)
    } else {
      //alert('offline mode')
      product = await getProductById(productId)
    }
    console.log(product);
    if (product) {
      // Reset selling unit related fields
      formState.products[index].selling_unit_id = ''
      formState.products[index].purchase_unit_id = ''
      formState.products[index].selling_price = ''
      formState.products[index].quantity_sold = 0
      formState.products[index].vat = product.vat?.toLowerCase() || 'no'
      formState.products[index].barcode = product.barcode || ''
    }
  } catch (error) {
    console.error('Error during product selection:', error)
  }
}

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
      )
    })
    calculateTotalPrice() // Recalculate the total price
  },
  { deep: true }
)

const handleSellingUnitSelect = (index) => {
  const product = data.value.find((p) => p.id === formState.products[index].product_type_id)
  const selectedUnit = product?.purchase_units.find(
    (unit) => unit.purchase_unit_id === formState.products[index].selling_unit_id
  )

  if (selectedUnit) {
    // Check for duplicate selling unit
    const isDuplicate = formState.products.some(
      (p, i) =>
        i !== index &&
        p.product_type_id === formState.products[index].product_type_id &&
        p.selling_unit_id === selectedUnit.purchase_unit_id
    )

    if (isDuplicate) {
      alert('This selling unit has already been selected for this product')
      formState.products[index].selling_unit_id = ''
      return
    }

    // Set the values
    formState.products[index].selling_price = selectedUnit.selling_price
    formState.products[index].cost_price = selectedUnit.cost_price
    formState.products[index].quantity_available = selectedUnit.capacity_quantity_available
    formState.products[index].purchase_unit_id = selectedUnit.purchase_unit_id
    
    // Add estimation status indicators
    formState.products[index].is_selling_price_est = selectedUnit.is_selling_price_est
    formState.products[index].is_actual = !selectedUnit.is_selling_price_est
    
    // Only allow editing if it's an estimated price
    const priceInput = document.querySelector(`input[name="selling_price_${index}"]`)
    if (priceInput) {
      priceInput.readOnly = !selectedUnit.is_selling_price_est
    }

    formState.products[index].quantity_sold = 0
    formState.products[index].amount = calculateAmountWithVat(
      selectedUnit.selling_price,
      formState.products[index].quantity_sold,
      formState.products[index].vat
    )
  }
}

// const handleSellingUnitSelect = (index) => {
//   const product = data.value.find((p) => p.id === formState.products[index].product_type_id)
//   const selectedUnit = product?.purchase_units.find(
//     (unit) => unit.purchase_unit_id === formState.products[index].selling_unit_id
//   )
//   console.log("Product:", product)
// console.log("ello:", selectedUnit)
//   if (selectedUnit) {
//     const isDuplicate = formState.products.some(
//       (p, i) =>
//         i !== index &&
//         p.product_type_id === formState.products[index].product_type_id &&
//         p.selling_unit_id === selectedUnit.selling_unit_id
//     )

//     if (isDuplicate) {
//       alert('This selling unit is already selected for this product')
//       formState.products[index].purchase_unit_id = ''
//       return
//     }

//     formState.products[index].selling_price = selectedUnit.selling_price
//     formState.products[index].cost_price = selectedUnit.cost_price
//     formState.products[index].quantity_available = selectedUnit.capacity_quantity_available
//     formState.products[index].purchase_unit_id = selectedUnit.purchase_unit_id
//     formState.products[index].quantity_sold = 0
//     formState.products[index].amount = calculateAmountWithVat(
//       selectedUnit.selling_price,
//       formState.products[index].quantity_sold,
//       formState.products[index].vat
//     )
//   }
// }
// Function to calculate the total price of all products
const calculateTotalPrice = () => {
  const total = formState.products.reduce((acc, product) => acc + (product.amount || 0), 0) // Calculate total
  totalPrice.value = isNaN(total) ? '0.00' : total.toFixed(2) // Ensure total is never NaN
}

// Function to remove a product from the list
const removeProduct = (index) => {
  if (formState.products.length > 1) {
    formState.products.splice(index, 1) // Remove the product at the specified index
    barcodeInputRefs.value.splice(index, 1) // Remove the barcode reference
    nextTick(() => focusBarcodeInput()) // Focus on the next empty barcode input
    calculateTotalPrice() // Recalculate total price
  }
}

// Function to handle when a barcode is entered
const handleBarcodeEnter = (index) => {
  const product = data.value.find((p) => p.barcode === formState.products[index].barcode) // Find product by barcode

  if (product) {
    populateProductDetails(index, product) // Populate product details if found
    addProducts() // Add a new product row
  }
}



const checkQuantitySold = (index) => {
  const product = data.value.find((p) => p.id === formState.products[index].product_type_id)
  const selectedUnit = product?.selling_units.find(
    (unit) => unit.selling_unit_id === formState.products[index].selling_unit_id
  )

  if (
    selectedUnit &&
    formState.products[index].quantity_sold > selectedUnit.capacity_quantity_available
  ) {
    formState.products[index].quantity_sold = selectedUnit.capacity_quantity_available
    alert(
      `Quantity sold exceeds available stock. Resetting to available quantity: ${selectedUnit.capacity_quantity_available}.`
    )
  }

  formState.products[index].amount = calculateAmountWithVat(
    formState.products[index].selling_price,
    formState.products[index].quantity_sold,
    formState.products[index].vat
  )
  calculateTotalPrice()
}

// Function to add a new product row
const addProducts = () => {
  const lastProduct = formState.products[formState.products.length - 1]

  if (lastProduct.barcode || lastProduct.product_type_id) {
    formState.products.push({
      product_type_id: '',
      barcode: '',
      selling_price: '',
      selling_unit_name: '',
      quantity_sold: 0,
      amount: '',
      vat: 'no'
    })
    nextTick(() => focusBarcodeInput()) // Focus on the next empty barcode input
  }
}

// Function to check online status
async function checkOnlineStatus() {
  try {
    isOnlineFlag.value = await isOnline() // Call the imported isOnline function
  } catch (error) {
    console.error('Error checking online status:', error) // Handle any potential errors
  }
}

const loadCustomers = async () => {
  try {
    const online = await isOnline() // Check if the app is online
    if (online) {
      await customersStore.handleAllCustomersName() // Fetch from API using Pinia
      allCustomers.value = allCustomersNames.value // Assign to allCustomers if online
    } else {
      allCustomers.value = await getAllCustomers() // Fetch from IndexedDB if offline
    }
  } catch (error) {
    console.error('Error loading customers:', error)
  }
}

onMounted(async () => {
  try {
    // Open IndexedDB
    //await customersStore.handleAllCustomersName();
    await loadCustomers()
    const db = await initializeSalesDB()

    // Check if the app is online
    await checkOnlineStatus()

    if (isOnlineFlag.value) {
      // Fetch both payment methods and product data together if online
      const [paymentMethodsResponse, productResponse] = await Promise.all([
        apiService.get('/list-payment-methods'),
        apiService.get('/all-product-type-name')
      ])

      console.log('Payment Methods Response:', paymentMethodsResponse)
      console.log('Product Response:', productResponse)

      // Store payment methods in IndexedDB
      await addPaymentMethods(paymentMethodsResponse.data)
      paymentList.value = paymentMethodsResponse.data // Store payment methods in reactive data

      // Store product data from the API in IndexedDB
      data.value = productResponse.data // Store API response in reactive data
      const tx = db.transaction('products', 'readwrite')
      const store = tx.objectStore('products')
      productResponse.data.forEach((product) => {
        store.put(product)
      })
      await tx.done // Ensure transaction is complete
    } else {
      //alert('You are offline');

      // Load product data from IndexedDB
      data.value = await getAllProducts()

      // Load payment methods from IndexedDB
      paymentList.value = await getAllPaymentMethods()
    }

    focusBarcodeInput() // Focus on the first empty barcode input
  } catch (error) {
    console.error('Error during initialization:', error)
  }
})

const handleSellingPriceChange = async (index) => {
  const product = formState.products[index];
  if (!product.product_type_id || !product.selling_unit_id) return;

  try {
    const online = await isOnline();
    if (online) {
      await apiService.update(`/estimated-stores/${product.product_type_id}?type=selling_price`, {
        selling_unit_id: product.selling_unit_id,
        product_type_id: product.product_type_id,
        selling_price: parseFloat(product.selling_price)
      });

      // Update the estimation status in the local data
      const productData = data.value.find(p => p.id === product.product_type_id);
      if (productData) {
        const unit = productData.selling_units.find(u => u.selling_unit_id === product.selling_unit_id);
        if (unit) {
          unit.is_selling_price_est = false;
        }
      }
    }
    // Recalculate amount after price change
    formState.products[index].amount = calculateAmountWithVat(
      product.selling_price,
      product.quantity_sold,
      product.vat
    );
    calculateTotalPrice();
  } catch (error) {
    console.error('Error updating selling price:', error);
    // Optionally show an error message to the user
  }
};

const addSales = async () => {
  isSubmitting.value = true

  // Validate that all products have quantities greater than 0
  const invalidProducts = formState.products.filter(
    (product) => product.product_type_id && product.quantity_sold <= 0
  )

  if (invalidProducts.length > 0) {
    alert(`Enter a quantity for all selected products`)
    isSubmitting.value = false
    return
  }

  const products = formState.products
    .filter((product) => product.amount > 0)
    .map((product) => ({
      product_type_id: product.product_type_id,
      price_sold_at: parseInt(product.selling_price, 10),
      quantity: parseInt(product.quantity_sold, 10),
      vat: product.vat === 'yes' ? 'yes' : 'no',
      // selling_unit_id: product.selling_unit_id,
      purchase_unit_id: product.selling_unit_id
    }))

  const payload = {
    customer_id: formState.customer_id ? formState.customer_id : null,
    payment_method: formState.payment_method,
    products
  }

  try {
    const online = await isOnline() // Re-check the network status dynamically
    if (online) {
      // If online, send the sales data to the server
      //alert("You are online");
      res.value = await apiService.post('/sales', payload)
      if (res.value.success) {
        showReceiptModal.value = true
      }
      catchAxiosSuccess(res.value)
    } else {
      // If offline, store sales data in IndexedDB
      alert('App is offline. Storing sales data.')
      payload.is_offline = 1
      // Open IndexedDB
      await addSale(payload)
      //router.push('/sale');

      // Register a sync event with the service worker
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then((registration) => {
          return registration.sync
            .register('sync-sales')
            .then(() => {
              console.log('Sync event registered successfully')
            })
            .catch((err) => {
              console.error('Failed to register sync event:', err)
            })
        })
      }
    }
  } catch (error) {
    console.error('Error while adding sales:', error)
    catchAxiosError(error)
  } finally {
    isSubmitting.value = false
    resetForm()
  }
}

// Function to handle receipt choice (whether to print or not)
const handleReceiptChoice = (choice) => {
  showReceiptModal.value = false
  if (choice === 'yes') {
    sendToPrinter(res.value.data) // Generate the receipt PDF if 'yes'
  }
  catchAxiosSuccess(res.value) // Handle the successful API response
  router.push('/sale') // Redirect to the sales page
}

// Function to reset the form after submission
const resetForm = () => {
  formState.customer_id = ''
  formState.payment_method = ''
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
  ]
  nextTick(() => focusBarcodeInput()) // Focus on the next empty barcode input
}
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 150px;
}

.search-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 0;
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
}

.option {
  padding: 8px;
  cursor: pointer;
}

.option:hover:not(.disabled) {
  background-color: #f5f5f5;
}

.option.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f0f0f0;
}

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

.estimation-badge {
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 4px;
}

.estimation-badge.estimated {
  background-color: #fef3c7;
  color: #92400e;
}

.estimation-badge.actual {
  background-color: #d1fae5;
  color: #065f46;
}

input[readonly] {
  background-color: #f3f4f6;
  cursor: not-allowed;
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
.network-status {
  padding: 10px;
  color: white;
  border-radius: 5px;
  width: 10%;
}

.online {
  background-color: #4caf50; /* Green for online */
}

.offline {
  background-color: #f44336; /* Red for offline */
}

.status-indicators {
  margin-top: 8px;
  font-size: 0.875rem;
  background-color: #f9fafb;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.status-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.status-item:last-child {
  margin-bottom: 0;
}

.status-label {
  color: #374151;
  font-weight: 500;
}

.status-value {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.status-value.estimated {
  background-color: #fef3c7;
  color: #92400e;
}

.status-value.actual {
  background-color: #d1fae5;
  color: #065f46;
}
</style>
