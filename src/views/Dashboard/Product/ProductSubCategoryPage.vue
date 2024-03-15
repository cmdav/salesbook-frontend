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
    <EditModal v-if="showEditModal" @close="closeEditModal" :items="items" :formField="productSubCategoryFormFields" :url="'/product-sub-categories'"/>
  </DashboardLayout>
</template>

<script setup>
import { onMounted } from "vue";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue"; // read data
import FormModal from "@/components/UI/Modal/FormModal.vue"; // show modal
import ReusableForm from "@/components/Form/ReusableForm.vue"; // To create form
import Loader from "@/components/UI/Loader.vue";
import { usePostComposable } from "@/composable/usePostComposable";
import { productSubCategoryFormFields } from "@/formfields/formFields";
import EditModal from "@/components/UI/Modal/EditModal.vue"; 
import { useEditComposable } from "@/composable/useEditComposable";
import { useSelectComposable } from "@/composable/useSelectComposable";


const formTitle = "Add Product  Sub Category";


const { showModal,isLoadingMsg,loading,allError,forceUpdate,errorMessage,isError,closeModal, submitForm} = usePostComposable("/product-sub-categories", productSubCategoryFormFields);
const {handleEdit, handleDelete, showEditModal, closeEditModal, items} = useEditComposable()
const {fetchDataForSelect} = useSelectComposable(productSubCategoryFormFields)

// Fetch data for select options on component mount
onMounted(async () => {
  await fetchDataForSelect("Category", "/product-categories", "id", "category_name");
});
</script>
