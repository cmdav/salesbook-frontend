<template>
  <DashboardLayout pageTitle="Product type page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="btn btn-secondary flex flex-row items-center gap-2 mb-3"
      >
        <BackIcon />
      </button>

      <!-- Button to Open Modal -->
      <!-- <button @click="showModal = true" class="btn btn-primary">Add Product Type</button> -->

      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        :endpoint="computedEndpoint"
        searchEndpoint="search-product-types"
        :clickableKeys="{ view_price: navigateToPrice }"
      />
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="formTitle">
      <template v-slot:default>
        <form @submit.prevent="submitForm">
          <p v-if="isError" class="text-red-500">{{ errorMessage }}</p>
          <ReusableForm
            :fields="productTypeFormFields"
            :isLoadingMsg="isLoadingMsg"
            :allError="allError"
          />
          <div class="flex justify-center items-center">
            <input type="submit" v-if="!loading" value="Submit" class="btn-brand mt-3" />
            <Loader v-else />
          </div>
        </form>
      </template>
    </FormModal>
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
