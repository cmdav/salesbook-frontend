<template>
    <div>
        <div class="actions">
            <input type="text" v-model="search" placeholder="Search..." class="search-input" />
            <div v-if="addPermissions" class="action">
                <BranchDropDown :branches="branches" @change="handleBranchChange" />
                <button class="button add-btn"><router-link to="/create-user"
                        class="button add-btn">Add</router-link></button>
            </div>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>S.NO</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Branch</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in data" :key="user.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ user.user_name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.role_name }}</td>
                        <td>{{ user.branch_name }}</td>
                        <td v-if="delPermissions"><button @click="openDeleteModal(user)">Delete</button></td>
                    </tr>
                </tbody>
            </table>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        </div>

        <DeleteModal v-if="showDeleteModal" @close="closeDeleteModal" @updated="forceRefresh" :items="itemsId"
            :url="'/users'" :modalTitle="modalTitle" />

        <FormModal v-if="showModal" @close="closeModal" :key="forceUpdate" :formTitle="'Add User'"
            :fields="userFormFields" @fetchDataForSubCategory="fetchDataForSubCategory"
            :isLoadingMsg="isOptionLoadingMsg" :url="'sale-users'" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import apiService from '@/services/apiService';
import { useStore } from "@/stores/user";
import BranchDropDown from '@/components/UI/Dropdown/BranchDropDown.vue';
import DeleteModal from '@/components/UI/Modal/DeleteModals.vue';
import FormModal from '@/components/UI/Modal/FormModal.vue';

const search = ref('');
const data = ref([]);
const branches = ref([]);
const selectedBranchId = ref(null);
const errorMessage = ref('');
const showModal = ref(false);
const showDeleteModal = ref(false);
const itemsId = ref(null);
const modalTitle = "Delete User";
const forceUpdate = ref(0);

const store = useStore();
const roles = computed(() => store.getUser.user.permission.role_name === "Admin");

const {
    fetchDataForSelect,
    fetchDataForSubCategory,
    isOptionLoadingMsg,
    usePostComposable,
    useDeleteComposable
    
} = useSharedComponent("sale-users");

const { userFormFields } = require('@/formfields/formFields');
const { useSelectComposable } = useSharedComponent("sale-users");

const { handleDelete } = useDeleteComposable();

const additionalColumns = computed(() => {
    const cols = [];
    if (roles.value) {
        cols.push({ name: 'Delete', action: handleDelete });
    }
    return cols;
});

onMounted(async () => {
    await fetchDataForSelect("Role", "/all-job-roles", "id", "role_name");
    await fetchDataForSelect("Branch", "/list-business-branches", "id", "name");
    await fetchBranches();
    fetchData();
});

watch(search, async (newSearch) => {
    if (newSearch) {
        try {
            const response = await apiService.get(`search-users/${newSearch}`);
            data.value = response.data || [];
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    } else {
        fetchData();
    }
});

async function fetchBranches() {
    try {
        const response = await apiService.get('/list-business-branches');
        branches.value = response.data || [];
    } catch (error) {
        console.error('Failed to fetch branches:', error);
    }
}

function handleBranchChange(branchId) {
    selectedBranchId.value = branchId;
    fetchData();
}

const dynamicEndpoint = computed(() => {
    let endpoint = '/users?type=sales_personnel';
    if (selectedBranchId.value) {
        endpoint += `&branch_id=${selectedBranchId.value}`;
    }
    return endpoint;
});

async function fetchData() {
    try {
        const response = await apiService.get(dynamicEndpoint.value);
        if (response.data && response.data.length > 0) {
            data.value = response.data;
            errorMessage.value = '';
        } else {
            data.value = [];
            errorMessage.value = 'No users found for the selected branch.';
        }
    } catch (error) {
        console.error('Failed to fetch data:', error);
        errorMessage.value = 'Failed to fetch data. Please try again later.';
    }
}

const forceRefresh = () => {
    forceUpdate.value++;
};

function openDeleteModal(user) {
    itemsId.value = user.id;
    showDeleteModal.value = true;
}

function closeDeleteModal() {
    showDeleteModal.value = false;
    itemsId.value = null;
}

function closeModal() {
    showModal.value = false;
    forceUpdate.value++;
}
</script>

<style scoped>
.actions {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.action {
    width: 25%;
    display: flex;
    justify-content: space-between;
}

.search-input {
    padding: 8px;
    width: 30%;
    border: 2px solid #ccc;
    border-radius: 4px;
}

.button {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
}

.add-btn {
    background-color: #C35214;
}

.table-container {
    overflow-x: auto;
    width: 100%;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 8px;
    text-align: left;
    border: 1px solid #C35214;
    white-space: nowrap;
}

thead {
    background-color: #C35214;
    color: white;
}

tbody tr:hover {
    background-color: #f1f5f9;
}

.error-message {
    color: rgb(171, 26, 26);
    font-size: 16px;
    text-align: center;
    margin: 20px 0;
}
</style>
