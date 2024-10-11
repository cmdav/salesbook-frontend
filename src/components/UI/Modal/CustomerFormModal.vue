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
      
      <!-- Form with JustValidate -->
      <form @submit.prevent="submitForm" class="max-w-4xl mx-auto p-4" id="customerForm">
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

        <!-- Dynamic Form Fields -->
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
            <!-- Error messages will be displayed below the input -->
            <div :id="field.databaseField + '-error'"></div>
          </div>
        </div>

        <button 
          type="submit" 
          class="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Submitting...' : 'Add' }}
        </button>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch,  nextTick } from 'vue';
import { useCustomerstore } from '@/stores/customers';
import { catchAxiosSuccess } from '@/services/Response';
import { isOnline } from '@/isOnline'; 
import { addCustomer } from '@/services/indexedDbService';
import { v4 as uuidv4 } from 'uuid';

const customerStore = useCustomerstore();
const emits = defineEmits(["close"]);

const customerType = ref('1');  // Default to 'Individual'
const isSubmitting = ref(false);  // Track form submission state
let validation;

// Form fields for individual and company customers
const individualFields = [
  { label: 'First Name', type: 'text', databaseField: 'first_name', placeholder: 'Enter first name', required: true, maxLength: 55 },
  { label: 'Last Name', type: 'text', databaseField: 'last_name', placeholder: 'Enter last name', required: true, maxLength: 55 },
  { label: 'Phone Number', type: 'text', databaseField: 'phone_number', placeholder: 'Enter phone number', required: true, maxLength: 15 },
  { label: 'Email', type: 'email', databaseField: 'email', placeholder: 'Enter email', required: true },
  { label: 'Address', type: 'text', databaseField: 'address', placeholder: 'Enter customer address', required: false, maxLength: 150 },
  { type: 'hidden', databaseField: 'type_id', value: 'individual' }
];

const companyFields = [
  { label: 'Company Name', type: 'text', databaseField: 'company_name', placeholder: 'Enter company name', required: true, maxLength: 55 },
  { label: 'Contact Person', type: 'text', databaseField: 'contact_person', placeholder: 'Enter contact person', required: true, maxLength: 55 },
  { label: 'Phone Number', type: 'text', databaseField: 'phone_number', placeholder: 'Enter phone number', required: true, maxLength: 15 },
  { label: 'Email', type: 'email', databaseField: 'email', placeholder: 'Enter email', required: true },
  { label: 'Address', type: 'text', databaseField: 'address', placeholder: 'Enter customer address', required: false, maxLength: 150 },
  { type: 'hidden', databaseField: 'type_id', value: 'company' }
];

// Dynamically switch between individual and company fields
const currentFormFields = computed(() => {
  return customerType.value === '1' ? individualFields : companyFields;
});

const formData = ref({});

// Watch customer type and reset form data when the type changes
const allFields = { '1': individualFields, '2': companyFields };
watch(customerType, async (newType) => {
  formData.value = {};  // Reset formData
  allFields[newType].forEach(field => {
    formData.value[field.databaseField] = field.value || '';
  });

  // Wait for the DOM to update before setting up validation
  await nextTick();

  // Dynamically set up validation after switching between Individual and Company
  setUpValidation();
}, { immediate: true });

// Set up validation for dynamically rendered fields
const setUpValidation = () => {
  // Reset validation instance to avoid adding rules multiple times
  if (validation) validation.destroy();

  validation = new window.JustValidate('#customerForm', {
    errorFieldCssClass: 'is-invalid',
    errorLabelCssClass: 'is-label-invalid',
  });

  if (customerType.value === '1') {
    // Validation for Individual fields
    validation
      .addField('#first_name', [
        { rule: 'required', errorMessage: 'First name is required' },
        { rule: 'maxLength', value: 55, errorMessage: 'First name cannot exceed 55 characters' },
      ])
      .addField('#last_name', [
        { rule: 'required', errorMessage: 'Last name is required' },
        { rule: 'maxLength', value: 55, errorMessage: 'Last name cannot exceed 55 characters' },
      ])
      .addField('#phone_number', [
        { rule: 'required', errorMessage: 'Phone number is required' },
        { rule: 'minLength', value: 11, errorMessage: 'Phone number must be at least 11 characters' },
        { rule: 'maxLength', value: 15, errorMessage: 'Phone number cannot exceed 15 characters' },
      ])
      .addField('#email', [
        { rule: 'required', errorMessage: 'Email is required' },
        { rule: 'email', errorMessage: 'Email is invalid' },
      ])
      .addField('#address', [
        { rule: 'maxLength', value: 150, errorMessage: 'Address cannot exceed 150 characters' },
      ]);
  } else {
    // Validation for Company fields
    validation
      .addField('#company_name', [
        { rule: 'required', errorMessage: 'Company name is required' },
        { rule: 'maxLength', value: 55, errorMessage: 'Company name cannot exceed 55 characters' },
      ])
      .addField('#contact_person', [
        { rule: 'required', errorMessage: 'Contact person is required' },
        { rule: 'maxLength', value: 55, errorMessage: 'Contact person cannot exceed 55 characters' },
      ])
      .addField('#phone_number', [
        { rule: 'required', errorMessage: 'Phone number is required' },
        { rule: 'minLength', value: 11, errorMessage: 'Phone number must be at least 11 characters' },
        { rule: 'maxLength', value: 15, errorMessage: 'Phone number cannot exceed 15 characters' },
      ])
      .addField('#email', [
        { rule: 'required', errorMessage: 'Email is required' },
        { rule: 'email', errorMessage: 'Email is invalid' },
      ])
      .addField('#address', [
        { rule: 'maxLength', value: 150, errorMessage: 'Address cannot exceed 150 characters' },
      ]);
  }

  // On validation failure
  validation.onFail((fields) => {
    console.error('Validation failed', fields);
  });

  // On validation success
  validation.onSuccess(async (event) => {
    console.log(event)
    // Form submission logic on successful validation
    isSubmitting.value = true;  // Disable the submit button and show "Submitting..."
    let response;
    const payload = { ...formData.value };

    try {
      const online = await isOnline();
      if (online) { 
        response = await customerStore.handleAddCustomer(payload);
      } else {
        payload.id = uuidv4();
        response = await addCustomer(payload);
      }

      catchAxiosSuccess(response);
      formData.value = {};
      emits('close');
    } catch (error) {
      console.error('Submission Failed:', error);
    } finally {
      isSubmitting.value = false;  // Re-enable the submit button after the submission is done
    }
  });
};
</script>






<style lang="scss" scoped>
.is-invalid {
  border-color: red;
}

.is-label-invalid {
  color: red;
}
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
  max-width: 600px;
  background-color: #fff;
  border-radius: 12px;
  animation: slidedown 0.8s ease;
  max-height: 90vh;
  overflow-y: auto;
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
