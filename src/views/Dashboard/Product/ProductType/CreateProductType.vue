<template>
  <DashboardLayout pageTitle="Create Product">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Navigation buttons at the top -->
      <div class="top-buttons">
        <router-link to="/product-type" class="button back-btn">Back</router-link>
      </div>

      <!-- Form for adding a new sale -->
      <form @submit.prevent="handleSubmit">
        <!-- <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product</label>
          <select v-model="formState.product" class="select-input" required>
            <option selected>Select Product...</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.product_name }}
            </option>
          </select>
        </div> -->

        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product Name</label>
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
          <label class="block text-sm font-medium text-gray-700">Product Image</label>
          <input ref="fileInput" type="file" @change="handleImageChange" />
          <img
            v-if="newImage"
            :src="newImage"
            class="mb-4 h-20 w-30 rounded-md object-cover"
            alt="Current Image"
          />
        </div>

        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product Description</label>
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
            ref="barcodeInput"
            v-model="formState.barcode"
            type="text"
            class="input"
            :readonly="isBarcodeReadonly"
            @keydown.enter.prevent="handleBarcodeEntry"
          />
        </div>

        <!-- Conditionally render the edit button -->
        <button 
          v-if="isBarcodeReadonly" 
          type="button" 
          class="button edit-button" 
          @click="clearBarcode"
        >
          Edit Barcode
        </button>

        <div>
  <label>VAT</label>
  <div>
    <input
      type="radio"
      id="vatYes"
      value="1"
      v-model="formState.vat"
    />
    <label for="vatYes">Yes</label>
  </div>
  <div>
    <input
      type="radio"
      id="vatNo"
      value="0"
      v-model="formState.vat"
    />
    <label for="vatNo">No</label>
  </div>
</div>

        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product Category</label>
          <select v-model="formState.category" @change="fetchSubCategory(formState.category)" class="select-input" required>
            <option selected>Select Category...</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.category_name }}
            </option>
          </select>
        </div>

         <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product Subcategory</label>
          <select v-model="formState.sub_category" class="select-input" required>
            <option selected>Select Subcategory...</option>
            <option v-for="subCategory in subCategories" :key="subCategory.id" :value="subCategory.id">
              {{ subCategory.sub_category_name }}
            </option>
          </select>
        </div>

        <div class="input-group w-full">
          <label class="block text-sm font-medium text-gray-700">Select Purchase Unit 
            <span class="tooltip-container">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 24 24">
                <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"></path>
              </svg> 
              <span class="tooltip-text">What unit did you purchase this item?</span>
            </span> 
          </label>
          <div class="flex">
            <div class="w-[70%]">
              <select
                v-model="formState.purchaseUnit"
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
          <label class="block text-sm font-medium text-gray-700">Select Selling Unit 
            <span class="tooltip-container">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 24 24">
                <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 4 12 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"></path>
              </svg> 
              <span class="tooltip-text">What unit will you sell this item?</span>
            </span> 
          </label>
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
            <button type="button" class="button btn-brand ml-4" @click="addSellingUnit(formState.purchaseUnit)">
              Add Selling Unit
            </button>
          </div>
        </div>

        <div class="input-group w-full">
          <label class="block text-sm font-medium text-gray-700">
            How many selling unit equal a purchase unit
            <span class="tooltip-container">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 24 24">
                <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"></path>
              </svg> 
              <span class="tooltip-text">E.g dozen = 12, one create = 30eggs...</span>
            </span>
          </label>
          <div class="flex">
            <div class="w-[70%]">
              <select v-model="selectedSellingCapacity" class="select-input">
                <option selected>Select Selling Unit ...</option>
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
      :purchaseUnitId="formState.purchaseUnit"
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
import { ref, reactive, onMounted } from 'vue'
import apiService from '@/services/apiService'
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'
import PurchaseUnitModal from '@/components/UI/Modal/purchaseUnitModal.vue'
import SellingUnitModal from '@/components/UI/Modal/sellingUnitModal.vue'
import SellingUnitCapacityModal from '@/components/UI/Modal/sellingUnitCapacityModal.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fileInput = ref(null)
const newImage = ref(null)
const isSubmitting = ref(false)

const showModal = ref(false)
const displayModal = ref(false)
const displayCapModal = ref(false)
const barcodeInput = ref(null)
const lastScannedBarcode = ref('')
const isBarcodeReadonly = ref(false)

