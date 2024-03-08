<template>
  <DashboardLayout>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Button to Open Modal -->
      <button @click="showModal = true" class="btn btn-primary">Add Product</button>
      <DataTableLayout endpoint="products" />
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="formTitle">
      <template v-slot:default>
        <form>
          <ReusableForm :fields="formFields"  @fetchDataForSubCategory="fetchDataForSubCategory" :isLoadingMsg="isLoadingMsg"/>
        </form>
      </template>
    </FormModal>
  </DashboardLayout>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue";
import FormModal from "@/components/UI/FormModal.vue";
import ReusableForm from "@/components/Forms/ReusableForm.vue"; 
import apiService from '@/services/apiService';

let showModal = ref(false);
let isLoadingMsg = ref(" ");
const formTitle = "Add Product";

const formFields = ref([
  { label: 'Product Name', type: 'text', value: '', required: true, placeholder: 'Enter product name' },
  { label: 'Product Description', type: 'textarea', value: '', required: false, placeholder: 'Enter product description' },
  { label: 'Product Image', type: 'image', value: '', required: false, placeholder: 'Enter image URL' },
  { label: 'Measurement', type: 'select', value: '', required: true, placeholder: 'Select Measurement', options: []},
  { label: 'Category',  type: 'select', value: '', required: true, placeholder: 'Enter category ',  options: []},
  { label:'Sub Category', type: 'select', value: '', required: true, placeholder: 'Select Sub category', options: [], showLoading: true},
  { label: 'Sex', type: 'select', value: '', required: true, placeholder: 'Enter category ', options: ['male', 'female'] }
]);

const closeModal = () => {
  showModal.value = false;
};

const fetchDataForSubCategory = async (value, label) => {
  if (label === 'Category') {
    isLoadingMsg.value = "Please wait";
    try {
      const response = await apiService.get(`/all-product-sub-categories-by-category-id/${value}`);
      //locate the sub category form field
      const subCategoryField = formFields.value.find(field => field.label === 'Sub Category');
      if (subCategoryField) {
        
        if (response.length === 0) {
          // If response is empty, set options for "Sub Category" dropdown to include just "No Subcategory"
          subCategoryField.options = [{ value: '', label: 'No Subcategory' }];
        } else {
          // If response is not empty, map response data to options for "Sub Category" dropdown
          subCategoryField.options = [
               { value: '', label: 'Select an option', disabled: true },
               ...response.map(item => ({ value: item.id, label: item.sub_category_name }))
           ]
        }
        isLoadingMsg.value= "";

      } else {

        console.error("Sub Category field not found.");
        isLoadingMsg.value= "Some went wrong. Try again";

      }
    } catch (error) {

      console.error('Error fetching data:', error);
      isLoadingMsg.value= "Some went wrong. Try again";
    }
  }
};





const fetchDataForSelect = async (field, endpoint, valueProp, labelProp) => {
  try {
    const response = await apiService.get(endpoint);
    const fieldObject = formFields.value.find(f => f.label === field);
    if (fieldObject) {
      fieldObject.options = [
        { value: '', label: 'Select an option', disabled: true },
        ...response.map(item => ({ value: item[valueProp], label: item[labelProp] }))
      ];

    } else {
      console.error(`Field with label '${field}' not found.`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};



// Fetch data for select options on component mount
onMounted(async () => {

  await fetchDataForSelect('Measurement', '/measurements', 'id', 'measurement_name');
  await fetchDataForSelect('Category', '/product-categories', 'id', 'category_name');

});
</script>


