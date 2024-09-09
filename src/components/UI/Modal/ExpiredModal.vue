<template>
  <div class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full">
    <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
      
        <div class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]">
          <h3 class="text-[32px] font-EBGaramond500 text-[#244034]">Expiring Products List</h3>
          <button class="close-btn" @click="$emit('close')">X</button>
        </div>

        <div class="table-container">
            <div v-if="isLoading" class="loader-container">
            <div class="loader"></div>
            <p>Loading expired products...</p>
          </div>
          <table v-else>
            <thead>
              <tr>
                <th>S.NO</th>
                <th>PRODUCT NAME</th>
                <th>QUANTITY AVAILABLE</th>
                <th>BATCH NO</th>
                <th>SUB CATEGORY</th>
                <th>PURCHASE UNIT</th>
                <th>SELLING UNIT</th>
                <th>EXPIRE DATE</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in expiredProducts" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>{{ item.product_type_name }}</td>
                <td>{{ item.quantity_available }}</td>
                <td>{{ item.batch_no }}</td>
                <td>{{ item.product_sub_category }}</td>
                <td>{{ item.purchase_unit_name }}</td>
                <td>{{ item.selling_unit_name }}</td>
                <td>{{ item.expiry_date }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-footer my-6">
          <button class="button download-btn" @click="downloadExpiredProducts">Download</button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/services/apiService'
import { catchAxiosSuccess, catchAxiosError } from '@/services/Response';

const expiredProducts = ref([])
const isLoading = ref(true)

async function fetchExpiredProducts() {
  try {
  isLoading.value = true
    const response = await apiService.get('/list-expired-products')
    console.log(response)
    expiredProducts.value = response.data || []
    catchAxiosSuccess(response)
    console.log(expiredProducts.value)
  } catch (error) {
    console.error('Failed to fetch expired products:', error)
    catchAxiosError()
  } finally{
  isLoading.value = false
  }
}

function downloadExpiredProducts() {
  apiService.get('/list-expired-products?download=true')
    .then(response => {
      const blob = new Blob([response.data], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'expired-products.csv'
      link.click()
    })
    .catch(error => {
      console.error('Error downloading expired products:', error)
    })
}

onMounted(() => {
  fetchExpiredProducts()
})
</script>

<style scoped>
.modal {
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.modal__body {
  position: relative;
  max-width: fit-content;
  background-color: #fff;
  border-radius: 12px;
  animation: slidedown 0.8s ease;
  max-height: 90vh;
  overflow-y: auto; 
}

.modal-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 50%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background-color: red;
  border: none;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}

table-container {
  overflow-x: auto;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

th,
td {
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

.download-btn {
  background-color: #c35214;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
