<template>
  <DashboardLayout pageTitle="Sales Page">
   
    <div class="actions">
      <input type="text" v-model="search" placeholder="Search..." class="search-input" />
      <div v-if="addPermissions" class="action">
        
          <BranchDropDown v-if="roles" :branches="branches" @change="handleBranchChange" />
        
      <button class="button add-btn">
        <router-link to="/create-sale" class="button add-btn">Add</router-link>
      </button>
      </div>
    </div>
    <div :class="['network-status', { 'online': isOnlineFlag, 'offline': !isOnlineFlag }]">
            <span>{{ isOnlineFlag ? 'Online' : 'Offline' }}</span>
          </div>
    <!-- {{ isOnlineFlag }} -->
    <div v-if="isOnlineFlag" class="table-container">
      <table>
        <thead>
          <tr>
            <th>S.NO</th>
            <th>PRODUCT TYPE</th>
            <th>PRODUCT TYPE DESCRIPTION</th>
            <!-- <th>BATCH NO</th> -->
            <!-- <th>COST PRICE</th> -->
            <th>PRICE SOLD AT(NGN)</th>
            <th>QUANTITY</th>
            <th>TOTAL PRICE(NGN)</th>
            <th>PAYMENT METHOD</th>
            <th>CREATED AT</th>
            <th>TRANSACTION ID</th>
            <th>CUSTOMER DETAIL</th>
            <th>CUSTOMER PHONE NUMBER</th>
            <th>BRANCH</th>
            <th>CREATED BY</th>
            <th>UPDATED BY</th>
            <th>RECEIPT</th>
            <th v-if="delPermissions">DELETE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="item.id">
            <td>{{(parseInt(currentPage, 10) - 1) * parseInt(itemsPerPage, 10) + index + 1}}</td>
            <td>{{ item.product_type_name }}</td>
            <td>{{ item.product_type_description }}</td>
            <!-- <td>{{ item.batch_no }}</td> -->
            <!-- <td>{{ item.cost_price }}</td> -->
            <td>{{ item.price_sold_at }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.total_price }}</td>
            <td>{{ item.payment_method }}</td>
            <td>{{ item.created_at }}</td>
            <td>{{ item.transaction_id }}</td>
            <td>{{ item.customer_detail }}</td>
            <td>{{ item.customer_phone_number }}</td>
            <td>{{ item.branch_name }}</td>
            <td>{{ item.created_by }}</td>
            <td>{{ item.updated_by }}</td>
            <td><button @click="generateReceipt(item.transaction_id)">Receipt</button></td>
            <td v-if="delPermissions"><button @click="openDeleteModal(item)">Delete</button></td>
          </tr>
        </tbody>
      </table>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>

    <DeleteModal v-if="showDeleteModal" @close="closeDeleteModal" @updated="forceRefresh" :items="itemToDelete" :url="'purchases'" :modalTitle="modalTitle" />
<div v-if="!isSearching && isOnlineFlag" class="mx-auto w-fit my-5">
  <Pagination :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage" />
</div>

<!-- Offline Table Section -->
<div v-if="!isOnlineFlag && offlineData.length > 0" class="offline-table-container">
  <h3 class="text-lg font-semibold mb-4">Offline Sales Data</h3>
  <table>
    <thead>
      <tr>
        <th>S.NO</th>
        <th>PRODUCT TYPE</th>
        <th>PRICE SOLD AT(NGN)</th>
        <th>QUANTITY SOLD</th>
        <th>QUANTITY AVAILABLE</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in offlineData" :key="item.id">
        <td>{{ index + 1 }}</td>
        <td>{{ item.product_type_name }}</td>
        <td>{{ item.products[0]['price_sold_at']}}</td>
        <td>{{ item.products[0]['quantity']}}</td>
        <td>{{ item.quantity_available }}</td>
      </tr>
    </tbody>
  </table>
  <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
</div>

  </DashboardLayout>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted} from 'vue';
import apiService from '@/services/apiService';
import DeleteModal from '@/components/UI/Modal/DeleteModals.vue';
import Pagination from '@/components/UI/Pagination/PaginatePage.vue';
import { useStore } from "@/stores/user";
import { storeToRefs } from 'pinia';
import BranchDropDown from '@/components/UI/Dropdown/BranchDropDown.vue';
import { generateReceiptPDF } from './receipts';
import { isOnline, listenForNetworkStatusChanges } from '@/isOnline'; 
import { getAllProducts, getAllSales } from '@/services/indexedDbService'
import { syncSalesToServer,  syncCustomersToServer } from '/customSync'

