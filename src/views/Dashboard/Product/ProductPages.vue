<template>
  <DashboardLayout>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Button to Open Modal -->
      <button @click="showModal = true" class="btn btn-primary">Add Product </button>
      <DataTableLayout
           :key="forceUpdate"
            endpoint="products"
            :clickableKeys="{'product_name': navigateToProductDetail,'product_type': navigateToProductType}"
            :additionalColumns="[{ name: 'edit', action: handleEdit }, { name: 'delete', action: handleDelete }]"
            />
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="formTitle" >
      <template v-slot:default>
        
        <form  @submit.prevent="submitForm">
          <p v-if="isError" class="text-red-500">{{ errorMessage }}</p>
          <ReusableForm :fields="formFields"  @fetchDataForSubCategory="fetchDataForSubCategory" :isLoadingMsg="isLoadingMsg" :allError="allError"/>
          <input type="submit"  v-if="!loading"  value="Submit" class="btn btn-primary mt-3">
          
                    <Loader v-else />
          
        </form>
      </template>
    </FormModal>
    
  </DashboardLayout>
</template>



<script setup>
import { onMounted } from 'vue';
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue"; // read data
import FormModal from "@/components/UI/FormModal.vue"; // show modal
import ReusableForm from "@/components/Forms/ReusableForm.vue";  // To create form
import apiService from '@/services/apiService';
import Loader from "@/components/UI/Loader.vue";

import { usePostComposable} from '@/composable/usePostComposable';
import { formFields } from '@/formfields/formFields';


const formTitle = "Add Product";

const { 
    
     showModal, 
     isLoadingMsg,
     loading, 
     allError,
     forceUpdate,
     errorMessage, 
     isError,  
     closeModal, 
     submitForm
     } = usePostComposable('/products', formFields);


const navigateToProductDetail = (product) => {
  console.log(product);
 // router.push({ name: 'product-detail', params: { id: product.id } });
};

const navigateToProductType = (product) => {
  console.log(product);
};

const handleEdit = (product) => {
  console.log('Editing product', product);
};

const handleDelete = (product) => {
  // Your delete logic here
  console.log('Deleting product', product);
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


