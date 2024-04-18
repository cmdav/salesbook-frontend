<template>
  <DashboardLayout pageTitle="Sales Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
        <div class="flex flex-row justify-between rounded-[8px] bg-brand p-4">
          <div>
            <!-- <div class="icon">
                  <img src="/assets/verifiedusers-5d08be57.svg" alt="" />
                </div> -->
            <div
              class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
            >
              <span>Total Sales</span>
            </div>
            <div class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]">
              {{ productsStore?.sales?.total }}
            </div>
          </div>
        </div>
      </div>
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="sales"
        searchEndpoint="search-sales"
        :additionalColumns=additionalColumns
      >
        <button class="btn-brand" @click="closeUploadModal">Upload</button>
      </DataTableLayout>
    </div>
    <FormModal
      v-if="showModal"
      @close="closeModal"
      :formTitle="'Add Sale'"
      :fields="saleFormFields"
      @fieldChanged="updateTotalPrice"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'sales'"
    >
    </FormModal>
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemsId"
      :url="'/sales'"
      :modalTitle="modalTitle"
    />
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      :formField="saleFormFields"
      @updated="forceRefresh"
      :url="'sales'"
    />
    <UploadModal
      v-if="showUploadModal"
      @close="closeUploadModal"
      @updated="forceRefresh"
      :url="'/sales'"
      type="Sale"
    />
  </DashboardLayout>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import { saleFormFields } from "@/formfields/formFields";

import { useSharedComponent } from "@/composable/useSharedComponent";
import { useProductStore } from "@/stores/products";
const productsStore = useProductStore();

const {
  DataTableLayout,
  FormModal,
  usePostComposable,
  useEditComposable,
  EditModal,
  useSelectComposable,
  DeleteModal,
  useDeleteComposable,
  defineEmits,
  UploadModal,
  useUploadComposable,
  useStore,
  computed,
} = useSharedComponent('sales');
const { showUploadModal, closeUploadModal } = useUploadComposable();
const emit = defineEmits("forceRefresh");
const url = "/latest-product-type-price";
const priceSoldAt= ref();
const {
  fetchDataForSelect,
  fetchDataForSubCategory,
  isOptionLoadingMsg,
} = useSelectComposable(
  saleFormFields,
  url,
  "product_type_id",
  "price_id",
  "selling_price"
);
const {  handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);

const { showModal, forceUpdate, closeModal } = usePostComposable(
  "/sales",
  saleFormFields
);
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

const forceRefresh = () => {
  forceUpdate.value++;
};

const store = useStore();
const permissions = computed(() => {
    
    return  store.getUser.user.permission.permissions.find(p => p.page_name === "measurements");
 })

const additionalColumns = computed(() => {
    const cols = [];
    if (permissions.value?.update) {
      cols.push({ name: 'Edit', action: handleEdit });
    }
    if (permissions.value?.del) {
      cols.push({ name: 'Delete', action: handleDelete });
    }
    return cols;
  });

onMounted(async () => {
  await fetchDataForSelect(
    "Product Type",
    "/all-product-type-name",
    "id",
    "product_type_name"
  );
  await fetchDataForSelect("Customer", "/user-detail", "id", "customer_id");
  await productsStore.handleGetSales();
});

// Method to update the total price

const updateTotalPrice = (fieldDatabase, value) => {
  console.log(value);

  if (fieldDatabase === "price_sold_at" || fieldDatabase === "quantity") {
       
    priceSoldAt.value =parseFloat( saleFormFields.value.find((field) => field.databaseField === "price_sold_at") ?.value) || 0;
    const quantity = parseFloat(saleFormFields.value.find((field) => field.databaseField === "quantity")?.value) || 0;
    const totalPriceField = saleFormFields.value.find((field) => field.databaseField === "total_price");
    if (totalPriceField) {
      totalPriceField.value = Math.round(priceSoldAt.value * quantity);
    }

   
  }
};

const confirmPrice = () => {
    const priceIdField = saleFormFields.value.find((field) => field.databaseField === "price_id");
    const sellingPriceOption = priceIdField.options.find(option => option.value === priceIdField.value);
    const priceSoldAtField = saleFormFields.value.find((field) => field.databaseField === "price_sold_at");
    const quantityField = saleFormFields.value.find((field) => field.databaseField === "quantity");

    // Ensure that we found the fields and sellingPriceOption before proceeding
    if (sellingPriceOption && priceSoldAtField && quantityField && parseFloat(priceSoldAtField.value) < parseFloat(sellingPriceOption.label)) {
        alert("Invalid Price: Price Sold At Cannot be less than the selling price.");
        
        // Reset the values directly in the saleFormFields
        priceSoldAtField.value = ''; // Clear the price sold at field
        quantityField.value = ''; // Clear the quantity field
    }
};
// Call this function whenever the related fields change.
watch(
  () =>
    saleFormFields.value.find((field) => field.databaseField === "price_sold_at")?.value,
  updateTotalPrice
);
watch(() => saleFormFields.value.find(field => field.databaseField === "quantity")?.value, () => {
  updateTotalPrice();
  confirmPrice();
});

</script>
