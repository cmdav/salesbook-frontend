<template>
  <DashboardLayout>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Button to Open Modal -->
      <button @click="showModal = true" class="btn btn-primary">Add Measurement</button>
      <DataTableLayout :key="forceUpdate" endpoint="measurements" />
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="formTitle" >
      <template v-slot:default>
        
        <form  @submit.prevent="submitForm">
          <p v-if="isError" class="text-red-500">{{ errorMessage }}</p>
          <ReusableForm :fields="measurementFormFields" :isLoadingMsg="isLoadingMsg" :allError="allError"/>
          <input type="submit"  v-if="!loading"  value="Submit" class="btn btn-primary mt-3">
          
                    <Loader v-else />
          
        </form>
      </template>
    </FormModal>
    
  </DashboardLayout>
</template>



<script setup>
//import { onMounted } from 'vue';
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue"; // read data
import FormModal from "@/components/UI/FormModal.vue"; // show modal
import ReusableForm from "@/components/Form/ReusableForm.vue"  // To create form
//import apiService from '@/services/apiService';
import Loader from "@/components/UI/Loader.vue";

import { usePostComposable} from '@/composable/usePostComposable';
import { measurementFormFields } from '@/formfields/formFields';


const formTitle = "Add Measurement";

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
     } = usePostComposable('/measurements', measurementFormFields);

</script>


