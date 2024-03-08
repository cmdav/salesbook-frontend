<template>
  <DashboardLayout>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout endpoint="product-sub-categories" :excludedKeys="['id','sub_category_id']"/>
    </div>
  </DashboardLayout>
</template>

<script setup>

import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue";
</script>


