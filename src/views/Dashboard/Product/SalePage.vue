<template>
  <DashboardLayout pageTitle="Sales Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="sales"
        :additionalColumns="[
          { name: 'edit', action: handleEdit },
          { name: 'delete', action: handleDelete },
        ]"
      />
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="formTitle">
      <template v-slot:default>
        <form @submit.prevent="submitForm">
          <p v-if="isError" class="text-red-500">{{ errorMessage }}</p>
          <ReusableForm
            :fields="saleFormFields"
            :isLoadingMsg="isLoadingMsg"
            :allError="allError"
          />
          <div class="flex justify-center items-center">
            <input type="submit" v-if="!loading" value="Submit" class="btn-brand mt-3" />

            <Loader v-else />
          </div>
        </form>
      </template>
    </FormModal>
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      :items="itemsId"
      :url="'/sales'"
      :modalTitle="modalTitle"
    />
  </DashboardLayout>
</template>

<script setup>
import { onMounted } from "vue";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue"; // read data
import FormModal from "@/components/UI/Modal/FormModal.vue"; // show modal
import ReusableForm from "@/components/Form/ReusableForm.vue"; // To create form
//import apiService from '@/services/apiService';
import Loader from "@/components/UI/Loader.vue";
import { useSelectComposable } from "@/composable/useSelectComposable";
import { usePostComposable } from "@/composable/usePostComposable";
import { saleFormFields } from "@/formfields/formFields";
import { useDeleteComposable } from "@/composable/useDeleteComposable";
import DeleteModal from "@/components/UI/Modal/DeleteModal.vue";

const url = "/all-price-by-product-type";
const { fetchDataForSelect } = useSelectComposable(saleFormFields, url);
// import { useEditDeleteComposable } from "@/composable/useEditDeleteComposable";
// const {handleEdit, handleDelete} = useEditDeleteComposable()

const formTitle = "Add Sale";

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
} = usePostComposable("/sales", saleFormFields);
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

onMounted(async () => {
  await fetchDataForSelect(
    "Product Type",
    "/all-product-type-name",
    "id",
    "product_type"
  );
  await fetchDataForSelect("Customer", "/user-detail", "id", "customer_id");
});
</script>
