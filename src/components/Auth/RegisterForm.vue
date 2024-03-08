<template>
  <div
    class="mx-auto lg:w-[53%] w-full flex bg-white rounded-[4px] lg:p-10 p-4 lg:px-12 gap-[20px] lg:justify-between flex-col"
  >
    <div class="w-full">
      <h4 class="text-center font-semibold text-[20px] lg:text-[24px] mb-20 my-10">
        Create an Account
      </h4>
      <tab-selector>
        <template #tab1> Individual</template>
        <template #tab2> Company </template>
        <template #view1>
          <Individual />
        </template>
        <template #view2> <CompanyForm /> </template>
      </tab-selector>
    </div>
  </div>
</template>
<script setup>
// import { ref, computed, watch, reactive } from "vue";
// import AuthInput from "@/components/UI/Input/AuthInput.vue";
// import PasswordInput from "@/components/UI/Input/PasswordInput.vue";
// import Loader from "@/components/UI/Loader.vue";
import TabSelector from "@/components/UI/TabSelector.vue";
// import { useRouter } from "vue-router";
// import { useStore } from "@/stores/user";
// import { register } from "@/services/Auth";
import CompanyForm from "@/components/Auth/Forms/Company.vue";
import Individual from "@/components/Auth/Forms/Individual.vue";
// const router = useRouter();
// const store = useStore();

// const middelName = ref("");
// const phoneNo = ref("");
// const dob = ref("");

// const formData = reactive({
//   firstName: "",
//   lastName: "",
//   code: "",
//   email: "",
//   password: "",
//   confirmPassword: "",
// });
// const CompanyformData = reactive({
//   company_name: "",
//   contact_person: "",
//   company_address: "",
//   phone_number: "",
//   code: "",
//   email: "",
//   password: "",
//   confirmPassword: "",
// });
// let loading = ref(false);

// const errors = reactive({
//   firstName: false,
//   lastName: false,
//   code: false,
//   email: false,
//   password: false,
//   confirmPassword: false,
// });
// const CompanyErrors = reactive({
//   company_name: false,
//   contact_person: false,
//   company_address: false,
//   phone_number: false,
//   code: false,
//   email: false,
//   password: false,
//   confirmPassword: false,
// });

// const dobError = ref(false);
// const dobErrorMsg = ref("date of birth is lower than 18");
// const confirmPassword = ref("");

// const errorsMsg = {
//   firstName: "First name is required",
//   lastName: "Last name is required",
//   code: "Organisation code is required",
//   email: "Email is required",
//   password: "Password is required",
//   confirmPassword: "Password does not match",
// };
// const CompanyErrorsMsg = {
//   company_name: "company name is required",
//   contact_person: "contact person is required",
//   company_address: "company address is required",
//   phone_number: "company number is required",
//   code: "Organisation code is required",
//   email: "Email is required",
//   password: "Password is required",
//   confirmPassword: "Password does not match",
// };
// const minDate = ref(getMinDate());

// function getMinDate() {
//   const today = new Date();
//   const minDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
//   // Return the minimum date in the format required by the input[type=date] field
//   return minDate.toISOString().split("T")[0];
// }
// console.log(minDate.value);
// const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
// const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
// const isValidEmail = computed(() => {
//   return emailRegex.test(formData.email);
// });
// const passwordsMatch = computed(() => {
//   return formData.password === formData.confirmPassword;
// });

// const isValidPassword = computed(() => {
//   return passwordRegex.test(formData.password);
// });
// const isMinLengthMet = computed(() => {
//   return formData.password.length >= 8;
// });

// const isAtLeastOneNumber = computed(() => {
//   return /\d/.test(formData.password);
// });

// const isAtLeastOneSpecialChar = computed(() => {
//   return /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/.test(formData.password);
// });

// const isAtLeastOneLowercase = computed(() => {
//   return /[a-z]/.test(formData.password);
// });

// const isAtLeastOneUppercase = computed(() => {
//   return /[A-Z]/.test(formData.password);
// });
// const validateForm = () => {
//   // Reset errorsMsg
//   Object.keys(errors).forEach((key) => {
//     errors[key] = false;
//   });

//   // Perform validation before submission
//   let isValid = true;

//   Object.keys(formData).forEach((key) => {
//     if (!formData[key]) {
//       errors[key] = true;
//       isValid = false;
//     }
//   });
//   if (!isValidEmail.value) {
//     errors.email = true;
//     errorsMsg.email;
//     isValid = false;
//   }

//   if (!isValidPassword.value) {
//     errors.password = true;
//     errorsMsg.password = "Password is required";
//     isValid = false;
//   }

