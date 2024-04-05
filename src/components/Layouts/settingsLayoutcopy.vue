<template>
  <div>
    <div
      class="px-5 py-2 mt-8 border-[1px] rounded-t-md lg:items-center gap-6 border-brand/[50%] flex flex-col lg:flex-row justify-between bg-secondary-800/[20%] text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider"
    >
      <div class="flex flex-row relative w-full lg:w-[40%]">
        <AuthInput
          :error="false"
          type="text"
          v-model="searchQuery"
          placeholder="Search..."
          class="w-full !py-1"
          @input="search"
        />
        <button
          @click="clear"
          v-if="searchQuery"
          class="absolute font-bold text-red-500 text-lg right-2 top-3.5"
        >
          X
        </button>
      </div>
      <slot></slot>
      <!-- <div v-if="hideToggleButtonLabel">
        <button @click="$emit('toggleModal')" class="btn-brand !px-4">
          {{ props?.toggleButtonLabel }}
        </button>
      </div> -->
    </div>
    <!-- {{ products }} -->
    <!-- Section for the  table -->
    <div class="w-full">
      <div class="relative overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th
                scope="col"
                class="px-5 py-5 border-b-2 border-x-[1px] border-r-gray-200 border-l-brand bg-gray-100 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider"
              >
                S.No
              </th>
              <th
                scope="col"
                class="px-5 py-5 border-b-2 border-x-[1px] border-r-gray-200 border-l-brand bg-gray-100 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider"
              >
                role name
              </th>
              <th
                scope="col"
                class="px-5 py-5 border-b-2 border-x-[1px] border-r-gray-200 border-l-brand bg-gray-100 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider"
              >
                page name
              </th>
              <th
                scope="col"
                class="px-5 py-5 border-b-2 border-x-[1px] border-r-gray-200 border-l-brand bg-gray-100 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider"
              >
                Add right
              </th>
              <th
                scope="col"
                class="px-5 py-5 border-b-2 border-x-[1px] border-r-gray-200 border-l-brand bg-gray-100 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider"
              >
                View right
              </th>
              <th
                scope="col"
                class="px-5 py-5 border-b-2 border-x-[1px] border-r-gray-200 border-l-brand bg-gray-100 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider"
              >
                Edit right
              </th>

              <!-- Merge the additional columns with keys from the api -->
              <!-- <th
                scope="col"
                v-for="(col, index) in [
                  ...uniqueKeys,
                  ...additionalColumns.map((col) => col.name),
                ]"
                :key="index"
                class="px-5 py-5 border-b-[1px] border-r-[1px] border-gray-200 bg-gray-100 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider"
                :class="
                  index ===
                  [...uniqueKeys, ...additionalColumns.map((col) => col.name)].length - 1
                    ? '!border-r-brand'
                    : ''
                "
              >
                {{ formatKey(col) }}
              </th> -->
            </tr>
          </thead>

          <tbody v-if="products?.data && products?.data.length !== 0">
            <!-- Loop through product which represents Items for each row -->
            <tr v-for="(product, index) in products?.data" :key="product.id">
              <td class="px-5 py-5 border-brand border-x-[1px] bg-white text-sm">
                {{ index + 1 }}
              </td>
              <td class="px-5 py-5 border-brand border-r-[1px] bg-white text-sm">
                {{ product.role_name }}
              </td>

              <td class="px-5 py-5 border-brand border-r-[1px] bg-white text-sm">
                {{ product.page_name }}
              </td>
              <!-- <td class="px-5 py-5 border-brand border-r-[1px] bg-white text-sm">
                {{ product }}
              </td> -->
              <td
                :class="
                  product.write === '0'
                    ? '!text-white !bg-red-600'
                    : '!bg-green-600 !text-white'
                "
                class="px-5 py-5 border-brand border-r-[1px] font-extrabold bg-white text-sm"
              >
                {{ product.write === "0" ? "No access" : "Grant access" }}
              </td>
              <td
                :class="
                  product.read === '0'
                    ? '!text-white !bg-red-600'
                    : '!bg-green-600 !text-white'
                "
                class="px-5 py-5 border-brand border-r-[1px] font-extrabold bg-white text-sm"
              >
                {{ product.read === "0" ? "No access" : "Grant access" }}
              </td>
              <td
                :class="
                  product.update === '0'
                    ? '!text-white !bg-red-600'
                    : '!bg-green-600 !text-white'
                "
                class="px-5 py-5 border-brand border-r-[1px] font-extrabold bg-white text-sm"
              >
                {{ product.update === "0" ? "No access" : " Access granted" }}
              </td>
              <!-- render content for additional code -->
            </tr>
          </tbody>
          <!-- <tbody v-else>
            <div class="text-center">Loading...</div>
          </tbody> -->
        </table>
        <div v-if="products?.data?.length <= 0" class="text-center">Loading...</div>
      </div>
      <!--- Pagination link -->
      <div class="overflow-x-auto mt-4">
        <ul class="flex space-x-2">
          <li
            v-for="(link, index) in products?.links"
            :key="index"
            :class="
              products?.current_page == link.label
                ? 'bg-blue-500 text-white'
                : 'bg-blue-500/[30%] !text-black'
            "
            class="flex items-center justify-center px-4 min-w-[32px] h-[32px] rounded-full cursor-pointer"
          >
            <a
              :class="
                products?.current_page == link.label ? ' text-white' : ' !text-black'
              "
              v-html="link.label"
              @click="$emit('changePage', link.label)"
              class="block"
            >
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- <div v-else-if="isLoading" class="text-center">Loading...</div> -->
    <!-- <div v-else-if="hasError" class="text-center">An error occur.</div>
    <div v-else class="text-center">No records found.</div> -->
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watchEffect, watch } from "vue";
// import { useReadComposable } from "@/composable/useReadComposable";
// import { useSearchStore } from "@/composable/useSearchComposable";
import AuthInput from "@/components/UI/Input/AuthInput.vue";
// import { storeToRefs } from "pinia";
// import apiService from "@/services/apiService";
let isLoading = ref(false);
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
  products: { type: Object, default: () => {} },
});
// const paginationArray = computed(() => {
//   let pages = [];
//   for (let i = 1; i <= lastPage.value; i++) {
//     pages.push(i);
//   }
//   return pages;
// });

// const filteredProducts = ref([]);
let searchResults = ref([]);
// This is the data that will be returned from the API

// const search = async () => {
//   try {
//     isLoading.value = true;
//     searchResults.value = await apiService.get(
//       `${props.searchEndpoint}/${searchQuery.value}`
//     );
//     isLoading.value = false;
//     console.log(searchResults.value);
//     return searchResults.value;
//   } catch (error) {
//     console.error(error);
//     isLoading.value = false;
//   }
// };

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
// watch(searchQuery, () => {
//   if (searchQuery.value === "") {
//     // When searchQuery is empty, fetch page again
//     (async () => {
//       searchResults.value = [];
//       isLoading.value = true;
//       isLoading.value = false;
//     })();
//   } else {
//     search();
//     // clear();
//   }
// });
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
