// useProductTable.js

import { ref, computed } from 'vue';
import apiService from '@/services/apiService';

export function useReadComposable(props = {}) {
  const products = ref([]);
  const uniqueKeys = ref([]);
  const currentPage = ref(1);
  const itemsPerPage = ref(1);
  const totalPage = ref(1);
  const lastPage = ref(1);
  const isLoading = ref(false);
  const hasError = ref(false);

  function extractUniqueKeys(dataArray) {
    return dataArray.reduce((keys, obj) => {
      Object.keys(obj).forEach((key) => {
        if (!keys.includes(key) && !props.excludedKeys.includes(key)) {
          keys.push(key);
        }
      });
      return keys;
    }, []);
  }

  const displayKeys = computed(() => {
    return uniqueKeys.value.filter(key => !props.excludedKeys.includes(key));
  });

  function formatKey(key) {
    return key.replace(/_/g, ' ');
  }

  function isMediaKey(key) {
    return ['image', 'logo', 'file'].some(suffix => key.toLowerCase().endsWith(suffix));
  }

  async function fetchPage(apiUrl, page) {
    isLoading.value = true;
    hasError.value = false;
    try {

      const data = await apiService.get(`${apiUrl}?page=${page}`);
      // process paginated endpoint
      if (data.data && Array.isArray(data.data)) {
        products.value = data.data;
        uniqueKeys.value = extractUniqueKeys(data.data);
        currentPage.value = data.current_page;
        lastPage.value = data.last_page;
        totalPage.value = data.total;
        itemsPerPage.value = data.per_page;
      } else if (Array.isArray(data)) {
        //process un paginated endpoint
        products.value = data;
        uniqueKeys.value = extractUniqueKeys(data);
      
      } else {
        products.value = [];
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      hasError.value = true;
    } finally {
      isLoading.value = false;
    }
  }

  const paginationArray = computed(() => {
    let pages = [];
    for (let i = 1; i <= lastPage.value; i++) {
      pages.push(i);
    }
    return pages;
  });

  return {
    products,
    uniqueKeys,
    currentPage,
    itemsPerPage,
    totalPage,
    lastPage,
    isLoading,
    hasError,
    displayKeys,
    formatKey,
    isMediaKey,
    fetchPage,
    paginationArray
  };
}
