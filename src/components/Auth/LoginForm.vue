<template>
  <div
    class="mx-auto lg:w-[53%] w-full flex bg-white rounded-[4px] lg:p-10 p-4 lg:px-12 gap-[20px] lg:justify-between flex-col"
  >
    <div class="w-full">
      <h4 class="text-center font-semibold text-[20px] lg:text-[24px] my-10">
        Welcome to Salesbook
      </h4>

      <form action="" @submit.prevent="">
        <div class="mb-6 flex flex-col">
          <AuthInput
            label="Email"
            :error="errors.login"
            type="email"
            placeholder="janedoe@gmail.com"
            v-model="formState.login"
          />
        </div>
        <div class="mb-6 flex flex-col">
          <AuthInput
            label="Institution Code"
            :error="errors.code"
            type="text"
            placeholder=""
            v-model="formState.code"
          />
        </div>

        <div class="mb-3 flex flex-col">
          <PasswordInput
            label="Password"
            :error="errors.password"
            :errorsMsg="errorsMsg.password"
            placeholder="Password*"
            @keyup.enter="onFinish"
            v-model="formState.password"
          />
        </div>

        <div class="mb-10 w-full flex justify-between">
          <p class="text-[14px]">
            Don’t have an account?
            <router-link to="/register" class="font-medium text-brand text-[14px]"
              >Register</router-link
            >
          </p>
          <router-link class="font-medium text-brand text-[14px]" to="/forgotten-password"
            >Forgotten password?</router-link
          >
        </div>

        <div class="mb-3">
          <button
            :disabled="loading"
            :class="loading ? 'cursor-not-allowed' : ''"
            @click="onFinish"
            class="btn-brand w-full flex gap-2 items-center justify-center !rounded-[4px] py-3 lg:!py-5"
          >
            <span v-if="!loading" class="font-semibold !text-[15px]">Get Started</span>
            <Loader v-else />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import AuthInput from "@/components/UI/Input/AuthInput.vue";
import PasswordInput from "@/components/UI/Input/PasswordInput.vue";
import { ref, reactive, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/services/Auth";
import { useStore } from "@/stores/user";
import Loader from "@/components/UI/Loader.vue";
const router = useRouter();
let loading = ref(false);
const store = useStore();

const formState = reactive({
  login: "",
  password: "",
  code: "",
});
const errors = reactive({
  login: false,
  password: false,
  code: false,
});
const errorsMsg = {
  password: "",
};
const isValidEmail = computed(() => {
  return formState.login.trim() !== "";
});

const isValidPassword = computed(() => {
  return formState.password.trim() !== "";
});
const validateForm = () => {
  // Reset errorsMsg
  Object.keys(errors).forEach((key) => {
    errors[key] = false;
  });

  // Perform validation before submission
  let isValid = true;

  if (!isValidEmail.value) {
    errors.login = true;
    isValid = false;
  }
  if (!formState.code) {
    errors.code = true;
    isValid = false;
  }

  if (!isValidPassword.value) {
    errors.password = true;
    errorsMsg.password = "Password is required";
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
    let res = await login(formState.email, formState.password, formState.code);

    if (res.data.status === true) {
      store.saveUser(res.data);
      router.push({ name: "dashboard" });
    } else {
      // Handle unsuccessful login
      loading.value = false;
      formState.login = "";
      formState.password = "";
      formState.code = "";
    }
    loading.value = false;
    return res;
  } catch (error) {
    return error;
  } finally {
    loading.value = false;
    formState.login = "";
    formState.password = "";
    formState.code = "";
  }
};
</script>
