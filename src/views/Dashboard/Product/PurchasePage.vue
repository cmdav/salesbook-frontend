<template>
  <DashboardLayout pageTitle="Purchase page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showPurchaseModal = !showPurchaseModal"
        :key="forceUpdate"
        endpoint="purchases"
        searchEndpoint="search-purchases"
        :additionalColumns="additionalColumns"
      >
        <button class="btn-brand" @click="closeUploadModal">Upload</button>
      </DataTableLayout>
    </div>
    <SaleFormModal
      v-if="showPurchaseModal"
      :buttonLable="'submit'"
      :loading="pruchaseLoading"
      @close="closePruchaseModal"
      @submitForm="handleAddPurchase"
      title="Add Purchases"
    >
      <div class="my-8 flex flex-col gap-2">
        <div class="flex flex-row justify-end items-end">
          <button
            @click="addPurchases"
            class="btn-brand !bg-brand/[20%] !text-black !px-3"
          >
            Add purchases
          </button>
        </div>

        <div class="overflow-y-auto flex flex-col gap-2 max-h-[340px]">
          <div
            v-for="(question, index) in formState.purchases"
            :key="index"
            class="flex flex-col gap-2"
          >
            <div class="bg-brand/[50%] rounded-full px-4 py-2">
              <h4 class="text-[#fff] text-[15px] font-bold">
                {{ index + 1 }}
              </h4>
            </div>
        



            <div class="flex flex-col gap-2">
              <div class="w-full">
                <label class="block text-sm font-medium text-gray-700"> Product </label>
                <select
                  required
                  v-model="formState.purchases[index].product_type_id"
                  :label="`Product ${index + 1}`"
                  :name="`Product ${index + 1}`"
                  :placeholder="`Add Product ${index + 1}`"
                  class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                >
                <option v-for="product in allProductTypeName" :key="product.id" :value="product.id">
                  {{ product.product_type_name }}
                </option>
                   
                </select>
              </div>

              <div class="flex flex-row w-full gap-2">
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700">
                    Supplier
                  </label>

                  <input
                    :label="`Supplier ${index + 1}`"
                    :name="`Supplier ${index + 1}`"
                    :placeholder="`Supplier ${index + 1}`"
                    v-model="formState.purchases[index].supplier_id"
                    type="number"
                    class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                  />
                </div>
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700"> Price </label>

                  <input
                      required
                      type="text"
                      :value="formState.purchases[index].display_price"
                      class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                      readonly
                    />
                    <!-- Hidden input to hold the actual price_id for submission -->
                    <input type="hidden" v-model="formState.purchases[index].price_id">
                </div>
              </div>
              <div class="flex flex-row w-full gap-2">
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700">
                    Batch no
                  </label>

                  <input

                    :label="`batch no ${index + 1}`"
                    :name="`batch no ${index + 1}`"
                    :placeholder="`batch no ${index + 1}`"
                    v-model="formState.purchases[index].batch_no"
                    type="text"
                    class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                  />
                </div>
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>

                  <input
                    required
                    :label="`quantity ${index + 1}`"
                    :name="`quantity ${index + 1}`"
                    :placeholder="`quantity ${index + 1}`"
                    v-model="formState.purchases[index].quantity"
                    min="0"
                    type="number"
                    class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                  />
                </div>
              </div>
              <div class="flex flex-row w-full gap-2">
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700">
                    Product Identifier
                  </label>

                  <input
                    :label="`product identifier ${index + 1}`"
                    :name="`product identifier ${index + 1}`"
                    :placeholder="`product identifier ${index + 1}`"
                    v-model="formState.purchases[index].product_identifier"
                    type="text"
                    class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                  />
                </div>
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700">
                    Expired Date
                  </label>

                  <input
                    :label="`expired date ${index + 1}`"
                    :name="`expired date ${index + 1}`"
                    :placeholder="`expired date ${index + 1}`"
                    v-model="formState.purchases[index].expiry_date"
                    type="date"
                    :min="minDate"
                    class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                  />
                </div>
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </SaleFormModal>

    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemsId"
      :url="'purchases'"
      :modalTitle="modalTitle"
    />
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      :formField="purchaseFormFields"
      @updated="forceRefresh"
      :url="'purchases'"
    />
    <UploadModal
      v-if="showUploadModal"
      @close="closeUploadModal"
      @updated="forceRefresh"
      :url="'/purchases'"
      type="Purchase"
    />
  </DashboardLayout>
</template>

