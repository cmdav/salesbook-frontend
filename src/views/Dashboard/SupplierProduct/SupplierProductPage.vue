<template>
  <DashboardLayout pageTitle="Supplier product page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">

  <SupplierTableLayout
  :key="forceUpdate"
  endpoint="price-notifications"
  hideToggleButtonLabel: false
  :excludedKeys="['id','product_type_id','supplier_id','product_category_name']"
  :additionalColumns="[{ name: 'Accept', action: (product) => handleAcceptModal(product), disabled: acceptDisabled  }, { name: 'Decline', action: declineProduct, disabled: declineDisabled }]"
  >
</SupplierTableLayout>
</div>

<SaleFormModal
      v-if="showModal"
      :buttonLable="'Accept & Update Price'"
      :loading="loading"
      @close="handleAcceptModal"
      @submitForm="acceptProduct"
      title="Add Price"
    >
      <div class="my-8 flex flex-col gap-2">
        <div class="overflow-y-auto flex flex-col gap-2 max-h-[340px]">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
              <div class="w-full">
                <label class="block text-sm font-medium text-gray-700">Add Selling Price </label>
                <input
                placeholder="Enter Selling Price"
                  v-model="formData.sellingPrice"
                  type="text"
                  class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SaleFormModal>
  </DashboardLayout>
</template>
<script setup>

import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import { onMounted, ref, reactive, computed } from "vue";
  import { useSupplierStore } from "@/stores/suppliers";
import SaleFormModal from "@/components/UI/Modal/SalesFormModal.vue";
  const supplierStore = useSupplierStore();
  //handles all component import
  import { useSharedComponent } from "@/composable/useSharedComponent";
  const {
    SupplierTableLayout,
    usePostComposable,
    defineEmits,
  } = useSharedComponent('supplier-home-page');

  const emit = defineEmits("forceRefresh");
  const {
    forceUpdate,
    } = usePostComposable("/supplier-dashboard");

  const showModal = ref(false);

  const formData = ref({
    sellingPrice: "",
    productId: ""
});

let loading = ref(false);

const lastClicked = ref(null); 
const acceptDisabled = ref(false); 
const declineDisabled = ref(false); 


 const handleAcceptModal = async (product) => {
  showModal.value = !showModal.value;
  if (product) {
    formData.value.productId = product.id;
  }
};

const declineProduct = async (product) => {
  await handlePriceStatus(product.id, { status: "decline" });

  lastClicked.value = "decline"; 
  declineDisabled.value = false; 
  acceptDisabled.value = true; 
};

const acceptProduct = async () => {
  await handlePriceStatus(formData.value.productId, { status: "accepted", selling_price: formData.value.sellingPrice });
  await handleAcceptModal()

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
