<template>
  <DashboardLayout pageTitle="Product Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
        <div class="flex flex-row justify-between rounded-[8px] bg-brand p-4">
          <div>
            <!-- <div class="icon">
                  <img src="/assets/verifiedusers-5d08be57.svg" alt="" />
                </div> -->
            <div
              class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
            >
              <span>Total Products</span>
            </div>
            <div class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]">
              {{ productsStore?.products?.total }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Button to Open Modal -->
      <DataTableLayout
        :key="forceUpdate"
        endpoint="products"
        @toggleModal="showModal = !showModal"
        toggleButtonLabel="Add Product"
        :excludedKeys="['id', 'product_description','cat_id']"
        :clickableKeys="{
          product_name: openProductDetailModal,
          product_type: navigateToProductType,
        }"
        :additionalColumns="[
          { name: 'edit', action: handleEdit },
          { name: 'delete', action: handleDelete },
        ]"
      >
      <button @click="togglePriceModal" class="btn-brand">Price</button>
      <button @click="toggleProductTypeModal" class="btn-brand">Add Product Type</button>
      </DataTableLayout>
    </div>
    <FormModal v-if="showModal" @close="closeModal" :formTitle="'Add Product'" 
              :fields="formFields"  
               @fetchDataForSubCategory="fetchDataForSubCategory"
               :isLoadingMsg="isOptionLoadingMsg"
               :url ="'/products'"
               >
    </FormModal>
    <!-- Modal to add sub product-->
    <FormModal v-if="showProductTypeModal" @close="toggleProductTypeModal" :formTitle="'Add Product Type'" 
              :fields="productTypeFormFields"  
               @fetchDataForSubCategory="fetchDataForSubCategory"
               :isLoadingMsg="isOptionLoadingMsg"
               :url ="'/product-types'"
               >
    </FormModal>
    <!-- Modal for Price Type-->
    <FormModal v-if="showPriceModal"  @close="togglePriceModal" :formTitle="'Add Price'" 
              :fields="priceFormFields"  
               @fetchDataForSubCategory="fetchDataForSubCategory"
               :isLoadingMsg="isOptionLoadingMsg"
               :url ="'/prices'"
               >
    </FormModal>
    
   

    
    <ViewModal v-if="showViewModal" @close="closeViewModal" :modalTitle="modalTitle">
      <ViewModalDetail :products="products" />
    </ViewModal>

    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemsId"
      :url="'/products'"
      :modalTitle="modalTitle"
    />
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :items="items"
      @updated="forceRefresh"
      :formField="formFields"
      :subCategoryIdToPopulate="product_sub_category_id"
      :url="'/products'"
    />
  </DashboardLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
//import { formFields, priceFormFields, productTypeFormFields} from '@/formfields/formFields';
import { formFields,priceFormFields, productTypeFormFields,} from '@/formfields/formFields';
//handles all component import
import { useSharedComponent } from "@/composable/useSharedComponent";
const {  DataTableLayout,FormModal, usePostComposable,useEditComposable,EditModal,useSelectComposable,
      useDeleteComposable,
      ViewModal,ViewModalDetail,defineEmits} = useSharedComponent();

const modalTitle = "View Product";
const router = useRouter();
const url = "/all-product-sub-categories-by-category-id";
const products = ref();
//const postUrl = ref('/products')
const showProductTypeModal = ref(false);
const showPriceModal = ref(false);


const { handleDelete,showDeleteModal,itemsId,closeDeleteModal} = useDeleteComposable();
const emit = defineEmits("forceRefresh")
//const { showModal, showViewModal,**loading, **allError,forceUpdate,**errorMessage,isError,closeModal,closeViewModal,} = usePostComposable('/products', formFields);
const { showModal, showViewModal,forceUpdate,closeModal,closeViewModal} = usePostComposable('/products', formFields);
const {handleEdit, showEditModal, closeEditModal, items} = useEditComposable(emit)

// fetchDataForSubCategory is emitted
const { fetchDataForSelect, fetchDataForSubCategory, isOptionLoadingMsg} = useSelectComposable(formFields, url,"category_id", "sub_category_id", "sub_category_name");
 
 
const openProductDetailModal = (product) => {
  products.value = product;
  showViewModal.value = true;
};

const navigateToProductType = (product) => {
  router.push({ name: "product-type", params: { id: product.id } });
};

const toggleProductTypeModal = () => {
  showProductTypeModal.value = !showProductTypeModal.value;
};
const togglePriceModal = () => {
  showPriceModal.value = !showPriceModal.value;
};

const forceRefresh = () => {

forceUpdate.value++; 

};
 
//useLabelNameToselectFormFieldToPopulate, endpoint, optionValue, formKey:is the name from endpoint
onMounted(async () => {
 await fetchDataForSelect("Measurement", "/measurements", "id", "measurement_name");
  await fetchDataForSelect("Category", "/product-categories", "id", "category_name");
  await fetchDataForSelect("Product Name", "/all-products", "id", "product_name",productTypeFormFields.value);
  await fetchDataForSelect("Product Type","/all-product-type-name","id","product_type",priceFormFields.value);
  await fetchDataForSelect("Currency Name", "/currencies", "id", "currency_name",priceFormFields.value);
});
</script>