<script setup>
import { onMounted, watch, ref, reactive } from "vue";
import { purchaseFormFields } from "@/formfields/formFields";
import SaleFormModal from "@/components/UI/Modal/SalesFormModal.vue";
import { useSharedComponent } from "@/composable/useSharedComponent";
import { useProductStore } from "@/stores/products";
import { storeToRefs } from "pinia";
const productsStore = useProductStore();
const pruchaseLoading = ref(false);
const showPurchaseModal = ref(false);

const { allProductTypeName } = storeToRefs(productsStore);

 console.log(allProductTypeName.value)
const minDate = ref(getMinDate());

function getMinDate() {
  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // Return the minimum date in the format required by the input[type=date] field
  return minDate.toISOString().split("T")[0];
}

const formState = reactive({
  purchases: [
    {
      product_type_id: "",
      supplier_id: "",
      price_id: "",
      display_price: "",
      batch_no: "",
      quantity: "",
      product_identifier: "",
      expiry_date: "",
    },
  ],
});
const addPurchases = () => {
  const lastPurchases = formState.purchases[formState.purchases.length - 1];
  if (lastPurchases.product_type_id.trim() !== "") {
    formState.purchases.push({
      product_type_id: "",
      supplier_id: "",
      price_id: "",
      batch_no: "",
      quantity: "",
      product_identifier: "",
      expiry_date: "",
    });
  }
};
const resetForm = () => {
  formState.purchases = [
    {
      product_type_id: "",
      supplier_id: "",
      price_id: "",
      batch_no: "",
      quantity: "",
      product_identifier: "",
      expiry_date: "",
    },
  ];
};
const closePruchaseModal = () => {
  showPurchaseModal.value = !showPurchaseModal.value;
  resetForm();
};
const handleAddPurchase = async () => {
  pruchaseLoading.value = true;
  let payload = {
    purchases: formState.purchases,
  };
  try {
    let res = await productsStore.handleAddPurchases(payload);
    pruchaseLoading.value = false;
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    pruchaseLoading.value = false;
    closePruchaseModal();
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
  useStore,
  computed,
  useUploadComposable,
} = useSharedComponent("purchases");
const { showUploadModal, closeUploadModal } = useUploadComposable();

const url = "/all-price-by-product-type";
const emit = defineEmits("forceRefresh");

const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

const {
  fetchDataForSelect,

} = useSelectComposable(purchaseFormFields, url, "Product Type", "Price", "cost_price");
const { forceUpdate, } = usePostComposable(
  "/purchases",
  purchaseFormFields
);

const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);

const forceRefresh = () => {
  forceUpdate.value++;
};
const checkDate = (fieldDatabase, value) => {
  if (fieldDatabase === "expiry_date") {
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part to compare only date parts

    if (selectedDate < today) {
      alert("Invalid date: Date cannot be in the past.");
      // Find the field and reset its value
      const expiredDateField = purchaseFormFields.value.find(
        (field) => field.databaseField === "expiry_date"
      );
      if (expiredDateField) {
        expiredDateField.value = ""; // Clear the input field
      }
    }
  }
};
// Call this function whenever the related fields change.
watch(
  () =>
    purchaseFormFields.value.find((field) => field.databaseField === "expired_at")?.value,
  checkDate
);
// Fetch data for select options on component mount
onMounted(async () => {
  await fetchDataForSelect(
    "Product Type",
    "/all-product-type-name",
    "id",
    "product_type_name"
  );
});
onMounted(async () => {
  try {
    await productsStore.handleGetAllProductTypeName();
  } catch (error) {
    console.error;
  }
});



const updatePriceId = (productTypeId, index) => {
  const productInfo = allProductTypeName.value.find(product => product.id === productTypeId);
  if (productInfo) {
    formState.purchases[index].price_id = productInfo.price_id;  
    formState.purchases[index].display_price = productInfo.cost_price;  
  } else {
    formState.purchases[index].price_id = "";
    formState.purchases[index].display_price = ""; 
  }
};

watch(() => formState.purchases.map(p => p.product_type_id), (newProductTypeIds, oldProductTypeIds) => {
  newProductTypeIds.forEach((productTypeId, index) => {
    if (productTypeId !== oldProductTypeIds[index]) {
      updatePriceId(productTypeId, index);
    }
  });
}, { deep: true });

const store = useStore();
const permissions = computed(() => {
  return store.getUser.user.permission.permissions.find(
    (p) => p.page_name === "purchases"
  );
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
