<template>
  <DashboardLayout pageTitle="Produc Category Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="product-categories"
        :additionalColumns="[
          { name: 'edit', action: handleEdit },
          { name: 'delete', action: handleDelete },
        ]"
      />
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="'Add Product Category'">
      <template v-slot:default>
        <form @submit.prevent="submitForm">
          <p v-if="isError" class="text-red-500">{{ errorMessage }}</p>
          <ReusableForm
            :fields="productCategoryFormFields"
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

    <!-- <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      :formField="productCategoryFormFields"
      :url="'/product-categories'"
      :modalTitle="modalTitle" -->
    <!-- /> -->
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      :items="itemsId"
      :url="'/product-categories'"
      :modalTitle="modalTitle"
    />
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      @updated="forceRefresh"
      :formField="productCategoryFormFields"
      :url="'/product-categories'"
    />
  </DashboardLayout>
</template>

<script setup>

import { productCategoryFormFields } from "@/formfields/formFields";
const modalTitle = "category_name";
import { useSharedComponent } from "@/composable/useSharedComponent";

const { DataTableLayout, FormModal,ReusableForm,Loader, usePostComposable, useEditComposable,EditModal,DeleteModal,
    useDeleteComposable,defineEmits} = useSharedComponent();

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
const emit = defineEmits("forceRefresh")
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);
const forceRefresh = () => {

forceUpdate.value = !forceUpdate.value; 

};
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();
</script>
