<template>
  <DashboardLayout pageTitle="Purchase page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="purchases"
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
            :fields="purchaseFormFields"
            @fetchDataForSubCategory="fetchDataForSubCategory"
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
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      :items="itemsId"
      :url="'purchases'"
      :modalTitle="modalTitle"
    />
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      :formField="purchaseFormFields"
      @updated="forceRefresh"
      :url="'/purchases'"
    />
  </DashboardLayout>
</template>

<script setup>
import { onMounted } from "vue";
import { purchaseFormFields } from "@/formfields/formFields";

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
  DeleteModal,
  useDeleteComposable,
  defineEmits
} = useSharedComponent();

const formTitle = "Add purchase";
const url = "/all-price-by-product-type";
const emit = defineEmits("forceRefresh")


const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();
const { fetchDataForSelect, fetchDataForSubCategory } = useSelectComposable(
  purchaseFormFields,
  url,
  "Product Type",
  "Price",
  "cost_price"
);
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
} = usePostComposable("/purchases", purchaseFormFields);
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);

const forceRefresh = () => {

forceUpdate.value = !forceUpdate.value; 

};
// Fetch data for select options on component mount
onMounted(async () => {
  await fetchDataForSelect(
    "Product Type",
    "/all-product-type-name",
    "id",
    "product_type"
  );
});
</script>
