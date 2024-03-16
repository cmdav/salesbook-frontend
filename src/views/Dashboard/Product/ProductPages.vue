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
              {{ productsStore?.products?.total }}
            </div>
          </div>
        </div>
      </div>

      <!-- Button to Open Modal -->
      <DataTableLayout
        :key="forceUpdate"
        endpoint="products"
        @toggleModal="showModal = !showModal"
        toggleButtonLabel="Add Product"
        :excludedKeys="['id', 'product_description']"
        :clickableKeys="{
          product_name: openProductDetailModal,
          product_type: navigateToProductType,
        }"
        :additionalColumns="[
          { name: 'edit', action: handleEdit },
          { name: 'delete', action: handleDelete },
        ]"
      />
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="formTitle">
      <template v-slot:default>
        <form @submit.prevent="submitForm">
          <p v-if="isError" class="text-red-500">{{ errorMessage }}</p>
          <ReusableForm
            :fields="formFields"
            @fetchDataForSubCategory="fetchDataForSubCategory"
            :isLoadingMsg="isOptionLoadingMsg"
            :allError="allError"
          />
          <input
            type="submit"
            v-if="!loading"
            value="Submit"
            class="btn btn-primary mt-3"
          />

          <Loader v-else />
        </form>
      </template>
    </FormModal>
    <ViewModal v-if="showViewModal" @close="closeViewModal" :modalTitle="modalTitle">
      <ViewModalDetail :products="products" />
    </ViewModal>
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      :items="itemsId"
      :url="'/products'"
      :modalTitle="modalTitle"
    />
  </DashboardLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue"; // read data
import FormModal from "@/components/UI/Modal/FormModal.vue"; // show  form modal
import ViewModal from "@/components/UI/Modal/ViewModal.vue"; // show read modal
import ViewModalDetail from "@/components/UI/Modal/ViewModalDetail.vue";
import ReusableForm from "@/components/Form/ReusableForm.vue"; // To create form
import Loader from "@/components/UI/Loader.vue";
import { usePostComposable } from "@/composable/usePostComposable";
import { useSelectComposable } from "@/composable/useSelectComposable";
import { formFields } from "@/formfields/formFields";
import DeleteModal from "@/components/UI/Modal/DeleteModal.vue";
import { useDeleteComposable } from "@/composable/useDeleteComposable";

const formTitle = "Add Product";
const modalTitle = "View Product";
const router = useRouter();
const url = "/all-product-sub-categories-by-category-id";
const products = ref();
const {
  showModal,
  showViewModal,
  loading,
  allError,
  forceUpdate,
  errorMessage,
  isError,
  closeModal,
  closeViewModal,
  submitForm,
} = usePostComposable("/products", formFields);
// fetchDataForSubCategory is emitted
const {
  fetchDataForSelect,
  fetchDataForSubCategory,
  isOptionLoadingMsg,
} = useSelectComposable(formFields, url, "Category", "Sub Category", "sub_category_name");
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

const openProductDetailModal = (product) => {
  // console.log(product);
  products.value = product;
  showViewModal.value = true;
};

const navigateToProductType = (product) => {
  router.push({ name: "product-type", params: { id: product.id } });
};

// Fetch data for select options on component mount
onMounted(async () => {
  await fetchDataForSelect("Measurement", "/measurements", "id", "measurement_name");
  await fetchDataForSelect("Category", "/product-categories", "id", "category_name");
});
</script>
