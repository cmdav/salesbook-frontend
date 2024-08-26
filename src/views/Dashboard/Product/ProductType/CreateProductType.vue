<template>
  <DashboardLayout pageTitle="Create Product Type">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Navigation buttons at the top -->
      <div class="top-buttons">
        <router-link to="/product-type" class="button back-btn">Back</router-link>
      </div>

      <!-- Form for adding a new sale -->
      <form @submit.prevent="handleSubmit">
        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product</label>
          <select v-model="formState.product" class="select-input" required>
            <option selected>Select Product...</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.product_name }}
            </option>
          </select>
        </div>

        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product Type Name</label>
          <input
            v-model="formState.productTypeName"
            required
            type="text"
            class="input"
            placeholder="Enter Product Type Name"
            @keypress="preventSubmitOnEnter"
          />
        </div>

        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product Type Image</label>
          <input ref="fileInput" type="file" @change="handleImageChange" />
          <img
            v-if="newImage"
            :src="newImage"
            class="mb-4 h-20 w-30 rounded-md object-cover"
            alt="Current Image"
          />
        </div>

        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product Type Description</label>
          <input
            v-model="formState.productTypeDescription"
            required
            type="text"
            placeholder="Enter Product Type Description"
            class="input"
            @keypress="preventSubmitOnEnter"
          />
        </div>

        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Barcode</label>
          <input
            v-model="formState.barcode"
            type="text"
            class="input"
            @keypress="preventSubmitOnEnter"
          />
        </div>

        <!-- <div class="input-group w-[70%]">
          <p>VAT</p>
          <label class="mt-20 text-sm font-medium text-gray-700">
            <input type="radio" value="yes" name="choice" v-model="formState.vat" />
            Yes
          </label>

          <label class="ml-8 text-sm font-medium text-gray-700">
            <input type="radio" value="no" name="choice" v-model="formState.vat" />
            No
          </label>
        </div> -->

        <div class="input-group w-full">
          <label class="block text-sm font-medium text-gray-700">Select Purchase Unit</label>
          <div class="flex">
            <div class="w-[70%]">
              <select
                v-model="selectedPurchaseUnit"
                class="select-input"
                @change="fetchPurchasingUnit"
              >
                <option selected>Select Purchasing Unit...</option>
                <option v-for="unit in purchaseUnit" :key="unit.id" :value="unit.id">
                  {{ unit.purchase_unit_name }}
                </option>
              </select>
            </div>
            <button type="button" class="button btn-brand ml-4" @click="addPurchaseUnit">
              Add Purchasing Unit
            </button>
          </div>
        </div>

        <div class="input-group w-full">
          <label class="block text-sm font-medium text-gray-700">Select Selling Unit</label>
          <div class="flex">
            <div class="w-[70%]">
              <select
                v-model="selectedSellingUnit"
                class="select-input"
                @change="fetchSellingCapacities(selectedSellingUnit)"
              >
                <option selected>Select Selling Unit...</option>
                <option v-for="unit in sellingUnit" :key="unit.id" :value="unit.id">
                  {{ unit.selling_unit_name }}
                </option>
              </select>
            </div>
            <button type="button" class="button btn-brand ml-4" @click="addSellingUnit(selectedPurchaseUnit)">
              Add Selling Unit
            </button>
          </div>
        </div>

        <div class="input-group w-full">
          <label class="block text-sm font-medium text-gray-700"
            >Select Selling Unit Capacity</label
          >
          <div class="flex">
            <div class="w-[70%]">
              <select v-model="selectedSellingCapacity" class="select-input">
                <option selected>Select Selling Unit Capacity...</option>
                <option
                  v-for="capacity in sellingCapacity"
                  :key="capacity.id"
                  :value="capacity.id"
                >
                  {{ capacity.selling_unit_capacity }}
                </option>
              </select>
            </div>
            <button type="button" class="button btn-brand ml-4" @click="addSellingCapacity(selectedSellingUnit)">
              Add Unit Capacity
            </button>
          </div>
        </div>


        <!-- Submit button for the form -->
        <button type="submit" class="button submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </form>
    </div>

    <!-- Modal for Container Type and Container Capacity -->
     <PurchaseUnitModal
     v-if="showModal"
     @close="closeModal"
     @purchase-unit-added="handlePurchaseUnit"
     />
     <SellingUnitModal
     v-if="displayModal"
     @close="closeModal"
     @selling-unit-added="handleSellingUnit"
     :purchaseUnitId="selectedPurchaseUnit"
     />
     <SellingUnitCapacityModal
     v-if="displayCapModal"
     @close="closeModal"
     @selling-capacity-added="handleSellingCapacity"
     :sellingUnitId="selectedSellingUnit"
     />
   
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import apiService from '@/services/apiService'
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'
// import ContainerTypeModal from '@/components/UI/Modal/sellingUnitCapacityModal.vue'
import PurchaseUnitModal from '@/components/UI/Modal/purchaseUnitModal.vue'
import SellingUnitModal from '@/components/UI/Modal/sellingUnitModal.vue'
import SellingUnitCapacityModal from '@/components/UI/Modal/sellingUnitCapacityModal.vue'
// import ContainerTypeCapacitiesModal from '@/components/UI/Modal/sellingUnitModal.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fileInput = ref(null)
const newImage = ref(null)
const isSubmitting = ref(false)
// const unitSales = ref(null);

