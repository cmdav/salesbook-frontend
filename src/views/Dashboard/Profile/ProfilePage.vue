<template>
  <DashboardLayout pageTitle="Profile Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div class="flex justify-center items-center">
        <EditProfileAvater
          :imageUrl="userProfileDetails.organization_logo"
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
});
</script>
