<template>
  <DashboardLayout>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div>
        <div class="lg:px-6 px-3 pt-8 grid grid-rows gap-4">
          <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
            <div
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(0, 175, 239)"
            >
              <div>
                <!-- <div class="icon">
                  <img src="/assets/verifiedusers-5d08be57.svg" alt="" />
                </div> -->
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Total Customers</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{ Customers?.total }}
                </div>
              </div>
            </div>
          </div>
          <div class="chart hidden bg-white rounded-[8px] min-h-[100vh] p-4"></div>
          <div class="bg-white py-6 mt-12 rounded-lg">
            <div class="flex lg:flex-row flex-col gap-3 px-4 justify-between mb-4">
              <div class="flex lg:flex-row flex-col justify-between w-full gap-3">
                <div class="flex lg:flex-row flex-col w-[60%] gap-3">
                  <input
                    class="border-[1px] w-[40%] border-gray-200 outline-none bg-[#F6F8FB] px-4 py-[4px] rounded-[4px]"
                    type="search"
                    placeholder="Search"
                    name=""
                    id=""
                  />
                </div>

                <button class="p-4 bg-brand py-[12px] text-white rounded-[4px]">
                  Add Customer
                </button>
              </div>
            </div>
            <!-- {{ Customer.data }} -->
            <div class="overflow-x-scroll hide-scrollbar">
              <div class="table-container overflow-x-scroll">
                <table class="table-auto w-full">
                  <thead class="bg-[#F9FBFF] text-[#A8AABC] text-[14px]">
                    <tr>
                      <th class="py-4 pl-4 flex">S/N</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">name</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">Email</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(i, index) in Customers?.data"
                      :key="i"
                      class="border-b text-[14px]"
                    >
                      <td class="py-4 pl-4">
                        {{ index + 1 }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">
                        <a href="" class="">{{ i.first_name }} {{ i.last_name }}</a>
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">{{ i.email }}</td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">
                        {{ i.phone_number }}
                      </td>
                    </tr>
                  </tbody>
                  <!---->
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useCustomerstore } from "@/stores/customers";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import { storeToRefs } from "pinia";
const CustomerStore = useCustomerstore();
const { Customers } = storeToRefs(CustomerStore);

onMounted(() => {
  CustomerStore.allCustomer();
});
</script>
