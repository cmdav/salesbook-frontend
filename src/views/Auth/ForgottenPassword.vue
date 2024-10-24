<template>
  <AuthLayout :hideLeftSection="true">
    <div
      class="mx-auto lg:w-[43%] w-full flex bg-white rounded-[4px] lg:p-10 p-4 lg:px-12 gap-[20px] lg:justify-between flex-col"
    >
      <div class="flex flex-col w-full justify-center items-center text-center">
        <div>
          <h2 class="lg:text-[24px] text-[20px] font-semibold text-[#000000] !my-5">
            RESET PASSWORD
          </h2>
        </div>
        <div class="px-[14px] py-[12px] my-[40px] bg-secondary-100/[50%] rounded-[4px]">
          <p class="text-primary-1000 lg:text-[14px] text-[12px] font-medium">
            Please enter the email address associated with your account
          </p>
        </div>
        <div class="w-full text-left">
          <form action="" @submit.prevent="">
            <div class="mb-6 flex flex-col">
              <AuthInput
                label="Email"
                :error="errors.email"
                :errorsMsg="errorsMsg.email"
                type="email"
                placeholder=" email address"
                v-model="formData.email"
              />
            </div>
            <div class="mb-4 w-full flex lg:flex-row flex-col justify-end">
              <p class="text-[14px]">
                Back to
                <router-link to="/login" class="font-medium text-brand text-[14px]"
                  >login</router-link
                >
              </p>
            </div>

            <div class="mb-8 w-full">
              <button
                :disabled="loading"
                @click="handleForgotPassword"
               :class="[
      (!isValidEmail || loading) ? 'bg-primary-100 cursor-not-allowed opacity-50' : 'bg-brand',
      'btn-brand !rounded-[5px] flex gap-2 items-center justify-center !text-white text-[14px] !py-[16px] font-semibold w-full'
    ]"
                >
                <span v-if="!loading" class="font-semibold !text-[15px]">Proceed</span>
                <Loader v-else />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>
<script setup>
import { ref, computed, watch, reactive } from "vue";
import AuthLayout from "@/components/Layouts/AuthLayout.vue";
import AuthInput from "@/components/UI/Input/AuthInput.vue";
import { useRouter } from "vue-router";
import { resendEmail } from "@/services/Auth";
import Loader from "@/components/UI/Loader.vue";

const router = useRouter();
const formData = reactive({
  email: "",
});
let loading = ref(false);

const errors = reactive({
  email: false,
});
const errorsMsg = {
  email: "Email is required",
};
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const isValidEmail = computed(() => {
  return emailRegex.test(formData.email);
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
  if (!isValidEmail.value) {
    errors.email = true;
    errorsMsg.email;
    isValid = false;
  }

  return isValid;
};
// Function to clear input errors
const clearInputErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = false;
  });

  Object.keys(errorsMsg).forEach((key) => {
    errorsMsg[key] = "";
  });
};
// const isFormValid = computed(() => {
//   return formData.email.trim() !== "";
// });
const clearInputs = () => {
  formData.email = "";
};
watch(formData, () => {
  clearInputErrors();
});
const handleForgotPassword = async () => {
  loading.value = true;
  if (!validateForm()) {
    loading.value = false;
    return;
  }
  let payload = {
    email: formData.email,
    type: "reset-password",
  };
  try {
    let res = await resendEmail(payload);
    sessionStorage.setItem("email", formData.email);
    router.push({ name: "login" });
    if (res.data.status === true) {
      router.push({ name: "login" });
    } else {
      // Handle unsuccessful login
      loading.value = false;
      formData.email = "";
    }
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
