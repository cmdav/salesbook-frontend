<template>
    <FormModal
      @close="closeModal"
      :formTitle="'Add Price'"
      :fields="priceFormFields"
      @fieldChanged="updateSellingPrice"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/prices'"
    />
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { priceFormFields } from '@/formfields/formFields'
  import { usePostComposable, useSelectComposable } from '@/composable/useSharedComponent'
  
  const { showModal, closeModal } = usePostComposable('/prices', priceFormFields)
  const { fetchDataForSelect, fetchDataForSubCategory, isOptionLoadingMsg } = useSelectComposable(
    priceFormFields,
    '/all-product-sub-categories-by-category-id',
    'category_id',
    'sub_category_id',
    'sub_category_name'
  )
  
  const updateSellingPrice = (fieldDatabase, value) => {
    // Implementation for updating selling price
  }
  
  watch(
    () => priceFormFields.value.find((field) => field.databaseField === 'auto_generated_selling_price')?.value,
    updateSellingPrice
  )
  watch(
    () => priceFormFields.value.find((field) => field.databaseField === 'cost_price')?.value,
    updateSellingPrice
  )
  
  onMounted(async () => {
    await fetchDataForSelect('Product Type', '/all-product-type-name', 'id', 'product_type_name', priceFormFields.value)
  })
  </script>
  