<template>
  <div class="modal z-[200] fixed backdrop-blur animate__fadeIn min-h-screen h-full">
    <div class="modal__body w-full md:max-w-[400px] bg-white m-0 md:px-5 py-4 px-4">
      <header class="flex justify-between mb-2 border-b pb-2">
        <h4 class="text-[24px]">Add New Payment Type</h4>
        <button @click="$emit('close')">&#10005;</button>
      </header>

       <div v-if="isLoading" class="loader-overlay">
        <div class="loader"></div>
      </div>

      <form @submit.prevent="submitNewPaymentType">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Payment Type</label>
          <input type="text" v-model="newPaymentType" required class="mt-1 block w-[90%] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        <button type="submit" class="px-4 py-2 bg-[#c35214] hover:bg-[#c35214cb] text-white font-bold py-2 px-4 rounded">Add Payment Type</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiService from "@/services/apiService";
import { catchAxiosSuccess, catchAxiosError } from '@/services/Response';

const newPaymentType = ref('');

const emits = defineEmits(['close', 'paymentTypeAdded'])
const isLoading = ref(false);

const submitNewPaymentType = async () => {
    isLoading.value = true;
  try {
    const response = await apiService.post('/payment-methods', { payment_name: newPaymentType.value });
    catchAxiosSuccess(response);
    // Emit event with the new payment type data
    emits('payment-type-added', response.data);
    emits('close');
  } catch (error) {
    catchAxiosError(error);
  } finally{
    isLoading.value = false;
  }
};
</script>
