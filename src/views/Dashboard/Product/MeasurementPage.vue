<template>
  <DashboardLayout pageTitle="Measurement Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Button to Open Modal -->
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="measurements"
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
            :fields="measurementFormFields"
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

  <EditModal v-if="showEditModal" @close="closeEditModal" :items="items" :formField="measurementFormFields" :url="'/measurements'"
              :modalTitle="modalTitle"/>

  </DashboardLayout>
</template>

<script setup>
import { onMounted } from "vue";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue"; 
import FormModal from "@/components/UI/Modal/FormModal.vue"
import ReusableForm from "@/components/Form/ReusableForm.vue"; 
import Loader from "@/components/UI/Loader.vue";
import { useProductStore } from "@/stores/products";
import EditModal from "@/components/UI/Modal/EditModal.vue"; 
import { usePostComposable } from "@/composable/usePostComposable";
import { measurementFormFields } from "@/formfields/formFields";
import { useEditComposable } from "@/composable/useEditComposable";


const formTitle = "Add Measurement";

const productsStore = useProductStore();

const {showModal,isLoadingMsg,loading,allError,forceUpdate,errorMessage,isError,closeModal,submitForm } = usePostComposable("/measurements", measurementFormFields);
const {handleEdit, handleDelete, showEditModal, closeEditModal, items} = useEditComposable()

onMounted(async () => {
  try {
    await productsStore.handleGetMeasurements();
  } catch (error) {
    console.error(error);
  }
});
</script>
