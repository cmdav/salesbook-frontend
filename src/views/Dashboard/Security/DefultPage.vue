<template>
  <DashboardLayout pageTitle="Settings Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- <Tab>
        <template #tab1> Roles </template>
        <template #tab2> Pages </template>
        <template #tab3> Permissions </template>
        <template #view1><RolesPage /></template>
        <template #view2><Page /></template>
        <template #view3><Permissions /></template>
      </Tab> -->
      <Permissions />
    </div>
  </DashboardLayout>
</template>

<script setup>
import Tab from "@/components/UI/Tab/Tab.vue";
import RolesPage from "@/views/Dashboard/Security/Pages/RolesPagecopy.vue";
import Page from "@/views/Dashboard/Security/Pages/Pagecopy.vue";
import Permissions from "@/views/Dashboard/Security/Pages/Permissionscopy.vue";
</script>
