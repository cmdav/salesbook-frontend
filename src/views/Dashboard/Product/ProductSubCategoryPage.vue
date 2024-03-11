<template>
  <DashboardLayout>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Button to Open Modal -->
      <button @click="showModal = true" class="btn btn-primary">Add Sub Category</button>
      <DataTableLayout :key="forceUpdate" endpoint="product-sub-categories" />
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="formTitle" >
      <template v-slot:default>
        
        <form  @submit.prevent="submitForm">
          <p v-if="isError" class="text-red-500">{{ errorMessage }}</p>
          <ReusableForm :fields="productSubCategoryFormFields "  @fetchDataForSubCategory="fetchDataForSubCategory" :isLoadingMsg="isLoadingMsg" :allError="allError"/>
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
import { productSubCategoryFormFields } from '@/formfields/formFields';


const formTitle = "Add Product  Sub Category";

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
     } = usePostComposable('/product-sub-categories', productSubCategoryFormFields);


const fetchDataForSelect = async (field, endpoint, valueProp, labelProp) => {
  try {
    const response = await apiService.get(endpoint);
    const fieldObject = productSubCategoryFormFields.value.find(f => f.label === field);
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

  
  await fetchDataForSelect('Category', '/product-categories', 'id', 'category_name');

});


</script>


