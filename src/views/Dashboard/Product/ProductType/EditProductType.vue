<template>
  <DashboardLayout pageTitle="Edit Product">

    <div class="top-buttons">
        <router-link to="/product-type" class="button back-btn">Back</router-link>
      </div>
    <!-- The form is similar to your create form, but fields are pre-filled based on the selected product -->
    <form @submit.prevent="handleSubmit">
      <!-- Similar structure as create form, but with pre-populated data -->
      <input v-model="formState.productTypeName" required />
      <input type="file" @change="handleImageChange" />
      <img v-if="newImage" :src="newImage" />
      <input v-model="formState.productTypeDescription" required />
      <!-- Additional fields and logic as needed -->
      <button type="submit">{{ isSubmitting ? 'Updating...' : 'Update Product' }}</button>
    </form>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import apiService from '@/services/apiService'
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSubmitting = ref(false)
const newImage = ref(null)
const formState = reactive({
  productId: '',  // This will be set when opening the modal for edit
  productTypeName: '',
  productTypeDescription: '',
  // Other form fields as necessary
})

const fetchProductDetails = async (id) => {
  try {
    const response = await apiService.get(`/product/${id}`)
    const product = response.data
    formState.productTypeName = product.name
    formState.productTypeDescription = product.description
    newImage.value = product.image_url
    // Populate other fields as necessary
  } catch (error) {
    catchAxiosError(error)
  }
}

onMounted(() => {
  if (props.productId) {
    fetchProductDetails(props.productId)
  }
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await apiService.put(`/product/${formState.productId}`, formState)
    catchAxiosSuccess('Product updated successfully')
    router.push('/products')
  } catch (error) {
    catchAxiosError(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
