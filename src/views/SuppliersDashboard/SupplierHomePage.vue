<template>
    <SupplierDashboardLayout pageTitle="Suppliers Page">
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
        <SupplierTableLayout
          :key="forceUpdate"
          endpoint="auth-supplier-products"
          hideToggleButtonLabel: false
          :excludedKeys="['id','product_type_id','supplier_id','product_category_name']"
        :additionalColumns="[{ name: 'Add New Price', action: handleModal}]"
        >
        </SupplierTableLayout>
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
    </SupplierDashboardLayout>
</template>

  <script setup>
  import { onMounted, ref, watch, reactive, computed } from "vue";
  import { useSupplierStore } from "@/stores/suppliers";
import SaleFormModal from "@/components/UI/Modal/SalesFormModal.vue";


  const supplierStore = useSupplierStore();
  import { storeToRefs } from "pinia";
const { supplierProducts } = storeToRefs(supplierStore)
  //handles all component import
  import { useSharedComponent } from "@/composable/useSharedComponent";
  const {
    SupplierDashboardLayout,
    SupplierTableLayout,
    DataTableLayout,
    usePostComposable,
    defineEmits,
    useStore
  } = useSharedComponent('supplier-home-page');

  const emit = defineEmits("forceRefresh");
  const {
    forceUpdate,
    } = usePostComposable("/supplier-dashboard");

  const showModal = ref(false);

  let loading = ref(false);
  const formData = ref({
    costPrice: "",
    supplierId: "",
    productId: "",
    status: "'0'"
    
});

  function handleModal(product) {

    console.log("Product:", product);
    
  showModal.value = !showModal.value;

  // Set form data with product details
    formData.value.supplierId = product.supplier_id;
    formData.value.productId = product.product_type_id;

    // Reset costPrice input field
    formData.value.costPrice = "";
    formData.value.status = "0"
}



const forceRefresh = () => {
    forceUpdate.value++;
};

  const errors = reactive({
 costPrice: false
});



const handleAddPrice = async () => {
  loading.value = true;
 
  let payload = {
    supplier_id: formData.value.supplierId,
      product_type_id: formData.value.productId,
      cost_price: formData.value.costPrice,
      status: formData.value.status
   
  };
  try {
    let res = await supplierStore.handleAddSupplierPrice(payload);
    await supplierStore.handleGetSupplierProducts()
    loading.value = false;
    
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    forceUpdate.value++
    showModal.value = !showModal.value; 
  }
};


  onMounted(async () => {
    await supplierStore.handleGetSupplierProducts();
  });

  </script>
