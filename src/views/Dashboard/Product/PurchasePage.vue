<template>
  <DashboardLayout pageTitle="Purchase page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="purchases"
        searchEndpoint="search-purchases"
        :additionalColumns="[
          { name: 'edit', action: handleEdit },
          { name: 'delete', action: handleDelete },
        ]"
      >
        <button class="btn-brand" @click="closeUploadModal">Upload</button>
      </DataTableLayout>
    </div>
<<<<<<< HEAD
    <FormModal v-if="showModal" @close="closeModal" :formTitle="'Add Purchase'" 
              :fields="purchaseFormFields"  
               @fetchDataForSubCategory="fetchDataForSubCategory"
               :isLoadingMsg="isOptionLoadingMsg"
               :url ="'purchases'"
               >
=======
    <FormModal
      v-if="showModal"
      @close="closeModal"
      :formTitle="'Add Purchase'"
      :fields="purchaseFormFields"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/purchases'"
    >
>>>>>>> main
    </FormModal>
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
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
      :url="'purchases'"
    />
    <UploadModal
      v-if="showUploadModal"
      @close="closeUploadModal"
      @updated="forceRefresh"
      :url="'/purchases'"
      type="Purchase"
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
  usePostComposable,
  useEditComposable,
  EditModal,
  useSelectComposable,
  DeleteModal,
  useDeleteComposable,
  defineEmits,
  UploadModal,
  useUploadComposable,
} = useSharedComponent();
const { showUploadModal, closeUploadModal } = useUploadComposable();

const url = "/all-price-by-product-type";
const emit = defineEmits("forceRefresh");

const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();
const {
  fetchDataForSelect,
  fetchDataForSubCategory,
  isOptionLoadingMsg,
} = useSelectComposable(purchaseFormFields, url, "Product Type", "Price", "cost_price");
const { showModal, forceUpdate, closeModal } = usePostComposable(
  "/purchases",
  purchaseFormFields
);
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);

const forceRefresh = () => {
  forceUpdate.value++;
};
// Fetch data for select options on component mount
onMounted(async () => {
  await fetchDataForSelect(
    "Product Type",
    "/all-product-type-name",
    "id",
    "product_type_name"
  );
});
</script>
