<template>
    <DashboardLayout pageTitle="Purchase Page">
      <div class="actions">
        <input type="text" v-model="search" placeholder="Search..." class="search-input" />
        <button class="button add-btn"><router-link to="/create-purchase" class="button add-btn">Add</router-link></button>
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
              <th>COST PRICE</th>
              <th>SELLING PRICE</th>
              <th>CREATED BY</th>
              <th>UPDATED BY</th>
              <th>DELETE</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredData" :key="item.id">
              <td>{{ index + 1 }}</td>
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
  
      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="!pagination.prev_page_url">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="!pagination.next_page_url">Next</button>
      </div>
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import axios from '@/services/axios';
  import { getDb, setDb, getAllDb, deleteDb } from '@/utils/indexedDB';
  import DeleteModal from '@/components/UI/Modal/DeleteModals.vue';
  
  const search = ref('');
  const data = ref([]);
  const pagination = ref({});
  const showDeleteModal = ref(false);
  const itemToDelete = ref(null);
  const modalTitle = "Delete Purchase";
  
  const currentPage = ref(1);
  const totalPages = ref(0);
  
  const filteredData = computed(() => {
    return data.value.filter(item => {
      const description = item.product_type_description || '';
      return description.toLowerCase().includes(search.value.toLowerCase());
    });
  });
  
  const isOnline = () => navigator.onLine;
  
  async function fetchData(page = 1) {
    if (isOnline()) {
      try {
        const response = await axios.get(`purchases?page=${page}`);
        data.value = response.data || [];
        pagination.value = {
          next_page_url: response.next_page_url,
          prev_page_url: response.prev_page_url,
        };
        currentPage.value = page;
        totalPages.value = response.last_page;
  
        // Store data in IndexedDB
        data.value.forEach(purchase => setDb('purchases', purchase));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    } else {
      // Get data from IndexedDB
      data.value = await getAllDb('purchases');
      pagination.value = { prev_page_url: null, next_page_url: null }; // Reset pagination when offline
      totalPages.value = 1; // Assume only one page when offline
    }
  }
  
  function changePage(page) {
    if (page > 0 && page <= totalPages.value) {
      fetchData(page);
    }
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
  
  async function syncData() {
    if (!isOnline()) return;
  
    const syncQueue = await getAllDb('sync-queue');
    for (const item of syncQueue) {
      try {
        const response = await axios({
          method: item.method,
          url: item.url,
          data: item.data,
          headers: item.headers
        });
  
        if (response.status === 200 || response.status === 201) {
          await deleteDb('sync-queue', item.id);
        }
      } catch (error) {
        console.log('Failed to sync item:', item, error);
      }
    }
  }
  
  window.addEventListener('online', syncData);
  
  onMounted(() => fetchData(currentPage.value));
  </script>
  