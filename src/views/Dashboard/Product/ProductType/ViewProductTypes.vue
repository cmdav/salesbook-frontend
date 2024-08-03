<template>
  <DashboardLayout pageTitle="Product Type Page">
    <div class="actions">
      <input type="text" v-model="search" placeholder="Search..." class="search-input" />
      <div  class="action">
        <!-- <BranchDropDown v-if="roles" :branches="branches" @change="handleBranchChange" /> -->

        <button class="button add-btn">
          <router-link to="/create-product-type" class="button add-btn">Add</router-link>
        </button>
      </div>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>S.NO</th>
            <th>PRODUCT NAME</th>
            <th>PRODUCT TYPE NAME</th>
            <th>PRODUCT TYPE IMAGE</th>
            <th>PRODUCT TYPE DESCRIPTION</th>
            <th>PRODUCT CATEGORY</th>
            <th>PRODUCT SUB CATEGORY</th>
            <th>QUANTITY</th>
            <th>VAT</th>
            <th>MEASUREMENT</th>
            <th>CONTAINER TYPE</th>
            <th>CONTAINER TYPE CAPACITY</th>
            <th>PURCHASING PRICE</th>
            <th>SELLING PRICE</th>
            <th>SUPPLIER NAME</th>
            <th>SUPPLIER PHONE NUMBER</th>
            <th>CREATED BY</th>
            <th>UPDATED BY</th>
            <th>DELETE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="item.id">
            <td>{{ (parseInt(currentPage, 10) - 1) * parseInt(itemsPerPage, 10) + index + 1 }}</td>
            <td>{{ item.product_name }}</td>
            <td>{{ item.product_type_name }}</td>
            <!-- <td>{{ item.product_type_image }}</td> -->
            <td><img class="w-10 h-10 bg-slate-500/[30%] rounded-lg mx-auto object-cover" :src="item.product_type_image"/></td>
            <td>{{ item.product_type_description }}</td>
            <td>{{ item.product_category }}</td>
            <td>{{ item.product_sub_category }}</td>
            <td>{{ item.quantity_available }}</td>
            <td>{{ item.vat }}</td>
            <td>{{ item.measurement }}</td>
            <td>{{ item.container_type }}</td>
            <td>{{ item.container_type_capacity }}</td>
            <td>{{ item.purchasing_price }}</td>
            <td>{{ item.selling_price }}</td>
            <td>{{ item.supplier_name }}</td>
            <td>{{ item.supplier_phone_number }}</td>
            <td>{{ item.created_by }}</td>
            <td>{{ item.updated_by }}</td>
            <td><button @click="openDeleteModal(item)">Delete</button></td>
          </tr>
        </tbody>
      </table>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>

    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemToDelete"
      :url="'purchases'"
      :modalTitle="modalTitle"
    />
    <div v-if="!isSearching" class="mx-auto w-fit my-5">
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage" />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import apiService from '@/services/apiService'
import DeleteModal from '@/components/UI/Modal/DeleteModals.vue'
import Pagination from '@/components/UI/Pagination/PaginatePage.vue'
import { useStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const store = useStore()
const { userProfileDetails } = storeToRefs(store)

const search = ref('')
const isSearching = ref(false)

const data = ref([]) // Initialize as an empty array
const pagination = ref({})
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const modalTitle = 'Delete Sale'

const currentPage = ref(1)
const totalPages = ref(0)
const itemsPerPage = ref(0)
// const branches = ref([]);
const errorMessage = ref('')

// async function fetchProductTypes() {
//   try {
//     const response = await apiService.get(`/product-types`);
//     if (response.data && response.data.length) {
//       data.value = response.data;
//       errorMessage.value = '';
//     } else {
//       data.value = [];
//       errorMessage.value = 'No items found for the selected branch.';
//     }
//   } catch (error) {
//     console.error('Failed to fetch sales data:', error);
//     errorMessage.value = 'An error occurred while fetching data.';
//   }
// }

onMounted( async() => {
  await fetchData()
});

async function fetchData(page = 1) {
  try {
    console.log('abcd')
    const response = await apiService.get(`/product-types?page=${page}`)
    console.log(response)
    data.value = response.data || []
    console.log(data.value)
    if (data.value.length === 0) {
      errorMessage.value = 'No items found'
    } else {
      errorMessage.value = ''
    }
    pagination.value = {
      next_page_url: response.next_page_url,
      prev_page_url: response.prev_page_url
    }
    currentPage.value = response.current_page
    totalPages.value = response.last_page
    itemsPerPage.value = response.per_page
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

watch(search, async (newSearch) => {
  if (newSearch) {
    isSearching.value = true
    try {
      const response = await apiService.get(`search-products/${newSearch}`)
      data.value = response
      return data.value
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  } else {
    isSearching.value = false
    fetchData()
  }
})

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    fetchData(page)
  }
}

function openDeleteModal(item) {
  itemToDelete.value = item
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  itemToDelete.value = null
}

function forceRefresh() {
  fetchData(currentPage.value)
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
  background-color: #c35214;
}

.add-btn {
  margin-left:;
  background-color: #c35214;
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
  border: 1px solid #c35214;
  /* Add borders around cells */
  white-space: nowrap;
  color: #c35214;
  font-size: 0.9em;
}

tbody tr:hover {
  background-color: #f1f5f9;
}

thead {
  background-color: #c35214;
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
  background-color: #c35214;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.pagination span {
  padding: 8px 16px;
  background-color: #c35214;
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
