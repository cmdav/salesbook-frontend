<script setup>
// import { useStore } from "@/stores/user";
import { ref, reactive, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
// import layout from "@/components/layout/AuthLayout.vue";
import { changePassword } from "@/services/Auth";
import PasswordInput from "@/components/UI/Input/PasswordInput.vue";
import AuthLayout from "@/components/Layouts/AuthLayout.vue";

// const store = useStore();
const route = useRoute();

const router = useRouter();
let loading = ref(false);
// Create a function to parse the URL and get the token value
const getTokenFromURL = () => {
  // const urlParams = new URLSearchParams(window.location.search);
  return route.params.token || "";
};
// Create a function to retrieve the email from local storage
const getEmailFromLocalStorage = () => {
  return localStorage.getItem("email") || "";
};
const formState = reactive({
  token: getTokenFromURL(), // Get the token value from the URL
  email: getEmailFromLocalStorage(), // Get the email value from local storage
  password: "",
  confirmPassword: "",
});
const errors = reactive({
  confirmPassword: false,
  password: false,
});
const errorsMsg = {
  confirmPassword: "Password does not match",
  password: "",
};

const isValidPassword = computed(() => {
  return formState.password.trim() !== "";
});
const passwordsMatch = computed(() => {
  return formState.password === formState.confirmPassword;
});

const validateForm = () => {
  // Reset errorsMsg
  Object.keys(errors).forEach((key) => {
    errors[key] = false;
  });

  // Perform validation before submission
  let isValid = true;

  if (!isValidPassword.value) {
    errors.password = true;
    errorsMsg.password = "Password is required";
    isValid = false;
  }
  if (formState.password !== formState.confirmPassword) {
    errors.confirmPassword = true;
    isValid = false;
  }

  return isValid; // Only return false if there are validation errors
};

const clearInputErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = false;
  });

  Object.keys(errorsMsg).forEach((key) => {
    errorsMsg[key] = "";
  });
};

watch(formState, () => {
  clearInputErrors();
});

const onFinish = async () => {
  loading.value = true;
  if (!validateForm()) {
    loading.value = false;
    return;
  }

  try {
    const res = await changePassword(
      formState.token,
      formState.email,
      formState.password,
      formState.confirmPassword
    );
    router.push({ name: "login" });
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <AuthLayout :hideLeftSection="true">
    <div class="h-screen w-full">
      <div
        class="mx-auto lg:w-[53%] w-full flex bg-white rounded-[4px] lg:p-10 p-4 lg:px-12 gap-[20px] lg:justify-between flex-col"
      >
        <h1
          class="md:text-[22.225px] font-EBGaramond400 text-brand my-6 text-center text-2xl"
        >
          Change your password
        </h1>

        <div class="flex flex-col gap-4">
          <div>
            <PasswordInput
              :error="errors.password"
              :errorsMsg="errorsMsg.password || !isValidPassword"
              placeholder="Password*"
              v-model="formState.password"
            />
          </div>

          <div>
            <PasswordInput
              :error="errors.confirmPassword || !passwordsMatch"
              :errorsMsg="errorsMsg.confirmPassword"
              placeholder="Confirm Password*"
              v-model="formState.confirmPassword"
            />
          </div>
        </div>
        <div class="mt-4 text-left"></div>
        <div class="mt-4">
          <button
            @click="onFinish"
            class="btn-brand bg-brand !rounded-[5px] flex gap-2 items-center justify-center !text-white text-[14px] !py-[16px] font-semibold w-full"
          >
            <span v-if="!loading">update PASSWORD</span>
            <Loader v-else />
          </button>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>
