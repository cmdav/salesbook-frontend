<template>
  <DashboardLayout pageTitle="Customer Page">
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
                  <span>Total Individuals </span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{ customerNames?.total ?? 0 }}
                </div>
              </div>
            </div>
            <div class="flex flex-row justify-between rounded-[8px] bg-brand p-4">
              <div>
                <!-- <div class="icon">
                  <img src="/assets/verifiedusers-5d08be57.svg" alt="" />
                </div> -->
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Total Companies </span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{ companyNames?.total ?? 0 }}
                </div>
              </div>
            </div>
          </div>
          <div class="chart hidden bg-white rounded-[8px] min-h-[100vh] p-4"></div>
          <div class="bg-white py-6 mt-12 rounded-lg">
            <div v-if="toggleCompanyTable" class="overflow-x-scroll hide-scrollbar">
              <div class="flex lg:flex-row flex-col gap-3 px-4 justify-between mb-4">
                <div class="flex lg:flex-row flex-col justify-between w-full gap-3">
                  <div class="w-[40%]">
                    <AuthInput
                      :error="false"
                      type="text"
                      placeholder="search"
                      v-model="sortInput.companies"
                    />
                  </div>
                  <div class="flex flex-row gap-[12px]">
                    <div
                      class="flex flex-row justify-end border-brand rounded-[4px] overflow-auto border-[1px]"
                    >
                      <button
                        @click="handleToggleTableButton"
                        :class="
                          toggleButton ? 'bg-brand text-white' : 'bg-white  text-brand'
                        "
                        class="p-4 py-[12px]"
                      >
                        Individual</button
                      ><button
                        @click="handleToggleCompanyTable"
                        :class="
                          toggleCompanyTable
                            ? 'bg-brand text-white'
                            : 'bg-white  text-brand '
                        "
                        class="p-4 py-[12px]"
                      >
                        Company
                      </button>
                    </div>

                    <button
                      @click="HandleToggleModal"
                      class="p-4 bg-brand py-[12px] text-white rounded-[4px]"
                    >
                      Add Customer
                    </button>
                  </div>
                </div>
              </div>

              <div class="table-container overflow-x-scroll">
                <table class="table-auto w-full">
                  <thead class="bg-[#F9FBFF] border-y text-[#A8AABC] text-[14px]">
                    <tr>
                      <th class="py-4 pl-4 flex border-x">S/N</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">
                        Company Name
                      </th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">
                        Company Representative
                      </th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">Email</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(i, index) in filteredCompany"
                      :key="i"
                      class="border-b text-[14px]"
                    >
                      <td class="py-4 pl-4 border-x">
                        {{ index + 1 }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 border-x capitalize">
                        <button @click="redirectToSingleCustomerPage(i.id)" class="">
                          {{ i.company_name }}
                        </button>
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 border-x">
                        {{ i.contact_person }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 border-x">{{ i.email }}</td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize border-x">
                        {{ i.phone_number }}
                      </td>
                    </tr>
                  </tbody>
                  <!---->
                </table>
              </div>
              <div class="mx-auto w-fit my-5">
                <!-- <Pagination
                  @changePage="(page) => (companiesCustomers.current_page = page)"
                  :currentPage="companiesCustomers?.current_page"
                  :pageSize="companiesCustomers?.per_page"
                  :totalPages="companiesCustomers?.last_page"
                  :alwaysShowNextAndPrevious="true"
                /> -->

              <Pagination v-if="showCompanyPagination" />
              </div>
            </div>

            <div v-if="toggleButton" class="overflow-x-scroll hide-scrollbar">
              <div class="flex lg:flex-row flex-col gap-3 px-4 justify-between mb-4">
                <div class="flex lg:flex-row flex-col justify-between w-full gap-3">
                  <div class="w-[40%]">
                    <AuthInput
                      :error="false"
                      type="text"
                      placeholder="search"
                      v-model="sortInput.Customers"
                    />
                  </div>
                  <div class="flex flex-row gap-[12px]">
                    <div
                      class="flex flex-row justify-end border-brand rounded-[4px] overflow-auto border-[1px]"
                    >
                      <button
                        @click="handleToggleTableButton"
                        :class="
                          toggleButton ? 'bg-brand text-white' : 'bg-white  text-brand'
                        "
                        class="p-4 py-[12px]"
                      >
                        Individual</button
                      ><button
                        @click="handleToggleCompanyTable"
                        :class="
                          toggleCompanyTable
                            ? 'bg-brand text-white'
                            : 'bg-white  text-brand '
                        "
                        class="p-4 py-[12px]"
                      >
                        Company
                      </button>
                    </div>

                    <button
                      @click="HandleToggleModal"
                      class="p-4 bg-brand py-[12px] text-white rounded-[4px]"
                    >
                      Add Customer
                    </button>
                  </div>
                </div>
              </div>

              <div class="table-container overflow-x-scroll">
                <table class="table-auto w-full">
                  <thead class="bg-[#F9FBFF] text-[#A8AABC] text-[14px]">
                    <tr class="border-y">
                      <th class="py-4 pl-4 border-x flex">S/N</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">name</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">Email</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(i, index) in filteredCustomer"
                      :key="i"
                      class="border-b text-[14px]"
                    >
                      <td class="py-4 border-x pl-4">
                        {{ index + 1 }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 border-x capitalize">
                        <button @click="redirectToSingleCustomerPage(i.id)" class="">
                          {{ i.first_name }} {{ i.last_name }}
                        </button>
                      </td>
                      <td class="text-left p-4 border-x pr-0 pl-6">{{ i.email }}</td>
                      <td class="text-left p-4 border-x pr-0 pl-6 capitalize">
                        {{ i.phone_number }}
                      </td>
                    </tr>
                  </tbody>
                  <!---->
                </table>
              </div>
              <div class="mx-auto w-fit my-5">
                <!-- <Pagination
                  @changePage="setCurrentCustomersPage"
                  :currentPage="Customers?.current_page"
                  :pageSize="Customers?.per_page"
                  :totalPages="Customers?.last_page"
                  :alwaysShowNextAndPrevious="true"
                /> -->
                  <Pagination v-if="showIndividualPagination" />
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
            <button @click="HandleToggleModal" class="text-[30px]">X</button>
          </header>
          <div v-if="step == 1">
            <div class="flex flex-row py-[30px] w-full gap-[10px]">
              <button
                @click="addCompany"
                class="bg-brand text-center py-4 text-white rounded-lg w-full"
              >
                Add Company
              </button>
              <button
                @click="addIndividual"
                class="bg-brand text-white text-center py-4 rounded-lg w-full"
              >
                Add Individual
              </button>
            </div>
          </div>
          <div v-if="step == 2">
            <div class="flex flex-col gap-[17px]">
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
                      label="Middle Name (optional)"
                      optional
                      :error="false"
                      type="text"
                      placeholder="Enter Middel Name"
                      v-model="middelName"
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
                      label="Date of Birth (optional)"
                      optional
                      :error="dobError"
                      type="date"
                      placeholder="Enter Date of Birth"
                      v-model="dob"
                      :max="minDate"
                      :errorsMsg="dobErrorMsg"
                    />
                  </div>
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="Phone number"
                      :error="errors.phoneNo"
                      type="number"
                      placeholder="Enter Phone number"
                      v-model="formData.phoneNo"
                    />
                  </div>
                </div>
              </div>

              <div class="flex flex-col lg:flex-row w-full gap-[30px]">
                <div class="w-full flex justify-center">
                  <button
                    @click="handleCustomerRegisteration()"
                    class="btn-brand !border-none !w-[30%] mx-auto !py-3 lg:!px-10 !px-5 !text-[#FFFFFF] text-center"
                  >
                    <span v-if="!loading" class="text-[12.067px]">Add</span>
                    <Loader v-else />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="step == 3">
            <div class="flex flex-col gap-[17px]">
              <div class="flex flex-col gap-[17px]">
                <div class="flex lg:flex-row flex-col w-full gap-[20px]">
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="Company Name"
                      :error="errorsCom.company_name"
                      type="text"
                      placeholder="Enter company name"
                      v-model="formCompanyData.company_name"
                    />
                  </div>
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="Contact Individual"
                      :error="errorsCom.contact_person"
                      type="text"
                      placeholder="Enter contact"
                      v-model="formCompanyData.contact_person"
                    />
                  </div>
                </div>

                <div class="flex lg:flex-row flex-col w-full gap-[20px]">
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="Email"
                      optional
                      :error="errorsCom.email"
                      type="email"
                      placeholder="Enter email company address"
                      v-model="formCompanyData.email"
                    />
                  </div>
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="Contact Number"
                      :error="errorsCom.phone_number"
                      type="number"
                      placeholder="Enter contact number"
                      v-model="formCompanyData.phone_number"
                    />
                  </div>
                </div>
              </div>

              <div class="flex flex-col lg:flex-row w-full gap-[30px]">
                <div class="w-full flex justify-center">
                  <button
                    @click="handleCompanyCustomerRegisteration()"
                    class="btn-brand !border-none !w-[30%] mx-auto !py-3 lg:!px-10 !px-5 !text-[#FFFFFF] text-center"
                  >
                    <span v-if="!loading" class="text-[12.067px]">Add</span>
                    <Loader v-else />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CenteredModalLarge>
    </div>
  </DashboardLayout>
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import { useCustomerstore } from "@/stores/customers";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import CenteredModalLarge from "@/components/UI/CenteredModalLarge.vue";
import AuthInput from "@/components/UI/Input/AuthInput.vue";
import Pagination from "@/components/UI/Pagination/customerPagination.vue";
import Loader from "@/components/UI/Loader.vue";

// import { useQuery } from "vue-query";
import { storeToRefs } from "pinia";
const CustomerStore = useCustomerstore();
const { Customers, companiesCustomers, customerNames, companyNames } = storeToRefs(
  CustomerStore
);
import { register } from "@/services/Auth";
import { useRouter } from "vue-router";
const router = useRouter();
import { useStore } from "@/stores/user";
const store = useStore();
const { userProfileDetails } = storeToRefs(store);

const dobError = ref(false);
const dobErrorMsg = ref("date of birth is lower than 18");

// Define the minimum date for the Date of Birth field
const minDate = ref(getMinDate());

function getMinDate() {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  // Return the minimum date in the format required by the input[type=date] field
  return minDate.toISOString().split("T")[0];
}
const redirectToSingleCustomerPage = (id) => {
  router.push({ name: "view-customers", params: { id } });
};
const toggleButton = ref(true);
const toggleCompanyTable = ref(false);
function handleToggleTableButton() {
  toggleCompanyTable.value = false;
  toggleButton.value = true;
  CustomerStore.allCustomer();
}
function handleToggleCompanyTable() {
  toggleCompanyTable.value = true;
  toggleButton.value = false;
  CustomerStore.allCompanyCustomers();
}
let sortInput = reactive({
  Customers: "",
  companies: "",
});
function clearSearch() {
  sortInput.Customers = "";
  sortInput.companies = "";
}
const filteredCustomer = computed(() => {
  // Create a shallow copy of the jobs array
  let filtered = customerNames.value?.data;

  // Filtering based on the search criteria
  if (sortInput.Customers) {
    return filtered.filter((item) =>
      item.first_name.toLowerCase().includes(sortInput.Customers.toLowerCase())
    );
  }

  return filtered; // Return the filtered array
});

const filteredCompany = computed(() => {
  // Create a shallow copy of the jobs array
  let filtered = companyNames.value?.data;

  // Filtering based on the search criteria
  if (sortInput.companies) {
    return filtered.filter((item) =>
      item.company_name.toLowerCase().includes(sortInput.companies.toLowerCase())
    );
  }

  return filtered; // Return the filtered array
});

let showModal = ref(false);
const step = ref(1);

const addCompany = () => {
  step.value = 3;
};
const addIndividual = () => {
  step.value = 2;
};

const formData = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phoneNo: "",
});
const formCompanyData = reactive({
  company_name: "",
  contact_person: "",
  email: "",
  phone_number: "",
});
let middelName = ref("");
let dob = ref("");
let loading = ref(false);

const errors = reactive({
  firstName: false,
  // middelName: false,
  lastName: false,
  email: false,
  // dob: false,
  phoneNo: false,
});
const errorsCom = reactive({
  company_name: false,
  contact_person: false,
  email: false,
  phone_number: false,
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
  const minDOB = new Date(minDate.value);
  const selectedDOB = new Date(dob.value);
  if (selectedDOB > minDOB) {
    // DOB is less than 5 years from today
    dobError.value = true;
    isValid = false;
  }

  return isValid;
};
const validateAddCompanyForm = () => {
  // Reset errorsMsg
  Object.keys(errorsCom).forEach((key) => {
    errorsCom[key] = false;
  });
  // Perform validation before submission
  let isValid = true;

  Object.keys(formCompanyData).forEach((key) => {
    if (!formCompanyData[key]) {
      errorsCom[key] = true;
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
// const isFormValid = computed(() => {
//   return (
//     formData.firstName.trim() !== "" &&
//     formData.lastName.trim() !== "" &&
//     formData.email.trim() !== "" &&
//     formData.middelName.trim() !== "" &&
//     formData.phoneNo.trim() !== "" &&
//     formData.dob.trim() !== ""
//   );
// });
const clearInputs = () => {
  (formData.firstName = ""),
    (formData.lastName = ""),
    (formData.email = ""),
    (middelName.value = "");
  formData.phoneNo = "";
  dob.value = "";
  formCompanyData.company_name = "";
  formCompanyData.contact_person = "";
  formCompanyData.email = "";
  formCompanyData.phone_number = "";
};
watch(formCompanyData, () => {
  clearInputErrors();
});
watch(formData, () => {
  clearInputErrors();
});
function HandleToggleModal() {
  showModal.value = !showModal.value;
  step.value = 1;
  clearInputs();
}

const pageSize = 20;

const showIndividualPagination = computed(() => {
  return filteredCustomer.value && filteredCustomer.value.length > pageSize;
});

const showCompanyPagination = computed(() => {
  return filteredCompany.value && filteredCompany.value.length > pageSize;
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
    middle_name: middelName.value,
    phone_number: formData.phoneNo,
    dob: dob.value,
    email: formData.email,
    type_id: "individual",
  };
  try {
    let res = await CustomerStore.handleAddCustomer(payload);
    await CustomerStore.handleCustomerName();
    HandleToggleModal();
    loading.value = false;
    clearInputs();
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const handleCompanyCustomerRegisteration = async () => {
  loading.value = true;
  if (!validateAddCompanyForm()) {
    loading.value = false;
    return;
  }
  let payload = {
    company_name: formCompanyData.company_name,
    contact_person: formCompanyData.contact_person,
    phone_number: formCompanyData.phone_number,
    email: formCompanyData.email,
    type_id: "company",
  };
  try {
    let res = await CustomerStore.handleAddCustomer(payload);
    // await CustomerStore.allCustomer();
    await CustomerStore.handleCompanyName();
    HandleToggleModal();
    loading.value = false;
    clearInputs();
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

watch(customerNames, () => {
  fetchProducts(Customers.value.current_page);
});

watch(companyNames, () => {
  fetchCompanyProducts(companiesCustomers.value.current_page);
});

const fetchProducts = async (page) => {
  try {
    let res = await CustomerStore.allCustomer(page);
    return res;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const fetchCompanyProducts = async (page) => {
  try {
    let res = await CustomerStore.allCompanyCustomers(page);
    return res;
  } catch (error) {
    console.error("Error fetching company customers:", error);
  }
};

const setCurrentCustomersPage = (page) => {
  Customers.value.current_page = page;
  fetchProducts(page);
};

onMounted(async () => {
  try {
    await CustomerStore.handleCustomerName();
    await CustomerStore.handleCompanyName();
    await fetchProducts(Customers.value.current_page);
    await fetchCompanyProducts(companiesCustomers.value.current_page);
    // await CustomerStore.allCustomer(
    //   Customers?.value?.current_page ? Customers?.value?.current_page : 1
    // );
    // await CustomerStore.allCompanyCustomers(
    //   companiesCustomers?.value?.current_page
    //     ? companiesCustomers?.value?.current_page
    //     : 1
    // );
  } catch (error) {
    console.error(error);
  }
});
</script>