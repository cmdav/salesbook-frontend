<template>
  <DashboardLayout pageTitle="Settings Pages">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <Tab>
        <template #tab1> Roles </template>
        <template #tab2> Permissions </template>
        <template #tab3> Users </template>
        
        <template #view1><RolesPage /></template>
        <template #view2><Permissions /></template>
        <template #view3><AddUser /></template>
        
      </Tab>
    </div>
  </DashboardLayout>
</template>

<script setup>
import Tab from "@/components/UI/Tab/Tab.vue";
import RolesPage from "@/views/Dashboard/Security/Pages/RolesPagecopy.vue";
import AddUser from "@/views/Dashboard/Security/Pages/AddUser.vue";
import Permissions from "@/views/Dashboard/Security/Pages/PermissionSetting.vue";
</script>
