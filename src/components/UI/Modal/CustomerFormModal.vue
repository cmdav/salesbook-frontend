<template>
  <div
    class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full"
  >
    <div
      class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4"
    >
      <header
        class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]"
      >
        <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">
           Add Customer
        </h4>
        <button class="close-button" @click="$emit('close')">&#10005;</button>
      </header>
      <form @submit.prevent="submitForm" class="max-w-4xl mx-auto p-4">
    <!-- Radio buttons for customer type selection with Tailwind styling -->
    <div class="mb-4">
      <label class="inline-flex items-center mr-6">
        <input type="radio" value="1" v-model="customerType" class="form-radio h-5 w-5 text-blue-600" />
        <span class="ml-2 text-gray-700">Individual</span>
      </label>
      <label class="inline-flex items-center">
        <input type="radio" value="2" v-model="customerType" class="form-radio h-5 w-5 text-blue-600" />
        <span class="ml-2 text-gray-700">Company</span>
      </label>
    </div>

    <!-- Dynamic form fields based on customer type with Tailwind CSS grid layout -->
    <div class="grid grid-cols-2 gap-4">
      <div v-for="field in currentFormFields" :key="field.databaseField" class="mb-4">
        <label :for="field.databaseField" class="block text-sm font-medium text-gray-700">{{ field.label }}</label>
        <input 
          :type="field.type"
          v-model="formData[field.databaseField]"
          :placeholder="field.placeholder"
          :required="field.required"
          :id="field.databaseField"
          :maxlength="field.maxLength || null"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>

    <button type="submit" class="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Add
    </button>
  </form>
    </div>
  </div>
</template>

<script setup>
import { defineEmits,ref,computed, watch} from "vue";
import { useCustomerstore } from '@/stores/customers';
import { catchAxiosSuccess } from '@/services/Response'


const customerStore = useCustomerstore();


const emits = defineEmits(["close"]);




 const customerType = ref('1');  // Default to 'Individual'

   

    const individualFields = [
      { label: 'First Name', type: 'text', databaseField: 'first_name', placeholder: 'Enter first name', required: true, value:'' },
      { label: 'Last Name', type: 'text', databaseField: 'last_name', placeholder: 'Enter last name', required: true , value:''},
     // { label: 'Middle Name', type: 'text', databaseField: 'middle_name', placeholder: 'Enter middle name', required: false, value:'' },
      { label: 'Phone Number', type: 'text', databaseField: 'phone_number', placeholder: 'Enter phone number', required: true, value:'' },
      // { label: 'Date of Birth', type: 'date', databaseField: 'dob', required: false },
      { label: 'Email', type: 'email', databaseField: 'email', placeholder: 'Enter email', required: true },
      {  type: 'hidden', databaseField: 'type_id', placeholder: 'Enter email', required: true, value:'individual'}
    ];

    const companyFields = [
      { label: 'Company Name', type: 'text', databaseField: 'company_name', placeholder: 'Enter company name', required: true , value:''},
      { label: 'Contact Person', type: 'text', databaseField: 'contact_person', placeholder: 'Enter contact person', required: true , value:''},
      { label: 'Phone Number', type: 'text', databaseField: 'phone_number', placeholder: 'Enter phone number', required: true, value:'' },
      { label: 'Email', type: 'email', databaseField: 'email', placeholder: 'Enter email', required: true, value:'1@gmail.com' },
      {  type: 'hidden', databaseField: 'type_id', placeholder: 'Enter email', required: true, value:'company'}
    ];

    const currentFormFields = computed(() => {
      return customerType.value === '1' ? individualFields : companyFields;
    });
    
     // Initialize formData as a reactive object
const formData = ref({});

const allFields = { '1': individualFields, '2': companyFields };
watch(customerType, (newType) => {
  formData.value = {};  // Reset formData
  allFields[newType].forEach(field => {
    formData.value[field.databaseField] = field.value || '';
  });
}, { immediate: true });

const submitForm = async () => {
  
    const payload = {...formData.value};
    //console.log(payload)
    
    try {
      console.log(payload)
        const response = await customerStore.handleAddCustomer(payload);
        console.log(response);
        catchAxiosSuccess(response)
       // alert('Submission Successful:', response);
        formData.value = {};
     
        emits('close'); 
    } catch (error) {
        console.error('Submission Failed:', error);
       
    }
};


   

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
