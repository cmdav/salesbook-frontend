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
    <FormModal v-if="showModal" @close="closeModal" :formTitle="'Add Currency'">
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
    <EditModal v-if="showEditModal" @close="closeEditModal" :items="items" :formField="currenciesFormFields" :url ="'/currencies'"/>

  </DashboardLayout>
</template>

<script setup>
 
 import { currenciesFormFields } from "@/formfields/formFields";

//handles all component import
import { useSharedComponent } from "@/composable/useSharedComponent";
const {DataTableLayout, FormModal,ReusableForm,Loader, usePostComposable, useEditComposable, EditModal} = useSharedComponent();
// define other constant

const {showModal,isLoadingMsg,loading,allError,forceUpdate,errorMessage,isError,closeModal,submitForm} = usePostComposable("/currencies", currenciesFormFields);
const {handleEdit, handleDelete, showEditModal, closeEditModal, items} = useEditComposable()

</script>
