<template>
  <div
    class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full"
  >
    <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
      <header
        class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]"
      >
        <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">Add Container Type</h4>
        <button class="close-button" @click="$emit('close')">&#10005;</button>
      </header>
      <form @submit.prevent="submitForm" class="max-w-4xl mx-auto p-4">
        <!-- Dynamic form fields based on customer type with Tailwind CSS grid layout -->
        <div class="grid grid-cols-2 gap-4">
          <div class="mb-4">
            <label  class="block text-sm font-medium text-gray-700">Container Type</label>
            <input
              type="text"
              v-model="containerName"
              placeholder="Enter Container Type"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, ref, computed, watch } from 'vue'
import { useCustomerstore } from '@/stores/customers'
import { catchAxiosSuccess } from '@/services/Response'

const customerStore = useCustomerstore()

const emits = defineEmits(['close'])



// Initialize formData as a reactive object
const formData = ref({
    ...individualFields
})


const submitForm = async () => {
  const payload = { ...formData.value }
  //console.log(payload)

  try {
    console.log(payload)
    const response = await customerStore.handleAddCustomer(payload)
    console.log(response)
    catchAxiosSuccess(response)
    // alert('Submission Successful:', response);
    formData.value = {}

    emits('close')
  } catch (error) {
    console.error('Submission Failed:', error)
  }
}
</script>

<style lang="scss" scoped>
.modal {
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.modal__body {
  position: relative;
  max-width: 600px; // Consider using max-width for better responsiveness
  background-color: #fff;
  border-radius: 12px;
  animation: slidedown 0.8s ease;
  max-height: 90vh; // Set a maximum height
  overflow-y: auto; // Enable vertical scrolling
}

.close-button {
  position: absolute;
  right: 20px;
  top: 20px;
  background: none;
  border: none;
  font-size: 25px;
  cursor: pointer;
}
</style>
