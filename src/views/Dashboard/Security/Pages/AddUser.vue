<template>
  <div>
    <DataTableLayout
      :key="forceUpdate"
      @toggleModal="showModal = !showModal"
      :endpoint="endpoint"
      :pageName="'settings'"
      toggleButtonLabel="Add User"
      :excludedKeys="['id', 'organization_code', 'branch_id', 'role_id']"
      searchEndpoint="search-users"
      :data="data"
      :additionalColumns="additionalColumns"
    >
      <div v-if="roles">
        <BranchDropDown :branches="branches" @change="handleBranchChange" />
      </div>
    </DataTableLayout>

    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      modalTitle="Edit User"
      :formField="userFormFields"
      @updated="forceRefresh"
      :url="'sale-users'"
    />

    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemsId"
      :url="'/users'"
      :modalTitle="modalTitle"
    />

    <FormModal
      v-if="showModal"
      @close="closeModal"
      :key="forceUpdate"
      :formTitle="'Add User'"
      :fields="userFormFields"
      :isLoadingMag="isOptionLoadingMsg"
      :url="'sale-users'"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { userFormFields } from '@/formfields/formFields'
import { useSharedComponent } from '@/composable/useSharedComponent'
import BranchDropDown from '@/components/UI/Dropdown/BranchDropDown.vue'
import apiService from '@/services/apiService'

const {
  useSelectComposable,
  DataTableLayout,
  usePostComposable,
  useEditComposable,
  useStore,
  EditModal,
  DeleteModal,
  useDeleteComposable,
  FormModal
} = useSharedComponent('sale-users')

const modalTitle = 'user_name'
const endpoint = ref('users?type=sales_personnel')
const emit = defineEmits(['update', 'close'])

const { fetchDataForSelect, isOptionLoadingMsg} = useSelectComposable(
  userFormFields,
  'sales-users',
  'role_name',
  '',
  'branch_name'
)
const { showModal, forceUpdate, closeModal } = usePostComposable('/settings', userFormFields)
const store = useStore()
const roles = computed(() => store.getUser.user.permission.role_name === 'Admin')
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit)

const additionalColumns = computed(() => {
  const cols = []
  if (roles.value) {
    cols.push({ name: 'Edit', action: handleEditWrapper }, { name: 'Delete', action: handleDelete })
  }
  return cols
})

const { handleDelete, showDeleteModal, itemsId, closeDeleteModal } = useDeleteComposable()

const branches = ref([])
const data = ref([])
const errorMessage = ref('')
const selectedBranchId = ref(null)

onMounted(async () => {
  await fetchDataForSelect('Role', '/all-job-roles', 'id', 'role_name')
  await fetchDataForSelect('Branch', '/list-business-branches', 'id', 'name')
  await fetchBranches()
  await fetchData()
})

async function fetchBranches() {
  try {
    const response = await apiService.get('/list-business-branches')
    branches.value = response || []
  } catch (error) {
    console.error('Failed to fetch branches:', error)
  }
}

function handleBranchChange(branchId) {
  selectedBranchId.value = branchId
  fetchData()
}

async function fetchData() {
  let url = endpoint.value
  if (selectedBranchId.value) {
    url += `&branch_id=${selectedBranchId.value}`
  }

  try {
    const response = await apiService.get(url)
    if (response.data && response.data.length > 0) {
      data.value = response.data
      errorMessage.value = ''
    } else {
      data.value = []
      errorMessage.value = 'No users found for the selected branch.'
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    data.value = []
    errorMessage.value = 'Failed to fetch data. Please try again later.'
  }
}

const forceRefresh = () => {
  forceUpdate.value++
}

function handleEditWrapper(item) {
  handleEdit(item)
}
</script>
