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
                  <span>Total Product Type</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{ dashboardSataus?.total_product_type }}
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
                  <span> Total Sales</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{ productsStore?.sales?.total }}
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
              style="background-color: rgb(44, 43, 108)"
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
                  {{ dashboardSataus?.suppliers }}
                </div>
              </div>
            </div>

            <div
              v-if="feature.includes('CUSTOMERS')"
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(123, 97, 255)"
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
                  {{ dashboardSataus?.customers }}

                  <!-- {{
                    Customers?.total + companiesCustomers?.total
                      ? Customers?.total + companiesCustomers?.total
                      : 0
                  }} -->
                </div>
              </div>
            </div>
            <div
              v-if="feature.includes('CUSTOMERS')"
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(123, 97, 255)"
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
                  {{ dashboardSataus?.total_product }}
                </div>
              </div>
            </div>
            <div
              v-if="feature.includes('CUSTOMERS')"
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(44, 43, 108)"
            >
              <div>
                <!-- <div class="icon"><img src="/assets/active-c00dd557.svg" alt="" /></div> -->
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Total Profits Sold Today</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{ dashboardSataus?.total_product_type_daily_profits }}
                </div>
              </div>
            </div>
            <div
              v-if="feature.includes('CUSTOMERS')"
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(123, 97, 255)"
            >
              <div>
                <!-- <div class="icon"><img src="/assets/active-c00dd557.svg" alt="" /></div> -->
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Total active users</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{ dashboardSataus?.active_users }}
                </div>
              </div>
            </div>
            <div
              v-if="feature.includes('CUSTOMERS')"
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(44, 43, 108)"
            >
              <div>
                <!-- <div class="icon"><img src="/assets/active-c00dd557.svg" alt="" /></div> -->
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span> Quantity Sold Today</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{ dashboardSataus?.daily_product_type_quantity_sold }}
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="grid lg:grid-rows-2 grid-cols-1 gap-4"> -->
          <div class="">
            <DataTableLayout
              :hideToggleButtonLabel="false"
              :key="forceRefresh"
              endpoint="daily-sales"
            />
          </div>
          <div class="flex flex-row gap-4 mt-8">
            <div
              class="bg-white border-secondary-400 border-[1px] pt-6 w-full rounded-lg"
            >
              <div class="flex lg:flex-row flex-col gap-3 px-4 justify-between mb-4">
                <div class="flex lg:flex-row flex-col justify-between w-full gap-3">
                  <div class="flex lg:flex-row flex-col gap-3">
                    <h4>Quantity of sales</h4>
                  </div>
                </div>
              </div>
              <div class="overflow-x-scroll hide-scrollbar">
                <SalesChart
                  :chartData="dashboardSataus?.weekly_product_type_quantity_sales"
                  title="Sales"
                />
              </div>
            </div>
            <div
              class="bg-white border-secondary-400 border-[1px] pt-6 w-full rounded-lg"
            >
              <div class="flex lg:flex-row flex-col gap-3 px-4 justify-between mb-4">
                <div class="flex lg:flex-row flex-col justify-between w-full gap-3">
                  <div class="flex lg:flex-row flex-col gap-3"><h4>Profit</h4></div>
                </div>
              </div>
              <div class="overflow-x-scroll hide-scrollbar">
                <ChartComponentcopy
                  :chartData="dashboardSataus?.weekly_product_type_profit_made_per_day"
                  title="Profit"
                />
              </div>
            </div>
          </div>
          <!-- </div> -->
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { startOfWeek, format } from "date-fns";

import SalesChart from "@/components/UI/Chart/SalesChart.vue";
import ChartComponentcopy from "@/components/UI/Chart/ChartComponentcopy.vue";
import { useStore } from "@/stores/user";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import { useSupplierStore } from "@/stores/suppliers";
import { useCustomerstore } from "@/stores/customers";
import { useProductStore } from "@/stores/products";
import { useDashboardStore } from "@/stores/dashboardStatus";
const dashboardStore = useDashboardStore();
const productsStore = useProductStore();
const { products } = storeToRefs(productsStore);
const { dashboardSataus } = storeToRefs(dashboardStore);
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { saleFormFields } from "@/formfields/formFields";

import { useSharedComponent } from "@/composable/useSharedComponent";

const {
  DataTableLayout,
  usePostComposable,
  useSelectComposable,
  defineEmits,
} = useSharedComponent();
const emit = defineEmits("forceRefresh");
const url = "/all-price-by-product-type";
const { fetchDataForSelect } = useSelectComposable(saleFormFields, url);

const { forceUpdate } = usePostComposable("/sales", saleFormFields);

const forceRefresh = () => {
  forceUpdate.value++;
};

onMounted(async () => {
  await fetchDataForSelect(
    "Product Type",
    "/all-product-type-name",
    "id",
    "product_type_name"
  );
  await fetchDataForSelect("Customer", "/user-detail", "id", "customer_id");
});
const store = useStore();
const feature = computed(() => {
  return Array.isArray(store.features) ? store.features : [];
});

const supplierStore = useSupplierStore();
const { Supplier } = storeToRefs(supplierStore);
const CustomerStore = useCustomerstore();
const { Customers, companiesCustomers } = storeToRefs(CustomerStore);

const firstDayOfWeek = ref(getFirstDayOfWeek());
const currentDate = ref(new Date());

function getFirstDayOfWeek() {
  const today = new Date();
  return startOfWeek(today, { weekStartsOn: 1 }); // Assuming week starts on Monday (1)
}

watch(currentDate, () => {
  const today = new Date();
  if (today.getDay() === 0) {
    // If today is Sunday, update firstDayOfWeek
    firstDayOfWeek.value = getFirstDayOfWeek();
  }
});

setInterval(() => {
  currentDate.value = new Date(); // Update current date every second (for demonstration)
}, 1000);

console.log(format(firstDayOfWeek.value.toISOString(), "yyyy-MM-dd"));
console.log(format(currentDate.value.toISOString(), "yyyy-MM-dd"));
onMounted(async () => {
  try {
    await supplierStore.allSupplier();
    await CustomerStore.allCustomer();
    await productsStore.handleGetProducts(products?.value?.current_page);
    await productsStore.handleGetSales();
    await dashboardStore.handleDashboardSataus(
      format(firstDayOfWeek.value.toISOString(), "yyyy-MM-dd")
    );
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
