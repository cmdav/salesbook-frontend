<template>
  <DashboardLayout pageTitle="Profile Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <button class="text-xl font-bold pb-5" @click="goBack">Back</button>
      <div
        class="w-full bg-secondary-800/[30%] rounded-lg flex flex-col justify-center items-center p-4"
      >
        <div class="flex justify-center items-center">
          <EditProfileAvater
            :imageUrl="userProfileDetails?.organization_logo"
            @toggleModal="openFileInput"
          />
          <input
            type="file"
            id="fileInput"
            @change="handleFileUpload"
            accept="image/*"
            style="display: none"
          />
        </div>
        <div class="text-center">
          <p 
            class="text-[#000000] text-[24.518px] capitalize flex lg:flex-row flex-col gap-[2px] items-center font-bold leading-[31.739px]"
          >
            {{
              userProfileDetails?.first_name || userProfileDetails?.last_name
                ? userProfileDetails?.first_name + ` ` + userProfileDetails?.last_name
                : userProfileDetails?.company_name
            }}

            <span
              ><span
                class="bg-brand rounded-full py-[2.05px] capitalize text-[12.519px] text-[#E6F1F3] font-medium px-[19px]"
                >{{ userProfileDetails?.role }}</span
              ></span
            >
          </p>
          <p
            ><span
              class="bg-brand rounded-full py-[2.05px] capitalize text-[15px] text-[#E6F1F3] font-medium px-[19px]"
              >{{ userProfileDetails?.organization_type }}</span
            ><br/><span
              class="  py-[2.05px] capitalize text-[16px] text-[#00000066] font-semibold px-[19px]"
              >{{ userProfileDetails?.organization_code }}</span
            >
            </p
          >
          <p
            class="text-[#00000066] !my-1.5 text-[16px] flex gap-[8px] items-center leading-[31.739px]"
          >
            {{ userProfileDetails?.email }}
          </p>
          <p
            class="text-[#00000066] !my-1.5 text-[14.598px] font-semibold mx-auto flex gap-[8px] items-center capitalize leading-[31.739px]"
          >
            {{ userProfileDetails?.phone_number }}
          </p>
        
          
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import EditProfileAvater from "@/components/EditProfileAvater.vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/user";
const store = useStore();
const { userProfileDetails } = storeToRefs(store);
import { useRouter } from "vue-router";
const router = useRouter();
let selectedFile = ref(null);
const imageUrl = ref("");
const loading = ref(false);
const openFileInput = () => {
  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.click();
  }
};

const goBack = () => {
  router.back()
}

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
  if (selectedFile.value) {
    handleLogUpload();
    // const reader = new FileReader()
    // reader.onload = () => {
    //   imageUrl.value = reader.result
    // }
    // reader.readAsDataURL(selectedFile.value)
  } else {
    imageUrl.value = "";
  }
};

const handleLogUpload = async () => {
  loading.value = true;
  const formData = new FormData();
  formData.append("organization_logo", selectedFile.value);
  formData.append("_method", "put");
  try {
    let res = await store.handleUploadCompanyLogo(
      userProfileDetails.value.user_id,
      formData
    );
    console.log(formData, selectedFile.value);
    store.handleUserProfile();
    loading.value = false;
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    selectedFile.value = null;
    imageUrl.value = "";
  }
};

onMounted(async () => {
  await store.handleUserProfile();
  console.log(userProfileDetails)
});
</script>
