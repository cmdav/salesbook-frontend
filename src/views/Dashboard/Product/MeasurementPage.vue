<template>
  <DashboardLayout pageTitle="Measurement Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Button to Open Modal -->
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        endpoint="measurements"
        searchEndpoint="search-measurement"
        :additionalColumns="[
          { name: 'edit', action: handleEdit },
          { name: 'delete', action: handleDelete },
        ]"
      />
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
  </DashboardLayout>
</template>

<script setup>
import { onMounted } from "vue";
import { useProductStore } from "@/stores/products";
import { measurementFormFields } from "@/formfields/formFields";

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
} = useSharedComponent();

const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();
// define other constant
const productsStore = useProductStore();
const emit = defineEmits("forceRefresh");
const { showModal, forceUpdate, closeModal } = usePostComposable(
  "/measurements",
  measurementFormFields
);

const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);

const forceRefresh = () => {
  forceUpdate.value++;
};
onMounted(async () => {
  try {
    await productsStore.handleGetMeasurements();
  } catch (error) {
    console.error(error);
  }
});
</script>
