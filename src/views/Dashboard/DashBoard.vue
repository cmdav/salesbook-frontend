<template>
  <DashboardLayout pageTitle="Dasboard">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div>
        <div class="lg:px-6 px-3 pt-8 grid grid-rows gap-4">
          <div class="grid lg:grid-cols-4 grid-cols-1 gap-4">
            <div
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(44, 43, 108)"
            >
              <div>
                <!-- <div class="icon"><img src="/assets/eruo-4d2c66c5.svg" alt="" /></div> -->
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Total Transactions</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  0
                </div>
              </div>
            </div>
            <div
              v-if="feature.includes('INVENTORY')"
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(123, 97, 255)"
            >
              <div>
                <!-- <div class="icon">
                  <img src="/assets/customers-844da486.svg" alt="" />
                </div> -->
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span> Total Inventory</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  0
                </div>
              </div>
              <!-- <div class="flex flex-col justify-between">
                <div>
                  <div
                    class="title font-Satoshi700 text-white text-right text-[14px] leading-[21.6px]"
                  >
                    Talent
                  </div>
                  <div
                    class="amount font-Satoshi700 text-white text-right text-[28px] leading-[43.2px]"
                  >
                    0
                  </div>
                </div>
                <div>
                  <div
                    class="title font-Satoshi700 text-white text-right text-[14px] leading-[21.6px]"
                  >
                    Business
                  </div>
                  <div
                    class="amount font-Satoshi700 text-white text-right text-[28px] leading-[43.2px]"
                  >
                    0
                  </div>
                </div>
              </div> -->
            </div>
            <div
              v-if="feature.includes('SUPPLIER')"
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(6, 194, 112)"
            >
              <div>
                <!-- <div class="icon">
                  <img src="/assets/verifiedusers-5d08be57.svg" alt="" />
                </div> -->
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Total Suppliers</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{ Supplier?.total }}
                </div>
              </div>
            </div>

            <div
              v-if="feature.includes('CUSTOMERS')"
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(0, 175, 239)"
            >
              <div>
                <!-- <div class="icon"><img src="/assets/active-c00dd557.svg" alt="" /></div> -->
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Total Customers</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{
                    Customers?.total + companiesCustomers?.total
                      ? Customers?.total + companiesCustomers?.total
                      : 0
                  }}
                </div>
              </div>
            </div>
            <div
              v-if="feature.includes('CUSTOMERS')"
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(0, 175, 239)"
            >
              <div>
                <!-- <div class="icon"><img src="/assets/active-c00dd557.svg" alt="" /></div> -->
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Total products </span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{ products?.total }}
                </div>
              </div>
            </div>
          </div>
          <div class="chart hidden bg-white rounded-[8px] min-h-[100vh] p-4"></div>
          <div class="flex flex-row gap-4">
            <div
              class="bg-white border-secondary-400 border-[1px] pt-6 mt-12 w-full rounded-lg"
            >
              <div class="flex lg:flex-row flex-col gap-3 px-4 justify-between mb-4">
                <div class="flex lg:flex-row flex-col justify-between w-full gap-3">
                  <div class="flex lg:flex-row flex-col gap-3">
                    <h4>Quantity of sales</h4>
                  </div>
                </div>
              </div>
              <div class="overflow-x-scroll hide-scrollbar">
                <ChartComponentcopy title="Sales" />
              </div>
            </div>
            <div
              class="bg-white border-secondary-400 border-[1px] pt-6 mt-12 w-full rounded-lg"
            >
              <div class="flex lg:flex-row flex-col gap-3 px-4 justify-between mb-4">
                <div class="flex lg:flex-row flex-col justify-between w-full gap-3">
                  <div class="flex lg:flex-row flex-col gap-3"><h4>Profit</h4></div>
                </div>
              </div>
              <div class="overflow-x-scroll hide-scrollbar">
                <ChartComponentcopy title="Profit" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
<script setup>
import { onMounted } from "vue";
// import ChartComponent from "@/components/UI/Chart/ChartComponent.vue";
import ChartComponentcopy from "@/components/UI/Chart/ChartComponentcopy.vue";
import { useStore } from "@/stores/user";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import { useSupplierStore } from "@/stores/suppliers";
import { useCustomerstore } from "@/stores/customers";
import { useProductStore } from "@/stores/products";
const productsStore = useProductStore();
const { products } = storeToRefs(productsStore);

import { storeToRefs } from "pinia";
import { computed } from "vue";
const store = useStore();
const feature = computed(() => {
  return Array.isArray(store.features) ? store.features : [];
});

const supplierStore = useSupplierStore();
const { Supplier } = storeToRefs(supplierStore);
const CustomerStore = useCustomerstore();
const { Customers, companiesCustomers } = storeToRefs(CustomerStore);
onMounted(async () => {
  try {
    await supplierStore.allSupplier();
    await CustomerStore.allCustomer();
    await productsStore.handleGetProducts(products?.value?.current_page);

    // await CustomerStore.allCompanyCustomers();
  } catch (error) {
    console.log(error);
  }
});
onMounted(async () => {
  try {
    let res = await CustomerStore.allCompanyCustomers();
    return res;
  } catch (error) {
    console.log(error);
  }
});

// const TotalCustomers = computed(() => {
//   return Customers?.value?.total + companiesCustomers?.value?.total;
// });
</script>
