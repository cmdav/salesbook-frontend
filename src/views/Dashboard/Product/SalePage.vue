<template>
  <DashboardLayout pageTitle="Sales Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="sales"
        :additionalColumns="[
          { name: 'edit', action: handleEdit },
          { name: 'delete', action: handleDelete },
        ]"
      />
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="'Add Sale'" 
              :fields="saleFormFields"  
               @fetchDataForSubCategory="fetchDataForSubCategory"
               :isLoadingMsg="isOptionLoadingMsg"
               :url ="'/sales'"
               >
    </FormModal>
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemsId"
      :url="'/sales'"
      :modalTitle="modalTitle"
    />
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      :formField="saleFormFields"
      @updated="forceRefresh"
      :url="'/sales'"
    />
  </DashboardLayout>
</template>

<script setup>
import { onMounted } from "vue";
import { saleFormFields } from "@/formfields/formFields";

import { useSharedComponent } from "@/composable/useSharedComponent";
const {
  DataTableLayout,
  FormModal,
  usePostComposable,
  useEditComposable,
  EditModal,
  useSelectComposable,
  DeleteModal,
  useDeleteComposable,
  defineEmits
} = useSharedComponent();
const emit = defineEmits("forceRefresh")
const url = "/all-price-by-product-type";
const { fetchDataForSelect,fetchDataForSubCategory,isOptionLoadingMsg } = useSelectComposable(saleFormFields, url);
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);



const {showModal,forceUpdate,closeModal,} = usePostComposable("/sales", saleFormFields);
const { handleDelete, showDeleteModal,itemsId,closeDeleteModal,} = useDeleteComposable();

const forceRefresh = () => {

forceUpdate.value ++; 

};

onMounted(async () => {
  await fetchDataForSelect(
    "Product Type",
    "/all-product-type-name",
    "id",
    "product_type"
  );
  await fetchDataForSelect("Customer", "/user-detail", "id", "customer_id");
});
</script>
