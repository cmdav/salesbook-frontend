<template>
  <DashboardLayout pageTitle="Suppliers Page">
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
                  <span>Total Suppliers</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{ Supplier?.total }}
                </div>
              </div>
            </div>

            <!-- <div
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
            </div> -->
          </div>
          <div class="chart hidden bg-white rounded-[8px] min-h-[100vh] p-4"></div>
          <div class="bg-white py-6 mt-12 rounded-lg">
            <div class="flex lg:flex-row flex-col gap-3 px-4 justify-between mb-4">
              <div class="flex lg:flex-row flex-col justify-between w-full gap-2">
                <div class="w-[40%]">
                  <AuthInput :error="false" type="text" placeholder="search" />
                </div>
                <div class="flex flex-row gap-[12px]">
                  <button
                    @click="HandleToggleUploadModal"
                    class="p-4 bg-brand py-[12px] text-white rounded-[4px]"
                  >
                    Upload Suppliers
                  </button>
                  <button
                    @click="HandleToggleModal"
                    class="p-4 bg-brand py-[12px] text-white rounded-[4px]"
                  >
                    Invite Suppliers
                  </button>
                </div>
              </div>
            </div>
            <div class="overflow-x-scroll hide-scrollbar">
              <div class="table-container overflow-x-scroll">
                <table class="table-auto w-full">
                  <thead class="bg-[#F9FBFF] text-[#A8AABC] text-[14px]">
                    <tr class="border-y">
                      <th class="py-4 pl-4 flex border-x">S/N</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">name</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">Bank</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">Email</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">state</th>
                      <th class="text-left p-4 pr-0 px-6 border-x capitalize">account</th>
                      <!-- <th class="text-left p-4 pr-0 px-6 capitalize">expiring Date</th> -->
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(i, index) in filteredSupplier"
                      :key="i"
                      class="border-y text-[14px]"
                    >
                      <td class="py-4 border-x pl-4">
                        <!-- <input class="mr-2 outline-none" type="checkbox" value="1" /> -->
                        {{ index + 1 }}
                      </td>
                      <td class="text-left p-4 border-x pr-0 pl-6 capitalize">
                        <button @click="redirectToSingleSupplierPage(i.user_id)" class="">
                          {{ i.first_name }} {{ i.last_name }}
                        </button>
                      </td>
                      <td class="text-left p-4 border-x pr-0 pl-6 capitalize">
                        {{ i.bank_name }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 border-x capitalize">
                        {{ i.email }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 border-x capitalize">
                        {{ i.state }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 border-x capitalize">
                        {{ i.account_number }}
                      </td>
                      <!-- <td class="text-left p-4 pr-0 pl-6 capitalize">Basic</td> -->
                    </tr>
                  </tbody>
                  <!---->
                </table>
              </div>
            </div>
            <div class="mx-auto w-fit mt-5">
              <Pagination
                @changePage="(page) => (Supplier.current_page = page)"
                :currentPage="Supplier?.current_page"
                :pageSize="Supplier?.per_page"
                :totalPages="Supplier?.last_page"
                :alwaysShowNextAndPrevious="true"
              />
            </div>
          </div>
        </div>
      </div>
      <CenteredModalLarge v-if="showModal">
        <div class="p-4">
          <header
            class="flex flex-row items-center justify-between border-b-[#000000] pb-[35px] mb-[35px] border-b-[1px]"
          >
            <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">
              Invite Suppliers
            </h4>
            <button @click="HandleToggleModal" class="text-[30px]">X</button>
          </header>
          <div>
            <form
              class="flex flex-col gap-[17px]"
              action="POST"
              @submit.prevent="handleSupplierInvite()"
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
                      label="Email Address"
                      :error="errors.email"
                      type="email"
                      placeholder="Enter email address"
                      v-model="formData.email"
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
                    <span v-if="!loading" class="text-[12.067px]">Invite</span>
                    <Loader v-else />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </CenteredModalLarge>
      <CenteredModalLarge v-if="showUploadModal">
        <div class="p-4">
          <header
            class="flex flex-row items-center justify-between border-b-[#000000] pb-[35px] mb-[35px] border-b-[1px]"
          >
            <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">
              Upload Suppliers
            </h4>
            <button @click="HandleToggleUploadModal" class="text-[30px]">X</button>
          </header>
          <div>
            <form
              class="flex flex-col gap-[17px]"
              action="POST"
              @submit.prevent="handleSupplierInvite()"
            >
              <div class="flex flex-col gap-[17px]">
                <div class="flex flex-col w-full gap-[10px]">
                  <div class="flex h-40 rounded-lg flex-col w-full">
                    <label
                      for="upload_file"
                      class="bg-secondary-800 border-dashed cursor-pointer border-[#254035AB] border-[1.789px] p-2 py-6 flex flex-col text-center relative rounded-[5.982px]"
                    >
                      <div class="flex flex-col">
                        <p class="font-Satoshi500 text-[12.3px] text-[#000]">
                          Drag and Drop file or <span class="underline">Browse</span>
                        </p>
                        <p class="text-[#000000] text-[8.516px] font-Satoshi500">
                          Attach up to 3 files, max 10MB each.
                        </p>
                        <CloudUploadIcon class="mx-auto text-primary-900 mt-4" />
                      </div>
                      <span>{{}} </span>
                    </label>
                    <input
                      type="file"
                      name=""
                      ref="previewImage"
                      accept=".doc,.docx,.jpg,.png,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      hidden
                      id="upload_file"
                    />
                  </div>
                  <button class="bg-brand text-center p-2 rounded-lg w-full">
                    Download Sample
                  </button>
                </div>

                <!-- <div class="flex lg:flex-row flex-col w-full gap-[20px]">
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="Email Address"
                      :error="errors.email"
                      type="email"
                      placeholder="Enter email address"
                      v-model="formData.email"
                    />
                  </div>
                </div> -->
              </div>

              <div class="flex flex-col lg:flex-row w-full gap-[30px]">
                <div class="w-full flex justify-center">
                  <button
                    type="submit"
                    class="btn-brand !border-none !w-[30%] mx-auto !py-3 lg:!px-10 !px-5 !text-[#FFFFFF] text-center"
                  >
                    <span v-if="!loading" class="text-[12.067px]">Invite</span>
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
import { ref, reactive, watch, onMounted, computed } from "vue";
import { useSupplierStore } from "@/stores/suppliers";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import CenteredModalLarge from "@/components/UI/CenteredModalLarge.vue";
import AuthInput from "@/components/UI/Input/AuthInput.vue";
import Pagination from "@/components/UI/Pagination/Pagination.vue";
import Loader from "@/components/UI/Loader.vue";
import { storeToRefs } from "pinia";
const supplierStore = useSupplierStore();
const { Supplier } = storeToRefs(supplierStore);
import { resendEmail } from "@/services/Auth";
import { useStore } from "@/stores/user";
const store = useStore();
const { userProfileDetails } = storeToRefs(store);
import CloudUploadIcon from "@/components/icons/cloudUploadIcon.vue";
import { useRouter } from "vue-router";
const router = useRouter();

const redirectToSingleSupplierPage = (id) => {
  router.push({ name: "view-supplier", params: { id } });
};

let showModal = ref(false);
let showUploadModal = ref(false);
const formData = reactive({
  firstName: "",
  lastName: "",
  email: "",
});
let loading = ref(false);
let sortInput = reactive({
  name: "",
});
const filteredSupplier = computed(() => {
  // Create a shallow copy of the jobs array
  let filtered = Supplier.value?.data;

  // Filtering based on the search criteria
  if (sortInput.name) {
    return filtered.filter((item) =>
      item.first_name.toLowerCase().includes(sortInput.name.toLowerCase())
    );
  }

  return filtered; // Return the filtered array
});

const errors = reactive({
  firstName: false,
  lastName: false,
  email: false,
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
// const isFormValid = computed(() => {
//   return (
//     formData.firstName.trim() !== "" &&
//     formData.lastName.trim() !== "" &&
//     formData.email.trim() !== ""
//   );
// });
const clearInputs = () => {
  (formData.firstName = ""), (formData.lastName = ""), (formData.email = "");
};
watch(formData, () => {
  clearInputErrors();
});
function HandleToggleModal() {
  showModal.value = !showModal.value;
  clearInputs();
}
function HandleToggleUploadModal() {
  showUploadModal.value = !showUploadModal.value;
  clearInputs();
}

const handleSupplierInvite = async () => {
  loading.value = true;
  if (!validateForm()) {
    loading.value = false;
    return;
  }
  let payload = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    organization_id: userProfileDetails.value?.organization_id,
    email: formData.email,
    type: "invitation",
  };
  try {
    let res = await resendEmail(payload);
    supplierStore.allSupplier();
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
onMounted(async () => {
  await supplierStore.allSupplier();
  await store.handleUserProfile();
});
</script>
