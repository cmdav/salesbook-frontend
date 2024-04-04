<template>
  <!-- <DashboardLayout pageTitle="Roles Page"> -->
  <div class="">
    <!-- Button to Open Modal -->
    <!-- <button @click="showModal = true" class="btn btn-primary">Add Store</button> -->
    <SettingsLayout
      :key="forceUpdate"
      endpoint="permissions"
      :additionalColumns="[{ name: 'delete', action: handleDelete }]"
      :hideToggleButtonLabel="false"
    >
      <button class="btn-brand !px-2 !text-[14px]" @click="toggleAddPermissionModal">
        Add Permission
      </button>
    </SettingsLayout>

    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      :items="itemsId"
      :url="'/permissions'"
      :modalTitle="modalTitle"
    />
  </div>
  <FormModal
    v-if="showModal"
    @close="closeModal"
    :formTitle="'Add User Role'"
    :fields="permissionFormFields"
    @fetchDataForSubCategory="fetchDataForSubCategory"
    :isLoadingMsg="isOptionLoadingMsg"
    :url="'/permissions'"
  ></FormModal>

  <!-- <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      :items="itemsId"
      :url="'stores'"
      :modalTitle="modalTitle"
    /> -->
  <!-- </DashboardLayout> -->
</template>

<script setup>
import { onMounted } from "vue";

import { useSharedComponent } from "@/composable/useSharedComponent";
import { permissionFormFields } from "@/formfields/formFields";

const {
  DataTableLayout,
  SettingsLayout,
  usePostComposable,
  DeleteModal,
  FormModal,
  useDeleteComposable,
  useSelectComposable,
} = useSharedComponent();
const { showModal, forceUpdate, closeModal } = usePostComposable(
  "/permissions",
  permissionFormFields
);
const {
  fetchDataForSelect,
  fetchDataForSubCategory,
  isOptionLoadingMsg,
} = useSelectComposable();
onMounted(async () => {
  await fetchDataForSelect(
    "Select Page",
    "/all-pages",
    "page_id",
    "page_name",
    permissionFormFields.value
  );
  await fetchDataForSelect(
    "User Role",
    "/all-job-roles",
    "role_id",
    "role_name",
    permissionFormFields.value
  );
});
const toggleAddPermissionModal = async () => {
  showModal.value = !showModal.value;
  await fetchDataForSelect(
    "Select Page",
    "/all-pages",
    "page_id",
    "page_name",
    permissionFormFields.value
  );
  await fetchDataForSelect(
    "User Role",
    "/all-job-roles",
    "role_id",
    "role_name",
    permissionFormFields.value
  );
};

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
