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
          <div class="flex justify-end mb-4">
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
          <div class="bg-white py-6 mt-4 rounded-lg">
            <div class="overflow-x-scroll hide-scrollbar">
              <div class="table-container overflow-x-scroll">
                <table class="table-auto w-full">
                  <thead class="bg-[#F9FBFF] border-y text-[#A8AABC] text-[14px]">
                    <tr>
                      <th class="py-4 pl-4 flex border-x">S/N</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">Name</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">Company Name</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">Company Representative</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">Email</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(i, index) in data" :key="i.id" class="border-b text-[14px]">
                      <td class="py-4 pl-4 border-x">{{ serialNumber(index) }}</td>
                      <td class="text-left p-4 pr-0 pl-6 border-x capitalize">
                        <button @click="redirectToSingleCustomerPage(i.id)" class="">
                          {{ i.first_name }} {{ i.last_name }}
                        </button>
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 border-x capitalize">{{ i.company_name }}</td>
                      <td class="text-left p-4 pr-0 pl-6 border-x">{{ i.contact_person }}</td>
                      <td class="text-left p-4 pr-0 pl-6 border-x">{{ i.email }}</td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize border-x">{{ i.phone_number }}</td>
                    </tr>
                  </tbody>
                </table>
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
import { ref, reactive, watch, onMounted } from 'vue';
import DashboardLayout from '@/components/Layouts/dashboardLayout.vue';
import AuthInput from '@/components/UI/Input/AuthInput.vue';
import Pagination from '@/components/UI/Pagination/PaginatePage.vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/apiService';

const router = useRouter();
const isSearching = ref(false);

const currentPage = ref(1);
const totalPages = ref(0);
const totalIndividuals = ref(0);
const totalCompanies = ref(0);

const toggleButton = ref(true);
const toggleCompanyTable = ref(false);
const userType = ref('individual');
let sortInput = reactive({
  search: ''
});


const data = ref([]);

const redirectToSingleCustomerPage = (id) => {
  router.push({ name: 'view-customers', params: { id } });
};

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
      console.log(response)
      data.value = response;
      return data.value;
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }else{
    isSearching.value = false;
    fetchData();
  }
});




async function fetchData(page = 1, type = 'individual', search = '') {
  try {
    const response = await apiService.get(`customers?type=${type}&page=${page}&search=${search}`);
    data.value = response.data;
    if (type === 'individual') {
      totalIndividuals.value = response.total;
    } else {
      totalCompanies.value = response.total;
    }
    currentPage.value = response.current_page;
    totalPages.value = response.last_page;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

function serialNumber(index) {
  console.log(index)
  return currentPage.value;
}

onMounted(() => {
  fetchData();
});
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
</style>
