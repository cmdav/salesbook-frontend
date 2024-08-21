<template>
  <div
    class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full"
  >
    <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
      <header
        class="flex flex-row items-center justify-between border-b-[#000000] mb-[0.6em] border-b-[1px]"
      >
        <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">Add Container Capacity</h4>
        <button class="close-button" @click="$emit('close')">&#10005;</button>
      </header>
      <form @submit.prevent="submitForm" class="max-w-4xl mx-auto p-2">
        
          <div class="mb-4">
            <label  class="block text-sm font-medium text-gray-700 pb-1">Container Capacity</label>
            <input
              type="text"
              v-model="containerCapacity"
              placeholder="Enter Container Capacity"
              required
              class="mt-1 block w-[90%] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        

        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Capacity
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
// import { useCustomerstore } from '@/stores/customers'
import apiService from "@/services/apiService"
import { catchAxiosSuccess, catchAxiosError } from '@/services/Response'

const props = defineProps({
  containerTypeId: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['close', 'container-capacity-added'])


const containerCapacity = ref('')

const submitForm = async () => {
  try {
    const response = await apiService.post('/container-type-capacities', {
      container_type_id: props.containerTypeId,
      container_capacity: containerCapacity.value
    })
    console.log('Form submitted successfully:', response.data)
    catchAxiosSuccess(response)
     emits('container-capacity-added', response.data)
    emits('close')
  } catch (error) {
    console.error('Error submitting form:', error)
   catchAxiosError(error);
    
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
