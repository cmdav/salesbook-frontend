<template>
  <DashboardLayout pageTitle="Measurement Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Button to Open Modal -->
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="measurements"
        searchEndpoint="search-purchase-units"
        :pageName="'measurements'"
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
      :formTitle="'Add Measurement'"
      :fields="measurementFormFields"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'measurements'"
    >
    </FormModal>

    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemsId"
      :url="'/measurements'"
      :modalTitle="modalTitle"
    />
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      :formField="measurementFormFields"
      @updated="forceRefresh"
      :url="'measurements'"
    />
    <UploadModal
      v-if="showUploadModal"
      @close="closeUploadModal"
      @updated="forceRefresh"
      :url="'/measurements'"
      type="Measurement"
    />
  </DashboardLayout>
</template>

<script setup>
import { onMounted } from "vue";
import { useProductStore } from "@/stores/products";
import { measurementFormFields } from "@/formfields/formFields";
// import { useStore } from "@/stores/user";
// import { computed } from 'vue';

// const formTitle = "Add Measurement";
const modalTitle = "measurement_name";
//handles all component import
import { useSharedComponent } from "@/composable/useSharedComponent";

const {
  DataTableLayout,
  FormModal,
  usePostComposable,
  useEditComposable,
  EditModal,
  DeleteModal,
  useDeleteComposable,
  defineEmits,
  useStore,
  computed,
  UploadModal,
  useUploadComposable,

} = useSharedComponent('measurements');

const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();
// define other constant
const productsStore = useProductStore();

const emit = defineEmits(["forceRefresh"]);

const { showModal, forceUpdate, closeModal } = usePostComposable(
  "/measurements",
  measurementFormFields
);

const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);

const { showUploadModal, closeUploadModal } = useUploadComposable(emit);

const forceRefresh = () => {
  forceUpdate.value++;
};

const store = useStore();
const permissions = computed(() => {
    
    return  store.getUser.user.permission.permissions.find(p => p.page_name === "measurements");
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
//uploadPermission
const canUploadPermission = computed(() => {

  return permissions.value?.write == 1;
});
onMounted(async () => {
  try {
    await productsStore.handleGetMeasurements();
  } catch (error) {
    console.error(error);
  }
});
</script>