//   if (formData.password !== formData.confirmPassword) {
//     errors.confirmPassword = true;
//     errorsMsg.confirmPassword = "Password does not match";
//     isValid = false;
//   }
//   // Check if Date of Birth is not less than 5 years from today
//   const minDOB = new Date(minDate.value);
//   const selectedDOB = new Date(dob.value);
//   if (selectedDOB > minDOB) {
//     // DOB is less than 5 years from today
//     dobError.value = true;
//     isValid = false;
//   }

//   return isValid;
// };
// const validateCompanyForm = () => {
//   // Reset errorsMsg
//   Object.keys(errors).forEach((key) => {
//     errors[key] = false;
//   });

//   // Perform validation before submission
//   let isValid = true;

//   Object.keys(formData).forEach((key) => {
//     if (!formData[key]) {
//       errors[key] = true;
//       isValid = false;
//     }
//   });
//   if (!isValidEmail.value) {
//     errors.email = true;
//     errorsMsg.email;
//     isValid = false;
//   }

//   if (!isValidPassword.value) {
//     errors.password = true;
//     errorsMsg.password = "Password is required";
//     isValid = false;
//   }

//   if (formData.password !== formData.confirmPassword) {
//     errors.confirmPassword = true;
//     errorsMsg.confirmPassword = "Password does not match";
//     isValid = false;
//   }
//   // Check if Date of Birth is not less than 5 years from today
//   const minDOB = new Date(minDate.value);
//   const selectedDOB = new Date(dob.value);
//   if (selectedDOB > minDOB) {
//     // DOB is less than 5 years from today
//     dobError.value = true;
//     isValid = false;
//   }

//   return isValid;
// };
// // Function to clear input errors
// const clearInputErrors = () => {
//   Object.keys(errors).forEach((key) => {
//     errors[key] = false;
//   });

//   Object.keys(errorsMsg).forEach((key) => {
//     errorsMsg[key] = "";
//   });
// };
// const isFormValid = computed(() => {
//   return (
//     formData.firstName.trim() !== "" &&
//     formData.lastName.trim() !== "" &&
//     formData.email.trim() !== "" &&
//     formData.password.trim() !== "" &&
//     formData.code.trim() !== "" &&
//     confirmPassword.value.trim() !== ""
//   );
// });
// const clearInputs = () => {
//   (formData.firstName = ""),
//     (formData.lastName = ""),
//     (formData.email = ""),
//     (formData.password = "");
//   middelName.value = "";
//   phoneNo.value = "";
//   formData.code = "";
//   dob.value = "";
//   confirmPassword.value = "";
// };
// watch(formData, () => {
//   clearInputErrors();
// });
// watch(dob, () => {
//   clearInputErrors();
// });
// const handleSignup = async () => {
//   loading.value = true;
//   if (!validateForm()) {
//     loading.value = false;
//     return;
//   }
//   let payload = {
//     first_name: formData.firstName,
//     last_name: formData.lastName,
//     middle_name: middelName.value,
//     phone_number: phoneNo.value,
//     organization_code: formData.code,
//     dob: dob.value,
//     email: formData.email,
//     password: formData.password,
//     password_confirmation: confirmPassword.value,
//     type_id: 2,
//     role_id: 0,
//     organization_type: 1,
//   };
//   try {
//     let res = await register(payload);
//     // if (res.data.status === true) {
//     router.push({ name: "verify", params: { email: formData.email } });
//     // } else {
//     // Handle unsuccessful login
//     //   loading.value = false;
//     //   clearInputs();
//     // }
//     loading.value = false;
//     clearInputs();
//     return res;
//   } catch (error) {
//     console.log(error);
//   } finally {
//     loading.value = false;
//   }
// };
// const handleCompanySignup = async () => {
//   loading.value = true;
//   if (!validateForm()) {
//     loading.value = false;
//     return;
//   }
//   let payload = {
//     company_name: formData.company_name,
//     company_address: formData.company_address,
//     contact_person: formData.contact_person,
//     phone_number: formData.value,
//     organization_code: formData.code,
//     email: formData.email,
//     password: formData.password,
//     password_confirmation: confirmPassword.value,
//     type_id: 2,
//     role_id: 0,
//     organization_type: 1,
//   };
//   try {
//     let res = await register(payload);
//     // if (res.data.status === true) {
//     router.push({ name: "verify", params: { email: formData.email } });
//     // } else {
//     // Handle unsuccessful login
//     //   loading.value = false;
//     //   clearInputs();
//     // }
//     loading.value = false;
//     clearInputs();
//     return res;
//   } catch (error) {
//     console.log(error);
//   } finally {
//     loading.value = false;
//   }
// };
</script>

<script></script>
