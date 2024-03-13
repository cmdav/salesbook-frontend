<template>
  <DashboardLayout>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div class="py-8">
        <router-link to="/products" class="font-bold !my-8">Back</router-link>
      </div>
      <div>
        <div
          class="lg:px-6 px-3 p-8 lg:w-[60%] w-full rounded-lg mx-auto bg-secondary-700 flex flex-col gap-4"
        >
          <h4 class="text-center text-lg font-bold underline">Customer Details</h4>
          <div class="w-full">
            <label class="!font-bold">Name:</label>
            <div class="bg-secondary-1100 text-brand rounded-lg w-full p-3">
              <h4>{{ singleCustomer?.first_name }} {{ singleCustomer?.last_name }}</h4>
            </div>
          </div>
          <div class="w-full">
            <label class="!font-bold">Contact:</label>
            <div class="bg-secondary-1100 text-brand rounded-lg w-full p-3">
              <h4>{{ singleCustomer?.phone_number }}</h4>
            </div>
          </div>
          <div class="w-full">
            <label class="!font-bold">Email:</label>
            <div class="bg-secondary-1100 text-brand rounded-lg w-full p-3">
              <h4>{{ singleCustomer?.email }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
<script setup>
import { onMounted, onUnmounted } from "vue";
import { useCustomerstore } from "@/stores/customers";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import { storeToRefs } from "pinia";
const customersStore = useCustomerstore();
const { singleCustomer } = storeToRefs(customersStore);
import { useRoute } from "vue-router";
const route = useRoute();

onMounted(() => {
  customersStore.handleGetSingleCustomer(route.params.id);
});
onUnmounted(() => {
  singleCustomer.value = null;
});
</script>
