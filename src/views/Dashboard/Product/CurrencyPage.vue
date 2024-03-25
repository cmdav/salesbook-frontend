<template>
  <DashboardLayout pageTitle="Currency Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="currencies"
        searchEndpoint="search-currency"
        :additionalColumns="[
          { name: 'edit', action: handleEdit },
          { name: 'delete', action: handleDelete },
        ]"
      />
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
} = useSharedComponent();

const { showModal, forceUpdate, closeModal } = usePostComposable(
  "/currencies",
  currenciesFormFields
);

const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable();
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
</script>
