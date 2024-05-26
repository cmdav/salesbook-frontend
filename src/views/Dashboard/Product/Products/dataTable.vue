<template>
    <div>
      <button @click="toggleAddProductModal" class="btn-brand">Add Product</button>
      <button @click="toggleAddProductTypeModal" class="btn-brand">Add Product Type</button>
      <button @click="toggleAddPriceModal" class="btn-brand">Add Price</button>
      <button @click="toggleUploadProductModal" class="btn-brand">Upload Product</button>
  
      <table>
        <thead>
          <tr>
            <th v-for="(column, index) in columns" :key="index">{{ column }}</th>
            <th v-for="action in additionalColumns" :key="action.name">{{ action.name }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="index">
            <td v-for="(column, key) in columns" :key="key">{{ item[key] }}</td>
            <td v-for="action in additionalColumns" :key="action.name">
              <button @click="action.action(item)">{{ action.name }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useProductStore } from '@/stores/products'
  
  const productsStore = useProductStore()
  const data = ref([])
  const columns = ref([])
  const additionalColumns = ref([])
  
  onMounted(async () => {
    await fetchProducts()
    setupColumns()
    setupAdditionalColumns()
  })
  
  const fetchProducts = async () => {
    await productsStore.handleGetProductType()
    data.value = productsStore.productType.items
  }
  
  const setupColumns = () => {
    // Setup the columns you want to display in the table
    columns.value = ['Product Name', 'Product Type', 'Category', 'Price']
  }
  
  const setupAdditionalColumns = () => {
    additionalColumns.value = [
      { name: 'Edit', action: handleEdit },
      { name: 'Delete', action: handleDelete }
    ]
  }
  
  const toggleAddProductModal = () => {
    // Logic to toggle add product modal
  }
  
  const toggleAddProductTypeModal = () => {
    // Logic to toggle add product type modal
  }
  
  const toggleAddPriceModal = () => {
    // Logic to toggle add price modal
  }
  
  const toggleUploadProductModal = () => {
    // Logic to toggle upload product modal
  }
  
  const handleEdit = (item) => {
    // Logic to handle edit
  }
  
  const handleDelete = (item) => {
    // Logic to handle delete
  }
  </script>
  
  <style scoped>
  /* Add any relevant styles here */
  </style>
  