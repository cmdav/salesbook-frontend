<template>
  <DashboardLayout>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div>
        <div class="lg:px-6 px-3 pt-8 grid grid-rows gap-4">
          <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
            <div
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(44, 43, 108)"
            >
              <div>
                <!-- <div class="icon"><img src="/assets/eruo-4d2c66c5.svg" alt="" /></div> -->
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Total transactions</span>
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
                    NGN
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
                    USD
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
                  <span>Total Supplyers</span>
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
                  0
                </div>
              </div>
            </div>
          </div>
          <div class="chart hidden bg-white rounded-[8px] min-h-[100vh] p-4"></div>
          <div class="bg-white py-6 mt-12 rounded-lg">
            <div class="flex lg:flex-row flex-col gap-3 px-4 justify-between mb-4">
              <div class="flex lg:flex-row flex-col justify-between w-full gap-3">
                <div class="flex lg:flex-row flex-col gap-3">
                  <select
                    class="border-[1px] border-gray-200 px-6 py-[12px] bg-[#f6f6f6] rounded-[4px]"
                    name=""
                    id=""
                  >
                    <option>All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value=""></option>
                    <option value=""></option></select
                  ><input
                    class="border-[1px] border-gray-200 outline-none bg-[#F6F8FB] px-4 py-[12px] rounded-[4px]"
                    type="search"
                    placeholder="Search"
                    name=""
                    id=""
                  />
                </div>

                <button class="p-4 bg-brand py-[12px] text-white rounded-[4px]">
                  Add Inventory
                </button>
              </div>
            </div>
            <div class="overflow-x-scroll hide-scrollbar">
              <div class="table-container overflow-x-scroll">
                <table class="table-auto w-full">
                  <thead class="bg-[#F9FBFF] text-[#A8AABC] text-[14px]">
                    <tr>
                      <th class="py-4 pl-4 flex">
                        <input
                          class="mr-2 outline-none"
                          type="checkbox"
                          name=""
                          id=""
                        />S/N
                      </th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">name</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">plan</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">balances</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">monthly Income</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">monthly Amount</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">expiring Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b text-[14px]">
                      <td class="py-4 pl-4">
                        <input class="mr-2 outline-none" type="checkbox" value="1" />1
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">
                        <a href="/customers/manage-customer/john-doe" class=""
                          >John Doe</a
                        >
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">Basic</td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">$1000</td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">$1000</td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">$1000</td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">Basic</td>
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
import { useStore } from "@/stores/user";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
const store = useStore();
</script>
