<template>
  <div>
    <div
      class="px-5 py-2 mt-8 border-[1px] rounded-t-md lg:items-center gap-6 border-brand/[50%] flex flex-col lg:flex-row justify-between bg-secondary-800/[20%] text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider">
      <div class="flex flex-row relative w-full lg:w-[40%]">
        <AuthInput :error="false" type="text" v-model="searchQuery" placeholder="Search..." class="w-full !py-1"
          @input="search" />
        <button @click="clear" v-if="searchQuery" class="absolute font-bold text-red-500 text-lg right-2 top-3.5">
          X
        </button>
      </div>
      <slot></slot>
      <div v-if="hideToggleButtonLabel">
        <button @click="$emit('toggleModal')" class="btn-brand !px-4">
          {{ props?.toggleButtonLabel }}
        </button>
      </div>
    </div>

    <!-- Section for the  table -->
    <div class="w-full" v-if="!isLoading && !hasError && products.length > 0">
      <div class="relative overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th scope="col"
                class="px-5 py-5 border-b-2 border-x-[1px] border-r-gray-200 border-l-brand bg-gray-100 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider">
                S.No
              </th>
              <!-- Merge the additional columns with keys from the api -->
              <th scope="col" v-for="(col, index) in [
          ...uniqueKeys,
          ...additionalColumns.map((col) => col.name),
        ]" :key="index"
                class="px-5 py-5 border-b-[1px] border-r-[1px] border-gray-200 bg-gray-100 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider"
                :class="index ===
            [...uniqueKeys, ...additionalColumns.map((col) => col.name)].length - 1
            ? '!border-r-brand'
            : ''
          ">
                {{ formatKey(col) }}
              </th>
            </tr>
          </thead>
          <tbody v-if="searchResults?.length">
            <!-- Loop through products for each row -->
            <tr v-for="(product, index) in searchResults" :key="product.id">
              <td class="px-5 py-5 border-brand border-x-[1px] bg-white text-sm">
                {{
          (parseInt(currentPage, 10) - 1) * parseInt(itemsPerPage, 10) + index + 1
        }}
              </td>
              <td v-for="key in uniqueKeys" :key="key"
                class="px-5 py-5 border-b border-r-[1px] border-brand bg-white text-sm">
                <!-- Check for columns with onclick event -->
                <template v-if="clickableKeys[key]">
                  <span @click.prevent="clickableKeys[key](product)" class="text-blue-500 cursor-pointer">{{
          product[key] }}</span>
                </template>

                <!-- Check if key indicates an image, logo, or file -->
                <template v-else-if="isMediaKey(key)">
                  <img :src="product[key]" alt="Media"
                    class="w-10 h-10 bg-slate-500/[30%] rounded-lg mx-auto object-cover" />
                </template>

                <template v-else>
                  {{ product[key] }}
                </template>
              </td>
              <!-- template for additional code -->
              <template v-for="(col, index) in additionalColumns" :key="`${index}`">
                <td class="px-5 py-5 border-b border-x-[1px] border-brand bg-white text-sm">
                  <!--call the function define form the parent. It is passed as a props-->
                  <button @click="col.action(product)">
                    {{ formatKey(col.name) }}
                  </button>
                </td>
              </template>
            </tr>
          </tbody>
          <tbody v-if="searchQuery === ''">
            <!-- Loop through product which represents Items for each row -->
            <tr v-for="(product, index) in products" :key="product.id">
              <td class="px-5 py-5 border-brand border-x-[1px] bg-white text-sm">
                {{
          (parseInt(currentPage, 10) - 1) * parseInt(itemsPerPage, 10) + index + 1
        }}
              </td>
              <td v-for="key in uniqueKeys" :key="key" class="px-5 py-5 border-brand border-r-[1px] bg-white text-sm">
                <!-- Check for columns with onclick event. e.g click on product to view on details -->
                <template v-if="clickableKeys[key]">
                  <span @click.prevent="clickableKeys[key](product)" class="text-blue-500 cursor-pointer">{{
          product[key] }}</span>
                </template>

                <!-- Check if key indicates an image, logo, or file -->
                <template v-else-if="isMediaKey(key)">
                  <img :src="product[key]" alt="Media" class="w-10 h-10 bg-slate-500/[30%] rounded-lg object-cover" />
                </template>

                <template v-else>
                  {{ product[key] }}
                </template>
              </td>
              <!-- render content for additional code -->
              <template v-for="(col, index) in additionalColumns" :key="`${index}`">
                <td class="px-5 py-5 border-b border-x-[1px] border-brand bg-white text-sm">
                  <button @click="col.action(product)">
                    {{ formatKey(col.name) }}
                  </button>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
        <div v-if="searchResults?.length === 0 && searchQuery" class="flex justify-center py-10 text-lg">
          <p class="font-light italic">Record not found</p>
        </div>
      </div>
      <!--- Pagination link -->
      <div :class="searchResults?.length ? '!hidden' : 'flex'" class="overflow-x-auto mt-4" v-if="lastPage > 1">
        <ul class="flex space-x-2">
          <li v-for="(link, index) in paginationArray" :key="index" :class="{
          'bg-blue-500 text-white': currentPage === link,
          'bg-gray-200 text-blue-500': currentPage !== link,
        }" class="flex items-center justify-center min-w-[32px] h-[32px] rounded-full cursor-pointer">
            <a @click.prevent="fetchPage(props.endpoint, link)" class="block">
              {{ link }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div v-else-if="isLoading" class="text-center">Loading...</div>
    <div v-else-if="hasError" class="text-center">An error occur.</div>
    <div v-else class="text-center">No records found.</div>
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect, watch } from "vue";
import { useReadComposable } from "@/composable/useReadComposable";
// import { useSearchStore } from "@/composable/useSearchComposable";
import AuthInput from "@/components/UI/Input/AuthInput.vue";
// import { storeToRefs } from "pinia";
import apiService from "@/services/apiService";

