<template>
  <DashboardLayout pageTitle="Currency Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="currencies"
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
            :fields="currenciesFormFields"
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
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      :formField="currenciesFormFields"
      :modalTitle="modalTitle"
      :url="'/currencies'"
    />
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      :items="itemsId"
      :url="'/currencies'"
      :modalTitle="modalTitle"
    />
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue";
import FormModal from "@/components/UI/Modal/FormModal.vue";
import ReusableForm from "@/components/Form/ReusableForm.vue";
import DeleteModal from "@/components/UI/Modal/DeleteModal.vue";

import Loader from "@/components/UI/Loader.vue";
import EditModal from "@/components/UI/Modal/EditModal.vue";
import { usePostComposable } from "@/composable/usePostComposable";
import { currenciesFormFields } from "@/formfields/formFields";
import { useEditComposable } from "@/composable/useEditComposable";
import { useDeleteComposable } from "@/composable/useDeleteComposable";

const formTitle = "Add Currencies";
const modalTitle = "currency_name";

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
} = usePostComposable("/currencies", currenciesFormFields);
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable();
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();
</script>
