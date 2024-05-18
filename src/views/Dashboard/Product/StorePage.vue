<template>
  <DashboardLayout pageTitle="Store Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Button to Open Modal -->
      <!-- <button @click="showModal = true" class="btn btn-primary">Add Store</button> -->
      <DataTableLayout
        @toggleModal="showModal = !showModal"
        :hideToggleButtonLabel="false"
        :key="forceUpdate"
        endpoint="stores"
        searchEndpoint="search-stores"
       
      />
    </div>

    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      :items="itemsId"
      :url="'stores'"
      :modalTitle="modalTitle"
    />
  </DashboardLayout>
</template>

<script setup>
//import { onMounted } from 'vue';

import { useSharedComponent } from '@/composable/useSharedComponent'

const {
  DataTableLayout,
  //usePostComposable,
  DeleteModal,
  //useDeleteComposable
} = useSharedComponent()

//const formTitle = "Add Store";

// const {
//   showModal,

// } = usePostComposable("/stores", cu);
//const { handleDelete, showDeleteModal, itemsId, closeDeleteModal } = useDeleteComposable()
</script>
