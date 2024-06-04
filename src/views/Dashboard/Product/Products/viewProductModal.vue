<template>
    <ViewModal @close="closeModal" :modalTitle="modalTitle">
      <ViewModalDetail :products="products" />
    </ViewModal>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useViewComposable } from '@/composable/useSharedComponent'
  
  const products = ref([])
  const { showModal, closeModal } = useViewComposable()
  const modalTitle = 'View Product'
  </script>
  