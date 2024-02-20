<template>
  <AuthLayout :hideLeftSection="true">
    <div class="h-screen w-full">
      <div
        class="mx-auto lg:w-[53%] w-full flex bg-white rounded-[4px] lg:p-10 p-4 lg:px-12 gap-[20px] lg:justify-between flex-col"
      >
        <h4 class="text-center font-semibold text-[20px] lg:text-[24px] my-10">
          iSalesBok Email Verification...
        </h4>

        <div
          class="px-[14px] py-[12px] mb-5 text-center my-8 bg-secondary-100/[20%] rounded-[4px]"
        >
          <p
            v-if="loading"
            class="text-primary-1000 lg:text-[14px] overflow-hidden text-[12px] font-medium"
            role="alert"
          >
            Please wait while we verify your account ...
          </p>
          <p
            v-else-if="success && !loading"
            class="text-primary-1000 lg:text-[14px] overflow-hidden text-[12px] font-medium"
            role="alert"
          >
            {{ resp }}
          </p>
          <p
            v-else
            class="text-primary-1000 lg:text-[14px] overflow-hidden text-[12px] font-medium"
            role="alert"
          >
            {{ resp }}
          </p>
        </div>
        <div class="w-full flex flex-col gap-3 justify-center items-center">
          <router-link
            v-if="success && !loading"
            to="/login"
            class="btn-brand bg-brand !rounded-[5px] lg:w-[50%] flex gap-2 items-center justify-center !text-white text-[14px] !py-[16px] font-semibold w-full"
            >Proceed to login</router-link
          >
          <!-- <router-link
            v-if="!success"
            to="/register"
            class="btn-brand bg-brand !rounded-[5px] lg:w-[50%] flex gap-2 items-center justify-center !text-white text-[14px] !py-[16px] font-semibold w-full"
            >Home</router-link
          > -->
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { verifyEmail } from "@/services/Auth";
import AuthLayout from "@/components/Layouts/AuthLayout.vue";

const route = useRoute();
const token = ref("");
const loading = ref(true);
const success = ref(false);
const resp = ref("");

onMounted(async () => {
  token.value = route.params.token;
  if (token.value) {
    try {
      const response = await verifyEmail(token.value);

      if (response && response.status === 200) {
        success.value = true;
        resp.value = response?.data?.message || response.message;
      } else {
        // Handle error response
        success.value = false;
        resp.value = response.data.message || "Error occurred during email verification.";
      }
    } catch (err) {
      // Handle network errors or other exceptions
      success.value = false;
      resp.value =
        err.response?.data?.message || err.message || "Unknown error occurred.";
    }
    loading.value = false;
  }
});
</script>
