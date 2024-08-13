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
          />
        </div>

        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Barcode</label>
          <input v-model="formState.barcode" type="password" class="input" />
        </div>

        <div class="input-group w-[70%]">
          <p>Are you selling in unit?</p>
          <label class="mt-20 text-sm font-medium text-gray-700">
          <input type="radio" value="1" name="choice" v-model="formState.unitSales" >
          Yes 
        </label>

          <label class="ml-8 text-sm font-medium text-gray-700">
          <input type="radio" value="0" name="choice" v-model="formState.unitSales" >
          No 
        </label>
          <!-- <input v-model="formState.barcode" type="password" class="input" /> -->
        </div>

        <!-- <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Measurement</label>
          <select v-model="formState.measurement" class="select-input" required>
            <option selected>Select Measurement...</option>
            <option
              v-for="measurement in measurements"
              :key="measurement.id"
              :value="measurement.id"
            >
              {{ measurement.measurement_name }}
            </option>
          </select>
        </div> -->

        <div class="input-group w-full">
          <label class="block text-sm font-medium text-gray-700">Select Selling Unit</label>
          <div class="flex">
            <div class="w-[70%]">
              <select
                v-model="selectedContainerType"
                class="select-input"
                @change="fetchContainerTypeCapacities"

              >
                <option selected>Select Selling Unit...</option>
                <option v-for="type in containerTypes" :key="type.id" :value="type.id">
                  {{ type.container_type_name }}
                </option>
              </select>
            </div>
            <button type="button" class="button btn-brand ml-4" @click="addContainerType">
              Add Selling Unit
            </button>
          </div>
        </div>

        <div class="input-group w-full">
          <label class="block text-sm font-medium text-gray-700">Select Selling Unit Capacity</label>
          <div class="flex">
            <div class="w-[70%]">
              <select v-model="formState.containerTypeCapacity" class="select-input">
                <option selected>Select Selling Unit Capacity...</option>
                <option
                  v-for="capacity in containerTypeCapacities"
                  :key="capacity.id"
                  :value="capacity.id"
                >
                  {{ capacity.container_capacity }}
                </option>
              </select>
            </div>
            <button type="button" class="button btn-brand ml-4" @click="addContainerCapacity">
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
    <ContainerTypeModal v-if="showModal" @close="closeModal" />
    <ContainerTypeCapacitiesModal
      v-if="displayModal"
      :containerTypeId="selectedContainerType"
      @close="closeModal"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import apiService from '@/services/apiService'
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'
import ContainerTypeModal from '@/components/UI/Modal/containerTypeModal.vue'

import ContainerTypeCapacitiesModal from '@/components/UI/Modal/containerCapacitiesModal.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fileInput = ref(null)
const newImage = ref(null)
const isSubmitting = ref(false)
// const unitSales = ref(null);

const showModal = ref(false)
const displayModal = ref(false)

const addContainerCapacity = () => {
  displayModal.value = true
}
const addContainerType = () => {
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
  displayModal.value = false
}

const formState = reactive({
  product: '',
  productTypeName: '',
  productTypeImage: null,
  productTypeDescription: '',
  barcode: '',
  unitSales: null,
  // measurement: '',
  containerTypeCapacity: ''
})

// const measurements = ref([])
const products = ref([])
const containerTypes = ref([])
const containerTypeCapacities = ref([])
const selectedContainerType = ref(null)



// const fetchMeasurements = async () => {
//   try {
//     const response = await apiService.get('/measurements')
//     console.log(response)
//     catchAxiosSuccess(response)
//     measurements.value = response
//     console.log(measurements.value)
//   } catch (error) {
//     catchAxiosError(error)
//     console.error('Error fetching products:', error)
//   }
// }
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
const fetchContainerTypes = async () => {
  try {
    const response = await apiService.get('/list-all-containers')
    console.log(response)
    containerTypes.value = response.data
  } catch (error) {
    console.error('Error fetching container types:', error)
    catchAxiosError(error)
  }
}

const fetchContainerTypeCapacities = async () => {
  if (selectedContainerType.value) {
    try {
      const response = await apiService.get(
        `/container-with-capacities/${selectedContainerType.value}`
      )
      console.log(response.data.container_capacities)
      containerTypeCapacities.value = response.data.container_capacities
    } catch (error) {
      console.error('Error fetching container type capacities:', error)
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

// Fetch data on mounted
onMounted(async () => {
  // await fetchMeasurements()
  await fetchProducts()
  await fetchContainerTypes()
  await fetchContainerTypeCapacities()
})

const handleSubmit = async () => {
  isSubmitting.value = true

  const formData = new FormData()
  formData.append('product_id', formState.product)
  formData.append('product_type_name', formState.productTypeName)
  formData.append('product_type_image', formState.productTypeImage)
  formData.append('product_type_description', formState.productTypeDescription)
  formData.append('barcode', formState.barcode)
  formData.append('is_container_type', formState.unitSales)
  formData.append('container_type_capacity_id', formState.containerTypeCapacity)

  try {
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
