<template>
  <!-- <DashboardLayout pageTitle="Roles Page"> -->
  <div class="">
    <!-- Button to Open Modal -->
    <!-- <button @click="showModal = true" class="btn btn-primary">Add Store</button> -->
    <SettingsLayoutcopy @changePage="changePage" :products="roles">
      <button class="btn-brand !px-2 !text-[14px]" @click="toggleAddPermissionModal">
        Add Role
      </button>
    </SettingsLayoutcopy>
    <!-- <PermissionFormModalcopy v-if="showModal" @close="toggleAddPermissionModal" /> -->
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useSecurityStore } from "@/stores/security";
import { useStore } from "@/stores/user";
const store = useStore();
const securityStore = useSecurityStore();
const { allRoles, allPages, roles, pages, permissions } = storeToRefs(securityStore);
import SettingsLayoutcopy from "@/components/Layouts/RolesTable.vue";
import PermissionFormModalcopy from "@/components/UI/Modal/PermissionFormModalcopy.vue";
const changePage = async (link) => {
  try {
    await securityStore.handleGetPermissions(
      `9bb79eae-a64f-4eaa-b8d5-8990eb02205d`,
      link
    );
  } catch (error) {
    //
  }
};
const showModal = ref(false);
const toggleAddPermissionModal = async () => {
  showModal.value = !showModal.value;
};
onMounted(async () => {
  try {
    await securityStore.handleGetAllRole();
    await securityStore.handleGetRole();
    await securityStore.handleGetPages();
    await securityStore.handleGetAllPages();
    // await securityStore.handleGetPermissions(store.getUser.user.role_id);
    // await securityStore.handleAddPermissions();
  } catch (error) {
    console.error(error);
  }
});
</script>
