<template>
  <DashboardLayout pageTitle="Product Page">
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
              <span>Total Products</span>
            </div>
            <div class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]">
              {{ productsStore?.productType?.total }}
            </div>
          </div>
        </div>
      </div>

      <!-- Button to Open Modal -->
      <DataTableLayout
        :key="forceUpdate"
        endpoint="product-types"
        @toggleModal="showModal = !showModal"
        toggleButtonLabel="Add Product"
        :excludedKeys="['id', 'product_description', 'cat_id']"
        :clickableKeys="{
          //this will be render as a closure
          product_name: openProductDetailModal,
          view_price: navigateToProductTypePrice,
        }"
        :additionalColumns="[
          { name: 'edit', action: handleEdit },
          { name: 'delete', action: handleDelete },
        ]"
      >
        <button @click="togglePriceModal" class="btn-brand !text-sm !px-1.5">
          Add Price
        </button>
        <button @click="toggleProductTypeModal" class="btn-brand !px-1.5 !text-[14px]">
          Add Product Type
        </button>
        <button class="btn-brand !px-1.5 !text-[14px]" @click="closeUploadModal">
          Upload Product
        </button>
        <!-- <button class="btn-brand !px-1.5 !text-[14px]" @click="closeUploadModal">
          Upload Product Type
        </button> -->
      </DataTableLayout>
    </div>
    <!--Modal to add product-->
    <FormModal
      v-if="showModal"
      @close="closeModal"
      :formTitle="'Add Product'"
      :fields="formFields"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/products'"
    >
    </FormModal>
    <!-- Modal to add sub product-->
    <FormModal
      v-if="showProductTypeModal"
      @close="toggleProductTypeModal"
      :formTitle="'Add Product Type'"
      :fields="productTypeFormFields"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/product-types'"
    >
    </FormModal>
    <!-- Modal for Price Type-->
    <FormModal
      v-if="showPriceModal"
      @close="togglePriceModal"
      :formTitle="'Add Price'"
      :fields="priceFormFields"
      @fieldChanged="updateSellingPrice"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/prices'"
    >
    </FormModal>

    <ViewModal v-if="showViewModal" @close="closeViewModal" :modalTitle="modalTitle">
      <ViewModalDetail :products="products" />
    </ViewModal>

    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemsId"
      :url="'/product-types'"
      :modalTitle="modalTitle"
    />
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :items="items"
      @updated="forceRefresh"
      :formField="formFields"
      :subCategoryIdToPopulate="product_sub_category_id"
      :url="'/products'"
    />
    <UploadModal
      v-if="showUploadModal"
      @close="closeUploadModal"
      :url="'/products'"
      type="Product"
      @updated="forceRefresh"
    />
  </DashboardLayout>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "@/stores/products";
const productsStore = useProductStore();

//import { formFields, priceFormFields, productTypeFormFields} from '@/formfields/formFields';
import {
  formFields,
  priceFormFields,
  productTypeFormFields,
} from "@/formfields/formFields";
//handles all component import
import { useSharedComponent } from "@/composable/useSharedComponent";
const {
  DataTableLayout,
  FormModal,
  usePostComposable,
  useEditComposable,
  EditModal,
  useSelectComposable,
  useDeleteComposable,
  ViewModal,
  ViewModalDetail,
  defineEmits,
  DeleteModal,
  UploadModal,
  useUploadComposable,
} = useSharedComponent();
const { showUploadModal, closeUploadModal } = useUploadComposable();

const modalTitle = "View Product";
const router = useRouter();
const url = "/all-product-sub-categories-by-category-id";
const products = ref();
//const postUrl = ref('/products')
const showProductTypeModal = ref(false);
const showPriceModal = ref(false);

const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();
const emit = defineEmits("forceRefresh");
//const { showModal, showViewModal,**loading, **allError,forceUpdate,**errorMessage,isError,closeModal,closeViewModal,} = usePostComposable('/products', formFields);
const {
  showModal,
  showViewModal,
  forceUpdate,
  closeModal,
  closeViewModal,
} = usePostComposable("/products", formFields);
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);

// fetchDataForSubCategory is emitted
const {
  fetchDataForSelect,
  fetchDataForSubCategory,
  isOptionLoadingMsg,
} = useSelectComposable(
  formFields,
  url,
  "category_id",
  "sub_category_id",
  "sub_category_name"
);

const openProductDetailModal = (product) => {
  products.value = product;
  showViewModal.value = true;
};

const navigateToProductTypePrice = (product) => {
  router.push({ name: "price", params: { id: product.id } });
  // router.push({ name: "product-type", params: { id: product.id } });
};

const toggleProductTypeModal = () => {
  showProductTypeModal.value = !showProductTypeModal.value;
};
const togglePriceModal = () => {
  showPriceModal.value = !showPriceModal.value;
};

const forceRefresh = () => {
  forceUpdate.value++;
};

//useLabelNameToselectFormFieldToPopulate, endpoint, optionValue, formKey:is the name from endpoint
onMounted(async () => {
  await fetchDataForSelect("Measurement", "/measurements", "id", "measurement_name");
  await fetchDataForSelect("Category", "/product-categories", "id", "category_name");
  await fetchDataForSelect(
    "Product Name",
    "/all-products",
    "id",
    "product_name",
    productTypeFormFields.value
  );
  await fetchDataForSelect(
    "Product Type",
    "/all-product-type-name",
    "id",
    "product_type_name",
    priceFormFields.value
  );
  await fetchDataForSelect(
    "Currency Name",
    "/currencies",
    "id",
    "currency_name",
    priceFormFields.value
  );
});
onMounted(async () => {
  try {
    await productsStore.handleGetProductType();
  } catch (error) {
    console.error(error);
  }
});

const updateSellingPrice = (fieldDatabase, value) => {
  console.log(value);

  if (
    fieldDatabase === "auto_generated_selling_price" ||
    fieldDatabase === "cost_price"
  ) {
    const costPrice =
      parseFloat(
        priceFormFields.value.find((field) => field.databaseField === "cost_price")?.value
      ) || 0;
    const auto_generated_selling_price =
      parseFloat(
        priceFormFields.value.find(
          (field) => field.databaseField === "auto_generated_selling_price"
        )?.value
      ) || 0;
    const totalPriceField = priceFormFields.value.find(
      (field) => field.databaseField === "selling_price"
    );
    if (totalPriceField) {
      totalPriceField.value =
        costPrice + costPrice * (auto_generated_selling_price / 100);
    }
  }
};

// Call this function whenever the related fields change.
watch(
  () =>
    priceFormFields.value.find(
      (field) => field.databaseField === "auto_generated_selling_price"
    )?.value,
  updateSellingPrice
);
watch(
  () =>
    priceFormFields.value.find((field) => field.databaseField === "cost_price")?.value,
  updateSellingPrice
);
</script>
