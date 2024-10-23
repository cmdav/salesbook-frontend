<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex flex-col gap-[17px]">
    <div class="flex flex-col gap-[17px]">
      <div class="flex lg:flex-row flex-col w-full gap-[20px]">
        <div class="mb-3 flex flex-col w-full">
          <AuthInput label="First Name*" :error="errors.firstName" :errorsMsg="errorsMsg.firstName" type="text"
            placeholder="Enter first name" v-model="formData.firstName" required />
        </div>
        <div class="mb-3 flex flex-col w-full">
          <AuthInput label="Last Name*" :error="errors.lastName" type="text" placeholder="Enter last name"
            :errorsMsg="errorsMsg.lastName" v-model="formData.lastName" required />
        </div>
      </div>

      <div class="flex lg:flex-row flex-col w-full gap-[20px]">
        <div class="mb-3 flex flex-col w-full">
          <AuthInput label="Company Name*" :error="errors.company_name" :errorsMsg="errorsMsg.company_name" type="text"
            placeholder="Enter company name" v-model="formData.company_name" required />
        </div>
        <div class="mb-3 flex flex-col w-full">
          <AuthInput label="Email Address*" :error="errors.email" :errorsMsg="errorsMsg.email" type="email"
            placeholder="Enter email address" v-model="formData.email" required />
        </div>
      </div>
      <div class="flex lg:flex-row flex-col w-full gap-[20px]">
        <div class="mb-3 flex flex-col w-full">
          <AuthInput label="Date of Birth (Optional)"  type="date" placeholder="Enter DOB"
            v-model="dob" :max="minDate" :errorsMsg="dobErrorMsg" />
        </div>
        <div class="mb-3 flex flex-col w-full">
          <AuthInput label="Phone number*" :error="errors.phone_no" :errorsMsg="errorsMsg.phone_num" type="number" placeholder="Enter Phone number"
            v-model="phoneNo" required/>
        </div>
      </div>
      <div class="flex lg:flex-row flex-col w-full gap-[20px]">
        <div class="mb-3 flex flex-col w-full">
          <AuthInput
            label="Address*"
            :error="errors.address"
            :errorsMsg="errorsMsg.address"
            type="text"
            placeholder="Enter Address"
            v-model="formData.address"
            :max="minDate"
            required
          />
        </div>
      </div>
      <div class="flex lg:flex-row flex-col w-full gap-[20px]">
        <div class="mb-3 flex flex-col w-full">
          
          <label for="country">Country*</label>
          <select id="country" v-model="selectedCountry" @change="fetchStates" class="select-input">
            <option value="" disabled>Select Country</option>
            <option v-for="country in countries" :key="country.id" :value="country.id">{{ country.name }}</option>
          </select>
          <span v-if="errors.country" class="text-red-500">{{ errorsMsg.country }}</span>
        </div>
        <div class="mb-3 flex flex-col w-full">
          <label for="state">State*</label>
          <select id="state" v-model="formData.state" class="select-input">
            <option value="" disabled>Select State</option>
            <option v-for="state in states" :key="state.id" :value="state.id">{{ state.name }}</option>
          </select>
          <span v-if="errors.state" class="text-red-500">{{ errorsMsg.state }}</span>
        </div>
      
      </div>

      <div class="flex lg:flex-row flex-col w-full gap-[20px]">

        <div class="mb-3 flex flex-col w-full">
          <PasswordInput label="Password*" :error="errors.password" :errorsMsg="errorsMsg.password"
            v-model="formData.password" placeholder="**********" required />
        </div>
        <div class="mb-3 flex flex-col w-full">
          <PasswordInput label="Confirm Password" :error="errors.confirmPassword || !passwordsMatch"
            :errorsMsg="errorsMsg.confirmPassword" placeholder="Confirm Password*" v-model="formData.confirmPassword" required />
        </div>
      </div>
      <!-- password reg dropdown -->
      <div v-if="formData.password.length && !isValidPassword"
        class="grid grid-cols-3 font-Satoshi400 text-gray-400 text-[12px] gap-2">
        <div class="flex items-center gap-2">
          <div :class="{
              ' bg-[#55eb37]': isMinLengthMet,
              ' bg-gray-200': !isMinLengthMet,
            }" class="h-3 w-3 flex justify-center items-center rounded-full"></div>
          <p>A minimum of 8 characters</p>
        </div>
        <div class="flex items-center gap-2">
          <div :class="{
              ' bg-[#55eb37]': isAtLeastOneNumber,
              ' bg-gray-200': !isAtLeastOneNumber,
            }" class="h-3 w-3 flex justify-center items-center rounded-full"></div>
          <p>Atleast one number</p>
        </div>
        <div class="flex items-center gap-2">
          <div :class="{
              ' bg-[#55eb37]': isAtLeastOneSpecialChar,
              ' bg-gray-200': !isAtLeastOneSpecialChar,
            }" class="h-3 w-3 flex justify-center items-center rounded-full"></div>
          <p>Atleast one special character</p>
        </div>
        <div class="flex items-center gap-2">
          <div :class="{
              ' bg-[#55eb37]': isAtLeastOneLowercase,
              ' bg-gray-200': !isAtLeastOneLowercase,
            }" class="h-3 w-3 flex justify-center items-center rounded-full"></div>
          <p>Atleast one lowercase letter</p>
        </div>
        <div class="flex items-center gap-2">
          <div :class="{
              ' bg-[#55eb37]': isAtLeastOneUppercase,
              ' bg-gray-200': !isAtLeastOneUppercase,
            }" class="h-3 w-3 flex justify-center items-center rounded-full"></div>
          <p>Atleast one uppercase letter</p>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-between">
      <p class="text-[14px]">
        Already have an account
        <router-link to="/login" class="font-medium text-brand text-[14px]">Login</router-link>
      </p>
    </div>

    <div class="flex flex-col lg:flex-row w-full gap-[30px] mt-4">
      <button @click="handleSignup()"
      :disabled="!isFormFullyValid || loading"
        :class="(!isFormFullyValid || loading) ? '!bg-primary-100/[30%] cursor-not-allowed' : 'bg-brand'"
        class="btn-brand !rounded-[5px] flex gap-2 items-center justify-center !text-white text-[14px] !py-[16px] font-semibold w-full">
        <span v-if="!loading" class="font-semibold !text-[15px]">Submit</span>
        <Loader v-else />
      </button>
    </div>

    <div class="flex items-center justify-center mb-10 text-center gap-[4px]">
      <span class="font-normal text-[14px]">By continuing you agree to the
        <router-link class="text-[#007BFF] font-medium" to="/">terms of service</router-link>
        and
        <router-link class="text-[#007BFF] font-medium" to="/">privacy policy</router-link>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive, onMounted} from "vue";
