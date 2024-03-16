<template>
  <DashboardLayout pageTitle="Subcategory Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="product-sub-categories"
        :excludedKeys="['id', 'sub_category_id']"
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
            :fields="productSubCategoryFormFields"
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
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      :items="itemsId"
      :url="'/product-sub-categories'"
      :modalTitle="modalTitle"
    />
  </DashboardLayout>
</template>

<script setup>
import { onMounted } from "vue";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue"; // read data
import FormModal from "@/components/UI/Modal/FormModal.vue"; // show modal
import ReusableForm from "@/components/Form/ReusableForm.vue"; // To create form
import apiService from "@/services/apiService";
import Loader from "@/components/UI/Loader.vue";
import DeleteModal from "@/components/UI/Modal/DeleteModal.vue";
import { usePostComposable } from "@/composable/usePostComposable";
import { productSubCategoryFormFields } from "@/formfields/formFields";
// import { useEditDeleteComposable } from "@/composable/useEditDeleteComposable";
// const {handleEdit, handleDelete} = useEditDeleteComposable()
import { useDeleteComposable } from "@/composable/useDeleteComposable";

const formTitle = "Add Product  Sub Category";

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
} = usePostComposable("/product-sub-categories", productSubCategoryFormFields);
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

const fetchDataForSelect = async (field, endpoint, valueProp, labelProp) => {
  try {
    const response = await apiService.get(endpoint);
    const fieldObject = productSubCategoryFormFields.value.find((f) => f.label === field);
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
  await fetchDataForSelect("Category", "/product-categories", "id", "category_name");
});
</script>
