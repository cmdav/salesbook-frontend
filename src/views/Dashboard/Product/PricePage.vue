<template>
  <DashboardLayout pageTitle="Price Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <button
        @click="goBack"
        class="btn btn-secondary flex flex-row items-center gap-2 mb-3"
      >
        <BackIcon />
      </button>

      <DataTableLayout
        :hideToggleButtonLabel="false"
        @toggleModal="showModal = !showModal"
        :key="forceUpdate"
        :endpoint="computedEndpoint"
        :excludedKeys="['id', 'product_type_id']"
        :additionalColumns="[
          { name: 'edit', action: handleEdit },
          { name: 'delete', action: handleDelete },
        ]"
      >
        <button class="btn-brand" @click="closeUploadModal">Upload</button>
      </DataTableLayout>
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="formTitle">
      <template v-slot:default>
        <form @submit.prevent="submitForm">
          <p v-if="isError" class="text-red-500">{{ errorMessage }}</p>
          <ReusableForm
            :fields="priceFormFields"
            :isLoadingMsg="isLoadingMsg"
            :allError="allError"
          />
          <input
            type="submit"
            v-if="!loading"
            value="Submit"
            class="btn btn-primary mt-3"
          />
          <Loader v-else />
        </form>
      </template>
    </FormModal>
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      :items="itemsId"
      :url="prices"
      :modalTitle="modalTitle"
    />
    <UploadModal
      v-if="showUploadModal"
      @close="closeUploadModal"
      @updated="forceRefresh"
      :url="'/prices'"
      type="Price"
    />
  </DashboardLayout>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue";
import FormModal from "@/components/UI/Modal/FormModal.vue";
import ReusableForm from "@/components/Form/ReusableForm.vue";
import Loader from "@/components/UI/Loader.vue";
import { usePostComposable } from "@/composable/usePostComposable";
import { useSelectComposable } from "@/composable/useSelectComposable";
import { priceFormFields } from "@/formfields/formFields";
import DeleteModal from "@/components/UI/Modal/DeleteModal.vue";
import { useDeleteComposable } from "@/composable/useDeleteComposable";
import BackIcon from "@/components/icons/BackIcon.vue";
import { useSharedComponent } from "@/composable/useSharedComponent";

const { UploadModal, useUploadComposable } = useSharedComponent();
const { showUploadModal, closeUploadModal } = useUploadComposable();

const router = useRouter();
const route = useRoute();
const formTitle = "Add Price";
const productTypeId = ref(route.params.id);

const fieldOverrides = {
  product_type_id: productTypeId.value,
};

const { fetchDataForSelect } = useSelectComposable(priceFormFields);

const {
  showModal,
  isLoadingMsg,
  loading,
  allError,
  forceUpdate,
  errorMessage,
  isError,
  closeModal,
  submitForm,
} = usePostComposable(
  productTypeId.value ? `get-price-by-product-type/${productTypeId.value}` : "prices",
  priceFormFields,
  "prices",
  fieldOverrides
);
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

const computedEndpoint = computed(() => {
  return productTypeId.value
    ? `get-price-by-product-type/${productTypeId.value}`
    : "prices";
});

const goBack = () => {
  router.go(-1);
};

// router.go(-1);
// Fetch data for select options on component mount
onMounted(async () => {
  await fetchDataForSelect("Currency Name", "/currencies", "id", "currency_name");
});

// const updateSellingPrice = (fieldDatabase, value) => {
//    console.log(value)

//   if (fieldDatabase === 'cost_price') {
//     const costPrice = parseFloat(priceFormFields.value.find(field => field.databaseField === 'cost_price')?.value) || 0;
//     const auto_generated_selling_price = parseFloat(priceFormFields.value.find(field => field.databaseField === 'auto_generated_selling_price')?.value) || 0;
//     const totalPriceField = priceFormFields.value.find(field => field.databaseField === 'selling_price');
//     if (totalPriceField) {
//       totalPriceField.value = costPrice + costPrice * (auto_generated_selling_price/100);
//     }
//   }
// };

// // Call this function whenever the related fields change.
// watch(() => priceFormFields.value.find(field => field.databaseField === 'cost_price')?.value, updateSellingPrice);
</script>
