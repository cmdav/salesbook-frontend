<template>
    <FormModal
      @close="closeModal"
      :formTitle="'Add Product Type'"
      :fields="productTypeFormFields"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/product-types'"
    />
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { productTypeFormFields } from '@/formfields/formFields'
  import { usePostComposable, useSelectComposable } from '@/composable/useSharedComponent'
  
  const { showModal, closeModal } = usePostComposable('/product-types', productTypeFormFields)
  const { fetchDataForSelect, fetchDataForSubCategory, isOptionLoadingMsg } = useSelectComposable(
    productTypeFormFields,
    '/all-product-sub-categories-by-category-id',
    'category_id',
    'sub_category_id',
    'sub_category_name'
  )
  
  onMounted(async () => {
    await fetchDataForSelect('Product Name', '/all-products', 'id', 'product_name', productTypeFormFields.value)
  })
  </script>
  