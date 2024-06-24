<script setup>
import { ref, computed, onMounted } from 'vue';
import apiService from '@/services/apiService';
import { getDb, setDb } from '@/utils/db';

const search = ref('');
const data = ref([]);
const pagination = ref({});

const currentPage = ref(1);
const totalPages = ref(0);

const filteredData = computed(() => {
  return data.value.filter(item => {
    const description = item.product_description || '';
    return description.toLowerCase().includes(search.value.toLowerCase());
  });
});

async function fetchData(page = 1) {
  try {
    const response = await apiService.get(`stores?page=${page}`);
    // console.log(response.data)
    // console.log(response.data.data)
    data.value = response.data || []; // Adjust if API response is nested differently
    pagination.value = {
      next_page_url: response.data.next_page_url,
      prev_page_url: response.data.prev_page_url,
    };
    currentPage.value = page;
    totalPages.value = response.data.last_page;

    // Cache the data in IndexedDB
    await setDb('stores', { id: `page-${page}`, data: data.value });
    console.log(`Data from API cached for page ${page}`);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    // Retrieve data from IndexedDB if fetch fails
    const cachedData = await getDb('stores', `page-${page}`);
    if (cachedData) {
      data.value = cachedData.data;
      console.log(`Data retrieved from IndexedDB for page ${page}`);
      pagination.value = {
        next_page_url: currentPage.value < totalPages.value ? `stores?page=${currentPage.value + 1}` : null,
        prev_page_url: currentPage.value > 1 ? `stores?page=${currentPage.value - 1}` : null,
      };
    } else {
      console.log(`No cached data found for page ${page}`);
    }
  }
};

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    fetchData(page);
  }
}

onMounted(() => fetchData(currentPage.value));
</script>

<template>
    <DashboardLayout pageTitle="Store Page">
      <div class="actions">
        <input type="text" v-model="search" placeholder="Search..." class="search-input" />
        <!-- <button class="button add-btn"><router-link to="/create-purchase" class="button add-btn">Add</router-link></button> -->
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>S.NO</th>
              <th>PRODUCT TYPE</th>
              <th>PRODUCT DESCRIPTION</th>
              <th>BATCH NO</th>
              <th>QUANTITY AVAILABLE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredData" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.product_type }}</td>
              <td>{{ item.product_description }}</td>
              <td>{{ item.batch_no }}</td>
              <td>{{ item.quantity_available }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
  
      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="!pagination.prev_page_url">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="!pagination.next_page_url">Next</button>
      </div>
    </DashboardLayout>
  </template>

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

th, td {
  padding: 8px;
  text-align: left;
  border: 2px solid #C35214; 
  white-space: nowrap;
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