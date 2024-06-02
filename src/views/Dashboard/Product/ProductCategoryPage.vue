<template>
  <DashboardLayout pageTitle="Product Category Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="product-categories"
        searchEndpoint="search-product-categories"
        :pageName="'product-categories'"
        :additionalColumns=additionalColumns
      >
      <div v-if="canUploadPermission">
        <button class="btn-brand" @click="closeUploadModal">Upload</button>
       </div>
      </DataTableLayout>
    </div>
    <FormModal
      v-if="showModal"
      @close="closeModal"
      :formTitle="'Product Category'"
      :fields="productCategoryFormFields"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'product-categories'"
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
      :url="'product-categories'"
      :modalTitle="modalTitle"
    />
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      @updated="forceRefresh"
      :formField="productCategoryFormFields"
      :url="'product-categories'"
    />
    <UploadModal
      v-if="showUploadModal"
      @close="closeUploadModal"
      @updated="forceRefresh"
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
  useStore,
  computed,
  useDeleteComposable,
  defineEmits,
  UploadModal,
  useUploadComposable,
  
} = useSharedComponent('product-categories');
const { showUploadModal, closeUploadModal } = useUploadComposable();

const { showModal, forceUpdate, closeModal } = usePostComposable(
  "/product-categories",
  productCategoryFormFields
);
const emit = defineEmits("forceRefresh");
const {  handleEdit,showEditModal, closeEditModal, items } = useEditComposable(emit);

const forceRefresh = () => {
  forceUpdate.value++;
};
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

const store = useStore();
const permissions = computed(() => {
    return  store.getUser.user.permission.permissions.find(p => p.page_name === "product-categories");
 })

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
