<template>
  <div
    class="mx-auto lg:w-[53%] w-full flex bg-white rounded-[4px] lg:p-10 p-4 lg:px-12 gap-[20px] lg:justify-between flex-col"
  >
    <div class="w-full">
      <h4 class="text-center font-semibold text-[20px] lg:text-[24px] !mb-11 my-10">
        Create a Supplier Account
      </h4>

      <form
        class="flex flex-col gap-[17px]"
        action="POST"
        @submit.prevent="handleSignup()"
      >
        <div class="flex flex-col gap-[17px]">
          <div class="flex lg:flex-row flex-col w-full gap-[20px]">
            <div class="mb-3 flex flex-col w-full">
              <AuthInput
                label="First Name"
                :error="errors.firstName"
                type="text"
                placeholder="Enter first name"
                v-model="formData.firstName"
              />
            </div>
            <div class="mb-3 flex flex-col w-full">
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
            <div class="mb-3 flex flex-col w-full">
              <AuthInput
                label="Middle Name"
                :error="errors.middelName"
                type="text"
                placeholder="Enter Middel Name"
                v-model="formData.middelName"
              />
            </div>
            <div class="mb-3 flex flex-col w-full">
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
            <div class="mb-3 flex flex-col w-full">
              <AuthInput
                label="Date of Birth"
                :error="errors.dob"
                type="date"
                placeholder="Enter Date of Birth"
                v-model="formData.dob"
              />
            </div>
            <div class="mb-3 flex flex-col w-full">
              <AuthInput
                label="Phone number"
                :error="errors.phoneNo"
                type="tel"
                placeholder="Enter Phone number"
                v-model="formData.phoneNo"
              />
            </div>
          </div>
          <!-- <div class="flex lg:flex-row flex-col w-full gap-[20px]">
            <div class="mb-3 flex flex-col w-full">
              <AuthInput
                label="Phone number"
                :error="errors.phoneNo"
                type="tel"
                placeholder="Enter Phone number"
                v-model="formData.phoneNo"
              />
            </div>
          </div> -->
          <div class="flex lg:flex-row flex-col w-full gap-[20px]">
            <div class="mb-3 flex flex-col w-full">
              <PasswordInput
                label="Password"
                :error="errors.password"
                :errorsMsg="errorsMsg.password"
                v-model="formData.password"
                placeholder="**********"
              />
            </div>
            <div class="mb-3 flex flex-col w-full">
              <PasswordInput
                label="Confirm Password"
                :error="errors.confirmPassword || !passwordsMatch"
                :errorsMsg="errorsMsg.confirmPassword"
                placeholder="Confirm Password*"
                v-model="confirmPassword"
              />
            </div>
          </div>
          <!-- password reg dropdown -->
          <div
            v-if="formData.password.length && !isValidPassword"
            class="grid grid-cols-3 font-Satoshi400 text-gray-400 text-[12px] gap-2"
          >
            <div class="flex items-center gap-2">
              <div
                :class="{
                  ' bg-[#55eb37]': isMinLengthMet,
                  ' bg-gray-200': !isMinLengthMet,
                }"
                class="h-3 w-3 flex justify-center items-center rounded-full"
              ></div>
              <p>A minimum of 8 characters</p>
            </div>
            <div class="flex items-center gap-2">
              <div
                :class="{
                  ' bg-[#55eb37]': isAtLeastOneNumber,
                  ' bg-gray-200': !isAtLeastOneNumber,
                }"
                class="h-3 w-3 flex justify-center items-center rounded-full"
              ></div>
              <p>Atleast one number</p>
            </div>
            <div class="flex items-center gap-2">
              <div
                :class="{
                  ' bg-[#55eb37]': isAtLeastOneSpecialChar,
                  ' bg-gray-200': !isAtLeastOneSpecialChar,
                }"
                class="h-3 w-3 flex justify-center items-center rounded-full"
              ></div>
              <p>Atleast one special character</p>
            </div>
            <div class="flex items-center gap-2">
              <div
                :class="{
                  ' bg-[#55eb37]': isAtLeastOneLowercase,
                  ' bg-gray-200': !isAtLeastOneLowercase,
                }"
                class="h-3 w-3 flex justify-center items-center rounded-full"
              ></div>
              <p>Atleast one lowercase letter</p>
            </div>
            <div class="flex items-center gap-2">
              <div
                :class="{
                  ' bg-[#55eb37]': isAtLeastOneUppercase,
                  ' bg-gray-200': !isAtLeastOneUppercase,
                }"
                class="h-3 w-3 flex justify-center items-center rounded-full"
              ></div>
              <p>Atleast one uppercase letter</p>
            </div>
          </div>
        </div>
        <div class="w-full flex justify-between">
          <p class="text-[14px]">
            Already have an account
            <router-link to="/login" class="font-medium text-brand text-[14px]"
              >Login</router-link
            >
          </p>
        </div>

        <div class="flex flex-col lg:flex-row w-full gap-[30px] mt-4">
          <button
            :disabled="loading"
            type="submit"
            :class="!isFormValid ? '!bg-primary-100 cursor-not-allowed' : 'bg-brand'"
            class="btn-brand !rounded-[5px] flex gap-2 items-center justify-center !text-text-black-200 text-[14px] !py-[16px] font-semibold w-full"
          >
            <span v-if="!loading" class="font-semibold !text-[15px]">Submit</span>
            <Loader v-else />
          </button>
        </div>

        <div class="flex items-center justify-center mb-10 text-center gap-[4px]">
          <span class="font-normal text-[14px]"
            >By continuing you agree to the
            <router-link class="text-[#007BFF] font-medium" to="/"
              >terms of service</router-link
            >
            and
            <router-link class="text-[#007BFF] font-medium" to="/"
              >privacy policy</router-link
            >
          </span>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted, reactive } from "vue";
