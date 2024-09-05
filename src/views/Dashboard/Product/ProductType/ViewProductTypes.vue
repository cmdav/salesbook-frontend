<template>
  <DashboardLayout pageTitle="Product Page">
    <div class="actions">
      <input type="text" v-model="search" placeholder="Search..." class="search-input" />

      <!-- <BranchDropDown v-if="roles" :branches="branches" @change="handleBranchChange" /> -->
      <div>
        <button class="button upload-btn" @click="openUploadModal()">
          Upload
          <!-- <router-link to="/create-product-type" class="button add-btn">Add</router-link> -->
        </button>
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
            <!-- <th>PRODUCT NAME</th> -->
            <th>PRODUCT NAME</th>
            <th>PRODUCT IMAGE</th>
            <th>PRODUCT DESCRIPTION</th>
            <th>PRODUCT CATEGORY</th>
            <th>PRODUCT SUB CATEGORY</th>
            <th>QUANTITY</th>
            <th>VAT</th>
            <th>SELLING UNIT</th>
            <th>SELLING UNIT CAPACITY</th>
            <th>PURCHASING PRICE</th>
            <th>SELLING PRICE</th>
            <th>SUPPLIER NAME</th>
            <th>SUPPLIER PHONE NUMBER</th>
            <th>CREATED BY</th>
            <th>UPDATED BY</th>
            <th>EDIT</th>
            <th>DELETE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="item.id">
            <td>{{ (parseInt(currentPage, 10) - 1) * parseInt(itemsPerPage, 10) + index + 1 }}</td>
            <!-- <td>{{ item.product_name }}</td> -->
            <td>{{ item.product_type_name }}</td>
            <!-- <td>{{ item.product_type_image }}</td> -->
            <td>
              <img
                class="w-10 h-10 bg-slate-500/[30%] rounded-lg mx-auto object-cover"
                :src="item.product_type_image"
              />
            </td>
            <td>{{ item.product_type_description }}</td>
            <td>{{ item.product_category }}</td>
            <td>{{ item.product_sub_category }}</td>
            <td>{{ item.quantity_available }}</td>
            <td>{{ item.vat }}</td>

            <td>{{ item.selling_unit_name }}</td>
            <td>{{ item.selling_unit_capacity }}</td>
            <td>{{ item.purchasing_price }}</td>
            <td>{{ item.selling_price }}</td>
            <td>{{ item.supplier_name }}</td>
            <td>{{ item.supplier_phone_number }}</td>
            <td>{{ item.created_by }}</td>
            <td>{{ item.updated_by }}</td>
            <td><button @click="openEditModal(item)">Edit</button></td>
            <td><button @click="openDeleteModal(item)">Delete</button></td>
          </tr>
        </tbody>
      </table>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>

    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="itemToEdit"
      @updated="forceRefresh"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :formField="productTypeFormFields"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/product-types'"
    />

    <UploadModal
      v-if="showUploadModal"
      @close="closeUploadModal"
      @updated="forceRefresh"
      :url="'/process-csv'"
      :downloadUrl="'product'"
      type="Product"
    />

    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemToDelete"
      :url="'product-types'"
      :modalTitle="modalTitle"
    />
    <div v-if="!isSearching" class="mx-auto w-fit my-5">
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage" />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import apiService from '@/services/apiService'
import DeleteModal from '@/components/UI/Modal/DeleteModals.vue'
import UploadModal from '@/components/UI/Modal/UploadModal.vue'
import EditModal from '@/components/UI/Modal/EditModal.vue';
import Pagination from '@/components/UI/Pagination/PaginatePage.vue'
import { productTypeFormFields } from '@/formfields/formFields';
import { useSharedComponent } from '@/composable/useSharedComponent'

const search = ref('')
const isSearching = ref(false)

const data = ref([])
const pagination = ref({})
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showUploadModal = ref(false)
const itemToDelete = ref({})
const itemToEdit = ref(null)
const modalTitle = 'Delete Product'

