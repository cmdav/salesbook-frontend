
<template>
  <DashboardLayout pageTitle="Logs Page">
    

    <div class="actions">
      <input type="text" v-model="search" placeholder="Search..." class="search-input" />
      <!-- <button class="button add-btn"><router-link to="/create-purchase" class="button add-btn">Add</router-link></button> -->

      <!-- <BranchDropDown v-if="roles" :branches="branches" @change="handleBranchChange" /> -->
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>S.NO</th>
            <th>ACTIVITY</th>
            <th>CREATED AT</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredData" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.activity }}</td>
            <td>{{ item.created_at }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>

    <div class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="!pagination.prev_page_url">
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="!pagination.next_page_url">
        Next
      </button>
    </div>
  </DashboardLayout>

 
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import apiService from '@/services/apiService'
//import { getDb, setDb } from '@/utils/db'
// import BranchDropDown from '@/components/UI/Dropdown/BranchDropDown.vue'
import { useStore } from '@/stores/user'


const search = ref('')
const data = ref([])
const pagination = ref({})

const currentPage = ref(1)
const totalPages = ref(0)
const branches = ref([])
const errorMessage = ref('')


onMounted(async () => {
  try {
    const response = await apiService.get('/list-business-branches')
    branches.value = response || []
    console.log(branches.value)
  } catch (error) {
    console.error('Failed to fetch branches:', error)
  }
})

// function handleBranchChange(selectedBranchId) {
//   if (selectedBranchId) {
//     fetchBranch(selectedBranchId)
//   } else {
//     fetchData(currentPage.value)
//   }
// }

async function fetchBranch(branchId = 1) {
  try {
      const response = await apiService.get(`logs?branch_id=${branchId}`)
   
    if (response.data && response.data.length) {
      data.value = response.data
      errorMessage.value = ''
    } else {
      data.value = []
      errorMessage.value = 'No items found for the selected branch.'
    }
  } catch (error) {
    console.error('Failed to fetch sales data:', error)
    errorMessage.value = 'An error occurred while fetching data.'
  }
}

const filteredData = computed(() => {
  return data.value.filter((item) => {
    const description = item.activity || ''
    return description.toLowerCase().includes(search.value.toLowerCase())
  })
})

async function fetchData(page = 1) {
  try {
      const response = await apiService.get(`logs?page=${page}`)
    console.log(response.data.data)
    data.value = response.data.data || [] 
    pagination.value = {
      next_page_url: response.data.next_page_url,
      prev_page_url: response.data.prev_page_url
    }
    currentPage.value = page
    totalPages.value = response.data.last_page

    // Cache the data in IndexedDB
   // await setDb('stores', { id: `page-${page}`, data: data.value })
    console.log(`Data from API cached for page ${page}`)
  } catch (error) {
    console.error('Failed to fetch data:', error)
    // Retrieve data from IndexedDB if fetch fails
    // const cachedData = await getDb('stores', `page-${page}`)
    // if (cachedData) {
    //   data.value = cachedData.data
    //   console.log(`Data retrieved from IndexedDB for page ${page}`)
    //   pagination.value = {
    //     next_page_url:
    //       currentPage.value < totalPages.value ? `stores?page=${currentPage.value + 1}` : null,
    //     prev_page_url: currentPage.value > 1 ? `stores?page=${currentPage.value - 1}` : null
    //   }
    // } else {
    //   console.log(`No cached data found for page ${page}`)
    // }
  }
}

// const checkExpiredProduct = async () => {
//   try {
//     const response = await apiService.get('/list-expired-products')
//     // purchaseUnit.value = response.data
//     console.log(response)
//     // if (formState.purchaseUnit) {
//     //   await fetchSellingUnit(formState.purchaseUnit)
//     // }
//     catchAxiosSuccess(response.message)
//   } catch (error) {
//     console.error('Error fetching purchasing unit:', error)
//     catchAxiosError(error)
//   }
// }

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    fetchData(page)
  }
}

const store = useStore()
const roles = computed(() => store.getUser.user.permission.role_name === 'Admin')

onMounted(() => fetchData(currentPage.value))
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

.prod_des{
  white-space: pre-wrap;
  word-wrap: break-word;
}

th{
  color: white;
}
td{
  color: #c35214;
}
th,
td {
  max-width: 35em;
  padding: 8px;
  text-align: left;
  border: 2px solid #c35214;
  white-space: nowrap;
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
