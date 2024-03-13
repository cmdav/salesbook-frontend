<template>
  <DashboardLayout>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Button to Open Modal -->
      <button @click="showModal = true" class="btn btn-primary">Add Product </button>
      <DataTableLayout
           :key="forceUpdate"
            endpoint="products"
            :excludedKeys="['id', 'product_description']"
            :clickableKeys="{'product_name': openProductDetailModal,'product_type': navigateToProductType}"
            :additionalColumns="[{ name: 'edit', action: handleEdit }, { name: 'delete', action: handleDelete }]"
            />
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="formTitle" >
      <template v-slot:default>
        
        <form  @submit.prevent="submitForm">
          <p v-if="isError" class="text-red-500">{{ errorMessage }}</p>
          <ReusableForm :fields="formFields"  @fetchDataForSubCategory="fetchDataForSubCategory" :isLoadingMsg="isOptionLoadingMsg" :allError="allError"/>
          <input type="submit"  v-if="!loading"  value="Submit" class="btn btn-primary mt-3">
          
                    <Loader v-else />
          
        </form>
      </template>
    </FormModal>
    <ViewModal  v-if="showViewModal"   @close="closeViewModal" :modalTitle="modalTitle" >
        <ViewModalDetail :products="products"/>
    </ViewModal>
  </DashboardLayout>
</template>



<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue"; // read data
import FormModal from "@/components/UI/FormModal.vue"; // show  form modal
import ViewModal from "@/components/UI/ViewModal.vue"; // show read modal
import ViewModalDetail from "@/components/UI/ViewModalDetail.vue"; 
import ReusableForm from "@/components/Form/ReusableForm.vue"  // To create form
import Loader from "@/components/UI/Loader.vue";

import { usePostComposable} from '@/composable/usePostComposable';
import { useSelectComposable} from '@/composable/useSelectComposable';
import { formFields } from '@/formfields/formFields';


const formTitle = "Add Product";
const modalTitle = "View Product";
const router = useRouter();
const url = '/all-product-sub-categories-by-category-id';
const products = ref();
const { showModal, showViewModal,loading, allError,forceUpdate,errorMessage,isError,closeModal,closeViewModal,submitForm}
       = usePostComposable('/products', formFields);

      // fetchDataForSubCategory is emitted
const { fetchDataForSelect, fetchDataForSubCategory,isOptionLoadingMsg} = useSelectComposable(formFields, url,"Category", "Sub Category", "sub_category_name"); 


const openProductDetailModal = (product) => {
  // console.log(product);
  products.value = product
  showViewModal.value = true;
 
};

const navigateToProductType = (product) => {
  
   router.push({ name: 'product-type', params: { id: product.id } });
};

const handleEdit = (product) => {
  console.log('Editing product', product);
};

const handleDelete = (product) => {
  // Your delete logic here
  console.log('Deleting product', product);
};

// Fetch data for select options on component mount
onMounted(async () => {

  await fetchDataForSelect('Measurement', '/measurements', 'id', 'measurement_name');
  await fetchDataForSelect('Category', '/product-categories', 'id', 'category_name');

});


</script>


