<template>
  <DashboardLayout pageTitle="Product Request">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout endpoint="products" />
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue";
</script>
