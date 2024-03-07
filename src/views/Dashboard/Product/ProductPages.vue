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
            <!-- Table body -->
            <tbody>
              <!-- Loop through products for each row -->
              <tr v-for="product in products" :key="product.id" class="hover:bg-gray-100">
               
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
  try {
    const data = await apiService.get('products');
    products.value = data.data;
    uniqueKeys.value = extractUniqueKeys(data.data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
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
</style>
