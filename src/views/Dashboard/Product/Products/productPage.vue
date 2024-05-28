<template>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
        <div class="flex flex-row justify-between rounded-[8px] bg-brand p-4">
          <div>
            <div class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]">
              <span>Total Products</span>
            </div>
            <div class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]">
              {{ productsStore?.productType?.total }}
            </div>
          </div>
        </div>
      </div>
  
      <!-- Data Table -->
      <DataTable @toggleModal="toggleModal" />
  
      <!-- Modals -->
      <AddProductForm v-if="showModal.addProduct" @close="toggleModal('addProduct')" />
      <ProductTypeForm v-if="showModal.addProductType" @close="toggleModal('addProductType')" />
      <PriceForm v-if="showModal.addPrice" @close="toggleModal('addPrice')" />
      <UploadProductModal v-if="showModal.uploadProduct" @close="toggleModal('uploadProduct')" />
      <ViewProductModal v-if="showModal.viewProduct" @close="toggleModal('viewProduct')" />
      <EditProductForm v-if="showModal.editProduct" @close="toggleModal('editProduct')" />
      <DeleteProductModal v-if="showModal.deleteProduct" @close="toggleModal('deleteProduct')" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useProductStore } from '@/stores/products'
//   import DataTable from '@/views/Dashboard/Product/Products/dataTable.vue'
//   import AddProductForm from '@/views/Dashboard/Product/Products/addProductForm.vue'
//   import ProductTypeForm from '@/views/Dashboard/Product/Products/productTypeForm.vue'
//   import PriceForm from '@/views/Dashboard/Product/Products/priceForm.vue'
//   import UploadProductModal from '@/views/Dashboard/Product/Products/uploadProductModal.vue'
//   import ViewProductModal from '@/views/Dashboard/Product/Products/viewProductModal.vue'
//   import EditProductForm from '@/views/Dashboard/Product/Products/editProductForm.vue'
//   import DeleteProductModal from '@/views/Dashboard/Product/Products/deleteProductModal.vue'
  
  const productsStore = useProductStore()
  
  const showModal = ref({
    addProduct: false,
    addProductType: false,
    addPrice: false,
    uploadProduct: false,
    viewProduct: false,
    editProduct: false,
    deleteProduct: false
  })
  
  const toggleModal = (modal) => {
    showModal.value[modal] = !showModal.value[modal]
  }
  
  onMounted(async () => {
    await productsStore.handleGetProductType()
  })
  </script>
  
  <style scoped>
  /* Add any relevant styles here */
  </style>
  