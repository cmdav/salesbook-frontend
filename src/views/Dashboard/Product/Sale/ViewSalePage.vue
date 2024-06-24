<template>
  <DashboardLayout pageTitle="Sales Page">
    <div class="actions">
      <input type="text" v-model="search" placeholder="Search..." class="search-input" />
      <div v-if="addPermissions">
      <button class="button add-btn">
        <router-link to="/create-sale" class="button add-btn">Add</router-link>
      </button>
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
            <th>COST PRICE</th>
            <th>PRICE SOLD AT(NGN)</th>
            <th>QUANTITY</th>
            <th>TOTAL PRICE(NGN)</th>
            <th>PAYMENT METHOD</th>
            <th>CREATED AT</th>
            <th>TRANSACTION ID</th>
            <th>CUSTOMER DETAIL</th>
            <th>CUSTOMER PHONE NUMBER</th>
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
            <td>{{ item.batch_no }}</td>
            <td>{{ item.cost_price }}</td>
            <td>{{ item.price_sold_at }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.total_price }}</td>
            <td>{{ item.payment_method }}</td>
            <td>{{ item.created_at }}</td>
            <td>{{ item.transaction_id }}</td>
            <td>{{ item.customer_detail }}</td>
            <td>{{ item.customer_phone_number }}</td>
            <td>{{ item.created_by }}</td>
            <td>{{ item.updated_by }}</td>
            <td><button @click="generateReceipt(item.transaction_id)">Receipt</button></td>
            <td v-if="permissions"><button @click="openDeleteModal(item)">Delete</button></td>
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import apiService from '@/services/apiService';
import DeleteModal from '@/components/UI/Modal/DeleteModals.vue';
import Pagination from '@/components/UI/Pagination/PaginatePage.vue';
import { useStore } from "@/stores/user";
import { storeToRefs } from 'pinia';
import { invalidateTypeCache } from 'vue/compiler-sfc';

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

watch(search, async (newSearch) => {
  if (newSearch) {
    isSearching.value = true;
    try {
      const response = await apiService.get(`search-sales/${newSearch}`);
      data.value = response;
      return data.value;
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  } else {
    isSearching.value = false;
    fetchData();
  }
});

async function fetchData(page = 1) {
  try {
    const response = await apiService.get(`sales?page=${page}`);
    data.value = response.data || []; // Ensure it’s always an array
    pagination.value = {
      next_page_url: response.next_page_url,
      prev_page_url: response.prev_page_url,
    };
    currentPage.value = response.current_page;
    totalPages.value = response.last_page;
    itemsPerPage.value = response.per_page;
  } catch (error) {
    console.error("Failed to fetch data:", error);
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
    console.log(response.data)
    if (response.data) {
      generateReceiptPDF(response.data, userProfileDetails.value);
    } else {
      console.error('Failed to fetch receipt data');
    }
  } catch (error) {
    console.error('Failed to generate receipt:', error);
  }
};

const formatNumber = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};


const generateReceiptPDF = (receiptData, userProfileDetails) => {
  const doc = new jsPDF();

  const headerStyle = { fontSize: 18, fontStyle: 'bold' };
  const invoiceStyle = { fontSize: 15, fontStyle: 'bold' };
  const sectionHeaderStyle = { fontSize: 12, fontStyle: 'bold' };
  const companyDetailsStyle = { fontSize: 12, fontStyle: 'normal' };
  const itemStyle = { fontSize: 12 };

  doc.setFont(headerStyle.fontStyle, 'normal');
  doc.setFontSize(headerStyle.fontSize);
  doc.text(`${userProfileDetails?.company_name}`, 105, 20, null, null, 'center');


  doc.setFont(companyDetailsStyle.fontStyle, 'normal');
  doc.setFontSize(companyDetailsStyle.fontSize);
  doc.text(`Address ${userProfileDetails?.company_address}`, 105, 28, null, null, 'center');
  doc.text(`Email: ${userProfileDetails?.email}`, 105, 36, null, null, 'center');
  doc.text(`Phone No: ${userProfileDetails?.phone_number}`, 105, 44, null, null, 'center');

  doc.setFont(invoiceStyle.fontStyle, 'normal');
  doc.setFontSize(invoiceStyle.fontSize);
  doc.text('RECEIPT', 105, 55, null, null, 'center'); 

  doc.setFont(sectionHeaderStyle.fontStyle, 'normal');
  doc.setFontSize(sectionHeaderStyle.fontSize);
  doc.text(`Customer Name: ${receiptData.transaction_details.customer_detail}`, 20, 70);
  doc.text(`Customer PhoneNum: ${receiptData.transaction_details.customer_phone_number}`, 20, 78);
  doc.text(`Transaction ID: ${receiptData.transaction_details.transaction_id}`, 20, 86);
  doc.text(`Payment Method: ${receiptData.transaction_details.payment_method}`, 20, 94);
  doc.text(`Date: ${receiptData.transaction_details.created_at}`, 20, 102);

  const tableColumn = ["Product Name", "Price(NGN)", "Quantity", "VAT(NGN)", "Total Price(NGN)"];
  const tableRows = [];

  receiptData.items.forEach((item) => {
    const itemData = [
      item.product_type_name,
      item.price_sold_at,
      item.quantity,
      item.vat.toFixed(2),
      `${item.total_price}`
    ];
    tableRows.push(itemData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 115,
    styles: { fontSize: itemStyle.fontSize },
    theme: 'plain',
    tableLineColor: [0, 0, 0], 
    tableLineWidth: 0.1, 
  });

  let finalY = doc.autoTable.previous.finalY + 10;
  doc.setFont(invoiceStyle.fontStyle)
  doc.setFontSize(invoiceStyle.fontSize);
  doc.text(`Total Amount (NGN): ${formatNumber(receiptData.transaction_details.transaction_amount.toFixed(2))}`, doc.internal.pageSize.width - 20, finalY, null, null, 'right');

   
  doc.setFontSize(itemStyle.fontSize);
  doc.text('Thanks for your patronage!', 105, finalY + 15, null, null, 'center');

  const pdfDataUri = doc.output('datauristring');
  const viewerWindow = window.open();
  viewerWindow.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);
};

onMounted(() => fetchData(currentPage.value));

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
</style>
