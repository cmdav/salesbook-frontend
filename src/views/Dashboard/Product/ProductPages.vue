<template>
  <DashboardLayout>
    <!-- Container for displaying products -->
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div>
        <!-- Section for the products table -->
        <div class="lg:px-6 px-3 pt-8">
          <table class="min-w-full leading-normal">
            <!-- Table headers -->
            <thead>
             
              <tr>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  S.No 
                </th>
                <!-- Loop through unique keys and modify them for display -->
                <th v-for="key in displayKeys"
                          :key="key" 
                          class="px-5 py-3 
                                 border-b-2 
                                 border-gray-200
                                  bg-gray-100 text-left text-xs font-semibold 
                                  text-gray-600 uppercase tracking-wider"
                  >
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

          <div class="flex overflow-x-auto mt-4">
            <ul class="flex space-x-2">
              <li v-for="(link, index) in paginationArray" :key="index" 
                  :class="{'bg-blue-500': currentPage === link, 'bg-gray-200': currentPage !== link}" 
                  class="flex items-center justify-center min-w-[32px] h-[32px] rounded-full cursor-pointer text-white">
                <a @click.prevent="fetchPage(link)" class="block">
                  {{ link }}
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import apiService from '@/services/apiService';

const products = ref([]);
const uniqueKeys = ref([]);
const excludedKeys = ['id']; 
const links = ref('');
const currentPage = ref(1); 
const itemsPerPage = ref(1);
const totalPage = ref(1);
const lastPage = ref(1);

// Function to extract and process unique keys from the data array
function extractUniqueKeys(dataArray) {
  return dataArray.reduce((keys, obj) => {
    Object.keys(obj).forEach((key) => {
      if (!keys.includes(key) && !excludedKeys.includes(key)) {
        keys.push(key);
      }
    });
    return keys;
  }, []);
}

// Computed property for keys that should be displayed (excluding certain keys)
const displayKeys = computed(() => {
  return uniqueKeys.value.filter(key => !excludedKeys.includes(key));
});

// Format key for display: replace underscores with spaces
function formatKey(key) {
  return key.replace(/_/g, ' ');
}

// Check if a key corresponds to media (image, logo, file)
function isMediaKey(key) {
  return ['image', 'logo', 'file'].some(suffix => key.toLowerCase().endsWith(suffix));
}

// Component mounted lifecycle hook
onMounted(async () => {
    await fetchPage(1);
});

// Add reactive properties for handling pagination
const paginationArray = computed(() => {
  console.log(lastPage.value)
  let pages = [];
  for (let i = 1; i <= lastPage.value; i++) {
    pages.push(i);
  }
  return pages;
});

// Add method for fetching specific page
const fetchPage = async (page) => {
  try {
    const data = await apiService.get(`products?page=${page}`);
    products.value = data.data;
    uniqueKeys.value = extractUniqueKeys(data.data);
    links.value = data.links;
    itemsPerPage.value = data.per_page; // record per page
    currentPage.value = data.current_page; // current page no
    lastPage.value = data.last_page; // last page no
    totalPage.value = data.total; // total pages
  } catch (error) {
    console.error('Error fetching page:', error);
  }
};

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
