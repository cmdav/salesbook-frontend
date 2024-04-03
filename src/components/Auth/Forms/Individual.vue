<template>
  <div class="flex flex-col gap-[17px]">
    <div class="flex flex-col gap-[17px]">
      <div class="flex lg:flex-row flex-col w-full gap-[20px]">
        <div class="mb-3 flex flex-col w-full">
          <AuthInput
            label="First Name*"
            :error="errors.firstName"
            :errorsMsg="errorsMsg.firstName"
            type="text"
            placeholder="Enter first name"
            v-model="formData.firstName"
          />
        </div>
        <div class="mb-3 flex flex-col w-full">
          <AuthInput
            label="Last Name*"
            :error="errors.lastName"
            type="text"
            placeholder="Enter last name"
            :errorsMsg="errorsMsg.lastName"
            v-model="formData.lastName"
          />
        </div>
      </div>

      <div class="flex lg:flex-row flex-col w-full gap-[20px]">
        <div class="mb-3 flex flex-col w-full">
          <AuthInput
            label="Middle Name"
            :error="false"
            type="text"
            placeholder="Enter middle Name"
            v-model="middelName"
          />
        </div>
        <div class="mb-3 flex flex-col w-full">
          <AuthInput
            label="Email Address*"
            :error="errors.email"
            :errorsMsg="errorsMsg.email"
            type="email"
            placeholder="Enter email address"
            v-model="formData.email"
          />
        </div>
      </div>
      <div class="flex lg:flex-row flex-col w-full gap-[20px]">
        <div class="mb-3 flex flex-col w-full">
          <AuthInput
            label="Date of Birth (optional)"
            :error="dobError"
            type="date"
            placeholder="Enter Date of Birth"
            v-model="dob"
            :max="minDate"
            :errorsMsg="dobErrorMsg"
          />
        </div>
        <div class="mb-3 flex flex-col w-full">
          <AuthInput
            label="Organizational Code*"
            :error="errors.code"
            :errorsMsg="errorsMsg.code"
            type="number"
            placeholder="Enter Organizational Code"
            v-model="formData.code"
          />
        </div>
      </div>
      <div class="flex lg:flex-row flex-col w-full gap-[20px]">
        <div class="mb-3 flex flex-col w-full">
          <AuthInput
            label="Phone number*"
            :error="false"
            type="tel"
            placeholder="Enter Phone number"
            v-model="phoneNo"
          />
        </div>
      </div>
      <div class="flex lg:flex-row flex-col w-full gap-[20px]">
        <div class="mb-3 flex flex-col w-full">
          <PasswordInput
            label="Password*"
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
            v-model="formData.confirmPassword"
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
        @click="handleSignup()"
        :class="!isFormValid ? '!bg-primary-100/[30%] cursor-not-allowed' : 'bg-brand'"
        class="btn-brand !rounded-[5px] flex gap-2 items-center justify-center !text-white text-[14px] !py-[16px] font-semibold w-full"
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
  </div>
</template>
<script setup>
import { ref, computed, watch, reactive } from "vue";
import AuthInput from "@/components/UI/Input/AuthInput.vue";
import PasswordInput from "@/components/UI/Input/PasswordInput.vue";
import Loader from "@/components/UI/Loader.vue";
import { useRouter } from "vue-router";
import { useStore } from "@/stores/user";
import { register } from "@/services/Auth";

const router = useRouter();
const store = useStore();

const middelName = ref("");
const phoneNo = ref("");
const dob = ref("");

const formData = reactive({
  firstName: "",
  lastName: "",
  code: "",
  email: "",
  password: "",
  confirmPassword: "",
});
let loading = ref(false);

const errors = reactive({
  firstName: false,
  lastName: false,
  code: false,
  email: false,
  password: false,
  confirmPassword: false,
});
const dobError = ref(false);
const dobErrorMsg = ref("date of birth is lower than 18");
const confirmPassword = ref("");

const errorsMsg = {
  firstName: "First name is required",
  lastName: "Last name is required",
  code: "Organisation code is required",
  email: "Email is required",
  password: "Password is required",
  confirmPassword: "Password does not match",
};
const minDate = ref(getMinDate());

function getMinDate() {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  // Return the minimum date in the format required by the input[type=date] field
  return minDate.toISOString().split("T")[0];
}
console.log(minDate.value);
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
const isValidEmail = computed(() => {
  return emailRegex.test(formData.email);
});
const passwordsMatch = computed(() => {
  return formData.password === formData.confirmPassword;
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
  if (!formData.email) {
    errors.email = true;
    errorsMsg.email = "Email is required";
    isValid = false;
  } else if (!isValidEmail.value) {
    errors.email = true;
    errorsMsg.email = "Invalid email";
    isValid = false;
  }
  if (!isValidPassword.value) {
    errors.password = true;
    errorsMsg.password = "Password is required";
    isValid = false;
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = true;
    errorsMsg.confirmPassword = "Password does not match";
    isValid = false;
  }
  // Check if Date of Birth is not less than 5 years from today
  const minDOB = new Date(minDate.value);
  const selectedDOB = new Date(dob.value);
  if (selectedDOB > minDOB) {
    // DOB is less than 5 years from today
    dobError.value = true;
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
    formData.code.trim() !== "" &&
    confirmPassword.value.trim() !== ""
  );
});
const clearInputs = () => {
  (formData.firstName = ""),
    (formData.lastName = ""),
    (formData.email = ""),
    (formData.password = "");
  middelName.value = "";
  phoneNo.value = "";
  formData.code = "";
  dob.value = "";
  confirmPassword.value = "";
};
watch(formData, () => {
  clearInputErrors();
});
watch(dob, () => {
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
    middle_name: middelName.value,
    phone_number: phoneNo.value,
    organization_code: formData.code,
    dob: dob.value,
    email: formData.email,
    password: formData.password,
    password_confirmation: formData.confirmPassword,
    type_id: 2,
    role_id: 0,
    organization_type: 0,
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
</script>
