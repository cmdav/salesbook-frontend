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
                  <span>Total Organisations</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{ organisation?.total }}
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
              <div class="flex lg:flex-row flex-col justify-between w-full gap-3">
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
                  @click="HandleToggleModal"
                  class="p-4 bg-brand py-[12px] text-white rounded-[4px]"
                >
                  Add organisation
                </button>
              </div>
            </div>
            <div class="overflow-x-scroll hide-scrollbar">
              <div class="table-container overflow-x-scroll">
                <table class="table-auto w-full">
                  <thead class="bg-[#F9FBFF] text-[#A8AABC] text-[14px]">
                    <tr>
                      <th class="py-4 pl-4 flex">S/N</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">name</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">Code</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">Url</th>
                      <!-- <th class="text-left p-4 pr-0 px-6 capitalize">expiring Date</th> -->
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(i, index) in organisation?.data"
                      :key="i"
                      class="border-b text-[14px]"
                    >
                      <td class="py-4 pl-4">
                        <!-- <input class="mr-2 outline-none" type="checkbox" value="1" /> -->
                        {{ index + 1 }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">
                        <a href="" class="flex flex-row items-center gap-3 justify-start">
                          <img
                            :src="i.organization_logo"
                            class="h-[40px] w-[40px] rounded-full"
                            alt=""
                          />{{ i.organization_name }}</a
                        >
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">
                        {{ i.organization_code }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">
                        {{ i.organization_url }}
                      </td>
                    </tr>
                  </tbody>
                  <!---->
                </table>
              </div>
            </div>
            <div class="mx-auto w-fit mt-5">
              <Pagination
                @changePage="(page) => (organisation.current_page = page)"
                :currentPage="organisation?.current_page"
                :pageSize="organisation?.per_page"
                :totalPages="organisation?.last_page"
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
              Add Organisation
            </h4>
            <button @click="HandleToggleModal" class="text-[30px]">X</button>
          </header>
          <div>
            <form
              class="flex flex-col gap-[17px]"
              action="POST"
              @submit.prevent="handleorganisationInvite()"
            >
              <div class="flex flex-col gap-[17px]">
                <div class="flex lg:flex-row flex-col w-full gap-[20px]">
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="Organization Name"
                      :error="errors.organization_name"
                      type="text"
                      placeholder="Enter first name"
                      v-model="formData.organization_name"
                    />
                  </div>
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="organization Url"
                      :error="errors.organization_url"
                      type="text"
                      placeholder="Enter last name"
                      v-model="formData.organization_url"
                    />
                  </div>
                </div>

                <div class="flex lg:flex-row flex-col w-full gap-[20px]">
                  <div class="flex flex-col w-full">
                    <AuthInput
                      label="Organization code"
                      :error="errors.organization_code"
                      type="text"
                      placeholder="Enter organization code"
                      v-model="formData.organization_code"
                    />
                  </div>
                  <div class="flex flex-col w-full">
                    <Label class="">Upload Logo</Label>

                    <div
                      class="border-[0.737px] border-[#254035AB] flex items-center w-full h-full rounded-[5.897px] p-4 py-2"
                    >
                      <!-- <img
                        v-if="formData.organization_logo"
                        :src="formData.organization_logo"
                        class="w-full h-[100px] object-cover mb-4 rounded-md"
                      /> -->

                      <input
                        type="file"
                        name=""
                        @change="uploadFile"
                        ref="previewImage"
                        accept="image/*"
                        id="uploadFile"
                        hidden
                      />
                      <label
                        for="uploadFile"
                        class="cursor-pointer w-full justify-between flex text-[#01272C] overflow-x-hidden px-2 text-[12px] font-Satoshi400"
                        >#
                        <span v-if="formData.organization_logo"
                          >{{ uploadedImageName }}
                        </span>
                        <AttachFileIcon
                      /></label>
                    </div>
                  </div>

                  <!-- <div class="flex flex-col w-full">
                    <input type="file" name="" id="" />
                    <AuthInput
                      label="Organization Logo"
                      :error="errors.organization_code"
                      type="text"
                      placeholder="Enter email address"
                      v-model="formData.organization_code"
                    />
                  </div> -->
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
    </div>
  </DashboardLayout>
</template>
<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useOrganisationStore } from "@/stores/organisation";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import CenteredModalLarge from "@/components/UI/CenteredModalLarge.vue";
import AuthInput from "@/components/UI/Input/AuthInput.vue";
import Pagination from "@/components/UI/Pagination/Pagination.vue";
import Loader from "@/components/UI/Loader.vue";
import Label from "@/components/UI/Input/Label.vue";
import { storeToRefs } from "pinia";
const organisationStore = useOrganisationStore();
const { organisation } = storeToRefs(organisationStore);
// import { resendEmail } from "@/services/Auth";
// import { useStore } from "@/stores/user";
// const store = useStore();
// const { userProfileDetails } = storeToRefs(store);

// onMounted(() => {
//   store.handleUserProfile();
// });

import { useQuery } from "vue-query";
let showModal = ref(false);

const formData = reactive({
  organization_name: "",
  organization_url: "",
  organization_code: "",
  organization_logo: "",
});
let loading = ref(false);

const errors = reactive({
  organization_name: false,
  organization_url: false,
  organization_code: false,
  organization_logo: false,
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
//     formData.organization_name.trim() !== "" &&
//     formData.organization_url.trim() !== "" &&
//     formData.organization_code.trim() !== ""
//   );
// });
const clearInputs = () => {
  (formData.organization_name = ""),
    (formData.organization_url = ""),
    (formData.organization_code = ""),
    (formData.organization_logo = "");
};
watch(formData, () => {
  clearInputErrors();
});
function HandleToggleModal() {
  showModal.value = !showModal.value;
  clearInputs();
}

// onMounted(() => {
//   organisationStore.allorganisation();
// });
const getallorganisationData = async () => {
  let response = await organisationStore.allOrganisation();
  return response;
};
const fetchData = async () => {
  await Promise.all([getallorganisationData()]);
};

fetchData();

useQuery(["allorganisation"], getallorganisationData, {
  retry: 10,
  staleTime: 10000,
  onSuccess: (data) => {
    organisation.value = data;
  },
});
const previewImage = ref(null);
const uploadedImageName = ref("");

const uploadFile = (event) => {
  // formData.organization_logo = previewImage.value.files[0];
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    uploadedImageName.value = file.name;

    reader.onload = () => {
      formData.organization_logo = reader.result;
    };
    reader.readAsDataURL(file);
  } else {
    formData.organization_logo = "";
  }

  showImage();
};

const showImage = async () => {
  if (formData.organization_logo) {
    previewImage.value = URL.createObjectURL(formData.organization_logo);
  } else {
    previewImage.value = null;
  }
};

const handleorganisationInvite = async () => {
  loading.value = true;
  if (!validateForm()) {
    loading.value = false;
    return;
  }
  let payload = {
    organization_name: formData.organization_name,
    organization_url: formData.organization_url,
    organization_code: formData.organization_code,
    organization_logo: formData.organization_logo,
  };
  try {
    let res = await organisationStore.handleAddOrganisation(payload);
    HandleToggleModal();
    getallorganisationData();
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
