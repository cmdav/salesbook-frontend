<template>
  <DashboardLayout pageTitle="Purchase page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="purchases"
        searchEndpoint="search-purchases"
        :additionalColumns=additionalColumns
      >
        <button class="btn-brand" @click="closeUploadModal">Upload</button>
      </DataTableLayout>
    </div>
    <FormModal
      v-if="showModal"
      @close="closeModal"
      :formTitle="'Add Purchase'"
      :fields="purchaseFormFields"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      @fieldChanged="checkDate"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/purchases'"
    >
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
import { onMounted, watch } from "vue";
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
  useStore,
  computed,
} = useSharedComponent('purchases');
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


const {   handleEdit,showEditModal, closeEditModal, items } = useEditComposable(emit);

const forceRefresh = () => {
  forceUpdate.value++;
};
const checkDate = (fieldDatabase, value) => {
  if (fieldDatabase === "expired_date") {
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part to compare only date parts

    if (selectedDate < today) {
      alert("Invalid date: Date cannot be in the past.");
      // Find the field and reset its value
      const expiredDateField = purchaseFormFields.value.find(field => field.databaseField === "expired_date");
      if (expiredDateField) {
        expiredDateField.value = ''; // Clear the input field
      }
    }
  }
  

}
// Call this function whenever the related fields change.
watch(() =>
 purchaseFormFields.value.find((field) => field.databaseField === "expired_at")?.value,
  checkDate
);

const store = useStore();
const permissions = computed(() => {
    
    return  store.getUser.user.permission.permissions.find(p => p.page_name === "measurements");
 })

const additionalColumns = computed(() => {
    const cols = [];
    if (permissions.value?.update) {
      cols.push({ name: 'Edit', action: handleEdit });
    }
    if (permissions.value?.del) {
      cols.push({ name: 'Delete', action: handleDelete });
    }
    return cols;
  });

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
