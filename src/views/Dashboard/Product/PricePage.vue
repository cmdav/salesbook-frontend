<template>
  <DashboardLayout>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Back Button -->
      <button @click="goBack" class="btn btn-secondary mb-3">Back to Products |</button>
      
      <!-- Button to Open Modal -->
      <button @click="showModal = true" class="btn btn-primary">Add Price</button>
      
      <DataTableLayout 
        :key="forceUpdate" 
        :endpoint="computedEndpoint" 
        :excludedKeys="['id','product_type_id']"
       
      />
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="formTitle" >
      <template v-slot:default>
        <form @submit.prevent="submitForm">
          <p v-if="isError" class="text-red-500">{{ errorMessage }}</p>
          <ReusableForm :fields="priceFormFields" :isLoadingMsg="isLoadingMsg" :allError="allError"/>
          <input type="submit" v-if="!loading" value="Submit" class="btn btn-primary mt-3">
          <Loader v-else />
        </form>
      </template>
    </FormModal>
  </DashboardLayout>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue";
import FormModal from "@/components/UI/FormModal.vue";
import ReusableForm from "@/components/Form/ReusableForm.vue";
import Loader from "@/components/UI/Loader.vue";
import { usePostComposable } from '@/composable/usePostComposable';
import { useSelectComposable } from '@/composable/useSelectComposable';
import { priceFormFields } from '@/formfields/formFields';


const router = useRouter();
const route = useRoute();
const formTitle = "Add Price";
const productTypeId = ref(route.params.id); 

const fieldOverrides = {
   product_type_id: productTypeId.value, 
};

const { fetchDataForSelect } = useSelectComposable(priceFormFields); 

const { showModal,isLoadingMsg,loading,allError,forceUpdate, errorMessage, isError, closeModal, submitForm}
       = usePostComposable(productTypeId.value ? `get-price-by-product-type/${productTypeId.value}` : 'prices', priceFormFields, 'prices',fieldOverrides);


const computedEndpoint = computed(() => {
  return productTypeId.value ? `get-price-by-product-type/${productTypeId.value}` : 'prices';
});


const goBack = () => {
  router.push({ name: 'products' });
};
// Fetch data for select options on component mount
onMounted(async () => {

await fetchDataForSelect('Currency Name', '/currencies', 'id', 'currency_name');

});
</script>
