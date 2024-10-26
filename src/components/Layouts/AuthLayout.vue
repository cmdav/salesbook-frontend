<template>
  <main class="bg-[#F0F2F5]">
    <AuthPageNavbar />
    <div
      class="w-full flex justify-center py-12 !pb-8 mb-20 items-center lg:px-[16px]"
    >
      <slot></slot>
    </div>
  </main>
</template>

<script setup>
import AuthPageNavbar from "@/components/Header/AuthPageNavbar.vue";
</script>
