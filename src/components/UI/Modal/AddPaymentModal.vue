<template>
  <div
    class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full"
  >
    <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
      <header
        class="flex flex-row items-center justify-between border-b-[#000000] mb-[0.6em] border-b-[1px]"
      >
        <!-- <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">{{ isEditing ? 'Edit Purchase Unit' : 'Add Purchase Unit' }}</h4> -->
        <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">Add Payment Type Details</h4>
        <button class="close-button" @click="$emit('close')">&#10005;</button>
      </header>

       <div v-if="isLoading" class="loader-overlay">
        <div class="loader"></div>
      </div>

      <form @submit.prevent="submitForm" class="max-w-4xl mx-auto p-2">


            <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 pb-1"
            >Select Payment Type
          </label>
          <div class="flex">
            <div class="w-[60%]" >
              <select
                v-model="form.payment_method"
                class="select-input w-[100%] "
              >
                <option selected>Select Payment Type...</option>
                <option v-for="type in paymentType"  :key="type.id" :value="type.id">
                  {{ type.payment_name }}
                </option>
              </select>
            </div>
            <button type="button" class="button btn-brand ml-3" @click=openPaymentTypeModal >
              Add Payment Type
            </button>
          </div>
        </div>
          <div class="mb-4">
            <label  class="block text-sm font-medium text-gray-700 pb-1">Account Name</label>
            <input
              type="text"
              v-model="form.account_name"
              placeholder="Enter Account Name"
              required
              class="mt-1 block w-[90%] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div class="mb-4">
            <label  class="block text-sm font-medium text-gray-700 pb-1">Account Number</label>
            <input
              type="text"
              v-model="form.account_number"
              placeholder="Enter Account Number"
              required
              class="mt-1 block w-[90%] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div class="mb-4">
            <label  class="block text-sm font-medium text-gray-700 pb-1">Payment Method</label>
            <input
              type="text"
              v-model="form.paymentIdentifier"
              placeholder="Enter Payment Method"
              required
              class="mt-1 block w-[90%] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>


        <button
          type="submit"
          class="px-4 py-2 bg-[#c35214] hover:bg-[#c35214cb] text-white font-bold py-2 px-4 rounded"
        >
        Submit
        </button>
      </form>
    </div>
    <AddPaymentTypeModal v-if="showPaymentType" @close="closePaymentTypeModal" @payment-type-added="addPaymentType" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineEmits } from 'vue'
import AddPaymentTypeModal from './AddPaymentTypeModal.vue';
import apiService from "@/services/apiService"
import { catchAxiosSuccess, catchAxiosError } from '@/services/Response'

const isLoading = ref(false)
const showPaymentType = ref(false)
const paymentType = ref([]);

const form = reactive({
    payment_method: '',
    account_name: '',
    account_number: '',
    paymentIdentifier: ''
})

const emits = defineEmits(['close', 'paymentDetailsUpdated'])


const fetchPaymentTypes = async () => {
    try{
        const response = await apiService.get('/payment-methods');
        paymentType.value = response.data
        console.log(response)

        catchAxiosSuccess()

        

    } catch(error){
        console.error("Error refreshing payment types:", error);
        catchAxiosError(error)
    }
}

onMounted( async () => {
  await fetchPaymentTypes();
})

const openPaymentTypeModal = () => {
  showPaymentType.value = true;
};

const closePaymentTypeModal = () => {
  showPaymentType.value = false;
};

const addPaymentType = (newType) => {
  paymentType.value.push(newType);
};


const submitForm = async () => {
  isLoading.value = true;

  const payload = {
    payment_method_id : form.payment_method,
    account_name: form.account_name,
    account_number: form.account_number,
    payment_identifier: form.paymentIdentifier
  }

  try {
      const response = await apiService.post('/payment-details', payload)
    //   emits('purchase-unit-added', response.data)
      catchAxiosSuccess(response)

      emits('paymentDetailsUpdated', response.data);
        emits('close');
  } catch (error) {
    console.error('Error submitting form:', error)
   catchAxiosError(error);

  } finally{
    isLoading.value = false;
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

.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.btn-brand {
  background-color: #c35214;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
