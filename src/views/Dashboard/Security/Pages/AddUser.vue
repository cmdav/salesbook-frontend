<template>
  <!-- <DashboardLayout pageTitle="Roles Page"> -->
  <div class="">
    <!-- Button to Open Modal -->
    <!-- <button @click="showModal = true" class="btn btn-primary">Add Store</button> -->

    <DataTableLayout 
      :key="forceUpdate"
       @toggleModal="showModal = !showModal" 
       :endpoint="url" :pageName="'settings'"
      searchEndpoint="search-users" 
      :additionalColumns=additionalColumns>
      <!-- <button class="btn-brand" @click="closeUploadModal">Upload</button> -->
    </DataTableLayout>

    <DeleteModal v-if="showDeleteModal" @close="closeDeleteModal" @updated="forceRefresh" :items="itemsId"
      :url="'/users'" :modalTitle="modalTitle" />

    <!-- <SettingsLayoutcopy @changePage="changePage" :products="allUser">
      <button class="btn-
      brand !px-2 !text-[14px]" @click="toggleAddPermissionModal">
        Add  User
      </button>
    </SettingsLayoutcopy> -->
    <!-- <PermissionFormModalcopy v-if="showModal" @close="toggleAddPermissionModal" /> -->
    <FormModal 
        v-if="showModal"
         @close="closeModal"
        :key="forceUpdate" 
        :formTitle="'Add User'"
         :fields="userFormFields"
      @fetchDataForSubCategory="fetchDataForSubCategory" 
      :isLoadingMsg="isOptionLoadingMsg" :url="'sale-users'">
    </FormModal>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { userFormFields } from "@/formfields/formFields";
import { useSharedComponent } from "@/composable/useSharedComponent";

const { 
  useSelectComposable, 
  DataTableLayout, 
  usePostComposable, 
  useStore, 
  DeleteModal, 
  useDeleteComposable, 
  FormModal, 
  computed 
} = useSharedComponent("sale-users");

const modalTitle = "user_name ";
const url = ref("users?type=sales_personnel");

const { fetchDataForSelect, fetchDataForSubCategory, isOptionLoadingMsg, }
  = useSelectComposable(userFormFields, 'users', 'branch_id', "role_id", "", "");


const { showModal, forceUpdate, closeModal } = usePostComposable("/settings", userFormFields);
const store = useStore();
const roles = computed(() => {

  return store.getUser.user.permission.role_name === "Admin";
})

const additionalColumns = computed(() => {
  const cols = [];
  if (roles.value) {
    cols.push({ name: 'Delete', action: handleDelete });
  }
  return cols;
})

const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal
} = useDeleteComposable();

// const toggleAddPermissionModal = async () => {
//   showModal.value = !showModal.value;
// };

const forceRefresh = () => {
  forceUpdate.value++;
};

onMounted(async () => {

  await fetchDataForSelect("Role", "/all-job-roles", "id", "role_name");
});
</script>
