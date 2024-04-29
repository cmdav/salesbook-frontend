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
      <div>
        <label class="block text-sm font-medium text-gray-700"> Customer </label>

        <select
          required
          v-model="formState.customer_id"
          class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
        >
          <option v-for="name in allCustomersNames" :key="name.id" :value="name.id">
            {{ name.customer_detail }}
          </option>
        </select>
      </div>
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700"> Payment method </label>

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

      <div class="my-8 flex flex-col gap-2">
        <div class="flex flex-row justify-end items-end">
          <button
            @click="addProducts"
            class="btn-brand !bg-brand/[20%] !text-black !px-3"
          >
            Add product
          </button>
        </div>

        <div
          v-for="(question, index) in formState.products"
          :key="index"
          class="flex flex-col gap-2"
        >
          <div class="flex flex-row gap-2">
            <div class="w-full">
              <label class="block text-sm font-medium text-gray-700"> Product </label>
              <select
                required
                v-model="formState.products[index].product_type_id"
                :label="`Product ${index + 1}`"
                :name="`Product ${index + 1}`"
                :placeholder="`Add Product ${index + 1}`"
                class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
              >
                <option
                  v-for="name in allProductTypeName"
                  :key="name.id"
                  :value="name.id"
                >
                  {{ name.product_type_name }}
                </option>
              </select>
              <!-- <input
              :label="`Product ${index + 1}`"
              :name="`Product ${index + 1}`"
              :placeholder="`Add Product ${index + 1}`"
              v-model="formState.products[index].product_type_id"
              type="text"
              class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
            /> -->
            </div>

            <div class="flex flex-row w-[90%] gap-2">
              <div class="w-full">
                <label class="block text-sm font-medium text-gray-700"> Price </label>

                <input
                  required
                  :label="`price ${index + 1}`"
                  :name="`price ${index + 1}`"
                  :placeholder="`price ${index + 1}`"
                  v-model="formState.products[index].price_sold_at"
                  type="number"
                  class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                />
              </div>
              <div class="w-full">
                <label class="block text-sm font-medium text-gray-700"> Quantity </label>

                <input
                  required
                  :label="`quantity ${index + 1}`"
                  :name="`quantity ${index + 1}`"
                  :placeholder="`quantity ${index + 1}`"
                  v-model="formState.products[index].quantity"
                  type="number"
                  class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-row justify-end text-[14px] items-end gap-2">
            amount:
            <span class="text-[14px] text-green-600">
              {{
                formState.products[index].price_sold_at *
                formState.products[index].quantity
              }}</span
            >
          </div>
        </div>
      </div>
    </SaleFormModal>
    <!-- <FormModal
      v-if="showModal"
      @close="closeModal"
      :formTitle="'Add Sale'"
      :fields="saleFormFields"
      @fieldChanged="updateTotalPrice"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'sales'"
    >
    </FormModal> -->
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
import { useProductStore } from "@/stores/products";
import { useCustomerstore } from "@/stores/customers";
import { storeToRefs } from "pinia";
const productsStore = useProductStore();

const customersStore = useCustomerstore();
const { allCustomersNames } = storeToRefs(customersStore);
const { allProductTypeName } = storeToRefs(productsStore);

const salesLoading = ref(false);
const showSalesModal = ref(false);
const formState = reactive({
  customer_id: "",
  payment_method: "",
  products: [
    {
      product_type_id: "",
      price_sold_at: null,
      quantity: null,
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
  //FormModal,
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
const priceSoldAt = ref();
const {
  fetchDataForSelect,
  // fetchDataForSubCategory,
  // isOptionLoadingMsg,
} = useSelectComposable(
  saleFormFields,
  url,
  "product_type_id",
  "price_id",
  "selling_price"
);
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);

const {
      // showModal, 
      forceUpdate,
       //closeModal
       } = usePostComposable(
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

// Method to update the total price

const updateTotalPrice = (fieldDatabase, value) => {
  console.log(value);

  if (fieldDatabase === "price_sold_at" || fieldDatabase === "quantity") {
    priceSoldAt.value =
      parseFloat(
        saleFormFields.value.find((field) => field.databaseField === "price_sold_at")
          ?.value
      ) || 0;
    const quantity =
      parseFloat(
        saleFormFields.value.find((field) => field.databaseField === "quantity")?.value
      ) || 0;
    const totalPriceField = saleFormFields.value.find(
      (field) => field.databaseField === "total_price"
    );
    if (totalPriceField) {
      totalPriceField.value = Math.round(priceSoldAt.value * quantity);
    }
  }
};

const confirmPrice = () => {
  const priceIdField = saleFormFields.value.find(
    (field) => field.databaseField === "price_id"
  );
  const sellingPriceOption = priceIdField.options.find(
    (option) => option.value === priceIdField.value
  );
  const priceSoldAtField = saleFormFields.value.find(
    (field) => field.databaseField === "price_sold_at"
  );
  const quantityField = saleFormFields.value.find(
    (field) => field.databaseField === "quantity"
  );

  // Ensure that we found the fields and sellingPriceOption before proceeding
  if (
    sellingPriceOption &&
    priceSoldAtField &&
    quantityField &&
    parseFloat(priceSoldAtField.value) < parseFloat(sellingPriceOption.label)
  ) {
    alert("Invalid Price: Price Sold At Cannot be less than the selling price.");

    // Reset the values directly in the saleFormFields
    priceSoldAtField.value = ""; // Clear the price sold at field
    quantityField.value = ""; // Clear the quantity field
  }
};
// Call this function whenever the related fields change.
watch(
  () =>
    saleFormFields.value.find((field) => field.databaseField === "price_sold_at")?.value,
  updateTotalPrice
);
watch(
  () => saleFormFields.value.find((field) => field.databaseField === "quantity")?.value,
  () => {
    updateTotalPrice();
    confirmPrice();
  }
);
onMounted(async () => {
  try {
    await customersStore.handleAllCustomersName();
    await productsStore.handleGetAllProductTypeName();
  } catch (error) {
    console.error;
  }
});
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
