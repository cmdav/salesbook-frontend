<template>
  <DashboardLayout>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div>
        <div
          class="lg:px-6 px-3 p-8 lg:w-[60%] w-full rounded-lg mx-auto bg-secondary-700 flex flex-col gap-4"
        >
          <h4 class="text-center text-lg font-bold underline">Supplier Details</h4>
          <div class="w-full">
            <label class="!font-bold">Name:</label>
            <div class="bg-secondary-1100 text-brand rounded-lg w-full p-3">
              <h4>{{ singleSupplier?.first_name }} {{ singleSupplier?.last_name }}</h4>
            </div>
          </div>
          <div class="w-full">
            <label class="!font-bold">Contact:</label>
            <div class="bg-secondary-1100 text-brand rounded-lg w-full p-3">
              <h4>{{ singleSupplier?.phone_number }}</h4>
            </div>
          </div>
          <div class="w-full">
            <label class="!font-bold">Email:</label>
            <div class="bg-secondary-1100 text-brand rounded-lg w-full p-3">
              <h4>{{ singleSupplier?.email }}</h4>
            </div>
          </div>
          <div class="w-full">
            <label class="!font-bold">Address:</label>
            <div class="bg-secondary-1100 text-brand rounded-lg w-full p-3">
              <h4>{{ singleSupplier?.address }}</h4>
            </div>
          </div>
          <div class="w-full">
            <label class="!font-bold">Account Name:</label>
            <div class="bg-secondary-1100 text-brand rounded-lg w-full p-3">
              <h4>{{ singleSupplier?.account_name }}</h4>
            </div>
          </div>

          <div class="w-full">
            <label class="!font-bold">Account Number:</label>
            <div class="bg-secondary-1100 text-brand rounded-lg w-full p-3">
              <h4>{{ singleSupplier?.account_number }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
<script setup>
import { onMounted, onUnmounted } from "vue";
import { useSupplierStore } from "@/stores/suppliers";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import { storeToRefs } from "pinia";
const supplierStore = useSupplierStore();
const { singleSupplier } = storeToRefs(supplierStore);
import { useRoute } from "vue-router";
const route = useRoute();

onMounted(() => {
  supplierStore.handleGetSingleSupplier(route.params.id);
});
onUnmounted(() => {
  singleSupplier.value = null;
});
</script>
