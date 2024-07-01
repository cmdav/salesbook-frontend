<template>
  <!-- <DashboardLayout pageTitle="Roles Page"> -->
  <div class="">
    <!-- Button to Open Modal -->
    <!-- <button @click="showModal = true" class="btn btn-primary">Add Store</button> -->

    <DataTableLayout 
      :key="forceUpdate"
       @toggleModal="showModal = !showModal" 
       :endpoint="endpoint" 
       :pageName="'settings'"
       toggleButtonLabel="Add User"
       :excludedKeys="['id', 'organization_code' ]"
      searchEndpoint="search-users" 
      :additionalColumns=additionalColumns
      :data="data"
      :errorMessage="errorMessage"
      >
       <div>
              <BranchDropDown :branches="branches" @change="handleBranchChange" />
            </div>
      <!-- <button class="btn-brand" @click="closeUploadModal">Upload</button> -->
    </DataTableLayout>

    <DeleteModal v-if="showDeleteModal" @close="closeDeleteModal" @updated="forceRefresh" :items="itemsId"
      :url="'/users'" :modalTitle="modalTitle" />

    <FormModal 
        v-if="showModal"
         @close="closeModal"
        :key="forceUpdate" 
        :formTitle="'Add User'"
         :fields="userFormFields"
      @fetchDataForSubCategory="fetchDataForSubCategory" 
      :isLoadingMsg="isOptionLoadingMsg" 
      :url="'sale-users'">
    </FormModal>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { userFormFields } from "@/formfields/formFields";
import { useSharedComponent } from "@/composable/useSharedComponent";
import BranchDropDown from '@/components/UI/Dropdown/BranchDropDown.vue';
import apiService from '@/services/apiService';

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
const endpoint = ref("users?type=sales_personnel");

const { fetchDataForSelect, fetchDataForSubCategory, isOptionLoadingMsg, }
  = useSelectComposable(userFormFields, 'users', "role_id", "", "branch_id" );


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

const branches = ref([]);
const selectedBranchId = ref(null);
const data = ref([]);
const errorMessage = ref('');

onMounted(async () => {
  await fetchDataForSelect("Role", "/all-job-roles", "id", "role_name");
  await fetchDataForSelect("Branch", "/list-business-branches", "id", "name");
  await fetchBranches();
  fetchData();
});

async function fetchBranches() {
  try {
    const response = await apiService.get('/list-business-branches');
    branches.value = response || [];
  } catch (error) {
    console.error('Failed to fetch branches:', error);
  }
}

function handleBranchChange(branchId) {
  selectedBranchId.value =  Number(branchId);;
  fetchData();
}

async function fetchData() {
  let url = endpoint.value;
  if (selectedBranchId.value) {
    url += `&branch_id=${selectedBranchId.value}`;
  }

  try {
    const response = await apiService.get(url);
    if (response.data && response.data.length > 0) {
      data.value = response.data;
      errorMessage.value = '';
    } else {
      data.value = [];
      errorMessage.value = 'No users found for the selected branch.';
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
    data.value = [];
    errorMessage.value = 'Failed to fetch data. Please try again later.';
  }
}

// const toggleAddPermissionModal = async () => {
//   showModal.value = !showModal.value;
// };

const forceRefresh = () => {
  forceUpdate.value++;
};


</script>
