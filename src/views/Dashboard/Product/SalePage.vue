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
        @toggleModal="showSalesModal = !showSalesModal"
        :key="forceUpdate"
        endpoint="sales"
        searchEndpoint="search-sales"
        :additionalColumns="additionalColumns"
      >
        <button class="btn-brand" @click="closeUploadModal">Upload</button>
      </DataTableLayout>
    </div>
    <SaleFormModal
      v-if="showSalesModal"
      :buttonLable="'submit'"
      :loading="salesLoading"
      @close="closeSalesModal"
      @submitForm="handleAddSales"
      title="Add Sale"
    >
   
  <div class="mt-4">
        <span class="font-medium text-gray-700">Print Receipt:</span>
        <label class="ml-4">
          <input type="radio" value="yes" v-model="printReceipt" />
          Yes
        </label>
        <label class="ml-2">
          <input type="radio" value="no" v-model="printReceipt" />
          No
        </label>
      </div>

      <!-- Conditionally render Customer select based on printReceipt -->
      <div v-if="printReceipt === 'yes'" class="mt-4 flex items-center">
        <div class="flex-grow">
          <select
            v-model="formState.customer_id"
            class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
          >
            <option v-for="name in allCustomersNames" :key="name.id" :value="name.id">
              {{ name.customer_detail }}
            </option>
          </select>

        </div>
        <button type="button" class="ml-4 btn-brand" @click="addNewCustomer">Add Customer</button>
      
      </div>
  <div class="mt-4">
    <label class="block text-sm font-medium text-gray-700">Payment method</label>
    <select
      required
      v-model="formState.payment_method"
      class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
    >
      <option
        v-for="option in [
          { value: 'cash', label: 'Cash' },
          { value: 'pos', label: 'Pos' },
          { value: 'bank-transfer', label: 'Bank Transfer' },
        ]"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
  <div class="my-8">
    <div class="flex justify-end">
      <button
       type="button"
        @click="addProducts"
        class="btn-brand !bg-brand/[20%] !text-black !px-3"
      >
        Add product
      </button>
    </div>
    <div
    v-for="(question, index) in formState.products"
    :key="index"
    class="flex justify-between items-end mt-4"
  >
    <div class="flex-1 mr-2">
      <label class="block text-sm font-medium text-gray-700">Product</label>
      <select
        v-model="formState.products[index].product_type_id"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
      >
        <option
          v-for="name in allProductTypeName"
          :key="name.id"
          :value="name.id"
        >
          {{ name.product_type_name }}
        </option>
      </select>
    </div>
    <div class="flex-1 mr-2">
      <label class="block text-sm font-medium text-gray-700">Product Batch</label>
      <select
        v-model="formState.products[index].batch_id"
        @change="updateBatchDetails(formState.products[index].batch_id, index)"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
      >
        <option
          v-for="batch in formState.products[index].batches"
          :key="batch.id"
          :value="batch.id"
        >
          {{ batch.batch_no }}
        </option>
      </select>
    </div>
    <div class="w-20 mr-2">
      <label class="block text-sm font-medium text-gray-700">Qty left</label>
      <input
        type="number"
        :value="formState.products[index].available_qty"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
        readonly
      />
    </div>
    <div class="w-20 mr-2">
      <label class="block text-sm font-medium text-gray-700">Price</label>
      <input
        required
        v-model="formState.products[index].price_sold_at"
        type="number"
        
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
      />
    </div>
    <div class="w-20 mr-2">
      <label class="block text-sm font-medium text-gray-700">Qty Sold</label>
      <input
        required
        v-model="formState.products[index].quantity"
        type="number"
        min=0
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
      />
    </div>
    <div class="w-20 mr-2">
      <label class="block text-sm font-medium text-gray-700">VAT</label>
      <select
        v-model="formState.products[index].vat"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
      >
        <option
          v-for="option in vatOptions"
          :key="option.id"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <div class="flex-1">
      <label class="block text-sm font-medium text-gray-700">Amount</label>
      <span>
        {{ formState.products[index].amount ? formState.products[index].amount.toFixed(2) : '0.00' }}
      </span>
    </div>



    </div>
  </div>
    </SaleFormModal>
    <CustomerFormModal  v-if="showModal" @close="closeModal"/>

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
import { onMounted, watch, ref, reactive } from "vue";
import { saleFormFields } from "@/formfields/formFields";
import SaleFormModal from "@/components/UI/Modal/SalesFormModal.vue";
import { useSharedComponent } from "@/composable/useSharedComponent";
import CustomerFormModal from '@/components/UI/Modal/CustomerFormModal.vue';
import { useProductStore } from "@/stores/products";
import { useCustomerstore } from "@/stores/customers";
import { storeToRefs } from "pinia";
const productsStore = useProductStore();

const customersStore = useCustomerstore();
const { allCustomersNames } = storeToRefs(customersStore);
const { allProductTypeName } = storeToRefs(productsStore);

console.log(allProductTypeName.value);
console.log(allCustomersNames.value);

const showModal = ref(false)
const addNewCustomer = () => {
  showModal.value  = true

}
const closeModal = () => {
  showModal.value  = false

}
const salesLoading = ref(false);
const showSalesModal = ref(false);
const printReceipt = ref('no');
// Define VAT options
const vatOptions = reactive([
  { id: 'yes', value: 'yes', label: 'Yes' },
  { id: 'no', value: 'no', label: 'No' }
]);


