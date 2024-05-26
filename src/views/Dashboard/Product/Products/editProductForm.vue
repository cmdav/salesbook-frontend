<template>
    <FormModal
      @close="closeModal"
      :formTitle="'Edit Product'"
      :fields="formFields"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/products'"
    />
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { formFields } from '@/formfields/formFields'
  import { useEditComposable, useSelectComposable } from '@/composable/useSharedComponent'
  
  const { showModal, closeModal } = useEditComposable()
  const { fetchDataForSelect, fetchDataForSubCategory, isOptionLoadingMsg } = useSelectComposable(
    formFields,
    '/all-product-sub-categories-by-category-id',
    'category_id',
    'sub_category_id',
    'sub_category_name'
  )
  
  onMounted(async () => {
    await fetchDataForSelect('Measurement', '/measurements', 'id', 'measurement_name')
    await fetchDataForSelect('Category', '/product-categories', 'id', 'category_name')
    await fetchDataForSelect('Product Name', '/all-products', 'id', 'product_name', formFields.value)
    await fetchDataForSelect('Currency Name', '/currencies', 'id', 'currency_name', formFields.value)
  })
  </script>
  