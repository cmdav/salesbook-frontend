<template>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>{{ currentPage }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  
  const currentPage = ref(1);
  const pageSize = 20; // Number of items per page
  const totalItems = ref(0); // Total number of items fetched from backend
  
  // Compute total number of pages
  const totalPages = computed(() => Math.ceil(totalItems.value / pageSize));
  
  // Function to navigate to previous page
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };
  
  // Function to navigate to next page
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };
  </script>
  
  <style>
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  