//import PaginationComponent from '@/components/UI/Pagination/DataTablePagination.vue';
let searchQuery = ref("");

const props = defineProps({
  endpoint: String,
  searchEndpoint: String,
  excludedKeys: {
    type: Array,
    default: () => ["id"],
  },
  clickableKeys: {
    type: Object,
    default: () => ({}),
  },
  additionalColumns: {
    type: Array,
    default: () => [],
  },
  toggleButtonLabel: {
    type: String,
    default: "Add",
  },
  hideToggleButtonLabel: {
    type: Boolean,
    default: true,
  },
});

const {
  products,
  currentPage,
  itemsPerPage,
  lastPage,
  isLoading,
  hasError,
  uniqueKeys,
  formatKey,
  isMediaKey,
  fetchPage,
  paginationArray,
} = useReadComposable(props);
// const SearchStore = useSearchStore();
// const { searchResults } = storeToRefs(SearchStore);

//console.log(products.value)
onMounted(async () => {
  await fetchPage(props.endpoint, 1);
});
// const filteredProducts = ref([]);
let searchResults = ref([]);
// This is the data that will be returned from the API

const search = async () => {
  try {
    isLoading.value = true;
    searchResults.value = await apiService.get(
      `${props.searchEndpoint}/${searchQuery.value}`
    );
    isLoading.value = false;
    console.log(searchResults.value);
    return searchResults.value;
  } catch (error) {
    console.error(error);
    isLoading.value = false;
  }
};

// const search = () => {
//   filteredProducts.value = products?.value?.filter((product) => {
//     return (
//       Object.values(product).some((value) =>
//         value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
//       ) ||
//       (product.product_type_id &&
//         product.product_type_id
//           .toString()
//           .toLowerCase()
//           .includes(searchQuery.value.toLowerCase()))
//     );
//   });
// };
// watch(searchQuery, () => {
//   search();
// });

// Watch for changes in searchQuery
watch(searchQuery, () => {
  if (searchQuery.value === "") {
    // When searchQuery is empty, fetch page again
    (async () => {
      searchResults.value = [];
      isLoading.value = true;
      await fetchPage(props.endpoint, 1);
      isLoading.value = false;
    })();
  } else {
    search();
    // clear();
  }
});
watchEffect(async () => {
  //await fetchPage(props.endpoint, 1);
});
function clear() {
  searchQuery.value = "";
}
</script>

<style scoped>
/* Add any specific styles for your table here */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #fff;
  @apply border-b-[1px] border-b-brand;
}

tbody,
tr {
  @apply border-x-brand hover:bg-brand/[70%] hover:text-white;
}

tbody,
tr,
td {
  padding: 8px;
  text-align: left;
  @apply bg-white text-brand border-b-[1px] border-b-brand;
}

tr {
  @apply hover:bg-brand/[70%] hover:text-white;
}

thead,
tr,
th {
  @apply bg-brand/[50%] text-white;
}

.flex {
  display: flex;
  overflow-x: auto;
}

/* Style for the active link */
.bg-blue-500 {
  background-color: #4299e1;
  /* Adjust the color based on your design */
}

/* Style for the non-active links */
.bg-gray-200 {
  background-color: #edf2f7;
  /* Adjust the color based on your design */
}

/* Ensure text is centered and white for all links */
.flex a {
  color: white;
}
</style>
