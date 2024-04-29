<template>
  <!-- <DashboardLayout pageTitle="Roles Page"> -->
  <div class="">
    <!-- Button to Open Modal -->
    <!-- <button @click="showModal = true" class="btn btn-primary">Add Store</button> -->
    <!-- <SettingsLayoutcopy @changePage="changePage" :products="roles">
      <button class="btn-brand !px-2 !text-[14px]" @click="closeModal">Add Role</button>
    </SettingsLayoutcopy> -->
    <DataTableLayout
      @toggleModal="showModal = !showModal"
      :key="forceUpdate"
      endpoint="job-roles"
      :additionalColumns="[{ name: 'edit', action: handleEdit}, { name: 'delete', action: handleDelete },]"
    >
    <button class="btn-brand !px-2 !text-[14px]" @click="closeModal">Add Role</button>
    </DataTableLayout>
    <!-- <PermissionFormModalcopy v-if="showModal" @close="toggleAddPermissionModal" /> -->
    <SaleFormModal
      v-if="showModal"
      :buttonLable="'submit'"
      :loading="loading"
      @close="closeModal"
      @submitForm="handleAddRole"
      title="Add Role"
    >
      <div class="my-8 flex flex-col gap-2">
        <div class="overflow-y-auto flex flex-col gap-2 max-h-[340px]">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
              <div class="w-full">
                <label class="block text-sm font-medium text-gray-700"> Role name </label>
                <input
                  v-model="formState.role_name"
                  type="text"
                  class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SaleFormModal>
    <!-- <DataTableLayout
      @toggleModal="showModal = !showModal"
      :hideToggleButtonLabel="false"
      :key="forceUpdate"
      endpoint="job-roles"
      :additionalColumns="additionalColumns"
    >
    </DataTableLayout> -->

    <!-- <FormModal
      v-if="showModal"
      @close="closeModal"
      :formTitle="'Add Purchase'"
      :fields="purchaseFormFields"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :url="'/job-roles'"
    ></FormModal> -->

    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      :formField="roleFormFields"
      @updated="forceRefresh"
      :url="'/job-roles'"
    />

    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemsId"
      :url="'/job-roles'"
      :modalTitle="modalTitle"
    />
  </div>
  <!-- </DashboardLayout> -->
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import { roleFormFields } from "@/formfields/formFields";
import { storeToRefs } from "pinia";
import { useSecurityStore } from "@/stores/security";
import { useStore } from "@/stores/user";
const store = useStore();
const securityStore = useSecurityStore();
const { allRoles, allPages, roles, pages, permissions } = storeToRefs(securityStore);
import SettingsLayoutcopy from "@/components/Layouts/RolesTable.vue";
// import PermissionFormModalcopy from "@/components/UI/Modal/PermissionFormModalcopy.vue";
import SaleFormModal from "@/components/UI/Modal/SalesFormModal.vue";
import { useSharedComponent } from "@/composable/useSharedComponent";
const emit = defineEmits("forceRefresh");

const loading = ref(false);
const showModal = ref(false);

const formState = reactive({ role_name: "" });
const {
  DataTableLayout,
  useEditComposable,
  EditModal,
  DeleteModal,
  useDeleteComposable,
  defineEmits,
  usePostComposable
} = useSharedComponent('job-roles');

const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);
const { forceUpdate } = usePostComposable(
  "/job-roles",
  roleFormFields
);

const forceRefresh = () => {
  forceUpdate.value++;
};

const closeModal = () => {
  showModal.value = !showModal.value;
  formState.role_name = "";
};
const handleAddRole = async () => {
  loading.value = true;
  let payload = {
    role_name: formState.role_name,
  };
  try {
    let res = await securityStore.handleAddRole(payload);
    await securityStore.handleGetRole();
    loading.value = false;
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    closeModal();
    formState.role_name = "";
  }
};
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

const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();


</script>