const currentPage = ref(1)
const totalPages = ref(0)
const itemsPerPage = ref(0)
// const branches = ref([]);
const errorMessage = ref('')

const { useSelectComposable } = useSharedComponent('products')

const purchaseUnits = ref([]);
const sellingUnits = ref([]);
const sellingCapacities = ref([]);

onMounted(async () => {
  await fetchData()
   await fetchPurchaseUnits();
})

const url = '/all-product-sub-categories-by-category-id'

const { fetchDataForSelect, fetchDataForSubCategory, isOptionLoadingMsg } = useSelectComposable(
  productTypeFormFields,
  url,
   'category_id',
  'sub_category_id',
  'sub_category_name'
)

onMounted(async () => {
  await fetchDataForSelect('Product Category', '/product-categories', 'id', 'category_name')
  await fetchDataForSelect('Purchase Unit', '/list-purchase-units', 'id', 'purchase_unit_name')
  
});

async function fetchPurchaseUnits() {
  try {
    const response = await apiService.get('/list-purchase-units');
    console.log(response.data)
    purchaseUnits.value = response.data || [];
  } catch (error) {
    console.error('Error fetching purchase units:', error);
  }
}

async function fetchSellingUnits(purchaseUnitId) {
  const selectedPurchaseUnit = purchaseUnits.value.find(unit => unit.id === purchaseUnitId);

  if (selectedPurchaseUnit) {
    sellingUnits.value = selectedPurchaseUnit.selling_units || [];

    const sellingUnitField = productTypeFormFields.value.find(f => f.databaseField === 'selling_unit_id');
    if (sellingUnitField) {
      sellingUnitField.options = sellingUnits.value.map(unit => ({
        value: unit.id,
        label: unit.selling_unit_name
      }));
    }
  }
}

async function fetchSellingCapacities(sellingUnitId) {
  const selectedSellingUnit = sellingUnits.value.find(unit => unit.id === sellingUnitId);

  if (selectedSellingUnit) {
    sellingCapacities.value = selectedSellingUnit.selling_capacities || [];

    const sellingCapacityField = productTypeFormFields.value.find(f => f.databaseField === 'selling_unit_capacity_id');
    if (sellingCapacityField) {
      sellingCapacityField.options = sellingCapacities.value.map(capacity => ({
        value: capacity.id,
        label: capacity.capacity_name
      }));
    }
  }
}

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
      const response = await apiService.get(`search-product-types/${newSearch}`)
      console.log(response)
      if(response.length>0){
      data.value = response
      // return data.value
      console.log(data.value)
      }else {
        data.value= [];
        errorMessage.value = response.message || 'No Product found'
      }

    } catch (error) {
      console.error('Failed to fetch data:', error)
      data.value = [];
      errorMessage.value = 'Error Occur while searching products'
    } finally {
      isSearching.value = false
    }
  } else {
    isSearching.value = false;
    errorMessage.value = '';
    fetchData(currentPage.value)
  }
})

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    fetchData(page)
  }
}

const openEditModal = async(item) => {
  itemToEdit.value = item

   await fetchPurchaseUnits();

   await fetchSellingUnits(item.purchase_unit_id);
  await fetchSellingCapacities(item.selling_unit_id);

  productTypeFormFields.value.forEach(field => {
    if (field.databaseField === 'selling_unit_id') {
      field.value = item.selling_unit_id;
    }
    if (field.databaseField === 'selling_unit_capacity_id') {
      field.value = item.selling_unit_capacity_id;
    }
  });

  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  itemToEdit.value = null
}

function openDeleteModal(item) {
  itemToDelete.value = item
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  itemToDelete.value = null
}
function openUploadModal() {
  showUploadModal.value = true
}

function closeUploadModal() {
  showUploadModal.value = false
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
  margin-right: 2em;
}

.add-btn {
  /* margin-left:; */
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
