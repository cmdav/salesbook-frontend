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
      @updated="forceRefresh" :url="'sale-users'" />

    <DeleteModal v-if="showDeleteModal" @close="closeDeleteModal" @updated="forceRefresh" :items="itemsId"
      :url="'/users'" :modalTitle="modalTitle" />

    <FormModal v-if="showModal" @close="closeModal" :key="forceUpdate" :formTitle="'Add User'" :fields="userFormFields"
      @fetchDataForSubCategory="fetchDataForSubCategory" :isLoadingMsg="isOptionLoadingMsg" :url="'sale-users'" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { userFormFields } from "@/formfields/formFields";
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

const modalTitle = "user_name";
const endpoint = ref("users?type=sales_personnel");

const { fetchDataForSelect, fetchDataForSubCategory, isOptionLoadingMsg } = useSelectComposable(userFormFields, 'users', "role_id", "", "branch_id");
const { showModal, forceUpdate, closeModal } = usePostComposable("/settings", userFormFields);
const store = useStore();
const roles = computed(() => store.getUser.user.permission.role_name === "Admin");
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable();

const additionalColumns = computed(() => {
  const cols = [];
  if (roles.value) {
    cols.push({ name: 'Edit', action: handleEditWrapper }, { name: 'Delete', action: handleDelete });
  }
  return cols;
});

const { handleDelete, showDeleteModal, itemsId, closeDeleteModal } = useDeleteComposable();

const branches = ref([]);
const data = ref([]);
const errorMessage = ref('');
const selectedBranchId = ref(null);

onMounted(async () => {
  await fetchDataForSelect("Role", "/all-job-roles", "id", "role_name");
  await fetchDataForSelect("Branch", "/list-business-branches", "id", "name");
  await fetchBranches();
  await fetchData();

  // Populate the options for select fields
  const branchField = userFormFields.value.find(field => field.databaseField === 'branch_id');
  if (branchField) {
    branchField.options = branches.value.map(branch => ({
      value: branch.id,
      label: branch.name
    }));
  }

  const rolesResponse = await apiService.get('/all-job-roles');
  const roleField = userFormFields.value.find(field => field.databaseField === 'role_id');
  if (roleField) {
    roleField.options = rolesResponse.map(role => ({
      value: role.id,
      label: role.role_name
    }));
  }
});

watch(() => showEditModal.value, (newShowEditModal) => {
  if (newShowEditModal && items.value) {
    // Populate the form fields with the existing item data
    userFormFields.value.forEach(field => {
      if (field.databaseField === 'branch_id') {
        field.value = items.value.branch_id;
      } else if (field.databaseField === 'role_id') {
        field.value = items.value.role_id;
      } else {
        field.value = items.value[field.databaseField];
      }
    });
  }
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

const forceRefresh = () => {
  forceUpdate.value++;
};

function handleEditWrapper(item) {
  handleEdit(item);

  // Populate the branch and role fields
  const branchField = userFormFields.value.find(field => field.databaseField === 'branch_id');
  console.log('Branch field:', branchField);
  if (branchField) {
    branchField.value = item.branch_id;
  }

  const roleField = userFormFields.value.find(field => field.databaseField === 'role_id');
  console.log('Role field:', roleField);
  if (roleField) {
    roleField.value = item.role_id;
  }

  console.log('Branch ID:', item.branch_id);
  console.log('Role ID:', item.role_id);

  showEditModal.value = true;
}
</script>
