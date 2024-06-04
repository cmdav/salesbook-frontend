<template>
    <DeleteModal
      @close="closeModal"
      @updated="forceRefresh"
      :items="itemsId"
      :url="'/product-types'"
      :modalTitle="modalTitle"
    />
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useDeleteComposable } from '@/composable/useSharedComponent'
  
  const { handleDelete, showModal, closeModal, itemsId, forceRefresh } = useDeleteComposable()
  const modalTitle = 'Delete Product'
  </script>
  