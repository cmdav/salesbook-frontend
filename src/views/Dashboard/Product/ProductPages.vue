<template>
  <DashboardLayout>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Button to Open Modal -->
      <button @click="showModal = true" class="btn btn-primary">Add Product</button>
      <DataTableLayout endpoint="products" />
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="formTitle">
      <template v-slot:default>
        <form  @submit.prevent="submitForm">
          <ReusableForm :fields="formFields"  @fetchDataForSubCategory="fetchDataForSubCategory" :isLoadingMsg="isLoadingMsg"/>
          <input type="submit" value="Submit" class="btn btn-primary mt-3">
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
//import { useDataTable} from '@/composable/useDataTable';

let showModal = ref(false);
let isLoadingMsg = ref(" ");
const formTitle = "Add Product";
//use composable
// const { fetchPage } = useDataTable();

const formFields = ref([
  { label: 'Product Name', type: 'text', value: 'a', required: true, placeholder: 'Enter product name' , databaseField:"product_name"},
  { label: 'Product Description', type: 'textarea', value: 'b', required: false, placeholder: 'Enter product description', databaseField:"product_description" },
  { label: 'Product Image', type: 'image', value: '', required: false, placeholder: 'Enter image URL', databaseField:"product_image" },
  { label: 'Measurement', type: 'select', value: '', required: true, placeholder: 'Select Measurement', options: [], databaseField:"measurement_id"},
  { label: 'Category',  type: 'select', value: '', required: true, placeholder: 'Enter category ',  options: [], databaseField:"category_id"},
  { label:'Sub Category', type: 'select', value: '', required: true, placeholder: 'Select Sub category', options: [], showLoading: true, databaseField:"sub_category_id"},
  // { label: 'Sex', type: 'select', value: '', required: true, placeholder: 'Enter category ', options: ['male', 'female'] }
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


const submitForm = async () => {
  try {
    const formData = new FormData();

    // Append other form fields to FormData
    formFields.value.forEach(field => {
      formData.append(field.databaseField, field.value);
    });

    // Append file data to FormData
    const fileField = formFields.value.find(field => field.databaseField === 'product_image');
    if (fileField && fileField.value instanceof File) {
      formData.append('product_image', fileField.value);
    }

    // Submit FormData to the server
    const response = await apiService.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Set the content type to multipart/form-data
      }
    });
    
    console.log(response);
    //await fetchPage("/products", 1);
  } catch (error) {
    console.error('Error submitting form:', error);
  }
  showModal.value = false;
};


// Fetch data for select options on component mount
onMounted(async () => {

  await fetchDataForSelect('Measurement', '/measurements', 'id', 'measurement_name');
  await fetchDataForSelect('Category', '/product-categories', 'id', 'category_name');

});
</script>


