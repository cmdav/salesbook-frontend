<template>
  <!-- <DashboardLayout pageTitle="Roles Page"> -->
  <div class="">
    <!-- Button to Open Modal -->
    <!-- <button @click="showModal = true" class="btn btn-primary">Add Store</button> -->
    <DataTableLayout
      @toggleModal="showModal = !showModal"
      :hideToggleButtonLabel="false"
      :key="forceUpdate"
      endpoint="pages"
      :additionalColumns="[{ name: 'delete', action: handleDelete }]"
    />
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      :items="itemsId"
      :url="'/pages'"
      :modalTitle="modalTitle"
    />
  </div>

  <!-- <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      :items="itemsId"
      :url="'stores'"
      :modalTitle="modalTitle"
    /> -->
  <!-- </DashboardLayout> -->
</template>

<script setup>
//import { onMounted } from 'vue';

import { useSharedComponent } from "@/composable/useSharedComponent";

const {
  DataTableLayout,
  //usePostComposable,
  DeleteModal,
  useDeleteComposable,
} = useSharedComponent();

//const formTitle = "Add Store";

// const {
//   showModal,

// } = usePostComposable("/stores", cu);
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();
</script>