const formState = reactive({
  product: '',
  productTypeName: '',
  productTypeImage: null,
  productTypeDescription: '',
  barcode: '',
  category: '',
  sub_category: '',
  vat: '1',
  selling_unit: '',
  selling_unit_cty: '',
  purchaseUnit: '', // Now using formState.purchaseUnit
  // other form states...
})

// const products = ref([])
const purchaseUnit = ref([])
const sellingUnit = ref([])
const sellingCapacity = ref([])
const selectedSellingUnit = ref(null)
const selectedSellingCapacity = ref(null)
const categories = ref([])
const subCategories = ref([])

const handleBarcodeEntry = (event) => {
  const newBarcode = event.target.value.trim()

  if (newBarcode !== lastScannedBarcode.value) {
    formState.barcode = newBarcode
    lastScannedBarcode.value = newBarcode
    isBarcodeReadonly.value = true
  }

  barcodeInput.value.value = ''
}

const clearBarcode = () => {
  formState.barcode = ''
  isBarcodeReadonly.value = false
}

const addPurchaseUnit = () => {
  showModal.value = true
}

const addSellingUnit = (purchaseUnitId) => {
  formState.purchaseUnit = purchaseUnitId
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

const handlePurchaseUnit = (newType) => {
  purchaseUnit.value.push(newType)
  formState.purchaseUnit = newType.id
}

const handleSellingUnit = (newType) => {
  sellingUnit.value.push(newType)
  selectedSellingUnit.value = newType.id
}

const handleSellingCapacity = (newCapacity) => {
  sellingCapacity.value.push(newCapacity)
  selectedSellingCapacity.value = newCapacity.id
}

// const fetchProducts = async () => {
//   try {
//     const response = await apiService.get('/all-products')
//     products.value = response
//   } catch (error) {
//     catchAxiosError(error)
//     console.error('Error fetching products:', error)
//   }
// }
const fetchCategory = async () => {
  try {
    const response = await apiService.get('/product-categories')
    categories.value = response
    // console.log('Hello Bro');
    console.log(response);
  } catch (error) {
    catchAxiosError(error)
    console.error('Error fetching products:', error)
  }
}

const fetchSubCategory = async (categoryId) => {
  try {
    const response = await apiService.get(`/all-product-sub-categories-by-category-id/${categoryId}`)
    subCategories.value = response
    // console.log('Hello Bro');
    console.log(response);
  } catch (error) {
    catchAxiosError(error)
    console.error('Error fetching products:', error)
  }
}

const fetchPurchasingUnit = async () => {
  try {
    const response = await apiService.get('/list-purchase-units')
    purchaseUnit.value = response.data
    if (formState.purchaseUnit) {
      await fetchSellingUnit(formState.purchaseUnit)
    }
    catchAxiosSuccess(response.data)
  } catch (error) {
    console.error('Error fetching purchasing unit:', error)
    catchAxiosError(error)
  }
}

const fetchSellingUnit = async (purchaseUnitId) => {
  const selectedUnit = purchaseUnit.value.find(unit => unit.id === purchaseUnitId)
  if (selectedUnit) {
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

onMounted(async () => {
  // await fetchProducts()
  await fetchCategory()
  await fetchSubCategory()
  await fetchPurchasingUnit()
})

const handleSubmit = async () => {
  isSubmitting.value = true

  const formData = new FormData()
  // formData.append('product_id', formState.product)
  formData.append('product_type_name', formState.productTypeName)
  if (formState.productTypeImage) {
    formData.append('product_type_image', formState.productTypeImage)
  }
  formData.append('product_type_description', formState.productTypeDescription)
  formData.append('barcode', formState.barcode)
  formData.append('category_id', formState.category)
  formData.append('vat', formState.vat)
  formData.append('sub_category_id', formState.sub_category)
  formData.append('selling_unit_id', selectedSellingUnit.value)
  formData.append('selling_unit_capacity_id', selectedSellingCapacity.value)
  formData.append('purchase_unit_id', formState.purchaseUnit)

  try {
    const res = await apiService.post('/product-types', formData)
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
  background-color: #fff;
  transition: background-color 0.3s ease;
}

.input[readonly] {
  background-color: #e0e0e0;
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

.tooltip-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.tooltip-container .tooltip-text {
  visibility: hidden;
  width: 200px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 4px;

  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -80px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.edit-button {
  background-color: #ffc107;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.edit-button:hover {
  background-color: #e0a800;
}
</style>
