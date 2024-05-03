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
          hideToggleButtonLabel: false
          :excludedKeys="['id','product_type_id','supplier_id','product_category_name']"
        :additionalColumns="[{ name: 'Add Price', action: handleModal}]"
        >
        </DataTableLayout>
      </div>

      <SaleFormModal
      v-if="showModal"
      :buttonLable="'Update Price'"
      :loading="loading"
      @close="handleModal"
      @submitForm="handleAddPrice"
      title="Add Price"
    >
      <div class="my-8 flex flex-col gap-2">
        <div class="overflow-y-auto flex flex-col gap-2 max-h-[340px]">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
              <div class="w-full">
                <label class="block text-sm font-medium text-gray-700"> Add Price </label>
                <input
                placeholder="Enter new Price"
                  v-model="formData.costPrice"
                  type="text"
                  class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SaleFormModal>

       <!-- <CenteredModalLarge v-if="showModal">
        <div class="p-4">
          <header
            class="flex flex-row items-center justify-between border-b-[#000000] pb-[35px] mb-[35px] border-b-[1px]"
          >
            <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">
              Add Price
            </h4>
            <button @click="handleModal()" class="text-[30px]">X</button>
          </header>
          <div> 
            <form
              class="flex flex-col gap-[17px]"
              action="POST"
              @submit.prevent="handleAddPrice()"
            >
              <div class="flex flex-col gap-[17px]">
                <div class="flex lg:flex-row flex-col w-full gap-[20px]">
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="Enter Price"
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
      </CenteredModalLarge> -->

     
    </DashboardLayout>
  </template>

  <script setup>
  import { onMounted, ref, watch, reactive, computed } from "vue";
  import { useSupplierStore } from "@/stores/suppliers"
import CenteredModalLarge from "@/components/UI/CenteredModalLarge.vue";
import AuthInput from "@/components/UI/Input/AuthInput.vue";
import Loader from "@/components/UI/Loader.vue";
import SaleFormModal from "@/components/UI/Modal/SalesFormModal.vue";

  const supplierStore = useSupplierStore();
  import { storeToRefs } from "pinia";
const { supplierProducts } = storeToRefs(supplierStore)
  //handles all component import
  import { useSharedComponent } from "@/composable/useSharedComponent";
  const {
    DataTableLayout,
    usePostComposable,
    defineEmits,
    useStore
  } = useSharedComponent('supplier-home-page');

  const emit = defineEmits("forceRefresh");
  const {
    forceUpdate,
    } = usePostComposable("/products");

  const showModal = ref(false)

  function handleModal() {
  showModal.value = !showModal.value;
  
}
let loading = ref(false);
 
const formData = reactive({
 costPrice: "",
//  status: 0
});

const forceRefresh = () => {
    forceUpdate.value++;
};

  const errors = reactive({
 costPrice: false
});



const handleAddPrice = async () => {
  loading.value = true;
 
  let payload = {
    cost_price: formData.costPrice,
    // supplier_id:
    // product_type_id:
    // status: 
  };
  try {
    let res = await supplierStore.handleAddSupplierPrice(payload);
    await supplierStore.handleGetSupplierProducts()
    loading.value = false;
    clearInputs();
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    handleModal();
    formData.costPrice = "";
  }
};


  onMounted(async () => {
    await supplierStore.handleGetSupplierProducts();

    // console.log(supplierProducts.value?.data.supplier_id)
  });



  const store = useStore();
  const permissions = computed(() => {

      return  store.getUser.user.permission.permissions.find(p => p.page_name === "products");
   })

  </script>
