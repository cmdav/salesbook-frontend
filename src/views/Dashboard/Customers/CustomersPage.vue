<template>
  <DashboardLayout>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div>
        <div class="lg:px-6 px-3 pt-8 grid grid-rows gap-4">
          <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
            <div class="flex flex-row justify-between rounded-[8px] bg-brand p-4">
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

                <button
                  @click="HandleToggleEditImageModal"
                  class="p-4 bg-brand py-[12px] text-white rounded-[4px]"
                >
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
                      <td class="text-left p-4 pr-0 pl-6">{{ i.email }}</td>
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
      <CenteredModalLarge v-if="showModal">
        <div class="p-4">
          <header
            class="flex flex-row items-center justify-between border-b-[#000000] pb-[35px] mb-[35px] border-b-[1px]"
          >
            <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">Add Customer</h4>
            <button @click="HandleToggleEditImageModal" class="text-[30px]">X</button>
          </header>
          <div>
            <form
              class="flex flex-col gap-[17px]"
              action="POST"
              @submit.prevent="handleCustomerRegisteration()"
            >
              <div class="flex flex-col gap-[17px]">
                <div class="flex lg:flex-row flex-col w-full gap-[20px]">
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="First Name"
                      :error="errors.firstName"
                      type="text"
                      placeholder="Enter first name"
                      v-model="formData.firstName"
                    />
                  </div>
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="Last Name"
                      :error="errors.lastName"
                      type="text"
                      placeholder="Enter last name"
                      v-model="formData.lastName"
                    />
                  </div>
                </div>

                <div class="flex lg:flex-row flex-col w-full gap-[20px]">
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="Middle Name"
                      :error="errors.middelName"
                      type="text"
                      placeholder="Enter Middel Name"
                      v-model="formData.middelName"
                    />
                  </div>
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="Email Address"
                      :error="errors.email"
                      type="email"
                      placeholder="Enter email address"
                      v-model="formData.email"
                    />
                  </div>
                </div>
                <div class="flex lg:flex-row flex-col w-full gap-[20px]">
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="Date of Birth"
                      :error="errors.dob"
                      type="date"
                      placeholder="Enter Date of Birth"
                      v-model="formData.dob"
                    />
                  </div>
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="Phone number"
                      :error="errors.phoneNo"
                      type="tel"
                      placeholder="Enter Phone number"
                      v-model="formData.phoneNo"
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
                    <span v-if="!loading" class="text-[12.067px]">Add</span>
                    <Loader v-else />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </CenteredModalLarge>
    </div>
  </DashboardLayout>
</template>
<script setup>
import { ref, onMounted, reactive, computed, watch } from "vue";
import { useCustomerstore } from "@/stores/customers";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import CenteredModalLarge from "@/components/UI/CenteredModalLarge.vue";
import AuthInput from "@/components/UI/Input/AuthInput.vue";
import Loader from "@/components/UI/Loader.vue";
import { useQuery } from "vue-query";
import { storeToRefs } from "pinia";
const CustomerStore = useCustomerstore();
const { Customers } = storeToRefs(CustomerStore);
import { register } from "@/services/Auth";

let showModal = ref(false);

const formData = reactive({
  firstName: "",
  middelName: "",
  lastName: "",
  email: "",
  dob: "",
  phoneNo: "",
});
let loading = ref(false);

const errors = reactive({
  firstName: false,
  middelName: false,
  lastName: false,
  email: false,
  dob: false,
  phoneNo: false,
});

const validateForm = () => {
  // Reset errorsMsg
  Object.keys(errors).forEach((key) => {
    errors[key] = false;
  });

  // Perform validation before submission
  let isValid = true;

  Object.keys(formData).forEach((key) => {
    if (!formData[key]) {
      errors[key] = true;
      isValid = false;
    }
  });

  return isValid;
};
// Function to clear input errors
const clearInputErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = false;
  });
};
const isFormValid = computed(() => {
  return (
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.middelName.trim() !== "" &&
    formData.phoneNo.trim() !== "" &&
    formData.dob.trim() !== ""
  );
});
const clearInputs = () => {
  (formData.firstName = ""),
    (formData.lastName = ""),
    (formData.email = ""),
    (formData.middelName = "");
  formData.phoneNo = "";
  formData.dob = "";
};
watch(formData, () => {
  clearInputErrors();
});
function HandleToggleEditImageModal() {
  showModal.value = !showModal.value;
  clearInputs();
}

// onMounted(() => {
//   CustomerStore.allCustomer();
// });
const getallCustomerData = async () => {
  let response = await CustomerStore.allCustomer();
  return response;
};
const fetchData = async () => {
  await Promise.all([getallCustomerData()]);
};

fetchData();

useQuery(["allCustomer"], getallCustomerData, {
  retry: 10,
  staleTime: 10000,
  onSuccess: (data) => {
    Customers.value = data;
  },
});
const handleCustomerRegisteration = async () => {
  loading.value = true;
  if (!validateForm()) {
    loading.value = false;
    return;
  }
  let payload = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    middle_name: formData.middelName,
    phone_number: formData.phoneNo,
    dob: formData.dob,
    email: formData.email,
    type_id: 0,
  };
  try {
    let res = await register(payload);
    HandleToggleEditImageModal();
    getallCustomerData();
    loading.value = false;
    clearInputs();
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>
