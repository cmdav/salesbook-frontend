<template>
  <DashboardLayout pageTitle="Customer Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div>
        <div class="lg:px-6 px-3 pt-8 grid grid-rows gap-4">
          <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
            <div class="flex flex-row justify-between rounded-[8px] bg-brand p-4">
              <div>
                <div class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]">
                  <span>Total Individuals </span>
                </div>
                <div class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]">
                  {{ totalIndividuals }}
                </div>
              </div>
            </div>
            <div class="flex flex-row justify-between rounded-[8px] bg-brand p-4">
              <div>
                <div class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]">
                  <span>Total Companies </span>
                </div>
                <div class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]">
                  {{ totalCompanies }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-between mt-6 ">
            <div>
              <BranchDropDown v-if="roles" :branches="branches"
               @change="(selectedBranchId) => handleBranchChange(userType, selectedBranchId)" />
            </div>
            <div class="flex flex-row gap-2 items-center">
              <AuthInput
                :error="false"
                type="text"
                placeholder="Search"
                v-model="sortInput.search"
                class="w-[40%]"
              />
              <button
                @click="handleToggleTableButton"
                :class="toggleButton ? 'bg-brand text-white' : 'bg-white text-brand'"
                class="p-4 py-2 mr-2 rounded"
              >
                Individual
              </button>
              <button
                @click="handleToggleCompanyTable"
                :class="toggleCompanyTable ? 'bg-brand text-white' : 'bg-white text-brand'"
                class="p-4 py-2 rounded"
              >
                Company
              </button>
            </div>
          </div>
          <div class="bg-white py-6 rounded-lg">
            <div class="overflow-x-scroll hide-scrollbar">
              <div class="table-container overflow-x-scroll">
                <table class="table-auto w-full">
                  <thead class="bg-[#F9FBFF] border-y text-[#A8AABC] text-[14px]">
                    <tr>
                      <th class="py-4 pl-4 border-x">S/N</th>
                      <th v-if="userType === 'individual'" class="text-left p-4 pr-0 px-6 border-x capitalize">Full Name</th>
                      <th v-if="userType === 'company'" class="text-left p-4 pr-0 px-6 border-x capitalize">Company Name</th>
                      <th v-if="userType === 'company'" class="text-left p-4 pr-0 px-6 border-x capitalize">Contact Person</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">Email</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">Phone Number</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(i, index) in data" :key="i.id" class="border-b text-[14px]">
                      <td class="py-4 pl-4 border-x">
                        {{(parseInt(currentPage, 10) - 1) * parseInt(itemsPerPage, 10) + index + 1}}
                      </td>
                      <td v-if="userType === 'individual'" class="text-left p-4 pr-0 pl-6 border-x capitalize">
                        <button class="">
                          {{ i.first_name }} {{ i.last_name }}
                        </button>

                      </td>
                      <td v-if="userType === 'company'" class="text-left p-4 pr-0 pl-6 border-x capitalize">
                        <button class="">
                          {{ i.company_name }}
                        </button>

                      </td>
                      <td v-if="userType === 'company'" class="text-left p-4 pr-0 pl-6 border-x">{{ i.contact_person }}</td>
                      <td class="text-left p-4 pr-0 pl-6 border-x">{{ i.email }}</td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize border-x">{{ i.phone_number }}</td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize border-x">{{ i.address }}</td>
                    </tr>
                  </tbody>

                </table>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

              </div>
              <div v-if="!isSearching" class="mx-auto w-fit my-5">
                <Pagination :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import DashboardLayout from '@/components/Layouts/dashboardLayout.vue';
import BranchDropDown from '@/components/UI/Dropdown/BranchDropDown.vue';
import AuthInput from '@/components/UI/Input/AuthInput.vue';
import Pagination from '@/components/UI/Pagination/PaginatePage.vue';
// import { useRouter } from 'vue-router';
import apiService from '@/services/apiService';
import { useStore } from "@/stores/user";
// import { UnderlineOutlined } from '@ant-design/icons';

const store = useStore();
const roles = computed(() => store.getUser.user.permission.role_name === "Admin");

// const router = useRouter();
const isSearching = ref(false);

const currentPage = ref(1);
const totalPages = ref(0);
const itemsPerPage = ref(0);
const totalIndividuals = ref(0);
const totalCompanies = ref(0);

const toggleButton = ref(true);
const toggleCompanyTable = ref(false);
const userType = ref('individual');
const branches = ref([]);
const errorMessage = ref('');
const selectedBranch = ref(null);


// onMounted(async () => {
//   try {
//     const response = await apiService.get('/list-business-branches');
//     console.log(response)
//     branches.value = response || [];
//     console.log(branches.value)
//   } catch (error) {
//     console.error('Failed to fetch branches:', error);
//   }
// });

onMounted(async () => {
  try {
    // Fetch branches
    const response = await apiService.get('/list-business-branches');
    branches.value = response || [];
    
    // Fetch initial data and totals
    await Promise.all([
      fetchData(),
      fetchTotals()
    ]);
  } catch (error) {
    console.error('Failed to initialize dashboard:', error);
  }
});


function handleBranchChange(type, selectedBranchId) {
  selectedBranch.value = selectedBranchId;
  if (selectedBranchId) {
    fetchBranch(type, selectedBranchId);
  } else {
    fetchData();
  }
}

async function fetchTotals() {
  try {
    const [individualsResponse, companiesResponse] = await Promise.all([
      apiService.get('customers?type=individual'),
      apiService.get('customers?type=company')
    ]);

    totalIndividuals.value = individualsResponse.total;
    totalCompanies.value = companiesResponse.total;
  } catch (error) {
    console.error('Failed to fetch totals:', error);
  }
}

async function fetchData(page = 1, type = 'individual', search = '') {
  try {
    const url = `customers?type=${type}&page=${page}&search=${search}`;
    const response = await apiService.get(url);
    console.log(response);
    if (type === 'individual') {
      data.value = response.data.map((i) => ({
        id: i.id,
        first_name: i.first_name,
        last_name: i.last_name,
        email: i.email,
        phone_number: i.phone_number,
        address: i.address
      }));
      // totalIndividuals.value = response.total;
    } else {
      data.value = response.data.map((i) => ({
        id: i.id,
        company_name: i.company_name,
        contact_person: i.contact_person,
        email: i.email,
        phone_number: i.phone_number,
        address: i.address
      }));
      // totalCompanies.value = response.total;
    }
    currentPage.value = response.current_page;
    totalPages.value = response.last_page;
    itemsPerPage.value = response.per_page;

    await fetchTotals()

  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

async function fetchBranch( type = 'individual', branchId = selectedBranch.value) {
  try {
    const response = await apiService.get(`customers?type=${type}&branch_id=${branchId}`);
    console.log(response)
    if (type === 'individual') {
      if (response.data && response.data.length) {
      data.value = response.data.map((i) => ({
        id: i.id,
        first_name: i.first_name,
        last_name: i.last_name,
        email: i.email,
        phone_number: i.phone_number,
        address: i.address
      }));
      // totalIndividuals.value = response.total;
      errorMessage.value = '';
    } else {
      data.value = [];
      errorMessage.value = 'No customer found for the selected branch.';
    }
    } else {
      if (response.data && response.data.length) {
      data.value = response.data.map((i) => ({
        id: i.id,
        company_name: i.company_name,
        contact_person: i.contact_person,
        email: i.email,
        phone_number: i.phone_number,
        address: i.address
      }));
      // totalCompanies.value = response.total;
      errorMessage.value = '';
    } else {
      data.value = [];
      errorMessage.value = 'No company customer found for the selected branch.';
    }
    }
   currentPage.value = response.current_page;
    totalPages.value = response.last_page;
    itemsPerPage.value = response.per_page;

    await fetchTotals();

    return data.value;
  } catch (error) {
    console.error('Failed to fetch sales data:', error);
  }
}

let sortInput = reactive({
  search: ''
});

const data = ref([]);



function handleToggleTableButton() {
  toggleCompanyTable.value = false;
  toggleButton.value = true;
  userType.value = 'individual';
  fetchData(1, 'individual');
}

function handleToggleCompanyTable() {
  toggleCompanyTable.value = true;
  toggleButton.value = false;
  userType.value = 'company';
  fetchData(1, 'company');
}

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    fetchData(page, userType.value);
  }
}

watch(() => sortInput.search, async (newSearch) => {
  if (newSearch) {
    isSearching.value = true;
    try {
      const response = await apiService.get(`search-customer/${newSearch}`);
      console.log(response);
      data.value = response;
      return data.value;
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  } else {
    isSearching.value = false;
    fetchData();
  }
});

// onMounted(() => {
//   fetchData();
// });


</script>


<style scoped>
.actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
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

.upload-btn {
  background-color: #C35214;
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
  table-layout: auto;
}

th {
  padding: 8px;
  text-align: left;
  border: 1px solid #fff;
  white-space: nowrap;
  color: #fff;
}

td {
  padding: 8px;
  text-align: left;
  border: 1px solid #C35214;
  white-space: nowrap;
  color: #C35214;
  font-size: 0.9em;
}

tbody tr:hover {
  background-color: #f1f5f9;
}

thead {
  background-color: #C35214;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.pagination button {
  padding: 8px 16px;
  background-color: #C35214;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.pagination span {
  padding: 8px 16px;
  background-color: #C35214;
  border-radius: 4px;
  color: white;
}

.error-message {
  color: rgb(171, 26, 26);
  font-size: 16px;
  text-align: center;
  margin: 20px 0;
}
</style>
