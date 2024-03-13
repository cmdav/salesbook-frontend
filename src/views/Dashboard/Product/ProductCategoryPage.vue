<template>
  <DashboardLayout>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div
        class="px-5 py-2 mt-8 border-b-2 border-gray-200 flex justify-end bg-gray-100 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider"
      >
        <button @click="showModal = true" class="btn-brand">Add Product Category</button>
      </div>
      <DataTableLayout :key="forceUpdate" endpoint="product-categories" />
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="formTitle">
      <template v-slot:default>
        <form @submit.prevent="submitForm">
          <p v-if="isError" class="text-red-500">{{ errorMessage }}</p>
          <ReusableForm
            :fields="productCategoryFormFields"
            :isLoadingMsg="isLoadingMsg"
            :allError="allError"
          />
          <input
            type="submit"
            v-if="!loading"
            value="Submit"
            class="btn btn-primary mt-3"
          />

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
import ReusableForm from "@/components/Form/ReusableForm.vue"; // To create form
//import apiService from '@/services/apiService';
import Loader from "@/components/UI/Loader.vue";

import { usePostComposable } from "@/composable/usePostComposable";
import { productCategoryFormFields } from "@/formfields/formFields";

const formTitle = "Add  Product Category";

const {
  showModal,
  isLoadingMsg,
  loading,
  allError,
  forceUpdate,
  errorMessage,
  isError,
  closeModal,
  submitForm,
} = usePostComposable("/product-categories", productCategoryFormFields);
</script>
