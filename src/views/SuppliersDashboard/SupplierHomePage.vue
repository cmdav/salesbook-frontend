<template>
    <DashboardLayout pageTitle="Suppliers Page">
      <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
        <!-- <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
          <div class="flex flex-row justify-between rounded-[8px] bg-brand p-4">
            <div>
              <div class="icon">
                    <img src="/assets/verifiedusers-5d08be57.svg" alt="" />
                  </div>
              <div
                class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
              >
                <span>Total Products</span>
              </div>
               <div class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]">
                {{ productsStore?.productType?.total }}
              </div>
            </div>
          </div>
        </div> -->

        <!-- Button to Open Modal -->
        <DataTableLayout
          :key="forceUpdate"
          endpoint="auth-supplier-products"
          @click="HandleToggleModal"
          toggleButtonLabel="Add Product"
          :excludedKeys="['id','product_type_id','supplier_id','product_category_name']"
          :additionalColumns=additionalColumns
        >
        </DataTableLayout>
      </div>

       <CenteredModalLarge v-if="showModal">
        <div class="p-4">
          <header
            class="flex flex-row items-center justify-between border-b-[#000000] pb-[35px] mb-[35px] border-b-[1px]"
          >
            <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">
              Add Price
            </h4>
            <button @click="HandleToggleModal" class="text-[30px]">X</button>
          </header>
          <div>
            <form
              class="flex flex-col gap-[17px]"
              action="POST"
              @submit.prevent="handleAddSupplierPrice()"
            >
              <div class="flex flex-col gap-[17px]">
                <div class="flex lg:flex-row flex-col w-full gap-[20px]">
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="Price"
                      :error="errors.costPrice"
                      type="text"
                      placeholder="Enter Price"
                      v-model="formData.costPrice"
                    />
                  </div>
                </div>
              </div> 

              <div class="flex flex-col lg:flex-row w-full gap-[30px]">
                <div class="w-full flex justify-center">
                  <button
                    type="submit"
                    class="btn-brand !border-none !w-[30%] mx-auto !py-3 lg:!px-10 !px-5 !text-[#FFFFFF] text-center"
                  >
                    <span v-if="!loading" class="text-[12.067px]">Add Price</span>
                    <Loader v-else />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </CenteredModalLarge>

      

      <DeleteModal
        v-if="showDeleteModal"
        @close="closeDeleteModal"
        @updated="forceRefresh"
        :items="itemsId"
        :url="'/auth-supplier-products'"
        :modalTitle="modalTitle"
      />
      <!--Modal to edit  product types-->
      <EditModal
        v-if="showEditModal"
        @close="closeEditModal"
        @fetchDataForSubCategory="fetchDataForSubCategory"
        :items="items"
        @updated="forceRefresh"
        :formField="dynamicFormFields"
        :url="dynamicUrl"
      />
     
    </DashboardLayout>
  </template>

  <script setup>
  import { onMounted, ref, watch, reactive, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useSupplierStore } from "@/stores/suppliers"
import CenteredModalLarge from "@/components/UI/CenteredModalLarge.vue";
  const supplierStore = useSupplierStore();
  import {
    formFields,
    priceFormFields,
    productTypeFormFields,
  } from "@/formfields/formFields";
  //handles all component import
  import { useSharedComponent } from "@/composable/useSharedComponent";
  const {
     DataTableLayout,
    FormModal,
    usePostComposable,
    useEditComposable,
    EditModal,
    useSelectComposable,
    useDeleteComposable,
    ViewModal,
    ViewModalDetail,
    defineEmits,
    DeleteModal,
    // UploadModal,
    // useUploadComposable,
    useStore
  } = useSharedComponent('supplier-home-page');
//   const { showUploadModal, closeUploadModal } = useUploadComposable();

  const modalTitle = "View Product";
  const router = useRouter();
//   const url = "/all-product-sub-categories-by-category-id";
  const products = ref();
  //const postUrl = ref('/products')
  const showProductTypeModal = ref(false);
  const showPriceModal = ref(false);


  const {
    handleDelete,
    showDeleteModal,
    itemsId,
    closeDeleteModal,
  } = useDeleteComposable();
  const emit = defineEmits("forceRefresh");
  //const { showModal, showViewModal,**loading, **allError,forceUpdate,**errorMessage,isError,closeModal,closeViewModal,} = usePostComposable('/products', formFields);
  const {
    forceUpdate,
    } = usePostComposable("/products");

  const showModal = ref(false)

  function HandleToggleModal() {
  showModal.value = !showModal.value;
  clearInputs();
}
 
const formData = reactive({
 costPrice: "",
productTypeId:"", 
supplierId: "",
status: 0
});


  const forceRefresh = () => {
    forceUpdate.value++;
  };

  const errors = reactive({
 costPrice: false
});

  //useLabelNameToselectFormFieldToPopulate, endpoint, optionValue, formKey:is the name from endpoint
  onMounted(async () => {

    await supplierStore.handleGetSupplierProducts()

  });

  const dynamicFormFields = computed(() => {

    if (items.value && items.value.product_name) {

    console.log(items.value.product_type_name)
      // check if product type and product name are the same
      if (items.value.product_name == items.value.product_type_name) {
        console.log('found');
        return formFields;
      }
    }

    return productTypeFormFields;
  });


  const dynamicUrl = computed(() => {


    if (items.value && items.value.product_name) {

      // check if product type and product name are the same
      if (items.value.product_name == items.value.product_type_name) {

        console.log(items.value.product_ids);

        return `/products/${items.value.product_ids}`;
      }
    }
    return `/product-types/${items.value.id}`;

  });

  const store = useStore();
  const permissions = computed(() => {

      return  store.getUser.user.permission.permissions.find(p => p.page_name === "products");
   })

  const additionalColumns = computed(() => {
      const cols = [];
      if (permissions.value?.update) {
        cols.push({ name: 'Edit', action: handleEdit });
      }
      if (permissions.value?.del) {
        cols.push({ name: 'Delete', action: handleDelete });
      }
      return cols;
    });
  </script>
