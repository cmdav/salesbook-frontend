<template>
    <UploadModal
      @close="closeModal"
      :url="'/products'"
      type="Product"
      @updated="forceRefresh"
    />
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useUploadComposable } from '@/composable/useSharedComponent'
  
  const { showModal, closeModal, forceRefresh } = useUploadComposable()
  </script>
  