const showModal = ref(false)
const displayModal = ref(false)
const displayCapModal = ref(false)

const addPurchaseUnit = () => {
  showModal.value = true
}
const addSellingUnit = (purchaseUnitId) => {
  selectedPurchaseUnit.value = purchaseUnitId
  displayModal.value = true

}
const addSellingCapacity = (sellingUnitId) => {
  selectedSellingCapacity.value = sellingUnitId
  displayCapModal.value = true
}
const closeModal = () => {
  showModal.value = false
  displayModal.value = false
  displayCapModal.value = false
}

const preventSubmitOnEnter = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
  }
}

const formState = reactive({
  product: '',
  productTypeName: '',
  productTypeImage: null,
  productTypeDescription: '',
  barcode: '',
  vat: 'yes',
  // measurement: '',
  // sellingunitCapacity: ''
})

// const getVatValue = () => {
//     return formState.vat === 'yes' ? 1 : 0;
// };

// const measurements = ref([])
const products = ref([])
const purchaseUnit = ref([])
const sellingUnit = ref([])
const sellingCapacity = ref([])
// const containerTypeCapacities = ref([])
const selectedPurchaseUnit = ref(null)
const selectedSellingUnit = ref(null)
const selectedSellingCapacity = ref(null)

const handlePurchaseUnit = (newType) => {
  purchaseUnit.value.push(newType)
  selectedPurchaseUnit.value = newType.id
  console.log(selectedPurchaseUnit.value)
}
const handleSellingUnit = (newType) => {
  sellingUnit.value.push(newType)
  selectedSellingUnit.value = newType.id
}

const handleSellingCapacity = (newCapacity) => {
  sellingCapacity.value.push(newCapacity)
  selectedSellingCapacity.value = newCapacity.id
}

const fetchProducts = async () => {
  try {
    const response = await apiService.get('/all-products')
    console.log(response)
    products.value = response
    console.log(products.value)
  } catch (error) {
    catchAxiosError(error)
    console.error('Error fetching products:', error)
  }
}
// console.log(products)
const fetchPurchasingUnit = async () => {
  try {
    const response = await apiService.get('/list-purchase-units')
    console.log(response.data)
    purchaseUnit.value = response.data
    if(selectedPurchaseUnit.value){
      await fetchSellingUnit(selectedPurchaseUnit.value)
    }
  } catch (error) {
    console.error('Error fetching purchasing unit:', error)
    catchAxiosError(error)
  }
}

const fetchSellingUnit = async (purchaseUnitId) => {
  const selectedUnit = purchaseUnit.value.find(unit => unit.id === purchaseUnitId)
  if(selectedUnit){
    sellingUnit.value = selectedUnit.selling_units
    selectedSellingUnit.value = null
    selectedSellingCapacity.value = null
  }
}

const fetchSellingCapacities = async (sellingUnitId) => {
  const selectedUnit = sellingUnit.value.find(unit => unit.id === sellingUnitId) 
  if (selectedUnit) {
    sellingCapacity.value = selectedUnit.selling_unit_capacities
    selectedSellingCapacity.value = null
   }
}


const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    formState.productTypeImage = file
    const reader = new FileReader()
    reader.onload = (e) => {
      newImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Fetch data on mounted
onMounted(async () => {
  await fetchProducts()
  await fetchPurchasingUnit()
  
})

const handleSubmit = async () => {
  isSubmitting.value = true

  const formData = new FormData()
  formData.append('product_id', formState.product)
  formData.append('product_type_name', formState.productTypeName)
  // formData.append('vat', getVatValue.value)
  // formData.append('product_type_image', formState.productTypeImage)
   if (formState.productTypeImage) {
    formData.append('product_type_image', formState.productTypeImage)
  }
  formData.append('product_type_description', formState.productTypeDescription)
  formData.append('barcode', formState.barcode)
  formData.append('selling_unit_capacity_id', selectedSellingCapacity.value)

  try {
    console.log(formData)
    let res = await apiService.post('/product-types', formData)
    router.push('/product-type')

    catchAxiosSuccess(res)
    return res
  } catch (error) {
    catchAxiosError(error)
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}
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
  margin-bottom: 1.2em;
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
  background-color: #c35214;
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
  background-color: #5a6268;
}

.back-btn {
  background-color: #c35214;
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
