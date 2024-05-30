<template>
  <DashboardLayout pageTitle="Purchase Page">
    <div class="actions">
      <input type="text" v-model="search" placeholder="Search..." class="search-input" />
      <div v-if="permissions">
        <button class="button add-btn"><router-link to="/create-purchase" class="button add-btn">Add</router-link></button>
      </div>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>S.NO</th>
            <th>PRODUCT TYPE</th>
            <th>PRODUCT TYPE DESCRIPTION</th>
            <th>BATCH NO</th>
            <th>QUANTITY</th>
            <th>EXPIRY DATE</th>
            <th>COST PRICE(NGN)</th>
            <th>SELLING PRICE(NGN)</th>
            <th>CREATED BY</th>
            <th>UPDATED BY</th>
            <th>DELETE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="item.id">
            <td>{{ serialNumber(index) }}</td>
            <td>{{ item.product_type_name }}</td>
            <td>{{ item.product_type_description }}</td>
            <td>{{ item.batch_no }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.expiry_date }}</td>
            <td>{{ item.cost_price }}</td>
            <td>{{ item.selling_price }}</td>
            <td>{{ item.created_by }}</td>
            <td>{{ item.updated_by }}</td>
            <td><button @click="openDeleteModal(item)">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <DeleteModal v-if="showDeleteModal" @close="closeDeleteModal" @updated="forceRefresh" :items="itemToDelete" :url="'purchases'" :modalTitle="modalTitle" />

    <div v-if="!isSearching" class="mx-auto w-fit my-5">
  <Pagination :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage" />
</div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import apiService from '@/services/apiService';
import DeleteModal from '@/components/UI/Modal/DeleteModals.vue';
import Pagination from '@/components/UI/Pagination/PaginatePage.vue';
import { useStore } from "@/stores/user";

const search = ref('');
const isSearching = ref(false);

const data = ref([]);
const pagination = ref({});
const showDeleteModal = ref(false);
const itemToDelete = ref(null);
const modalTitle = "Delete Purchase";

const currentPage = ref(1);
const totalPages = ref(0);

watch(search, async (newSearch) => {
  if (newSearch) {
    isSearching.value = true;
    try {

      console.log('seraching')
      const response = await apiService.get(`search-purchases/${newSearch}`);
      console.log(response)
      data.value = response;
      return data.value;
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }else{
    console.log('seraching')

    isSearching.value = false;
    fetchData();
  }
});

async function fetchData(page = 1) {
  try {
    const response = await apiService.get(`purchases?page=${page}`);
    data.value = response.data || [];
    pagination.value = {
      next_page_url: response.next_page_url,
      prev_page_url: response.prev_page_url,
    };
    currentPage.value = page;
    totalPages.value = response.last_page;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    fetchData(page);
  }
}

function serialNumber(index) {
 console.log(index)
 
  return currentPage.value
}


function openDeleteModal(item) {
  itemToDelete.value = item;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  itemToDelete.value = null;
}

function forceRefresh() {
  fetchData(currentPage.value);
}

onMounted(() => fetchData(currentPage.value));


const store = useStore();
const permissions = computed(() => {
  const perm = store.getUser.user.permission.permissions.find(p => p.page_name === 'purchases');
  return perm && perm.write == 1; 
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

th{
  padding: 8px;
  text-align: left;
  border: 1px solid #fff; /* Add borders around cells */
  white-space: nowrap;
  color: #fff;
  font-size: 0.95em;
}

td{
  padding: 8px;
  text-align: left;
  border: 1px solid #C35214;;
  /* Add borders around cells */
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
</style>