import apiService from '@/services/apiService'
import AuthInput from "@/components/UI/Input/AuthInput.vue";
import PasswordInput from "@/components/UI/Input/PasswordInput.vue";
import Loader from "@/components/UI/Loader.vue";
import { useRouter } from "vue-router";
// import { useStore } from "@/stores/user";
import { register } from "@/services/Auth";

const router = useRouter();
// const store = useStore();

const nameRegex = /^[A-Za-z\s-_()]+$/; 

const isValidName = (name) => nameRegex.test(name);

const middelName = ref("");
const phoneNo = ref("");
const dob = ref("");

const formData = reactive({
  firstName: "",
  lastName: "",
  company_name: "",
  address: "",
  email: "",
  state: "",
  password: "",
  confirmPassword: "",
});

let loading = ref(false);

const errors = reactive({
  firstName: false,
  lastName: false,
  company_name: false,
  phone_no:false,
  address: false,
  email: false,
  state: false,
  country: false,
  password: false,
  confirmPassword: false,
});
const dobError = ref(false);
const dobErrorMsg = ref("date of birth is lower than 18");
const confirmPassword = ref("");

const errorsMsg = {
  firstName: "First name is required",
  lastName: "Last name is required",
  company_name: "Company Name is required",
  phone_num: "Phone Number is required",
  address: "Address is required",
  email: "Email is required",
  state: "State is required",
  country: "Country is required",
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
// const textRegex = //;
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

const isFormFullyValid = computed(() => {
  return (
    isValidName(formData.firstName) &&
    isValidName(formData.lastName) &&
    isValidName(formData.company_name) &&
    isValidEmail.value &
    isValidPassword.value &&
    passwordsMatch.value 
    
    
  );
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

   if (!formData.firstName) {
    errors.firstName = true;
    errorsMsg.firstName = "First Name is required";
    isValid = false;
  } else if(!isValidName(formData.firstName)){
    errors.firstName=true;
    errorsMsg.firstName = "Invalid characters in First Name"
    isValid = false;
  }

   if (!formData.lastName) {
    errors.lastName = true;
    errorsMsg.lastName = "Last Name is required";
    isValid = false;
  } else if(!isValidName(formData.lastName)){
    errors.lastName = true;
    errorsMsg.lastName = "Invalid characters in Last Name"
    isValid = false;
  }

   if (!formData.company_name) {
    errors.company_name = true;
    errorsMsg.company_name = "Company Name is required";
    isValid = false;
  } else if(!isValidName(formData.company_name)){
    errors.company_name = true;
    errorsMsg.company_name = "Invalid characters in Company Name"
    isValid = false;
  }

  if(!phoneNo.value){
    errors.phone_no = true;
    errorsMsg.phone_num = "Phone Number is required";
    isValid = false;
  }

  if (!formData.email) {
    errors.email = true;
    errorsMsg.email = "Email is required";
    isValid = false;
  } else if (!isValidEmail.value) {
    errors.email = true;
    errorsMsg.email = "Invalid email";
    isValid = false;
  }

  if (!selectedCountry.value) {
    errors.country = true;
    errorsMsg.country = "Country is required";
    isValid = false;
  }

  if (!formData.state) {
    errors.state = true;
    errorsMsg.state = "State is required";
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

const clearInputs = () => {
  (formData.firstName = ""),
    (formData.lastName = ""),
    (formData.email = ""),
    (formData.password = "");
    (formData.company_name = "");
    (formData.company_address = "");
  middelName.value = "";
  phoneNo.value = "";
  // formData.code = "";
  dob.value = "";
  confirmPassword.value = "";
};
watch(formData, () => {
  clearInputErrors();
});
watch(dob, () => {
  clearInputErrors();
});

const countries = ref([]);
const states = ref([]);
const selectedCountry = ref("");

onMounted(async () => {
  try{
    const res = await apiService.get('/countries');
    console.log(res)
    countries.value = res
  } catch (err){
    console.error("Error fetching countries", err)
  }
});

const fetchStates = async () => {
  if (!selectedCountry.value) return;
  try{
    const res = await apiService.get(`/states?country_id=${selectedCountry.value}`)
    console.log(res)
    states.value = res
  } catch (err) {
    console.error("Error fetching State", err)
  }
}

const handleSignup = async () => {
  loading.value = true;
  if (!validateForm()) {
    loading.value = false;
    return;
  }
  let payload = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    company_name: formData.company_name,
    middle_name: middelName.value,
    phone_number: phoneNo.value,
    company_address: formData.address,
    dob: dob.value,
    email: formData.email,
    state_id: formData.state,
    country_id: selectedCountry.value,
    password: formData.password,
    password_confirmation: formData.confirmPassword,
    // type_id: 2,
    // role_id: 0,
    organization_type: "sole_properietor",
  };
  try {
    console.log(payload)
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
<style scoped>
.select-input {
  display: block;
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  transition: background-color 0.3s ease;
}
</style>