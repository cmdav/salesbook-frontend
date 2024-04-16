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
  // let showEditModal = ref(false);
  
  // const closeEditModal = () => {
  //   showEditModal.value = false;
  // };
  
 

  // Remove all keys you don't want to render on the table. This key are passed as props
  function extractUniqueKeys(dataArray) {
    
    const excludedKeys = Array.isArray(props.excludedKeys) ? props.excludedKeys : [];

    return dataArray.reduce((keys, obj) => {
        Object.keys(obj).forEach((key) => {
            if (!keys.includes(key) && !excludedKeys.includes(key)) {
                keys.push(key);
            }
        });
        return keys;
    }, []);
}
 
 function formatKey(key) {
   // First replace '_id' with '' to remove it, then replace all remaining underscores with spaces
   return key.replace(/_id/g, '').replace(/_/g, ' ')
 }
  //check for image
  function isMediaKey(key) {
    return ['image', 'logo', 'file'].some(suffix => key.toLowerCase().endsWith(suffix));
  }

  async function fetchPage(apiUrl, page) {
    isLoading.value = true;
    hasError.value = false;
    try {
       
        // Check if apiUrl already contains a query parameter
        const separator = apiUrl.includes('?') ? '&' : '?';
        const fullUrl = `${apiUrl}${separator}page=${page}`;
      
  
        const data = await apiService.get(fullUrl);
      //const data = await apiService.get(`${apiUrl}?page=${page}`);
      //console.log('success');
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
      return data;
    } catch (error) {
      console.log('Error fetching page:', error);
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
    formatKey,
    isMediaKey,
    fetchPage,
    paginationArray,
     //closeEditModal,
  };
}
