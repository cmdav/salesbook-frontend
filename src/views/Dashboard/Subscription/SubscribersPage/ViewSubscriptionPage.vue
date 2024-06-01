<template>
  <div class="actions">
    <input type="text" v-model="search" placeholder="Search..." class="search-input" />
    <div v-if="permissions">
      <button class="button add-btn"><router-link to="/create-subscription"
          class="button add-btn">Add</router-link></button>
    </div>
  </div>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>S.NO</th>
          <th>PLAN NAME</th>
          <th>DESCRIPTION</th>
          <th>ORGANIZATION NAME</th>
          <th>START DATE</th>
          <th>END DATE</th>
          <th>STATUS</th>
          <th>EDIT</th>
          <th>DELETE</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredData" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>{{ item.subscription_plan_name }}</td>
          <td>{{ item.subscription_description }}</td>
          <td>{{ item.organization_name }}</td>
          <td>{{ item.start_time }}</td>
          <td>{{ item.end_time }}</td>
          <td>{{ item.status }}</td>
          <td><button @click="openDeleteModal(item)">Edit</button></td>
          <td><button @click="openDeleteModal(item)">Delete</button></td>
        </tr>
      </tbody>
    </table>
  </div>


  <FormModal v-if="showModal" @close="closeModal" @updated="forceRefresh" :key="forceRefresh"
    :formTitle="'Add Subscription Plan'" :fields="subscriptionFormFields" :isLoadingMsg="isOptionLoadingMsg"
    :url="'subscriptions'">
  </FormModal>

  <DeleteModal v-if="showDeleteModal" @close="closeDeleteModal" @updated="forceRefresh" :items="itemToDelete"
    :url="'purchases'" :modalTitle="modalTitle" />

  <div class="pagination">
    <button @click="changePage(currentPage - 1)" :disabled="!pagination.prev_page_url">Previous</button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="changePage(currentPage + 1)" :disabled="!pagination.next_page_url">Next</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import apiService from '@/services/apiService';
import DeleteModal from '@/components/UI/Modal/DeleteModals.vue';
import { useStore } from "@/stores/user";
import { useSubscriptions } from '@/stores/subscriptions'

const subscriptionsStore = useSubscriptions()
const search = ref('');
const data = ref([]);
const pagination = ref({});
const showDeleteModal = ref(false);
const itemToDelete = ref(null);
const modalTitle = "Delete Purchase";

const currentPage = ref(1);
const totalPages = ref(0);

// const filteredData = computed(() => {
//   return data.value.filter(item => {
//     const description = item.product_type_description || '';
//     return description.toLowerCase().includes(search.value.toLowerCase());
//   });
// });


// const fetchSubscribers = async () => {
//   await subscriptionsStore.handleGetAllSubscribers()
//   data.value = subscriptionsStore.allSubscribers
//   console.log(data.value)
// }

const filteredData = computed(() => {
  return data.value.filter(item => {
    const description = item.subscription_description || '';
    return description.toLowerCase().includes(search.value.toLowerCase());
  });
});

async function fetchData(page = 1) {
  try {
    const response = await apiService.get(`subscription-statuses`)
    data.value = response.data || []
    console.log(data.value)
    pagination.value = {
      next_page_url: response.next_page_url,
      prev_page_url: response.prev_page_url
    }
    currentPage.value = page
    totalPages.value = response.last_page
  } catch (error) {
    console.error('Failed to fetch data:', error)
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

onMounted(() => fetchData(currentPage.value));

// onMounted(() => fetchSubscribers());


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
