<template>
  <DashboardLayout pageTitle="Product Category Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="product-categories"
        searchEndpoint="search-product-categories"
        :additionalColumns="[
          { name: 'edit', action: handleEdit },
          { name: 'delete', action: handleDelete },
        ]"
      >
        <button class="btn-brand" @click="closeUploadModal">Upload</button>
      </DataTableLayout>
    </div>
    <FormModal
      v-if="showModal"
      @close="closeModal"
      :formTitle="'Product Category'"
      :fields="productCategoryFormFields"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/product-categories'"
    >
    </FormModal>

    <!-- <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      :formField="productCategoryFormFields"
      :url="'/product-categories'"
      :modalTitle="modalTitle" -->
    <!-- /> -->
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemsId"
      :url="'/product-categories'"
      :modalTitle="modalTitle"
    />
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      @updated="forceRefresh"
      :formField="productCategoryFormFields"
      :url="'/product-categories'"
    />
    <UploadModal
      v-if="showUploadModal"
      @close="closeUploadModal"
      :url="'/product-categories'"
      type="ProductCategory"
    />
  </DashboardLayout>
</template>

<script setup>
import { productCategoryFormFields } from "@/formfields/formFields";
import { useSharedComponent } from "@/composable/useSharedComponent";

console.log(productCategoryFormFields);
const {
  DataTableLayout,
  FormModal,
  usePostComposable,
  useEditComposable,
  EditModal,
  DeleteModal,
  useDeleteComposable,
  defineEmits,
  UploadModal,
  useUploadComposable,
} = useSharedComponent();
const { showUploadModal, closeUploadModal } = useUploadComposable();

const { showModal, forceUpdate, closeModal } = usePostComposable(
  "/product-categories",
  productCategoryFormFields
);
const emit = defineEmits("forceRefresh");
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);
const forceRefresh = () => {
  forceUpdate.value++;
};
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();
</script>
