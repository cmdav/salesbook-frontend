<template>
  <div>
    <div
      class="px-5 py-2 mt-8 border-b-2 border-gray-200 flex justify-between bg-gray-100 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider"
    >
      <div class="flex flex-row relative w-[40%]">
        <AuthInput
          :error="false"
          type="text"
          v-model="searchQuery"
          placeholder="Search..."
          class="w-full"
          @input="search"
        />
        <button
          @click="clear"
          v-if="searchQuery"
          class="absolute font-bold text-red-500 text-lg right-2 top-2.5"
        >
          X
        </button>
      </div>

      <button @click="$emit('toggleModal')" class="btn-brand">
        {{ props?.toggleButtonLabel }}
      </button>
    </div>

    <!-- Section for the  table -->
    <div class="" v-if="!isLoading && !hasError && products.length > 0">
      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th
              class="px-5 py-5 border-b-2 border-gray-200 bg-gray-100 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider"
            >
              S.No
            </th>
            <!-- Merge the additional columns with keys from the api -->
            <th
              v-for="col in [...uniqueKeys, ...additionalColumns.map((col) => col.name)]"
              :key="col"
              class="px-5 py-5 border-b-2 border-gray-200 bg-gray-100 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider"
            >
              {{ formatKey(col) }}
            </th>
          </tr>
        </thead>

        <tbody v-if="filteredProducts?.length">
          <!-- Loop through products for each row -->
          <tr
            v-for="(product, index) in filteredProducts"
            :key="product.id"
            class="hover:bg-gray-100"
          >
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {{
                (parseInt(currentPage, 10) - 1) * parseInt(itemsPerPage, 10) + index + 1
              }}
            </td>
            <td
              v-for="key in uniqueKeys"
              :key="key"
              class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
            >
              <!-- Check for columns with onclick event -->
              <template v-if="clickableKeys[key]">
                <span
                  @click.prevent="clickableKeys[key](product)"
                  class="text-blue-500 cursor-pointer"
                  >{{ product[key] }}</span
                >
              </template>

              <!-- Check if key indicates an image, logo, or file -->
              <template v-else-if="isMediaKey(key)">
                <img
                  :src="product[key]"
                  alt="Media"
                  class="w-10 h-10 bg-slate-500/[30%] rounded-lg object-cover"
                />
              </template>

              <template v-else>
                {{ product[key] }}
              </template>
            </td>
            <!-- template for additional code -->
            <template v-for="(col, index) in additionalColumns" :key="`${index}`">
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <button @click="col.action(product)">
                  {{ formatKey(col.name) }}
                </button>
              </td>
            </template>
          </tr>
        </tbody>
        <tbody v-else>
          <!-- Loop through product which represents Items for each row -->
          <tr
            v-for="(product, index) in products"
            :key="product.id"
            class="hover:bg-gray-100"
          >
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {{
                (parseInt(currentPage, 10) - 1) * parseInt(itemsPerPage, 10) + index + 1
              }}
            </td>
            <td
              v-for="key in uniqueKeys"
              :key="key"
              class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
            >
              <!-- Check for columns with onclick event -->
              <template v-if="clickableKeys[key]">
                <span
                  @click.prevent="clickableKeys[key](product)"
                  class="text-blue-500 cursor-pointer"
                  >{{ product[key] }}</span
                >
              </template>

              <!-- Check if key indicates an image, logo, or file -->
              <template v-else-if="isMediaKey(key)">
                <img
                  :src="product[key]"
                  alt="Media"
                  class="w-10 h-10 bg-slate-500/[30%] rounded-lg object-cover"
                />
              </template>

              <template v-else>
                {{ product[key] }}
              </template>
            </td>
            <!-- render content for additional code -->
            <template v-for="(col, index) in additionalColumns" :key="`${index}`">
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <button @click="col.action(product)">
                  {{ formatKey(col.name) }}
                </button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>

      <!--- Pagination link -->
      <div class="flex overflow-x-auto mt-4" v-if="lastPage > 1">
        <ul class="flex space-x-2">
          <li
            v-for="(link, index) in paginationArray"
            :key="index"
            :class="{
              'bg-blue-500': currentPage === link,
              'bg-gray-200': currentPage !== link,
            }"
            class="flex items-center justify-center min-w-[32px] h-[32px] rounded-full cursor-pointer text-white"
          >
            <a @click.prevent="fetchPage(props.endpoint, link)" class="block">
              {{ link }}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div v-else-if="isLoading" class="text-center">Loading...</div>
    <div v-else-if="hasError" class="text-center">
      Network error, please try again later.
    </div>
    <div v-else class="text-center">No records found.</div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useReadComposable } from "@/composable/useReadComposable";
import AuthInput from "@/components/UI/Input/AuthInput.vue";

//import PaginationComponent from '@/components/UI/Pagination/DataTablePagination.vue';
const searchQuery = ref("");

const props = defineProps({
  endpoint: String,
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
});

const {products,currentPage,itemsPerPage,lastPage,isLoading,hasError,uniqueKeys,formatKey,isMediaKey,fetchPage,paginationArray,
} = useReadComposable(props);

onMounted(async () => {
  await fetchPage(props.endpoint, 1);
});
const filteredProducts = ref([]);

const search = () => {
  filteredProducts.value = products?.value?.filter((product) => {
    return Object.values(product).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
};
watch(searchQuery, () => {
  search();
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