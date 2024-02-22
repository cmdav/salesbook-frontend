<template>
  <AuthLayout :hideLeftSection="true">
    <div
      class="mx-auto lg:w-[43%] w-full flex bg-white rounded-[4px] lg:p-10 p-4 lg:px-12 gap-[20px] lg:justify-between flex-col"
    >
      <div class="flex flex-col w-full justify-center items-center text-center">
        <div>
          <h2 class="lg:text-[24px] text-[20px] font-semibold text-[#000000] !my-5">
            Check your inbox and confirm your email address
          </h2>
        </div>
        <div class="px-[14px] py-[12px] mb-5 bg-secondary-100/[50%] rounded-[4px]">
          <p
            class="text-primary-1000 lg:text-[14px] overflow-hidden text-[12px] font-medium"
          >
            We’ve sent a confirmation email to
            <span class="font-Satoshi700 font-extrabold">{{ email }}</span>
          </p>
        </div>
        <p
          class="text-[13.303px] flex items-center gap-2 font-Satoshi400 my-4 md:mb-8 text-[#DA5252]"
        >
          Didn't receive an email?
        </p>
        <p class="text-[13.303px] font-Satoshi400 my-4 md:mb-8 text-[#01181B]">
          If you can't find the email in your inbox or spam folder, please click below and
          we will send you a new one.
        </p>

        <div class="w-full text-left mt-8">
          <form action="" @submit.prevent="">
            <div class="mt-8 flex justify-between gap-6">
              <button
                :disabled="loading"
                @click="handleResendEmail"
                class="btn-brand bg-brand !rounded-[5px] flex gap-2 items-center justify-center !text-white text-[14px] !py-[16px] font-semibold w-full"
              >
                <span v-if="!loading" class="font-semibold !text-[15px]"
                  >Resend mail</span
                >
                <Loader v-else />
              </button>
              <router-link
                to="/login"
                class="btn-brand !rounded-[5px] flex gap-2 items-center justify-center !text-white text-[14px] !py-[16px] font-semibold w-full"
              >
                LOG IN
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>
<script setup>
import { ref } from "vue";
import AuthLayout from "@/components/Layouts/AuthLayout.vue";
import Loader from "@/components/UI/Loader.vue";

import { useRoute } from "vue-router";
const route = useRoute();
import { resendEmail } from "@/services/Auth";
let loading = ref(false);

const email = ref(route.params.email);
const handleResendEmail = async () => {
  loading.value = true;
  let data = {
    email: email.value,
    type: "resend",
  };
  try {
    const res = await resendEmail(data);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>
