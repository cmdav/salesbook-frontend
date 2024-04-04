<template>
  <!-- <DashboardLayout pageTitle="Roles Page"> -->
  <div class="">
    <!-- Button to Open Modal -->
    <!-- <button @click="showModal = true" class="btn btn-primary">Add Store</button> -->
    <SettingsLayoutcopy @changePage="changePage" :products="permissions">
      <button class="btn-brand !px-2 !text-[14px]" @click="toggleAddPermissionModal">
        Add Permission
      </button>
    </SettingsLayoutcopy>
    <PermissionFormModalcopy v-if="showModal" @close="toggleAddPermissionModal" />
    <!-- <SettingsLayout
      :key="forceUpdate"
      endpoint="permissions"
      :additionalColumns="[{ name: 'delete', action: handleDelete }]"
      :hideToggleButtonLabel="false"
    >
      <button class="btn-brand !px-2 !text-[14px]" @click="toggleAddPermissionModal">
        Add Permission
      </button>
    </SettingsLayout> -->

    <!-- <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      :items="itemsId"
      :url="'/permissions'"
      :modalTitle="modalTitle"
    /> -->
  </div>
  <!-- <FormModal
    v-if="showModal"
    @close="closeModal"
    :formTitle="'Add User Role'"
    :fields="permissionFormFields"
    @fetchDataForSubCategory="fetchDataForSubCategory"
    :isLoadingMsg="isOptionLoadingMsg"
    :url="'/permissions'"
  ></FormModal> -->
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useSecurityStore } from "@/stores/security";
const securityStore = useSecurityStore();
const { allRoles, allPages, roles, pages, permissions } = storeToRefs(securityStore);

import SettingsLayoutcopy from "@/components/Layouts/settingsLayoutcopy.vue";
import PermissionFormModalcopy from "@/components/UI/Modal/PermissionFormModalcopy.vue";
const changePage = async (link) => {
  try {
    await securityStore.handleGetPermissions(link);
  } catch (error) {
    //
  }
};
const showModal = ref(false);
const toggleAddPermissionModal = async () => {
  showModal.value = !showModal.value;
};
// import { useSharedComponent } from "@/composable/useSharedComponent";
// import { permissionFormFields } from "@/formfields/formFields";

// const {
//   DataTableLayout,
//   SettingsLayout,
//   usePostComposable,
//   DeleteModal,
//   FormModal,
//   useDeleteComposable,
//   useSelectComposable,
// } = useSharedComponent();
// const { showModal, forceUpdate, closeModal } = usePostComposable(
//   "/permissions",
//   permissionFormFields
// );
// const {
//   fetchDataForSelect,
//   fetchDataForSubCategory,
//   isOptionLoadingMsg,
// } = useSelectComposable();
// onMounted(async () => {
//   await fetchDataForSelect(
//     "Select Page",
//     "/all-pages",
//     "page_id",
//     "page_name",
//     permissionFormFields.value
//   );
//   await fetchDataForSelect(
//     "User Role",
//     "/all-job-roles",
//     "role_id",
//     "role_name",
//     permissionFormFields.value
//   );
// });
// const toggleAddPermissionModal = async () => {
//   showModal.value = !showModal.value;
//   await fetchDataForSelect(
//     "Select Page",
//     "/all-pages",
//     "page_id",
//     "page_name",
//     permissionFormFields.value
//   );
//   await fetchDataForSelect(
//     "User Role",
//     "/all-job-roles",
//     "role_id",
//     "role_name",
//     permissionFormFields.value
//   );
// };

//const formTitle = "Add Store";

// const {
//   showModal,

// } = usePostComposable("/stores", cu);
// const {
//   handleDelete,
//   showDeleteModal,
//   itemsId,
//   closeDeleteModal,
// } = useDeleteComposable();
onMounted(async () => {
  try {
    await securityStore.handleGetAllRole();
    await securityStore.handleGetRole();
    await securityStore.handleGetPages();
    await securityStore.handleGetAllPages();
    await securityStore.handleGetPermissions();
    // await securityStore.handleAddPermissions();
  } catch (error) {
    console.error(error);
  }
});
</script>
