<!-- EditProductModal.vue -->
<template>
  <div v-if="show" class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Edit Product
              </h3>

              <form @submit.prevent="handleSubmit" class="space-y-6 mt-4">
                <div v-for="field in formFields" :key="field.databaseField" class="mb-4">
                  <label :for="field.databaseField" class="block text-sm font-medium text-gray-700 mb-1">
                    {{ field.label }}
                    <span v-if="field.tooltip" class="ml-1 tooltip-container inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="ml-1 text-gray-500">
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                        />
                      </svg>
                      <span class="tooltip-text">{{ field.tooltip }}</span>
                    </span>
                  </label>
                  
                  <div class="mt-1">
                    <!-- Input Field -->
                    <input
                      v-if="field.type === 'text' || field.type === 'number'"
                      :type="field.type"
                      :id="field.databaseField"
                      v-model="formData[field.databaseField]"
                      :placeholder="field.placeholder"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    
                    <!-- Select Field -->
                    <select
                      v-else-if="field.type === 'select'"
                      :id="field.databaseField"
                      v-model="formData[field.databaseField]"
                      class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      @change="handleSelectChange(field.databaseField)"
                    >
                      <option value="">{{ field.placeholder }}</option>
                      <option v-for="option in field.options" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>

                    <!-- Image Upload -->
                    <div v-else-if="field.type === 'image'" class="flex items-center mt-1">
                      <input
                        type="file"
                        :id="field.databaseField"
                        @change="handleImageChange"
                        class="hidden"
                        ref="fileInput"
                      />
                      <label :for="field.databaseField" class="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
                        Choose Image
                      </label>
                      <img v-if="formData[field.databaseField]" :src="formData[field.databaseField]" class="ml-4 h-20 w-30 rounded-md object-cover" alt="Product Image" />
                    </div>

                    <!-- Radio Button Group -->
                    <div v-else-if="field.type === 'radio'" class="flex space-x-4 mt-2">
                      <div v-for="option in field.options" :key="option.value">
                        <input
                          type="radio"
                          :id="`${field.databaseField}_${option.value}`"
                          :value="option.value"
                          v-model="formData[field.databaseField]"
                          class="mr-2"
                        />
                        <label :for="`${field.databaseField}_${option.value}`">{{ option.label }}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Footer Buttons -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="handleSubmit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 sm:ml-3 sm:w-auto sm:text-sm"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
          <button
            @click="closeModal"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<!-- <template>
  <section :show="show" @close="closeModal">
    <h3 class="text-lg font-medium leading-6 text-gray-900">Edit Product</h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-for="field in formFields" :key="field.databaseField">
        <label :for="field.databaseField" class="block text-sm font-medium text-gray-700">
          {{ field.label }}
          <span v-if="field.tooltip" class="tooltip-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
              />
            </svg>
            <span class="tooltip-text">{{ field.tooltip }}</span>
          </span>
        </label>
        <div class="mt-1">
          <input
            v-if="field.type === 'text' || field.type === 'number'"
            :type="field.type"
            :id="field.databaseField"
            v-model="formData[field.databaseField]"
            :placeholder="field.placeholder"
            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <select
            v-else-if="field.type === 'select'"
            :id="field.databaseField"
            v-model="formData[field.databaseField]"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            @change="handleSelectChange(field.databaseField)"
          >
            <option value="">{{ field.placeholder }}</option>
            <option v-for="option in field.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <div v-else-if="field.type === 'image'" class="flex items-center">
            <input
              type="file"
              :id="field.databaseField"
              @change="handleImageChange"
              class="hidden"
              ref="fileInput"
            />
            <label
              :for="field.databaseField"
              class="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded"
            >
              Choose Image
            </label>
            <img
              v-if="formData[field.databaseField]"
              :src="formData[field.databaseField]"
              class="ml-4 h-20 w-30 rounded-md object-cover"
              alt="Product Image"
            />
          </div>
          <div v-else-if="field.type === 'radio'">
            <div class="flex space-x-4">
              <div v-for="option in field.options" :key="option.value">
                <input
                  type="radio"
                  :id="`${field.databaseField}_${option.value}`"
                  :value="option.value"
                  v-model="formData[field.databaseField]"
                  class="mr-2"
                />
                <label :for="`${field.databaseField}_${option.value}`">{{ option.label }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <button @click="closeModal" class="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2">
      Cancel
    </button>
    <button
      @click="handleSubmit"
      class="bg-blue-500 text-white px-4 py-2 rounded"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
    </button>
  </section>
</template> -->

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
// import Modal from '@/components/UI/Modal/Modal.vue'
import apiService from '@/services/apiService'
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'
import { productTypeFormFields } from '@/formfields/formFields'

const props = defineProps({
  show: Boolean,
  productId: Number
})

const emit = defineEmits(['close', 'updated'])

const formFields = ref([...productTypeFormFields.value])
const formData = reactive({})
const isSubmitting = ref(false)
const fileInput = ref(null)

const fetchProductDetails = async () => {
  try {
    const response = await apiService.get(`/product-types/${props.productId}`)
    Object.assign(formData, response.data)
    await fetchRelatedData()
  } catch (error) {
    console.error('Error fetching product details:', error)
    catchAxiosError(error)
  }
}

const fetchRelatedData = async () => {
  await fetchCategories()
  if (formData.category_id) {
    await fetchSubCategories(formData.category_id)
  }
  await fetchPurchaseUnits()
  if (formData.purchase_unit_id) {
    await fetchSellingUnits(formData.purchase_unit_id)
  }
  if (formData.selling_unit_id) {
    await fetchSellingCapacities(formData.selling_unit_id)
  }
}

const fetchCategories = async () => {
  try {
    const response = await apiService.get('/product-categories')
    updateFieldOptions('category_id', response, 'category_name')
  } catch (error) {
    console.error('Error fetching categories:', error)
    catchAxiosError(error)
  }
}

const fetchSubCategories = async (categoryId) => {
  try {
    const response = await apiService.get(
      `/all-product-sub-categories-by-category-id/${categoryId}`
    )
    updateFieldOptions('sub_category_id', response, 'sub_category_name')
  } catch (error) {
    console.error('Error fetching sub-categories:', error)
    catchAxiosError(error)
  }
}

const fetchPurchaseUnits = async () => {
  try {
    const response = await apiService.get('/list-purchase-units')
    updateFieldOptions('purchase_unit_id', response.data, 'purchase_unit_name')
  } catch (error) {
    console.error('Error fetching purchase units:', error)
    catchAxiosError(error)
  }
}

const fetchSellingUnits = async (purchaseUnitId) => {
  try {
    const response = await apiService.get(`/selling-units-by-purchase-unit/${purchaseUnitId}`)
    updateFieldOptions('selling_unit_id', response.data, 'selling_unit_name')
  } catch (error) {
    console.error('Error fetching selling units:', error)
    catchAxiosError(error)
  }
}

const fetchSellingCapacities = async (sellingUnitId) => {
  try {
    const response = await apiService.get(`/selling-capacities-by-selling-unit/${sellingUnitId}`)
    updateFieldOptions('selling_unit_capacity_id', response.data, 'selling_unit_capacity')
  } catch (error) {
    console.error('Error fetching selling capacities:', error)
    catchAxiosError(error)
  }
}

const updateFieldOptions = (fieldName, options, labelKey) => {
  const field = formFields.value.find((f) => f.databaseField === fieldName)
  if (field) {
    field.options = options.map((option) => ({
      value: option.id,
      label: option[labelKey]
    }))
  }
}

const handleSelectChange = async (fieldName) => {
  if (fieldName === 'category_id') {
    await fetchSubCategories(formData.category_id)
    formData.sub_category_id = ''
  } else if (fieldName === 'purchase_unit_id') {
    await fetchSellingUnits(formData.purchase_unit_id)
    formData.selling_unit_id = ''
    formData.selling_unit_capacity_id = ''
  } else if (fieldName === 'selling_unit_id') {
    await fetchSellingCapacities(formData.selling_unit_id)
    formData.selling_unit_capacity_id = ''
  }
}

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.product_type_image = file
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.product_type_image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  const formDataToSend = new FormData()

  for (const [key, value] of Object.entries(formData)) {
    if (key === 'product_type_image' && value instanceof File) {
      formDataToSend.append(key, value)
    } else if (value !== null && value !== undefined) {
      formDataToSend.append(key, value)
    }
  }

  try {
    const response = await apiService.post(`/product-types/${props.productId}`, formDataToSend)
    catchAxiosSuccess(response)
    emit('updated')
    closeModal()
  } catch (error) {
    console.error('Error updating product:', error)
    catchAxiosError(error)
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  emit('close')
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal && props.productId) {
      fetchProductDetails()
    }
  }
)

onMounted(() => {
  if (props.show && props.productId) {
    fetchProductDetails()
  }
})
</script>
