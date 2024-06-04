<template>
  <DashboardLayout pageTitle="Subcategory Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="product-sub-categories"
        searchEndpoint="search-product-sub-categories"
        :excludedKeys="['id', 'sub_category_id']"
        :pageName="'product-sub-categories'"
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
      :formTitle="'Product Sub Category'"
      :fields="productSubCategoryFormFields"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/product-sub-categories'"
    >
    </FormModal>
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
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
      :url="'product-sub-categories'"
    />
    <UploadModal
      v-if="showUploadModal"
      @close="closeUploadModal"
      @updated="forceRefresh"
      :url="'/product-sub-categories'"
      type="ProductSubCategory"
    />
  </DashboardLayout>
</template>

<script setup>
import { onMounted } from "vue";

import { productSubCategoryFormFields } from "@/formfields/formFields";
import { useSharedComponent } from "@/composable/useSharedComponent";

const emit = defineEmits(['update', 'close']);

const {
  DataTableLayout,
  FormModal,
  usePostComposable,
  useEditComposable,
  EditModal,
  useSelectComposable,
  DeleteModal,
  useDeleteComposable,
  UploadModal,
  useUploadComposable,
  useStore,
  computed,
} = useSharedComponent('product-sub-categories');
const { showUploadModal, closeUploadModal } = useUploadComposable(emit);

// const emit = defineEmits(["forceRefresh",]);


const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

const { showModal, forceUpdate, closeModal } = usePostComposable(
  "/product-sub-categories",
  productSubCategoryFormFields,
  emit
);
const {  handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);
const { fetchDataForSelect } = useSelectComposable(productSubCategoryFormFields);

const forceRefresh = () => {
  forceUpdate.value++;
};

const store = useStore();
const permissions = computed(() => {
    
    return  store.getUser.user.permission.permissions.find(p => p.page_name === "product-sub-categories");
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

const canUploadPermission = computed(() => {

  return permissions.value?.write == 1;
});
// Fetch data for select options on component mount
onMounted(async () => {
  await fetchDataForSelect("Category", "/product-categories", "id", "category_name");
});
</script>
