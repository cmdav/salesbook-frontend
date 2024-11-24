<template>
  <DashboardLayout pageTitle="Logs Page">
    <div class="actions">
      <div class="filters">
        <input type="text" v-model="search" placeholder="Search..." class="search-input" />
        <div class="date-filters">
          <input 
            type="date" 
            v-model="startDate" 
            class="date-input"
            @change="handleDateChange"
          />
          <span class="date-separator">to</span>
          <input 
            type="date" 
            v-model="endDate" 
            class="date-input"
            @change="handleDateChange"
          />
        </div>
      </div>
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

const search = ref('')
const data = ref([])
const pagination = ref({})
const currentPage = ref(1)
const totalPages = ref(0)
const branches = ref([])
const errorMessage = ref('')
const startDate = ref('')
const endDate = ref('')

onMounted(async () => {
  try {
    const response = await apiService.get('/list-business-branches')
    branches.value = response || []
    console.log(branches.value)
  } catch (error) {
    console.error('Failed to fetch branches:', error)
  }
})

const filteredData = computed(() => {
  return data.value.filter((item) => {
    const description = item.activity || ''
    return description.toLowerCase().includes(search.value.toLowerCase())
  })
})

async function fetchData(page = 1) {
  try {
    let url = `logs?page=${page}`
    if (startDate.value && endDate.value) {
      url += `&start_time=${startDate.value}&end_time=${endDate.value}`
    }
    
    const response = await apiService.get(url)
    console.log(response.data.data)
    data.value = response.data.data || []
    pagination.value = {
      next_page_url: response.data.next_page_url,
      prev_page_url: response.data.prev_page_url
    }
    currentPage.value = page
    totalPages.value = response.data.last_page

    console.log(`Data from API cached for page ${page}`)
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

function handleDateChange() {
  if (startDate.value && endDate.value) {
    fetchData(1)
  }
}

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    fetchData(page)
  }
}

onMounted(() => fetchData(currentPage.value))
</script>

<style scoped>
.actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 20px;
  align-items: center;
  width: 100%;
}

.date-filters {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-input {
  padding: 8px;
  border: 2px solid #ccc;
  border-radius: 4px;
  color: #333;
}

.date-separator {
  color: #666;
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