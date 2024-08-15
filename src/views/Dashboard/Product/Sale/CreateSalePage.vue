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
              <select v-model="formState.products[index].product_type_id" class="select-input">
                <option v-for="name in data" :key="name.id" :value="name.id">
                  {{ name.product_type_name }}
                </option>
              </select>
            </div>
            <!-- 
            <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                required
                v-model="formState.products[index].price_sold_at"
                type="number"
                class="input"
              />
               <label class="priceView"> &#8358; {{ formState.products[index].price_sold_at ? parseFloat(formState.products[index].price_sold_at).toLocaleString() : '0.00' }}</label>
            </div> -->

            <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">Barcode</label>
              <input
                type="password"
                id="barcode"
                v-model="formState.products[index].barcode"
                class="input"
                
              />
            </div>

            <div class="input-group">
              <label class="block text-sm font-medium text-gray-700">Unit Sales</label>
              <input type="text" id="container_type" v-model="formState.products[index].is_container_type" class="input" readonly />
            </div>
            <div class="input-group">
              <label class="block text-sm font-medium text-gray-700">Purchase Unit</label>
              <input type="text" id="container_type" v-model="formState.products[index].container_capacity" class="input" readonly />
            </div>

            <div class="input-group">
              <label class="block text-sm font-medium text-gray-700">Cost Price</label>
              <input type="text" id="cost_price" v-model="formState.products[index].cost_price" class="input" readonly />
              <label class="priceView">
                &#8358;
                {{
                  formState.products[index].cost_price
                    ? parseFloat(formState.products[index].cost_price).toLocaleString()
                    : '0.00'
                }}</label>
            </div>            

            <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">Selling Price</label>
              <input
                type="text"
                id="selling_price"
                v-model="formState.products[index].selling_price"
                class="input"
                readonly
              />
              <label class="priceView">
                &#8358;
                {{
                  formState.products[index].selling_price ? parseFloat(formState.products[index].selling_price).toLocaleString() : '0.00'
                }}</label
              >
            </div>

            
            <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">Selling Unit</label>
              <input type="number" :value="formState.products[index].capacity_qty" class="input" />
            </div>
            <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">Container Qty</label>
              <input type="number" :value="formState.products[index].container_qty" class="input" />
            </div>

            <!-- Input field for the selling price of the product -->
            <!-- <div class="input-group w-20">
              <label class="block text-sm font-medium text-gray-700">Price</label>
              <input
                required
                v-model="formState.products[index].price_sold_at"
                type="number"
                class="input"
              />
              <label class="priceView">
                &#8358;
                {{
                  formState.products[index].price_sold_at
                    ? parseFloat(formState.products[index].price_sold_at).toLocaleString()
                    : '0.00'
                }}</label>
            </div> -->

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
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/apiService'
// import { useProductStore } from '@/stores/products'
import { useCustomerstore } from '@/stores/customers'
import CustomerFormModal from '@/components/UI/Modal/CustomerFormModal.vue'
import { storeToRefs } from 'pinia'

const router = useRouter()
// const productsStore = useProductStore()
const customersStore = useCustomerstore()
const data = ref([]);


const { allCustomersNames } = storeToRefs(customersStore)
// const { allProductTypeName } = storeToRefs(productsStore)

const showModal = ref(false)
const isSubmitting = ref(false) // Reactive variable for submission state

const addNewCustomer = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

//const salesLoading = ref(false);
const printReceipt = ref('no')

const formState = reactive({
  customer_id: '',
  payment_method: 'cash',
  products: [
    {
      product_type_id: '',
      barcode: '',
      price_sold_at: null,
      is_container_type: '',
      container_capacity: '',
      cost_price: '',
      selling_price: '',
      capacity_qty: '',
      container_qty: '',
      // vat: 'no'
    }
  ]
})

const addProducts = () => {
  const lastProduct = formState.products[formState.products.length - 1]
  if (
    lastProduct.product_type_id.trim() !== '' 
    &&
    lastProduct.container_qty > 0 ||
    lastProduct.capacity_qty > 0
  ) {
    formState.products.push({
    product_type_id: '',
      barcode: '',
      price_sold_at: null,
      is_container_type: '',
      container_capacity: '',
      cost_price: '',
      selling_price: '',
      capacity_qty: '',
      container_qty: '',
    })
  }
}

