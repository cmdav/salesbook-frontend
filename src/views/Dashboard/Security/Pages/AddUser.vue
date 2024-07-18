<template>
  <div>
    <DataTableLayout :key="forceUpdate" @toggleModal="showModal = !showModal" :endpoint="endpoint"
      :pageName="'settings'" toggleButtonLabel="Add User" :excludedKeys="['id', 'organization_code']"
      searchEndpoint="search-users" :data="data" :additionalColumns="additionalColumns">
      <div v-if="roles">
        <BranchDropDown :branches="branches" @change="handleBranchChange" />
      </div>
    </DataTableLayout>

    <EditModal v-if="showEditModal" @close="closeEditModal" :items="items" :formField="userFormFields"
      @updated="forceRefresh" :url="'sale-users'" 
      />

    <DeleteModal v-if="showDeleteModal" @close="closeDeleteModal" @updated="forceRefresh" :items="itemsId"
      :url="'/users'" :modalTitle="modalTitle" />

    <FormModal v-if="showModal" @close="closeModal" :key="forceUpdate" :formTitle="'Add User'" :fields="userFormFields"
      @fetchDataForSubCategory="fetchDataForSubCategory" :isLoadingMsg="isOptionLoadingMsg" :url="'sale-users'" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import {userFormFields } from "@/formfields/formFields";
import { useSharedComponent } from "@/composable/useSharedComponent";
import BranchDropDown from '@/components/UI/Dropdown/BranchDropDown.vue';
import apiService from '@/services/apiService';

const {
  useSelectComposable,
  DataTableLayout,
  usePostComposable,
  useEditComposable,
  useStore,
  EditModal,
  DeleteModal,
  useDeleteComposable,
  FormModal,
  
} = useSharedComponent("sale-users");
// const emit = defineEmits("forceRefresh");
const modalTitle = "user_name ";
const endpoint = ref("users?type=sales_personnel");

const { fetchDataForSelect, fetchDataForSubCategory, isOptionLoadingMsg }
  = useSelectComposable(userFormFields, 'users', "role_id", "", "branch_id");

const { showModal, forceUpdate, closeModal } = usePostComposable("/settings", userFormFields);
const store = useStore();
const roles = computed(() => store.getUser.user.permission.role_name === "Admin");
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable();

const additionalColumns = computed(() => {
  const cols = [];
  if (roles.value) {
    cols.push( { name: 'Edit', action: handleEdit },{ name: 'Delete', action: handleDelete });
  }
  return cols;
});

const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal
} = useDeleteComposable();

const branches = ref([]);
const selectedBranchId = ref(null);
const selectedRoleId = ref(null);
const data = ref([]);
const errorMessage = ref('');

onMounted(async () => {
  await fetchDataForSelect("Role", "/all-job-roles", "id", "role_name");
  await fetchDataForSelect("Branch", "/list-business-branches", "id", "name");
  await fetchBranches();
  await fetchData();

  // Populate the options for select fields
  userFormFields.value.find(field => field.databaseField === 'branch_id').options = branches.value.map(branch => ({
    value: branch.id,
    label: branch.name
  }));

  const rolesResponse = await apiService.get('/all-job-roles');
  console.log(rolesResponse)
  userFormFields.value.find(field => field.databaseField === 'role_id').options = rolesResponse.map(role => ({
    value: role.role,
    label: role.role_name
  }));
});




watch(selectedBranchId, () => {
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
  selectedBranchId.value = branchId;
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

const forceRefresh = () => {
  forceUpdate.value++;
};

watch([showEditModal, items], ([newShowEditModal, newItems]) => {
  if (newShowEditModal && newItems && newItems.length > 0) {
    const currentItem = newItems[0];
    console.log('Current item:', currentItem); // Log current item for debugging
    selectedBranchId.value = currentItem.branch_id;
    selectedRoleId.value = currentItem.role_id;

    // Set the form fields values here
    userFormFields.forEach(field => {
      if (field.databaseField === 'branch_id') {
        field.value = currentItem.branch_id;
      } else if (field.databaseField === 'role_id') {
        field.value = currentItem.role_id;
      }
    });

    console.log('Selected branch ID:', selectedBranchId.value); // Log selected branch ID for debugging
    console.log('Selected role ID:', selectedRoleId.value); // Log selected role ID for debugging
  }
});

// watch(items, (newItems) => {
//   if (newItems && newItems.length > 0) {
//     const currentItem = newItems[0];
//     selectedBranchId.value = currentItem.branch_id;
//     selectedRoleId.value = currentItem.role_id;
//   }
// });

</script>
