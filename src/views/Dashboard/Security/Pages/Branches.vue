<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, reactive } from "vue";
import { branchFormFields } from "@/formfields/formFields";
import { useSharedComponent } from "@/composable/useSharedComponent";
const emit = defineEmits("forceRefresh");


const url = ref("business-branches");

const showModal = ref(false);

const formState = reactive({ role_name: "" });
const {
  DataTableLayout,
  usePostComposable,
  useEditComposable,
  EditModal,
  DeleteModal,
  useDeleteComposable,
  FormModal, 
  defineEmits,
} = useSharedComponent('business-branches');

const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);
const { forceUpdate } = usePostComposable(
  "/business-branches",
  branchFormFields
);

const forceRefresh = () => {
  forceUpdate.value++;
};

const closeModal = () => {
  showModal.value = !showModal.value;
  formState.role_name = "";
};


const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

</script>

<template>
  
   
    <DataTableLayout 
      :key="forceUpdate"
       @toggleModal="showModal = !showModal"
       :excludedKeys="[ 'created_at', 'updated_at' ]"
       toggleButtonLabel="Add Branches" 
       :endpoint="url" 
       :pageName="'settings'"
      searchEndpoint="business-branches" 
      :additionalColumns="[{ name: 'Edit', action: handleEdit}, { name: 'Delete', action: handleDelete },]">
    </DataTableLayout>

    

    <EditModal 
        v-if="showEditModal" 
        @close="closeEditModal" 
        :items="items" 
        :formField="branchFormFields"
        @updated="forceRefresh" 
        :url="'/business-branches'" 
        />

    <DeleteModal 
        v-if="showDeleteModal" 
        @close="closeDeleteModal" 
        @updated="forceRefresh" 
        :items="itemsId"
        :url="url" 
    />

   <FormModal 
        v-if="showModal"
         @close="closeModal"
        :key="forceUpdate"
        @updated="forceRefresh"  
        :formTitle="'Add User'"
         :fields="branchFormFields" 
      :isLoadingMsg="isOptionLoadingMsg" :url="url">
    </FormModal>

  
</template>