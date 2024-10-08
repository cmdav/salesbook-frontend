<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex flex-col gap-[17px]">
    <div class="flex flex-col gap-[17px]">
      <div class="flex lg:flex-row flex-col w-full gap-[20px]">
        <div class="mb-3 flex flex-col w-full">
          <AuthInput
            label="Company Name*"
            :error="CompanyErrors.company_name"
            :errorsMsg="CompanyErrorsMsg.company_name"
            type="text"
            placeholder="Enter company name"
            v-model="CompanyformData.company_name"
            required
          />
        </div>
        <div class="mb-3 flex flex-col w-full">
          <AuthInput
            label="Company Contact Person*"
            :error="CompanyErrors.contact_person"
            type="text"
            placeholder="Enter contact person name"
            :errorsMsg="CompanyErrorsMsg.contact_person"
            v-model="CompanyformData.contact_person"
            required
          />
        </div>
      </div>

      <div class="flex lg:flex-row flex-col w-full gap-[20px]">
        <div class="mb-3 flex flex-col w-full">
          <AuthInput
            label="Company Address*"
            :error="CompanyErrors.company_address"
            :errorsMsg="CompanyErrorsMsg.company_address"
            type="text"
            placeholder="Enter company address "
            v-model="CompanyformData.company_address"
            required
          />
        </div>
        <div class="mb-3 flex flex-col w-full">
          <AuthInput
            label="Company Email*"
            :error="CompanyErrors.email"
            :errorsMsg="CompanyErrorsMsg.email"
            type="email"
            placeholder="Enter company email address"
            v-model="CompanyformData.email"
            required
          />
        </div>
      </div>
      <div class="flex lg:flex-row flex-col w-full gap-[20px]">
        <div class="mb-3 flex flex-col w-full">
          <AuthInput
            label="Company contact number*"
            :error="CompanyErrors.phone_number"
            :errorsMsg="CompanyErrorsMsg.phone_number"
            type="number"
            placeholder="Enter Company contact number"
            v-model="CompanyformData.phone_number"
            required
          />
        </div>
        <!-- <div class="mb-3 flex flex-col w-full">
          <AuthInput
            label="Organizational Code*"
            :error="CompanyErrors.code"
            :errorsMsg="CompanyErrorsMsg.code"
            type="number"
            placeholder="Enter Organizational Code"
            v-model="CompanyformData.code"
          />
        </div> -->
      </div>
      <div class="flex lg:flex-row flex-col w-full gap-[20px]">
        <div class="mb-3 flex flex-col w-full">
          <PasswordInput
            label="Password*"
            :error="CompanyErrors.password"
            :errorsMsg="CompanyErrorsMsg.password"
            v-model="CompanyformData.password"
            placeholder="**********"
            required
          />
        </div>
        <div class="mb-3 flex flex-col w-full">
          <PasswordInput
            label="Confirm Password"
            :error="CompanyErrors.confirmPassword || !passwordsMatch"
            :errorsMsg="CompanyErrorsMsg.confirmPassword"
            placeholder="Confirm Password*"
            v-model="CompanyformData.confirmPassword"
            required
          />
        </div>
      </div>
      <!-- password reg dropdown -->
      <div
        v-if="CompanyformData.password.length && !isValidPassword"
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
        @click="handleCompanySignup()"
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
// import { useStore } from "@/stores/user";
import { register } from "@/services/Auth";
const router = useRouter();
// const store = useStore();



const CompanyformData = reactive({
  company_name: "",
  contact_person: "",
  company_address: "",
  phone_number: "",
  // code: "",
  email: "",
  password: "",
  confirmPassword: "",
});
let loading = ref(false);

const CompanyErrors = reactive({
  company_name: false,
  contact_person: false,
  company_address: false,
  phone_number: false,
  // code: false,
  email: false,
  password: false,
  confirmPassword: false,
});

const CompanyErrorsMsg = {
  company_name: "company name is required",
  contact_person: "contact person is required",
  company_address: "company address is required",
  phone_number: "contact number is required",
  // code: "Organisation code is required",
  email: "Email is required",
  password: "Password is required",
  confirmPassword: "Password does not match",
};

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
const nameRegex = /^[A-Za-z\s-_()]+$/; 

const isValidEmail = computed(() => {
  return emailRegex.test(CompanyformData.email);
});
const passwordsMatch = computed(() => {
  return CompanyformData.password === CompanyformData.confirmPassword;
});

