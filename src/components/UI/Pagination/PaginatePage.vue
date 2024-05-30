<template>
    <div class="pagination">
      <button @click="prevPage" :disabled="!hasPrevPage">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="!hasNextPage">Next</button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  // Define the props
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  });
  
  // Define the emits
  const emit = defineEmits(['changePage']);
  
  // Computed properties for enabling/disabling buttons
  const hasPrevPage = computed(() => props.currentPage > 1);
  const hasNextPage = computed(() => props.currentPage < props.totalPages);
  
  // Methods to handle page changes
  function prevPage() {
    if (hasPrevPage.value) {
      emit('changePage', props.currentPage - 1);
    }
  }
  
  function nextPage() {
    if (hasNextPage.value) {
      emit('changePage', props.currentPage + 1);
    }
  }
  </script>
  
  <style scoped>
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
  