const formState = reactive({
  customer_id: "",
  payment_method: "cash",
  products: [
    {
      product_type_id: "",
      price_sold_at: null,
      quantity: null,
      batch_no: '',
      available_qty:null,
      amount: 0,
    },
  ],
});
const addProducts = () => {
  const lastProduct = formState.products[formState.products.length - 1];
  if (lastProduct.product_type_id.trim() !== "") {
    formState.products.push({ product_type_id: "", price_sold_at: "", quantity: "" });
  }
};
const resetForm = () => {
  formState.customer_id = "";
  formState.payment_method = "";
  formState.products = [
    {
      product_type_id: "",
      price_sold_at: null,
      batch_no: null,
      quantity: null,
    },
  ];
};
const closeSalesModal = () => {
  showSalesModal.value = !showSalesModal.value;
  resetForm();
};
const handleAddSales = async () => {
  salesLoading.value = true;
  let payload = {
    customer_id: formState.customer_id,
    payment_method: formState.payment_method,
    products: formState.products,
  };
  try {
    let res = await productsStore.handleAddSaless(payload);
    productsStore.handleGetProducts();
    salesLoading.value = false;
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    salesLoading.value = false;
    closeSalesModal();
    forceRefresh();
  }
};

const {
  DataTableLayout,
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
} = useSharedComponent("sales");
const { showUploadModal, closeUploadModal } = useUploadComposable();
const emit = defineEmits("forceRefresh");
const url = "/latest-product-type-price";
//const priceSoldAt = ref();
const {
  fetchDataForSelect,

} = useSelectComposable(
  saleFormFields,
  url,
  "product_type_id",
  "price_id",
  "selling_price"
);
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);

const {  forceUpdate } = usePostComposable(
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


onMounted(async () => {
  try {
    await customersStore.handleAllCustomersName();
    await productsStore.handleGetAllProductTypeName();
  } catch (error) {
    console.error;
  }
});



//////////////////
// Add this watcher in your setup function or directly in the <script setup> block
watch(() => formState.products.map(product => product.quantity), (newQuantities, oldQuantities) => {
  formState.products.forEach((product, index) => {
    if (newQuantities[index] !== oldQuantities[index]) {
      calculateAmount(index);
    }
  });
}, { deep: true });

// This function can handle the amount calculation
function calculateAmount(index) {
  const product = formState.products[index];
  if (!product) return;
  
  const baseAmount = product.price_sold_at * product.quantity;
  if (product.vat === 'yes') {
    const vatPercentage = product.vat_percentage || 7.5; // Default VAT percentage if not specified
    product.amount = baseAmount * (1 + vatPercentage / 100);
  } else {
    product.amount = baseAmount;
  }
}

// Function to update product details based on the selected product type
const updatePriceId = (productTypeId, index) => {
  const productInfo = allProductTypeName.value.find(product => product.id === productTypeId);
  if (productInfo) {
    formState.products[index].batches = productInfo.batches; // Update the batches array
    formState.products[index].vat = productInfo.vat === "Yes" ? 'yes' : 'no'; // Set VAT based on the product info
  } else {
    formState.products[index].batches = []; // Clear batches if product is not found
    formState.products[index].vat = 'no'; // Default VAT to 'no'
  }
};

// Watcher for product type ID changes
watch(() => formState.products.map(p => p.product_type_id), (newProductTypeIds, oldProductTypeIds) => {
  newProductTypeIds.forEach((productTypeId, index) => {
    if (productTypeId !== oldProductTypeIds[index]) {
      updatePriceId(productTypeId, index);
    }
  });
}, { deep: true });
////////////////////////
const updateBatchDetails = (batchId, index) => {
  const productInfo = allProductTypeName.value.find(p => p.batches.some(b => b.id === batchId));
  const batchInfo = productInfo ? productInfo.batches.find(batch => batch.id === batchId) : null;

  if (batchInfo && productInfo) {
    formState.products[index].available_qty = batchInfo.batch_quantity_left;
    formState.products[index].price_sold_at = batchInfo.batch_selling_price;
    // Reset quantity sold when batch changes
    //formState.products[index].quantity = null;
  } else {
    formState.products[index].available_qty = "";
    formState.products[index].price_sold_at = "";
    formState.products[index].vat = 'no';
    formState.products[index].amount = 0;
  }
};

// Watcher to reset quantity sold when batch changes
// watch(() => formState.products.map(p => p.batch_id), (newBatchIds, oldBatchIds) => {
//   newBatchIds.forEach((batchId, index) => {
//     if (batchId !== oldBatchIds[index]) {
//       updateBatchDetails(batchId, index);
//     }
//   });
// }, { deep: true });






const store = useStore();
const permissions = computed(() => {
  return store.getUser.user.permission.permissions.find((p) => p.page_name === "sales");
});

const additionalColumns = computed(() => {
  const cols = [];
  if (permissions.value?.update) {
    cols.push({ name: "Edit", action: handleEdit });
  }
  if (permissions.value?.del) {
    cols.push({ name: "Delete", action: handleDelete });
  }
  return cols;
});
</script>
