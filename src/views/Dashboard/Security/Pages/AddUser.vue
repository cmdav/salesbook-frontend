<template>
  <!-- <DashboardLayout pageTitle="Roles Page"> -->
  <div class="">
    <!-- Button to Open Modal -->
    <!-- <button @click="showModal = true" class="btn btn-primary">Add Store</button> -->

    <DataTableLayout
        @toggleModal="showModal = !showModal"
        :endpoint="url"
        :key="forceRefresh"
        searchEndpoint="search-sales"
        :additionalColumns="[
          { name: 'delete', action: handleDeletes },
         
        ]"
      >
        <button class="btn-brand" @click="closeUploadModal">Upload</button>
      </DataTableLayout>


    <!-- <SettingsLayoutcopy @changePage="changePage" :products="allUser">
      <button class="btn-brand !px-2 !text-[14px]" @click="toggleAddPermissionModal">
        Add  User
      </button>
    </SettingsLayoutcopy> -->
    <!-- <PermissionFormModalcopy v-if="showModal" @close="toggleAddPermissionModal" /> -->
    <FormModal
      v-if="showModal"
      @close="toggleAddPermissionModal"
      :formTitle="'Add User'"
      :fields="userFormFields"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'sale-users'"
    >
    </FormModal>
  </div>
</template>

<script setup>
import { ref, onMounted} from "vue";
import { userFormFields } from "@/formfields/formFields";

import { useSharedComponent } from "@/composable/useSharedComponent";
const { useSelectComposable,  DataTableLayout,  usePostComposable, } = useSharedComponent();

const url = ref("users?type=sales_personnel");
import FormModal from "@/components/UI/Modal/FormModal.vue";

const { fetchDataForSelect,fetchDataForSubCategory,isOptionLoadingMsg,} 
= useSelectComposable(userFormFields,'user', "role_id","","");

const {  forceUpdate  } = usePostComposable();

const showModal = ref(false);

const toggleAddPermissionModal = async () => {
  showModal.value = !showModal.value;
};

const forceRefresh = () => {
  forceUpdate.value++;
};

onMounted(async () => {
  
  await fetchDataForSelect("Role","/all-job-roles","id","role_name");
});
</script>
