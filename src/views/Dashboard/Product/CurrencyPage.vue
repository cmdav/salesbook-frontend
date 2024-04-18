<template>
  <DashboardLayout pageTitle="Currency Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="currencies"
        searchEndpoint="search-currency"
        :additionalColumns=additionalColumns
      >
        <button class="btn-brand" @click="closeUploadModal">Upload</button>
      </DataTableLayout>
    </div>
    <FormModal
      v-if="showModal"
      @close="closeModal"
      :formTitle="'Add Currency'"
      :fields="currenciesFormFields"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/currencies'"
    >
    </FormModal>
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemsId"
      :url="'/currencies'"
      :modalTitle="modalTitle"
    />
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      @updated="forceRefresh"
      :items="items"
      :formField="currenciesFormFields"
      :url="'currencies'"
    />
    <UploadModal
      v-if="showUploadModal"
      @close="closeUploadModal"
      @updated="forceRefresh"
      :url="'/currencies'"
      type="Currency"
    />
  </DashboardLayout>
</template>

<script setup>
import { currenciesFormFields } from "@/formfields/formFields";
const modalTitle = "currency_name";

import { useSharedComponent } from "@/composable/useSharedComponent";

const {
  DataTableLayout,
  FormModal,
  usePostComposable,
  useEditComposable,
  DeleteModal,
  EditModal,
  useDeleteComposable,
  UploadModal,
  useUploadComposable,
  useStore,
  computed,

} = useSharedComponent('currencies');
const { showUploadModal, closeUploadModal } = useUploadComposable();

const { showModal, forceUpdate, closeModal } = usePostComposable(
  "/currencies",
  currenciesFormFields
);

const {  handleEdit, showEditModal, closeEditModal, items } = useEditComposable();
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

//This trigger a page refresh
const forceRefresh = () => {
  forceUpdate.value++;
};

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
</script>
