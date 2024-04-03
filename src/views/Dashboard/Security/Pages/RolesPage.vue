<template>
  <!-- <DashboardLayout pageTitle="Roles Page"> -->
  <div class="">
    <!-- Button to Open Modal -->
    <!-- <button @click="showModal = true" class="btn btn-primary">Add Store</button> -->
    <DataTableLayout
      @toggleModal="showModal = !showModal"
      :hideToggleButtonLabel="false"
      :key="forceUpdate"
      endpoint="job-roles"
      :additionalColumns="[{ name: 'delete', action: handleDelete }]"
    >
      <button class="btn-brand" @click="closeUploadModal">Upload</button>
    </DataTableLayout>
    <FormModal
      v-if="showModal"
      @close="closeModal"
      :formTitle="'Add Purchase'"
      :fields="purchaseFormFields"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/job-roles'"
    ></FormModal>

    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemsId"
      :url="'/job-roles'"
      :modalTitle="modalTitle"
    />
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      :formField="purchaseFormFields"
      @updated="forceRefresh"
      :url="'/job-roles'"
    />
  </div>

  <!-- </DashboardLayout> -->
</template>

<script setup>
//import { onMounted } from 'vue';

import { useSharedComponent } from "@/composable/useSharedComponent";
const emit = defineEmits("forceRefresh");
import { purchaseFormFields } from "@/formfields/formFields";

const {
  DataTableLayout,
  FormModal,
  usePostComposable,
  useEditComposable,
  EditModal,
  DeleteModal,
  useDeleteComposable,
  defineEmits,
} = useSharedComponent();
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);
const { showModal, forceUpdate, closeModal } = usePostComposable(
  "/purchases",
  purchaseFormFields
);

const forceRefresh = () => {
  forceUpdate.value++;
};
// Fetch data for select options on component mount

//const formTitle = "Add Store";

// const {
//   showModal,

// } = usePostComposable("/stores", cu);
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();
</script>
