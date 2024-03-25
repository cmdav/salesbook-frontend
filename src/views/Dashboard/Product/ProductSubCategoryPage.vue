<template>
  <DashboardLayout pageTitle="Subcategory Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="product-sub-categories"
        searchEndpoint="search-product-sub-categories"
        :excludedKeys="['id', 'sub_category_id']"
        :additionalColumns="[
          { name: 'edit', action: handleEdit },
          { name: 'delete', action: handleDelete },
        ]"
      />
    </div>
    <FormModal
      v-if="showModal"
      @close="closeModal"
      :formTitle="'Product Sub Category'"
      :fields="productSubCategoryFormFields"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/product-sub-categories'"
    >
    </FormModal>
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      :items="itemsId"
      :url="'/product-sub-categories'"
      :modalTitle="modalTitle"
    />
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      @updated="forceRefresh"
      :formField="productSubCategoryFormFields"
      :url="'/product-sub-categories'"
    />
  </DashboardLayout>
</template>

<script setup>
import { onMounted } from "vue";

import { productSubCategoryFormFields } from "@/formfields/formFields";
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
} = useSharedComponent();

const emit = defineEmits("forceRefresh");
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

const { showModal, forceUpdate, closeModal } = usePostComposable(
  "/product-sub-categories",
  productSubCategoryFormFields
);
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);
const { fetchDataForSelect } = useSelectComposable(productSubCategoryFormFields);

const forceRefresh = () => {
  forceUpdate.value++;
};
// Fetch data for select options on component mount
onMounted(async () => {
  await fetchDataForSelect("Category", "/product-categories", "id", "category_name");
});
</script>