// Function to remove a product from the formState.products array
const removeProduct = (index) => {
  if (index > 0) {
    formState.products.splice(index, 1)
  }
}



onMounted(async () => {
  try {
    await customersStore.handleAllCustomersName();
    const response = await apiService.get('/all-product-type-name')
    console.log(response.data)
    data.value = response.data;
  } catch (error) {
    console.error
  }

})

watch(
  () => formState.products.map(product => product.product_type_id),
  (newProductIds) => {
    newProductIds.forEach((productId, index) => {
      const selectedProduct = data.value.find(product => product.id === productId);
      if (selectedProduct) {
        formState.products[index].barcode = selectedProduct.barcode;
        formState.products[index].is_container_type = selectedProduct.is_container_type;
        formState.products[index].container_capacity = selectedProduct.container_capacity;
        formState.products[index].cost_price = selectedProduct.cost_price;
        formState.products[index].selling_price = selectedProduct.selling_price;
      }
    });
  }
);

const addSales = async() => {
  isSubmitting.value = true
  let products = formState.products
    .filter((product) => product.amount > 0)
    .map((product) => ({
      product_type_id: product.product_type_id,
      capacity_qty: product.capacity_qty,
      container_qty: product.container_qty,
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



const resetForm = () => {
  formState.customer_id = ''
  formState.payment_method = ''
  formState.products = [
    {
      product_type_id: '',
      price_sold_at: null,
      capacity_qty: '',
      container_qty: '',
    }
  ]
}

// const handleAddSales = async () => {
//   isSubmitting.value = true // Set submitting state to true
//   let products = formState.products
//     .filter((product) => product.amount > 0)
//     .map((product) => ({
//       product_type_id: product.product_type_id,
//       batch_no: product.batch_no,
//       price_sold_at: parseInt(product.price_sold_at),
//       quantity: parseInt(product.quantity),
//       vat: parseInt(product.vat === 'yes' ? 1 : 0)
//     }))

//   let payload = {
//     customer_id: formState.customer_id,
//     payment_method: formState.payment_method,
//     products: products
//   }

//   try {
//     let res = await productsStore.handleAddSaless(payload)
//     productsStore.handleGetProducts()
//     router.push('/sale')
//     return res
//   } catch (error) {
//     console.error('Failed to submit sale:', error)
//   } finally {
//     isSubmitting.value = false // Set submitting state to false
//     resetForm()
//   }
// }



// const selectedProduct = computed(() => {
//   if (allProductTypeName.value && allProductTypeName.value.data) {
//     return (
//       allProductTypeName.value.data.find(
//         product =>
//           product.product_type_name === form.product_type_name || 
//           product.barcode === form.barcode
//       ) || {}
//     );
//   }
//   return {}; 
// });

// watch(
//   () => formState.products.product_type_id,
//   () => {
//     if (selectedProduct.value) {
//       // form.vat = selectedProduct.value.vat;
//       formState.products.is_container_type = selectedProduct.value.is_container_type;
//       formState.products.container_capacity = selectedProduct.value.container_capacity;
//       formState.products.cost_price = selectedProduct.value.cost_price;
//       formState.products.selling_price = selectedProduct.value.selling_price;
//     }
//   },
//   {immediate: true}
// );


// watch(
//   () => formState.products.barcode,
//   () => {
//     if (selectedProduct.value) {
//       formState.products.product_type_name = selectedProduct.value.product_type_name;
//       formState.products.vat = selectedProduct.value.vat;
//       formState.products.is_container_type = selectedProduct.value.is_container_type;
//       formState.products.container_capacity = selectedProduct.value.container_capacity;
//       formState.products.cost_price = selectedProduct.value.cost_price;
//       formState.products.selling_price = selectedProduct.value.selling_price;
//     }
//   },
//   {immediate: true}
// );
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