import AuthInput from "@/components/UI/Input/AuthInput.vue";
import PasswordInput from "@/components/UI/Input/PasswordInput.vue";
import Loader from "@/components/UI/Loader.vue";

import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/stores/user";
import { register, verifyEmail } from "@/services/Auth";

const route = useRoute();
const router = useRouter();
const store = useStore();
const signupToken = ref(route.params.token);
const VerificationRespData = ref({});

const formData = reactive({
  firstName: "",
  middelName: "",
  lastName: "",
  email: "",
  dob: "",
  phoneNo: "",
  password: "",
});
let loading = ref(false);

const errors = reactive({
  firstName: false,
  middelName: false,
  lastName: false,
  email: false,
  dob: false,
  phoneNo: false,
  password: false,
  confirmPassword: false,
});
const confirmPassword = ref("");

const errorsMsg = {
  firstName: "First name is required",
  middelName: "Last name is required",
  lastName: "Last name is required",
  email: "Last name is required",
  dob: "Last name is required",
  phoneNo: "Email is required",
  password: "Password is required",
  confirmPassword: "Password does not match",
};
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
const isValidEmail = computed(() => {
  return emailRegex.test(formData.email);
});
const passwordsMatch = computed(() => {
  return formData.password === confirmPassword.value;
});

const isValidPassword = computed(() => {
  return passwordRegex.test(formData.password);
});
const isMinLengthMet = computed(() => {
  return formData.password.length >= 8;
});

const isAtLeastOneNumber = computed(() => {
  return /\d/.test(formData.password);
});

const isAtLeastOneSpecialChar = computed(() => {
  return /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/.test(formData.password);
});

const isAtLeastOneLowercase = computed(() => {
  return /[a-z]/.test(formData.password);
});

const isAtLeastOneUppercase = computed(() => {
  return /[A-Z]/.test(formData.password);
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

  if (!isValidPassword.value) {
    errors.password = true;
    errorsMsg.password = "Password is required";
    isValid = false;
  }

  if (formData.password !== confirmPassword.value) {
    errors.confirmPassword = true;
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
const isFormValid = computed(() => {
  return (
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.password.trim() !== "" &&
    formData.middelName.trim() !== "" &&
    formData.phoneNo.trim() !== "" &&
    confirmPassword.value.trim() !== "" &&
    formData.dob.trim() !== ""
  );
});
const clearInputs = () => {
  (formData.firstName = ""),
    (formData.lastName = ""),
    (formData.email = ""),
    (formData.password = "");
  formData.middelName = "";
  formData.phoneNo = "";
  formData.dob = "";
  confirmPassword.value = "";
};
watch(formData, () => {
  clearInputErrors();
});
const handleSignup = async () => {
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
    password: formData.password,
    password_confirmation: confirmPassword.value,
    type_id: 1,
    organization_id: VerificationRespData.value.data.organization_id,
  };
  try {
    let res = await register(payload);
    // if (res.data.status === true) {
    router.push({ name: "verify", params: { email: formData.email } });
    // } else {
    // Handle unsuccessful login
    //   loading.value = false;
    //   clearInputs();
    // }
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
  if (signupToken.value) {
    try {
      const response = await verifyEmail(signupToken.value);
      if (response) {
        VerificationRespData.value = response;
      }
    } catch (err) {
      // Handle network errors or other exceptions
      console.log(err.response?.data?.message || err.message);
    }
  }
});
</script>

<script></script>
