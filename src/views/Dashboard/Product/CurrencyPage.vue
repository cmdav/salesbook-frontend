<template>
  <DashboardLayout pageTitle="Currency Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout 
          @toggleModal="showModal = !showModal" 
          :key="forceUpdate"
           endpoint="currencies"
           :pageName="'currencies'"
          searchEndpoint="search-currency" 
        :additionalColumns=additionalColumns>
        <div v-if="canUploadPermission">
        <button class="btn-brand" @click="closeUploadModal">Upload</button>
      </div>
      </DataTableLayout>
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="'Add Currency'" :fields="currenciesFormFields"
      :isLoadingMsg="isOptionLoadingMsg" :url="'/currencies'">
    </FormModal>
    <DeleteModal v-if="showDeleteModal" @close="closeDeleteModal" @updated="forceRefresh" :items="itemsId"
      :url="'/currencies'" :modalTitle="modalTitle" />
    <EditModal 
    v-if="showEditModal" 
    @close="closeEditModal" 
    :items="items" 
    @updated="forceRefresh" 
      :formField="currenciesFormFields" 
      :url="'currencies'" />

      
    <UploadModal v-if="showUploadModal" @close="closeUploadModal" @updated="forceRefresh" :url="'/currencies'"
      type="Currency" />
  </DashboardLayout>
</template>

<script setup>
import { currenciesFormFields } from "@/formfields/formFields";
const modalTitle = "currency_name";

import { useSharedComponent } from "@/composable/useSharedComponent";

const {
  DataTableLayout,
  FormModal,
  usePostComposable,
  useEditComposable,
  DeleteModal,
  EditModal,
  useDeleteComposable,
  UploadModal,
  useUploadComposable,
  useStore,
  computed,

} = useSharedComponent('currencies');
const { showUploadModal, closeUploadModal } = useUploadComposable();

const { showModal, forceUpdate, closeModal } = usePostComposable(
  "/currencies",
  currenciesFormFields
);

const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable();
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

//This trigger a page refresh
const forceRefresh = () => {
  forceUpdate.value++;
};

const store = useStore();
const permissions = computed(() => {

  return store.getUser.user.permission.permissions.find(p => p.page_name === "currencies");
})

// console.log(store.getUser.user.permission.permissions)
 //console.log(permissions.value)
const additionalColumns = computed(() => {
  const cols = [];
  if (permissions.value?.update == 1 ) {
   
    cols.push({ name: 'Edit', action: handleEdit });
  }
  if (permissions.value?.del  == 1) {
    
    cols.push({ name: 'Delete', action: handleDelete });
  }
 
  return cols;
});
//check upload permission
const canUploadPermission = computed(() => {

return permissions.value?.write == 1;
});
</script>