const isValidPassword = computed(() => {
  return passwordRegex.test(CompanyformData.password);
});
const isMinLengthMet = computed(() => {
  return CompanyformData.password.length >= 8;
});

const isAtLeastOneNumber = computed(() => {
  return /\d/.test(CompanyformData.password);
});

const isAtLeastOneSpecialChar = computed(() => {
  return /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/.test(CompanyformData.password);
});

const isAtLeastOneLowercase = computed(() => {
  return /[a-z]/.test(CompanyformData.password);
});

const isAtLeastOneUppercase = computed(() => {
  return /[A-Z]/.test(CompanyformData.password);
});
const validateForm = () => {
  // Reset errorsMsg
  Object.keys(CompanyErrors).forEach((key) => {
    CompanyErrors[key] = false;
  });

  // Perform validation before submission
  let isValid = true;

  Object.keys(CompanyformData).forEach((key) => {
    if (!CompanyformData[key]) {
      CompanyErrors[key] = true;
      isValid = false;
    }
  });
  // if (!isValidEmail.value) {
  //   CompanyErrors.email = true;
  //   CompanyErrorsMsg.email;
  //   isValid = false;
  // }

  if (!CompanyformData.email) {
    CompanyErrors.email = true;
    CompanyErrorsMsg.email = "Email is required";
    isValid = false;
  } else if (!isValidEmail.value) {
    CompanyErrors.email = true;
    CompanyErrorsMsg.email = "Invalid email";
    isValid = false;
  }

  if (!nameRegex.test(CompanyformData.company_name)) {
    CompanyErrors.company_name = true;
    CompanyErrorsMsg.company_name = "Invalid company name";
    isValid = false;
  }
  if(!CompanyformData.company_address){
    CompanyErrors.company_address = true;
    CompanyErrorsMsg.company_address = "Company Address is required"
    isValid = false;
  }
  if(!CompanyformData.contact_person){
    CompanyErrors.contact_person = true;
    CompanyErrorsMsg.contact_person = "Contact Person is required"
    isValid = false;
  }

   if (!nameRegex.test(CompanyformData.contact_person)) {
    CompanyErrors.contact_person = true;
    CompanyErrorsMsg.contact_person = "Invalid contact person name";
    isValid = false;
  }

  if (!isValidPassword.value) {
    CompanyErrors.password = true;
    CompanyErrorsMsg.password = "Password is required";
    isValid = false;
  }

  if (CompanyformData.password !== CompanyformData.confirmPassword) {
    CompanyErrors.confirmPassword = true;
    CompanyErrorsMsg.confirmPassword = "Password does not match";
    isValid = false;
  }

  return isValid;
};

// Function to clear input errors
const clearInputErrors = () => {
  Object.keys(CompanyErrors).forEach((key) => {
    CompanyErrors[key] = false;
  });

  Object.keys(CompanyErrorsMsg).forEach((key) => {
    CompanyErrorsMsg[key] = "";
  });
};

const isFormValid = computed(() => {
  return (
    CompanyformData.company_name.trim() !== "" &&
    CompanyformData.contact_person.trim() !== "" &&
    CompanyformData.company_address.trim() !== "" &&
    CompanyformData.phone_number.trim() !== "" &&
    // CompanyformData.code.trim() !== "" &&
    CompanyformData.email.trim() !== "" &&
    CompanyformData.password.trim() !== "" &&
    CompanyformData.confirmPassword.trim() !== ""
  );
});

const clearInputs = () => {
  (CompanyformData.company_name = ""),
    (CompanyformData.contact_person = ""),
    (CompanyformData.company_address = ""),
    (CompanyformData.phone_number = "");
  // CompanyformData.code = "";
  CompanyformData.email = "";
  CompanyformData.password = "";
  CompanyformData.confirmPassword = "";
};
watch(CompanyformData, () => {
  clearInputErrors();
});

const handleCompanySignup = async () => {
  loading.value = true;
  if (!validateForm()) {
    loading.value = false;
    return;
  }
  let payload = {
    company_name: CompanyformData.company_name,
    company_address: CompanyformData.company_address,
    contact_person: CompanyformData.contact_person,
    phone_number: CompanyformData.phone_number,
    // organization_code: CompanyformData.code,
    email: CompanyformData.email,
    password: CompanyformData.password,
    password_confirmation: CompanyformData.confirmPassword,
    // type_id: 2,
    // role_id: 0,
    organization_type: "company",
  };
  try {
    let res = await register(payload);
    // if (res.data.status === true) {
    router.push({ name: "verify", params: { email: CompanyformData.email } });
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

<script></script>
