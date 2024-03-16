<template>
  <DashboardLayout pageTitle="Store Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Button to Open Modal -->
      <!-- <button @click="showModal = true" class="btn btn-primary">Add Store</button> -->
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="stores"
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
  </DashboardLayout>
</template>

<script setup>

import { currenciesFormFields } from "@/formfields/formFields";4
import { useSharedComponent } from "@/composable/useSharedComponent";

const { DataTableLayout, FormModal,ReusableForm,Loader, usePostComposable}= useSharedComponent();

const formTitle = "Add Store";

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
} = usePostComposable("/stores", currenciesFormFields);
</script>
