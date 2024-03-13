<template>
  <DashboardLayout>
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
    <ViewModal v-if="showViewModal" @close="closeViewModal" :modalTitle="modalTitle">
      <ViewModalDetail :products="products" />
    </ViewModal>
  </DashboardLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue"; // read data
import FormModal from "@/components/UI/FormModal.vue"; // show  form modal
import ViewModal from "@/components/UI/ViewModal.vue"; // show read modal
import ViewModalDetail from "@/components/UI/ViewModalDetail.vue";
import ReusableForm from "@/components/Form/ReusableForm.vue"; // To create form
import apiService from "@/services/apiService";
import Loader from "@/components/UI/Loader.vue";
import { usePostComposable } from "@/composable/usePostComposable";
import { formFields } from "@/formfields/formFields";
import { useProductStore } from "@/stores/products";
const productsStore = useProductStore();

const formTitle = "Add Product";
const modalTitle = "View Product";
const router = useRouter();
const products = ref();
const {
  showModal,
  showViewModal,
  isLoadingMsg,
  loading,
  allError,
  forceUpdate,
  errorMessage,
  isError,
  closeModal,
  closeViewModal,
  submitForm,
} = usePostComposable("/products", formFields);

const openProductDetailModal = (product) => {
  // console.log(product);
  products.value = product;
  showViewModal.value = true;
};

const navigateToProductType = (product) => {
  router.push({ name: "product-type", params: { id: product.id } });
};

const handleEdit = (product) => {
  console.log("Editing product", product);
};

const handleDelete = (product) => {
  // Your delete logic here
  console.log("Deleting product", product);
};

const fetchDataForSubCategory = async (value, label) => {
  if (label === "Category") {
    isLoadingMsg.value = "Please wait";
    try {
      const response = await apiService.get(
        `/all-product-sub-categories-by-category-id/${value}`
      );
      //locate the sub category form field
      const subCategoryField = formFields.value.find(
        (field) => field.label === "Sub Category"
      );
      if (subCategoryField) {
        if (response.length === 0) {
          // If response is empty, set options for "Sub Category" dropdown to include just "No Subcategory"
          subCategoryField.options = [{ value: "", label: "No Subcategory" }];
        } else {
          // If response is not empty, map response data to options for "Sub Category" dropdown
          subCategoryField.options = [
            { value: "", label: "Select an option", disabled: true },
            ...response.map((item) => ({
              value: item.id,
              label: item.sub_category_name,
            })),
          ];
        }
        isLoadingMsg.value = "";
      } else {
        console.error("Sub Category field not found.");
        isLoadingMsg.value = "Some went wrong. Try again";
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      isLoadingMsg.value = "Some went wrong. Try again";
    }
  }
};

const fetchDataForSelect = async (field, endpoint, valueProp, labelProp) => {
  try {
    const response = await apiService.get(endpoint);
    const fieldObject = formFields.value.find((f) => f.label === field);
    if (fieldObject) {
      fieldObject.options = [
        { value: "", label: "Select an option", disabled: true },
        ...response.map((item) => ({ value: item[valueProp], label: item[labelProp] })),
      ];
    } else {
      console.error(`Field with label '${field}' not found.`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Fetch data for select options on component mount
onMounted(async () => {
  await fetchDataForSelect("Measurement", "/measurements", "id", "measurement_name");
  await fetchDataForSelect("Category", "/product-categories", "id", "category_name");
});
onMounted(async () => {
  try {
    await productsStore.handleGetProducts(productsStore?.products?.value?.current_page);
  } catch (error) {
    console.error(error);
  }
});
</script>