const store = useStore();
const { userProfileDetails } = storeToRefs(store);

const search = ref('');
const isSearching = ref(false);

const data = ref([]); // Initialize as an empty array
const pagination = ref({});
const showDeleteModal = ref(false);
const itemToDelete = ref(null);
const modalTitle = "Delete Sale";

const currentPage = ref(1);
const totalPages = ref(0);
const itemsPerPage = ref(0);
const branches = ref([]);
const errorMessage = ref('');
const offlineData = ref([]);
const isOnlineFlag = ref(true); // Reactive property to track online status
//alert(isOnline.value)
async function checkOnlineStatus() {
  try {
    isOnlineFlag.value = await isOnline(); // Call the imported isOnline function
   
  } catch (error) {
    console.error('Error checking online status:', error); // Handle any potential errors
  }
}
// Listen for online/offline changes
onMounted( async() => {

  await checkOnlineStatus();
  // Fetch initial data
  fetchData(currentPage.value);

  const stopListening = listenForNetworkStatusChanges((isOnline) => {
    isOnlineFlag.value = isOnline; // Update online status in the UI
    if (isOnline) {
      console.log('Network is back online. Syncing sales...');
      syncSalesToServer(); 
      syncCustomersToServer(); 
    }
  });

  onUnmounted(() => {
    stopListening(); // Stops the interval and event listeners
  });
});



async function fetchData(page = 1) {
  if (!isOnlineFlag.value) {
    console.log('Offline mode detected');
    // If offline, load sales data from IndexedDB
    try {
      const storeSales = await getAllSales();
      const storeProducts = await getAllProducts();

      offlineData.value = storeSales.map(sale => {
        const product = storeProducts.find(p => p.id === sale.products[0].product_type_id); // Find matching product by ID
        return {
          ...sale,
          product_type_name: product ? product.product_type_name : 'Unknown', // Add product name
          quantity_available: product ? product.quantity_available : 'N/A',  // Add available quantity from product
        };
      });

      console.log(offlineData.value);
      
      if (offlineData.value.length === 0) {
        errorMessage.value = 'No offline sales data found';
      } else {
        errorMessage.value = '';
      }
    } catch (error) {
      console.error("Failed to fetch offline sales data:", error);
      errorMessage.value = 'An error occurred while fetching offline data.';
    }
  } else {
    // If online, fetch data from the server
    try {
      const response = await apiService.get(`sales?page=${page}`);
      data.value = response.data || [];
      if (data.value.length === 0) {
        errorMessage.value = 'No items found';
      } else {
        errorMessage.value = '';
      }
      pagination.value = {
        next_page_url: response.next_page_url,
        prev_page_url: response.prev_page_url,
      };
      currentPage.value = response.current_page;
      totalPages.value = response.last_page;
      itemsPerPage.value = response.per_page;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      errorMessage.value = 'An error occurred while fetching online data.';
    }
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

const generateReceipt = async (transactionId) => {
  try {
    const response = await apiService.get(`download-sales-receipts/${transactionId}`);
    console.log(response.data);
    if (response.data) {
      generateReceiptPDF(response.data, userProfileDetails.value);
    } else {
      console.error('Failed to fetch receipt data');
    }
  } catch (error) {
    console.error('Failed to generate receipt:', error);
  }
};

const roles = computed(() => store.getUser.user.permission.role_name === "Admin");

const delPermissions = computed(() => {
  const perm = store.getUser.user.permission.permissions.find(p => p.page_name === 'sales');
  return perm.value?.del == 1; 
});
const addPermissions = computed(() => {
  const perm = store.getUser.user.permission.permissions.find(p => p.page_name === 'sales');
  return perm.write == 1; 
});

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
  /* margin-bottom: 20px; */
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
  border: 1px solid #fff; /* Add borders around cells */
  white-space: nowrap;
  color: #fff;
}

td {
  padding: 8px;
  text-align: left;
  border: 1px solid #C35214;
  ;
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
.network-status {
  padding: 10px;
  color: white;
  border-radius: 5px;
  width:10%;
}

.online {
  background-color: #4caf50; /* Green for online */
}

.offline {
  background-color: #f44336; /* Red for offline */
}
</style>
