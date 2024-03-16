<template>
  <DashboardLayout pageTitle="Subcategory Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="product-sub-categories"
        :excludedKeys="['id', 'sub_category_id']"
        :additionalColumns="[
          { name: 'edit', action: handleEdit },
          { name: 'delete', action: handleDelete },
        ]"
      />
    </div>
    <FormModal
      v-if="showModal"
      @close="closeModal"
      :formTitle="'Add Product  Sub Category'"
    >
      <template v-slot:default>
        <form @submit.prevent="submitForm">
          <p v-if="isError" class="text-red-500">{{ errorMessage }}</p>
          <ReusableForm
            :fields="productSubCategoryFormFields"
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
      :url="'/product-sub-categories'"
      :modalTitle="modalTitle"
    />
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      :formField="productSubCategoryFormFields"
      :url="'/product-sub-categories'"
    />
  </DashboardLayout>
</template>

<script setup>
import { onMounted } from "vue";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
// import DataTableLayout from "@/components/Layouts/dataTableLayout.vue"; // read data
// import FormModal from "@/components/UI/Modal/FormModal.vue"; // show modal
// import ReusableForm from "@/components/Form/ReusableForm.vue"; // To create form
// import apiService from "@/services/apiService";
// import Loader from "@/components/UI/Loader.vue";
import DeleteModal from "@/components/UI/Modal/DeleteModal.vue";
// import { usePostComposable } from "@/composable/usePostComposable";
import { productSubCategoryFormFields } from "@/formfields/formFields";
// import { useEditDeleteComposable } from "@/composable/useEditDeleteComposable";
// const {handleEdit, handleDelete} = useEditDeleteComposable()
import { useDeleteComposable } from "@/composable/useDeleteComposable";
// import { useSelectComposable } from "@/composable/useSelectComposable";
//handles all component import
import { useSharedComponent } from "@/composable/useSharedComponent";
const {
  DataTableLayout,
  FormModal,
  ReusableForm,
  Loader,
  usePostComposable,
  useEditComposable,
  EditModal,
  useSelectComposable,
} = useSharedComponent();
// define other constant

// const {
//   showModal,
//   isLoadingMsg,
//   loading,
//   allError,
//   forceUpdate,
//   errorMessage,
//   isError,
//   closeModal,
//   submitForm,
// } = usePostComposable("/product-sub-categories", productSubCategoryFormFields);
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

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
} = usePostComposable("/product-sub-categories", productSubCategoryFormFields);
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable();
const { fetchDataForSelect } = useSelectComposable(productSubCategoryFormFields);

// Fetch data for select options on component mount
onMounted(async () => {
  await fetchDataForSelect("Category", "/product-categories", "id", "category_name");
});
</script>
