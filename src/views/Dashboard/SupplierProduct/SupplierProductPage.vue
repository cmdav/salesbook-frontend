<template>
  <DashboardLayout pageTitle="Supplier product page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">

      <!----<div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
            <div class="flex flex-row justify-between rounded-[8px] bg-brand p-4">
              <div>
                
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Total Products</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{ supplierProduct?.total }}
                </div>
              </div>
            </div>

            <div
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(0, 175, 239)"
            >
              <div>
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Rejected Supply</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  0
                </div>
              </div>
            </div>
            <div
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(44, 43, 108)"
            >
              <div>
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Pending Supply</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  0
                </div>
              </div>
            </div>
            <div
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(123, 97, 255)"
            >
              <div>
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Canceled Supply</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  0
                </div>
              </div>
            </div>
            </div>-->

  <SupplierTableLayout
  :key="forceUpdate"
  endpoint="price-notifications"
  hideToggleButtonLabel: false
  :excludedKeys="['id','product_type_id','supplier_id','product_category_name']"
  :additionalColumns="[{ name: 'Accept', action: acceptProduct , disabled: acceptDisabled  }, { name: 'Decline', action: declineProduct, disabled: declineDisabled }]"
  >
</SupplierTableLayout>
</div>
  </DashboardLayout>
</template>
<script setup>

import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import { onMounted, ref, reactive, computed } from "vue";
  import { useSupplierStore } from "@/stores/suppliers";
// import SaleFormModal from "@/components/UI/Modal/SalesFormModal.vue";
  const supplierStore = useSupplierStore();
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

  const lastClicked = ref(null); 
const acceptDisabled = ref(false); 
const declineDisabled = ref(false); 


 const acceptProduct = async (product) => {
  await handlePriceStatus(product.id, { status: "accepted", selling_price: product.selling_price });
  lastClicked.value = "accept"; 
  declineDisabled.value = true; 
  acceptDisabled.value = false; 
};

const declineProduct = async (product) => {
  await handlePriceStatus(product.id, { status: "decline", selling_price: product.selling_price });
  lastClicked.value = "decline"; 
  declineDisabled.value = false; 
  acceptDisabled.value = true; 
};

const forceRefresh = () => {
    forceUpdate.value++;
};

  const errors = reactive({
 costPrice: false
});


const handlePriceStatus = async (id, payload) => {
  loading.value = true;
 
  try {
    let res = await supplierStore.handleUpdateSupplierPriceStatus(id, payload);
    await supplierStore.handleGetSupplierPrice()
    loading.value = false;
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    forceUpdate.value++
  }
};


  onMounted(async () => {
    await supplierStore.handleGetSupplierPrice();
  });

</script>
