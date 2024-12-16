<template>
  <DashboardLayout pageTitle="Edit Product">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div class="top-buttons">
        <router-link to="/product-type" class="button back-btn">Back</router-link>
      </div>

      <form @submit.prevent="handleSubmit" v-if="formState">
        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            v-model="formState.productTypeName"
            required
            type="text"
            class="input"
            placeholder="Enter Product Name"
            @keypress="preventSubmitOnEnter"
          />
        </div>

        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product Image</label>
          <input ref="fileInput" type="file" @change="handleImageChange" />
          <img
            v-if="currentImage || newImage"
            :src="newImage || currentImage"
            class="mb-4 h-20 w-30 rounded-md object-cover"
            alt="Current Image"
          />
        </div>

        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700"
            >Product Description
            <span class="text-gray-500 text-sm">
              ({{ formState.productTypeDescription.length }}/300 characters)
            </span>
          </label>
          <textarea
            v-model="formState.productTypeDescription"
            required
            type="text"
            placeholder="Enter Product Description"
            maxlength="300"
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
          <div class="option">
            <div>
              <input type="radio" id="vatYes" value="1" v-model="formState.vat" />
              <label for="vatYes">Yes</label>
            </div>
            <div>
              <input type="radio" id="vatNo" value="0" v-model="formState.vat" />
              <label for="vatNo">No</label>
            </div>
          </div>
        </div>

        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product Category</label>
          <select
            v-model="formState.category"
            @change="fetchSubCategory(formState.category)"
            class="select-input"
          >
            <option value="">Select Category...</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.category_name }}
            </option>
          </select>
        </div>

        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product Subcategory</label>
          <select v-model="formState.sub_category" class="select-input">
            <option value="">Select Subcategory...</option>
            <option
              v-for="subCategory in subCategories"
              :key="subCategory.id"
              :value="subCategory.id"
            >
              {{ subCategory.sub_category_name }}
            </option>
          </select>
        </div>

        <div v-for="(unit, index) in units" :key="index" class="measurement-unit-container">
    <h3 class="text-lg font-semibold mb-4">Purchase Unit {{ index + 1 }}</h3>

    <div class="input-group w-full">
      <label class="block text-sm font-medium text-gray-700">
        Select Measurement Group
        <span class="tooltip-container">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 24 24">
            <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"></path>
          </svg>
          <span class="tooltip-text">Select the measurement group first</span>
        </span>
      </label>
      <div class="flex">
        <div class="w-[70%]">
          <v-select
            v-model="unit.measurementGroup"
            :options="measurementGroups"
            :reduce="group => group.id"
            :get-option-label="group => group.group_name"
            placeholder="Select Measurement Group..."
            class="vue-select-container"
            @input="handleGroupChange(index)"
            required
          ></v-select>
        </div>
      </div>
    </div>

    <div v-if="unit.measurementGroup" class="input-group w-full mt-4">
      <label class="block text-sm font-medium text-gray-700">
        Select Purchase Unit
        <span class="tooltip-container">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 24 24">
            <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"></path>
          </svg>
          <span class="tooltip-text">Select the purchase unit for this item</span>
        </span>
      </label>
      <div class="flex">
        <div class="w-[70%]">
          <v-select
            v-model="unit.purchaseUnit"
            :options="getPurchaseUnitsForGroup(unit.measurementGroup, index)"
            :reduce="unit => unit.id"
            :get-option-label="unit => unit.purchase_unit_name"
            placeholder="Select Purchase Unit..."
            class="vue-select-container"
            required
          ></v-select>
        </div>
      </div>
    </div>

    <div v-if="index !== 0" class="flex justify-end mt-4">
      <button type="button" class="button btn-danger" @click="units.splice(index, 1)">
        Remove Unit
      </button>
    </div>
  </div>

  <button
    type="button"
    class="button btn-brand mt-4"
    @click="addMeasurementSet"
  >
    Add Another Purchase Unit
  </button>

        <button type="submit" class="button submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Updating...' : 'Update' }}
        </button>
      </form>
    </div>

    <PurchaseUnitModal
      v-if="showModal"
      @close="closeModal"
      @purchase-unit-added="handlePurchaseUnit"
    />
   
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiService from '@/services/apiService'
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'
import PurchaseUnitModal from '@/components/UI/Modal/purchaseUnitModal.vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const route = useRoute()
const router = useRouter()
const fileInput = ref(null)
const currentImage = ref(null)
const newImage = ref(null)
const isSubmitting = ref(false)
const productId = route.params.id

const showModal = ref(false)
const displayModal = ref(false)
const displayCapModal = ref(false)
const barcodeInput = ref(null)
const lastScannedBarcode = ref('')
const isBarcodeReadonly = ref(false)
const currentUnitIndex = ref(null)

const formState = reactive({
  productTypeName: '',
  productTypeImage: null,
  productTypeDescription: '',
  barcode: '',
  category: '',
  sub_category: '',
  vat: '1'
})

const units = ref([
  {
    measurementGroup: '',
    purchaseUnit: '',
  }
])

const measurementGroups = ref([])
const availablePurchaseUnits = ref({})

const purchaseUnit = ref([])
const selectedPurchaseUnit = ref(null)
const selectedSellingUnit = ref(null)
const categories = ref([])
const subCategories = ref([])

const handleBarcodeEntry = (event) => {
  const newBarcode = event.target.value.trim()
  if (newBarcode !== lastScannedBarcode.value || !newBarcode) {
    formState.barcode = newBarcode
    lastScannedBarcode.value = newBarcode
    isBarcodeReadonly.value = true
  }
  barcodeInput.value.value = ''
}

