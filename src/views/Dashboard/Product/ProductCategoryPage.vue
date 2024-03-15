<template>
  <DashboardLayout pageTitle="Produc Category Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="product-categories"
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
            :fields="productCategoryFormFields"
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

    <EditModal v-if="showEditModal" @close="closeEditModal" :items="items" :formField="productCategoryFormFields" :url="'/product-categories'"
              :modalTitle="modalTitle"/>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue"; 
import FormModal from "@/components/UI/Modal/FormModal.vue"; 
import ReusableForm from "@/components/Form/ReusableForm.vue"; 
import Loader from "@/components/UI/Loader.vue";
import EditModal from "@/components/UI/Modal/EditModal.vue"; 
import { usePostComposable } from "@/composable/usePostComposable";
import { productCategoryFormFields } from "@/formfields/formFields";
import { useEditComposable } from "@/composable/useEditComposable";


const formTitle = "Add  Product Category";
const modalTitle = "category_name"

const {showModal,isLoadingMsg,loading,allError,forceUpdate,errorMessage,isError,closeModal,submitForm,} = usePostComposable("/product-categories", productCategoryFormFields);
const {handleEdit, handleDelete, showEditModal, closeEditModal, items} = useEditComposable()
</script>
