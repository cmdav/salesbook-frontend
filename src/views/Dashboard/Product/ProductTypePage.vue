<template>
  <DashboardLayout pageTitle="Product Type Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">

      <!-- <DataTableLayout @toggleModal="showModal = !showModal" :key="forceUpdate" :pageName="'product-types'"
        :endpoint="product-types"  :excludedKeys="[
          'product_ids', 'category_ids'
        ]" :clickableKeys="{ view_price: navigateToPrice }" /> -->

      <DataTableLayout :key="forceUpdate" endpoint="product-types" :pageName="'product-types'"
        searchEndpoint="search-products" @toggleModal="showModal = !showModal" toggleButtonLabel="Add Product Type"
        :excludedKeys="[
          'id',
          'product_id',
          'product_ids',
          'category_ids',
          'product_category',
          'sub_category_id',
          'product_type_description'
        ]" :clickableKeys="{
          view_price: navigateToProductTypePrice,
        }" :additionalColumns="additionalColumns">
        <!-- <button @click="togglePriceModal" class="btn-brand !text-sm !px-1.5">Add Price</button> -->
        <!-- <div v-if="canUploadPermission">
        <button @click="toggleProductTypeModal" class="btn-brand !px-1.5 !text-[14px]">
          Add Product Type
        </button>
      </div> -->
        <div v-if="canUploadPermission">
          <button class="btn-brand !px-1.5 !text-[14px]" @click="closeUploadModal">
            Upload Product
          </button>
        </div>
      </DataTableLayout>
    </div>

    <FormModal v-if="showModal" @close="closeModal" @updated="forceRefresh" :formTitle="'Add Product Type'"
      :fields="productTypeFormFields" @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg" :url="'/product-types'" />
  </DashboardLayout>

</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue";
import FormModal from "@/components/UI/Modal/FormModal.vue";
import ReusableForm from "@/components/Form/ReusableForm.vue";
import Loader from "@/components/UI/Loader.vue";
import { usePostComposable } from "@/composable/usePostComposable";
import { productTypeFormFields } from "@/formfields/formFields";
import BackIcon from "@/components/icons/BackIcon.vue";
// import { useEditDeleteComposable } from "@/composable/useEditDeleteComposable";
// const {handleEdit, handleDelete} = useEditDeleteComposable()
const router = useRouter();
const route = useRoute();
const formTitle = "Add Product Type";
const productTypeId = ref(route.params.id);

const fieldOverrides = {
  product_id: productTypeId.value,
};

const navigateToPrice = (product) => {
  router.push({ name: "price", params: { id: product.id } });
};

const {
  showModal,
  isLoadingMsg,
  loading,
  allError,
  forceUpdate,
  errorMessage,
  isError,
  closeModal,
  submitForm,
} = usePostComposable(
  productTypeId.value
    ? `product-type-by-id/${productTypeId.value}`
    : "product-type-by-id",
  productTypeFormFields,
  "product-types",
  fieldOverrides
);

const computedEndpoint = computed(() => {
  return productTypeId.value
    ? `product-type-by-id/${productTypeId.value}`
    : "product-type-by-id";
});

// const goBack = () => {
//   router.push({ name: "products" });
// };
const goBack = () => {
  router.go(-1);
};
</script>