const clearBarcode = () => {
  formState.barcode = ''
  isBarcodeReadonly.value = false
  lastScannedBarcode.value = ''
}

const closeModal = () => {
  showModal.value = false
  displayModal.value = false
  displayCapModal.value = false
  selectedPurchaseUnit.value = null
  selectedSellingUnit.value = null
  currentUnitIndex.value = null
}

const preventSubmitOnEnter = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
  }
}

const handlePurchaseUnit = (newType) => {
  purchaseUnit.value.push(newType)
}

// Function to get available purchase units for a group
const getPurchaseUnitsForGroup = (groupId, currentUnitIndex) => {
  if (!groupId) return []
  const groupUnits = availablePurchaseUnits.value[groupId] || []
  
  // Filter out purchase units that are already selected in other unit selections
  return groupUnits.filter(unit => {
    return !units.value.some((u, index) => 
      index !== currentUnitIndex && u.purchaseUnit === unit.id
    )
  })
}

const handleGroupChange = (index) => {
  // Reset purchase unit when group changes
  units.value[index].purchaseUnit = ''
}

const fetchProductData = async () => {
  try {
    const response = await apiService.get(`/product-types/${productId}`)
    
    // Populate form state
    formState.productTypeName = response.product_type_name
    formState.productTypeDescription = response.product_type_description
    formState.barcode = response.barcode
    formState.category = response.category_id
    formState.sub_category = response.sub_category_id
    formState.vat = response.vat === 'Yes' ? '1' : '0'
    currentImage.value = response.product_type_image

    // Clear existing units and populate with response data
    units.value = []
    const purchaseUnitIds = Object.keys(response)
      .filter(key => key.startsWith('purchase_unit_id'))
      .map(key => ({
        index: parseInt(key.match(/\[(\d+)\]/)[1]),
        id: response[key],
        name: response[`purchase_unit_name[${key.match(/\[(\d+)\]/)[1]}]`],
        
      }))

      for (const unit of purchaseUnitIds) {
      let measurementGroupId = null
      for (const group of measurementGroups.value) {
        if (group.purchase_units.some(pu => pu.id === unit.id)) {
          measurementGroupId = group.id
          break
        }
      }

      units.value.push({
        measurementGroup: measurementGroupId,
        purchaseUnit: unit.id,
      })
    }

    if (formState.category) {
      await fetchSubCategory(formState.category)
    }

  } catch (error) {
    catchAxiosError(error)
    console.error('Error fetching product data:', error)
  }
}

const fetchCategory = async () => {
  try {
    const response = await apiService.get('/product-categories')
    categories.value = response
  } catch (error) {
    catchAxiosError(error)
    console.error('Error fetching categories:', error)
  }
}

const fetchSubCategory = async (categoryId) => {
  try {
    const response = await apiService.get(
      `/all-product-sub-categories-by-category-id/${categoryId}`
    )
    subCategories.value = response
  } catch (error) {
    catchAxiosError(error)
    console.error('Error fetching subcategories:', error)
  }
}

const fetchMeasurementGroups = async () => {
  try {
    const response = await apiService.get('/list-purchase-units')
    measurementGroups.value = response.data
    measurementGroups.value.forEach(group => {
      availablePurchaseUnits.value[group.id] = group.purchase_units
    })
  } catch (error) {
    console.error('Error fetching measurement groups:', error)
    catchAxiosError(error)
  }
}

const fetchSellingUnit = async (purchaseUnitId, index) => {
  const selectedUnit = purchaseUnit.value.find((unit) => unit.id === purchaseUnitId)
  if (selectedUnit) {
    units.value[index].availableSellingUnits = selectedUnit.selling_units || []
    if (!units.value[index].sellingUnit) {
      units.value[index].sellingCapacity = ''
      units.value[index].availableCapacities = []
    }
  }
}

const fetchSellingCapacities = async (sellingUnitId, index) => {
  const selectedUnit = units.value[index].availableSellingUnits.find((unit) => unit.id === sellingUnitId)
  if (selectedUnit) {
    units.value[index].availableCapacities = selectedUnit.selling_unit_capacities || []
    if (!units.value[index].sellingCapacity) {
      units.value[index].sellingCapacity = ''
    }
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

const addMeasurementSet = () => {
  units.value.push({
    measurementGroup: '',
    purchaseUnit: '',
  })
}

onMounted(async () => {
  await fetchCategory()
  await fetchMeasurementGroups()
  await fetchProductData()
})

const handleSubmit = async () => {
  isSubmitting.value = true

  const formData = new FormData()

  formData.append('_method', 'PUT')
  formData.append('product_type_name', formState.productTypeName)
  if (formState.productTypeImage) {
    formData.append('product_type_image', formState.productTypeImage)
  }
  formData.append('product_type_description', formState.productTypeDescription)
  formData.append('barcode', formState.barcode)
  formData.append('category_id', formState.category || '')
  formData.append('vat', formState.vat)
  formData.append('sub_category_id', formState.sub_category || '')
  units.value.forEach((unit, index) => {
    formData.append(`purchase_unit_id[${index}]`, unit.purchaseUnit)
   
  })
  try {
    
    const res = await apiService.post(`/product-types/${productId}`, formData)
    router.push('/product-type')
    catchAxiosSuccess(res)
    return res
  } catch (error) {
    catchAxiosError(error)
    console.error('Error updating product:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
}

.measurement-unit-container {
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
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
  background-color: #c35114;
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

.option {
  display: flex;
}

.option div {
  margin: 0.3em 0.5em 1em;
}

.option div input {
  margin-right: 0.2em;
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