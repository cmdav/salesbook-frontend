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
                  <span>Total Products</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{ products?.total }}
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
                <div class="flex lg:flex-row flex-col w-[60%] gap-3">
                  <!-- <select
                    class="border-[1px] border-gray-200 px-6 py-[12px] bg-[#f6f6f6] rounded-[4px]"
                    name=""
                    id=""
                  >
                    <option>All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value=""></option>
                    <option value=""></option>
                  </select> -->

                  <!-- <input
                    class="border-[1px] w-[40%] border-gray-200 outline-none bg-[#F6F8FB] px-4 py-[4px] rounded-[4px]"
                    type="search"
                    placeholder="Search"
                    name=""
                    id=""
                  /> -->
                </div>

                <button
                  @click="HandleToggleUploadModal"
                  class="p-4 bg-brand py-[12px] text-white rounded-[4px]"
                >
                  Add Products Categories
                </button>
                <button
                  @click="HandleToggleModal"
                  class="p-4 bg-brand py-[12px] text-white rounded-[4px]"
                >
                  Add Products
                </button>
              </div>
            </div>
            <div class="">
              <div class="table-container">
                <table class="table-auto w-full">
                  <thead class="bg-[#F9FBFF] text-[#A8AABC] text-[14px]">
                    <tr>
                      <th class="py-4 pl-4 flex">S/N</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">Product name</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">measurement</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">category</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">sub-category</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">unit</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(i, index) in products?.data"
                      :key="i"
                      class="border-b text-[14px]"
                    >
                      <td class="py-4 pl-4">
                        {{ index + 1 }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">
                        <button class="flex flex-row items-center gap-3 justify-start">
                          <img
                            :src="i.product_image"
                            class="h-[40px] w-[40px] rounded-full"
                            alt=""
                          />

                          {{ i.product_name }}
                        </button>
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">
                        {{ i.measurement_name }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">
                        {{ i.product_category }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">
                        {{ i.product_sub_category }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">{{ i.unit }}</td>
                      <td class="relative !flex !justify-end !items-center">
                        <button
                          class="flex h-full justify-end items-center p-6 !px-6"
                          @click="toggleDocument(i)"
                        >
                          <svg
                            class="cursor-pointer flex lg:flex-row flex-col gap-4 justify-end"
                            xmlns="http://www.w3.org/2000/svg"
                            width="5"
                            height="19"
                            viewBox="0 0 5 19"
                            fill="none"
                          >
                            <circle
                              cx="2.25781"
                              cy="16.1094"
                              r="2"
                              transform="rotate(-90 2.25781 16.1094)"
                              fill="#3F634D"
                            />
                            <circle
                              cx="2.25781"
                              cy="9.10938"
                              r="2"
                              transform="rotate(-90 2.25781 9.10938)"
                              fill="#3F634D"
                            />
                            <circle
                              cx="2.25781"
                              cy="2.10938"
                              r="2"
                              transform="rotate(-90 2.25781 2.10938)"
                              fill="#3F634D"
                            />
                          </svg>
                        </button>

                        <Dropdown
                          v-if="showDocument.id == i.id && showDocumentToggle"
                          :showDropdown="showDocument.id == i.id && showDocumentToggle"
                          class="-bottom-[8rem] w-36 z-10 top-12 lg:right-15"
                          :link="false"
                          :id="`dropdown` + i.id"
                          @closeDropdown="closeDropdown"
                        >
                          <ul class="!mb-0">
                            <li>
                              <button
                                class="text-left p-2 flex items-center px-[20px] gap-[12px] hover:bg-gray-100 w-full"
                              >
                                <p>View</p>
                              </button>
                            </li>
                            <li>
                              <button
                                class="text-left p-2 flex items-center px-[20px] gap-[12px] hover:bg-gray-100 w-full"
                              >
                                <p>Edit</p>
                              </button>
                            </li>
                          </ul>
                        </Dropdown>
                      </td>
                    </tr>
                  </tbody>
                  <!---->
                </table>
              </div>
            </div>
            <div class="mx-auto w-fit mt-5">
              <Pagination
                @changePage="(page) => (products.current_page = page)"
                :currentPage="products?.current_page"
                :pageSize="products?.per_page"
                :totalPages="products?.last_page"
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
            <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">Add Products</h4>
            <button @click="HandleToggleModal" class="text-[30px]">X</button>
          </header>
          <div>
            <form
              class="flex flex-col gap-[17px]"
              action="POST"
              @submit.prevent="handleProductInvite()"
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
            <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">Upload Products</h4>
            <button @click="HandleToggleUploadModal" class="text-[30px]">X</button>
          </header>
          <div>
            <form
              class="flex flex-col gap-[17px]"
              action="POST"
              @submit.prevent="handleProductInvite()"
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
import { ref, reactive, watch, onMounted } from "vue";
import { useProductStore } from "@/stores/products";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import CenteredModalLarge from "@/components/UI/CenteredModalLarge.vue";
import AuthInput from "@/components/UI/Input/AuthInput.vue";
import Pagination from "@/components/UI/Pagination/Pagination.vue";
import Loader from "@/components/UI/Loader.vue";
import Dropdown from "@/components/UI/Dropdown/Dropdown.vue";
import { storeToRefs } from "pinia";
const productsStore = useProductStore();
const { products } = storeToRefs(productsStore);
import { useStore } from "@/stores/user";
const store = useStore();
const { userProfileDetails } = storeToRefs(store);
import CloudUploadIcon from "@/components/icons/cloudUploadIcon.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const showDocument = ref({});
const showDocumentToggle = ref(false);
const reason = ref("");
const redirectToSingleProductPage = () => {
  // router.push({ name: "view-Product", params: { id } });
};
let showModal = ref(false);
let showUploadModal = ref(false);
const formData = reactive({
  firstName: "",
  lastName: "",
  email: "",
});
let loading = ref(false);

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
const toggleDocument = (document) => {
  if (showDocument.value.id === document.id) {
    return (showDocumentToggle.value = !showDocumentToggle.value);
  }
  showDocument.value = document;
  showDocumentToggle.value = true;
};
const closeDropdown = () => {
  showDocumentToggle.value = false;
};

function HandleToggleUploadModal() {
  showUploadModal.value = !showUploadModal.value;
  clearInputs();
}

const handleProductInvite = async () => {
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
    // let res = await resendEmail(payload);
    // ProductStore.allProduct();
    HandleToggleModal();
    loading.value = false;
    clearInputs();
    // return res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
onMounted(async () => {
  await productsStore.handleGetProducts();
  await store.handleUserProfile();
});
</script>
