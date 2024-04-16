<template>
  <div class="">
    <SettingsLayoutcopy @changePage="changePage" :products="permissions">
      <button class="btn-brand !px-2 !text-[14px]" @click="toggleAddPermissionModal">
        Add Permission
      </button>
    </SettingsLayoutcopy>
    <FormPermissionModal v-if="showModal" @close="toggleAddPermissionModal" />
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

import SettingsLayoutcopy from "@/components/Layouts/settingsLayoutcopy.vue";
import FormPermissionModal from "@/components/UI/Modal/FormPermissionModal.vue";
const changePage = async (link) => {
  try {
    await securityStore.handleGetPermissions(store.getUser.user.role_id, link);
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
    await securityStore.handleGetPermissions(store.getUser.user.role_id);
    // await securityStore.handleAddPermissions();
  } catch (error) {
    console.error(error);
  }
});
</script>
