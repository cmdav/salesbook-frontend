<template>
  <main class="bg-[#F0F2F5] h-full">
    <AuthPageNavbar />
    <div
      class="w-full h-full flex justify-center py-12 !pb-20 mb-20 items-center lg:px-[16px] hide-scrollbar overflow-auto"
    >
      <slot></slot>
    </div>
  </main>
</template>

<script setup>
import AuthPageNavbar from "@/components/Header/AuthPageNavbar.vue";
</script>

