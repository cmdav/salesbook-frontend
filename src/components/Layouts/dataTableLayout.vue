<template>
  
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div>
        <!-- Section for the products table -->
        <div class="lg:px-6 px-3 pt-8" v-if="!isLoading && !hasError && products.length > 0">
          <table class="min-w-full leading-normal">
           
            <thead>
             
              <tr>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  S.No 
                </th>
                <th v-for="key in displayKeys"
                          :key="key" 
                          class="px-5 py-3 border-b-2 border-gray-20 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {{ formatKey(key) }}
                </th>
              </tr>
            </thead>
            
            <tbody>
              <!-- Loop through products for each row -->
              <tr v-for="(product, index) in products" :key="product.id" class="hover:bg-gray-100">
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                     {{ ((parseInt(currentPage, 10) - 1) * parseInt(itemsPerPage, 10)) + index + 1 }} 
                </td>
                <td v-for="key in displayKeys" :key="key" class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <!-- Check if key indicates an image, logo, or file -->
                  <template v-if="isMediaKey(key)">
                    <img :src="product[key]" alt="Media" class="w-20 h-20 object-cover"> 
                  </template>
                  <template v-else>
                    {{ product[key] }} 
                  </template>
                </td>
              </tr>
            </tbody>
          </table>


          
          <!--- Pagination link -->
          <div class="flex overflow-x-auto mt-4" v-if="lastPage > 1">
            <ul class="flex space-x-2">
              <li v-for="(link, index) in paginationArray" :key="index" 
                  :class="{'bg-blue-500': currentPage === link, 'bg-gray-200': currentPage !== link}" 
                  class="flex items-center justify-center min-w-[32px] h-[32px] rounded-full cursor-pointer text-white">
                <a @click.prevent="fetchPage(props.endpoint,link)" class="block">
                  {{ link }}
                </a>
              </li>
            </ul>
          </div>

        </div>
        <div v-else-if="isLoading" class="text-center">
          Loading...
        </div>
        <div v-else-if="hasError" class="text-center">
          Network error, please try again later.
        </div>
        <div v-else class="text-center">
          No records found.
        </div>
      </div>
    </div>
 
</template>

<script setup>
import { onMounted } from 'vue';
import { useReadComposable} from '@/composable/useReadComposable';

//import PaginationComponent from '@/components/UI/Pagination/DataTablePagination.vue';

const props = defineProps({
  endpoint: String, 
  excludedKeys: { 
    type: Array,
    default: () => ['id'] 
  }
});

const {
  products,
  currentPage,
  itemsPerPage,
  lastPage,
  isLoading,
  hasError,
  displayKeys,
  formatKey,
  isMediaKey,
  fetchPage,
  paginationArray
} = useReadComposable(props);

onMounted(async () => {
  await fetchPage(props.endpoint, 1);
});


</script>

<style scoped>
/* Add any specific styles for your table here */
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
tr:hover {
  background-color: #f5f5f5;
}
.flex {
  display: flex;
  overflow-x: auto;
}

/* Style for the active link */
.bg-blue-500 {
  background-color: #4299e1; /* Adjust the color based on your design */
}

/* Style for the non-active links */
.bg-gray-200 {
  background-color: #edf2f7; /* Adjust the color based on your design */
}

/* Ensure text is centered and white for all links */
.flex a {
  color: white;
}

</style>
